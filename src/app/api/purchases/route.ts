import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const purchases = await db.collection("purchases").find({}).toArray();

    // Flatten the games array from all purchases and remove duplicates
    const games = Array.from(
      new Set(purchases.flatMap((purchase) => purchase.games))
    );

    return NextResponse.json({
      success: true,
      games: games,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch purchases",
        games: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { games, totalAmount } = await req.json();
    const { db } = await connectToDatabase();

    const purchase = {
      userId: "user_id", // You'll need to get this from your auth system
      games,
      totalAmount,
      purchaseDate: new Date(),
    };

    await db.collection("purchases").insertOne(purchase);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save purchase" },
      { status: 500 }
    );
  }
}
