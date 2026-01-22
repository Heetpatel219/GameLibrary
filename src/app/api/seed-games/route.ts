import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // 1. Fetch data from FreeToGame API
    const response = await fetch("https://www.freetogame.com/api/games");
    if (!response.ok) throw new Error("Failed to fetch from external API");
    const games = await response.json();

    // 2. Clear existing games to avoid duplicates
    await db.collection("games").deleteMany({});

    // 3. Map and Format data for your database
    const formattedGames = games.map((game: any) => ({
      id: game.id.toString(), // Store ID as string for consistency
      name: game.title,
      image: game.thumbnail,
      price: 19.99, // Set a default price
      description: game.short_description,
      genre: game.genre,
      platform: game.platform,
      release_date: game.release_date
    }));

    // 4. FIX: Assign the insertion result to 'result'
    const result = await db.collection("games").insertMany(formattedGames);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} games!`,
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}