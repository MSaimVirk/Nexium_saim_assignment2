import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION!;

export async function GET() {
  try {
    const mongo = new MongoClient(MONGODB_URI);
    await mongo.connect();
    const db = mongo.db(MONGODB_DB);
    const collection = db.collection(MONGODB_COLLECTION);
    const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
    await mongo.close();
    return NextResponse.json({ data: docs });
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error }, { status: 500 });
  }
} 