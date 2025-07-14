import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_TABLE = process.env.SUPABASE_TABLE!;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    // 1. Check Supabase for summary
    const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: summary, error: supabaseError } = await supabase
      .from(SUPABASE_TABLE)
      .select("summary_en, summary_ur, created_at")
      .eq("url", url)
      .maybeSingle();
    if (supabaseError) throw supabaseError;
    if (!summary) return NextResponse.json({ found: false });

    // 2. Fetch raw text from MongoDB
    const mongo = new MongoClient(MONGODB_URI);
    await mongo.connect();
    const db = mongo.db(MONGODB_DB);
    const collection = db.collection(MONGODB_COLLECTION);
    const blogDoc = await collection.findOne({ url });
    await mongo.close();

    return NextResponse.json({
      found: true,
      summary_en: summary.summary_en,
      summary_ur: summary.summary_ur,
      created_at: summary.created_at,
      raw_text: blogDoc?.text || null,
    });
  } catch (e: any) {
    console.error("Check-summary error:", e, JSON.stringify(e));
    return NextResponse.json({ error: e?.message || JSON.stringify(e) || "Internal error" }, { status: 500 });
  }
}