import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
        games: []
      }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const purchases = await db.collection("purchases")
      .find({ userId: userId })
      .toArray();

    // Extract all games from purchases
    const allGames = purchases.flatMap(purchase => purchase.games);

    // Remove duplicates using Map
    const uniqueGames = Array.from(
      new Map(
        allGames.map(game => [game.id, game])
      ).values()
    );

    return NextResponse.json({
      success: true,
      games: uniqueGames,
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
    
    // Get user ID from headers
    const userId = req.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "User not authenticated" 
      }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Fetch existing purchases for the user
    const existingPurchases = await db.collection("purchases")
      .find({ userId: userId })
      .toArray();

    // Extract all previously purchased game IDs
    const purchasedGameIds = existingPurchases.flatMap(
      (purchase: any) => purchase.games.map((game: any) => game.id)
    );

    // Find duplicates in current cart
    const duplicateGames = games.filter(
      (game: any) => purchasedGameIds.includes(game.id)
    );

    // Find new games to purchase
    const newGames = games.filter(
      (game: any) => !purchasedGameIds.includes(game.id)
    );

    // If any games in the request are already owned, block the purchase
    if (duplicateGames.length > 0) {
      const gameNames = duplicateGames.map((g: any) => g.name).join(", ");
      return NextResponse.json({
        success: false,
        error: {
          title: "Games Already Owned",
          message: "These games are already in your library",
          details: `You already own: ${gameNames}`,
          count: duplicateGames.length,
          games: duplicateGames
        }
      }, { status: 400 });
    }

    // Create purchase record
    const purchase = {
      userId,
      games: newGames,
      totalAmount,
      purchaseDate: new Date(),
    };

    await db.collection("purchases").insertOne(purchase);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}