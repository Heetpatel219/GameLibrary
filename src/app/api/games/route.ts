import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const games = await db.collection("games").find({}).toArray();
    
    return NextResponse.json({ success: true, games });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch games" }, { status: 500 });
  }
}