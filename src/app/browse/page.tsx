"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';

export default function BrowsePage() {
  const { addToCart, isInCart } = useCart();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        if (data.success) setGames(data.games);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-10">Loading Library...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Game Library</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game: any) => (
            <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <div className="relative h-48 w-full">
                <Image src={game.image} alt={game.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{game.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{game.genre}</p>
                <button 
                  disabled={isInCart(game.id)}
                  onClick={() => addToCart(game)}
                  className={`w-full py-2 rounded font-semibold transition ${
                    isInCart(game.id) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isInCart(game.id) ? 'In Cart' : `Add to Cart - $${game.price}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}