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
    const { db } = await connectToDatabase();

    // Get user from request headers
    const user = req.headers.get('user-id');
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get existing games for the user
    const existingPurchases = await db.collection("purchases").find({
      userId: "user_id" // Replace with actual user ID when auth is implemented
    }).toArray();

    const existingGames = existingPurchases.flatMap(purchase => purchase.games);
    
    // Filter out duplicates and track them
    const duplicateGames: any[] = [];
    const newGames = games.filter((game: any) => {
      const isDuplicate = existingGames.some((existing: any) => existing.id === game.id);
      if (isDuplicate) {
        duplicateGames.push(game);
      }
      return !isDuplicate;
    });

// If all games are duplicates, return error
if (newGames.length === 0) {
  const gameNames = duplicateGames.map(game => game.name).join(', ');
  return NextResponse.json({
    success: false,
    error: {
      title: "Games Already Owned",
      message: "These games are already in your library",
      details: `You already own: ${gameNames}`,
      count: duplicateGames.length,
      games: duplicateGames.map(game => ({
        id: game.id,
        name: game.name,
        image: game.image || game.background_image
      }))
    }
  }, { status: 400 });
}

    // Calculate new total amount for non-duplicate games
    const newTotalAmount = newGames.reduce((sum: number, game: any) => sum + game.price, 0);

    const purchase = {
      userId: "user_id",
      games: newGames,
      totalAmount: newTotalAmount,
      purchaseDate: new Date(),
    };

    await db.collection("purchases").insertOne(purchase);

    return NextResponse.json({ 
      success: true,
      duplicates: duplicateGames.length > 0 ? {
        count: duplicateGames.length,
        games: duplicateGames
      } : null
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save purchase" },
      { status: 500 }
    );
  }
}
