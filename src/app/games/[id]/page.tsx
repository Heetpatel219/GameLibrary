"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, ChevronLeft } from 'lucide-react';

export default function GameDetailPage() {
  const params = useParams();
  const id = params.id;
  
  const [game, setGame] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useCart();

  useEffect(() => {
    const fetchLocalGame = async () => {
      setLoading(true);
      try {
        // We fetch from YOUR database via a simple API route
        const response = await fetch(`/api/games/${id}`);
        if (!response.ok) throw new Error('Game not found in your database');
        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError('Failed to load game from database');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLocalGame();
  }, [id]);

  const handleAddToCart = () => {
    if (game) {
      addToCart({
        id: game.id,
        name: game.name,
        price: game.price || 19.99,
        image: game.image,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const inCart = id ? isInCart(Number(id)) : false;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/browse" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ChevronLeft size={20} /> Back to Browse
        </Link>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div></div>
        ) : game ? (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              <Image src={game.image} alt={game.name} fill className="object-cover" />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl font-bold">{game.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-400">${game.price || '19.99'}</span>
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-400">{game.genre}</span>
              </div>
              
              <p className="text-gray-400 text-lg leading-relaxed">{game.description}</p>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-bold transition ${
                    inCart ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <ShoppingCart size={20} /> {inCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ) : <p className="text-center text-red-500">{error}</p>}
      </main>
      <Footer />
    </div>
  );
}