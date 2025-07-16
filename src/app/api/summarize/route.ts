import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_MODEL = process.env.GROQ_MODEL!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_TABLE = process.env.SUPABASE_TABLE!;

async function fetchBlogText(url: string): Promise<string> {
  // Simple fetch and extract text from HTML body
  const res = await fetch(url);
  const html = await res.text();
  // Naive extraction: strip tags, get body text
  const body = html.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i)?.[1] || html;
  return body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();           ////////////////////////////////
}

async function summarizeWithGroq(text: string): Promise<{ en: string; ur: string }> {
  const prompt_en = `Summarize the following blog post in English in 5-6 sentences:\n\n${text}`;
  const prompt_ur = `Summarize the following blog post in Urdu in 5-6 sentences:\n\n${text}`;

  const summarize = async (prompt: string) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  };

  const [en, ur] = await Promise.all([
    summarize(prompt_en),
    summarize(prompt_ur),
  ]);
  return { en, ur };
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    // 1. Extract blog text
    const text = await fetchBlogText(url);
    if (!text) return NextResponse.json({ error: "Could not extract text" }, { status: 400 });

    // 2. Store raw text in MongoDB
    const mongo = new MongoClient(MONGODB_URI);
    await mongo.connect();
    const db = mongo.db(MONGODB_DB);
    const collection = db.collection(MONGODB_COLLECTION);
    const blogDoc = { url, text, createdAt: new Date() };
    await collection.insertOne(blogDoc);
    await mongo.close();

    // 3. Summarize with Groq
    const { en, ur } = await summarizeWithGroq(text);

    // 4. Store summaries in Supabase
    const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.from(SUPABASE_TABLE).insert([
      { url, summary_en: en, summary_ur: ur, created_at: new Date().toISOString() },
    ]);
    if (error) throw error;

    // 5. Return summaries
    return NextResponse.json({ summary_en: en, summary_ur: ur });
  } catch (e: unknown) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}