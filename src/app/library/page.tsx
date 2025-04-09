"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Game {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function Library() {
  const [purchasedGames, setPurchasedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchasedGames = async () => {
      try {
        const response = await fetch("/api/purchases");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch games");
        }

        setPurchasedGames(data.games || []);
      } catch (error) {
        console.error("Error fetching purchased games:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load your games"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedGames();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Your Game Library</h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading your games...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : purchasedGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No games in your library yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{game.name}</h3>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
