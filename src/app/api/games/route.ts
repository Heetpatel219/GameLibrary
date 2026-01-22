import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const game = await db.collection("games").findOne({ id: params.id });
    
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
    
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: "External Error" }, { status: 500 });
  }
}