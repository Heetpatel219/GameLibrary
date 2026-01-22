import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// The second argument MUST match the folder name [id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    // params.id comes directly from the folder name [id]
    const game = await db.collection("games").findOne({ id: params.id });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}