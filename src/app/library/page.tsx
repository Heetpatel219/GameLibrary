"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(6); // Show 6 games per page

  useEffect(() => {
    const fetchPurchasedGames = async () => {
      try {
        const user = localStorage.getItem('user');
        const userData = user ? JSON.parse(user) : null;

        if (!userData) {
          setError('Please sign in to view your library');
          setLoading(false);
          return;
        }

        const response = await fetch("/api/purchases", {
          headers: {
            'user-id': userData.sub
          }
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch games");
        }

        if (!Array.isArray(data.games)) {
          console.warn("No games returned from the API");
          setPurchasedGames([]);
          return;
        }

        // Remove duplicates and sort
        const games = Array.isArray(data.games) ? (data.games as Game[]) : [];
        const uniqueGames: Game[] = Array.from(
          new Map(games.map((game) => [game.id, game])).values()
        );

        const sortedGames: Game[] = uniqueGames.sort((a, b) => {
          const nameA = a.name || "";
          const nameB = b.name || "";
          return nameA.localeCompare(nameB);
        });

        setPurchasedGames(sortedGames);
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

  // Pagination calculations
  const totalPages = Math.ceil(purchasedGames.length / gamesPerPage);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = purchasedGames.slice(indexOfFirstGame, indexOfLastGame);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentGames.map((game) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors
                          ${currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}