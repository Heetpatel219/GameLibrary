"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft, ShoppingCart, Heart } from 'lucide-react';

// Simple type for game details
interface GameDetails {
  id: number;
  name: string;
  description_raw: string;
  background_image: string;
  rating: number;
  released: string;
  platforms: { platform: { name: string } }[];
  genres: { name: string }[];
  developers: { name: string }[];
}

export default function GameDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? parseInt(params.id) : 0;
  
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  // Use the cart context
  const { 
    addToCart, 
    addToWishlist,
    isInCart,
    isInWishlist 
  } = useCart();

  const API_KEY = process.env.NEXT_PUBLIC_RAW_GAME_API;
  const API_BASE = 'https://api.rawg.io/api';
  
  // Basic price calculation
  const getPrice = (gameId: number, rating: number) => {
    // Simple deterministic price based on ID and rating
    const basePrice = Math.max(10, (gameId % 30) + 20);
    const adjustedPrice = basePrice + (rating * 2);
    return Math.round(adjustedPrice * 100) / 100;
  };
  
  // Fetch game details
  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/games/${id}?key=${API_KEY}`);
        
        if (!response.ok) {
          throw new Error('Could not find game');
        }
        
        const data = await response.json();
        setGame(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id, API_KEY]);

  // Handler for adding to cart
  const handleAddToCart = () => {
    if (game) {
      // Get a consistent price based on game details
      const price = getPrice(game.id, game.rating);
      
      addToCart({
        id: game.id,
        name: game.name,
        price: price,
        image: game.background_image,
      });
      
      // Show feedback
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Handler for adding to wishlist
  const handleAddToWishlist = () => {
    if (game) {
      const price = getPrice(game.id, game.rating);
      
      addToWishlist({
        id: game.id,
        name: game.name,
        price: price,
        image: game.background_image,
      });
    }
  };

  // Check if game is in cart/wishlist
  const inCart = id ? isInCart(id) : false;
  const inWishlist = id ? isInWishlist(id) : false;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {game && !loading && (
        <div className="relative w-full h-[60vh] mb-8">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/20" />
          </div>

          {/* Content Container */}
          <div className="relative h-full max-w-6xl mx-auto px-4">
            <div className="absolute bottom-8 left-4 right-4 flex flex-col md:flex-row gap-8 items-end">
              {/* Game Cover */}
              <div className="w-full md:w-[300px] shrink-0">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={game.background_image}
                    alt={game.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Game Info */}
              <div className="flex-1 space-y-4">
                <h1 className="text-4xl font-bold">{game.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{game.rating.toFixed(1)}</span>
                  </div>
                  
                  {game.released && (
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                      Released: {new Date(game.released).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {game.genres?.map((genre) => (
                    <span 
                      key={genre.name}
                      className="px-3 py-1.5 text-sm bg-black/30 backdrop-blur-sm rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="px-4 py-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p>{error}</p>
            <Link href="/browse" className="text-blue-500 mt-4 inline-block">
              Go back to browse
            </Link>
          </div>
        ) : game ? (
          <div className="space-y-8">
            {/* Price and Actions */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="text-xl font-bold mb-4">
                ${getPrice(game.id, game.rating).toFixed(2)}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${
                    inCart 
                      ? 'bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <ShoppingCart size={16} />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </button>
                
                <button 
                  onClick={handleAddToWishlist}
                  disabled={inWishlist}
                  className={`flex items-center gap-2 px-4 py-2 rounded border ${
                    inWishlist
                      ? 'border-pink-600 text-pink-500'
                      : 'border-gray-600 text-gray-300 hover:border-pink-600 hover:text-pink-500'
                  }`}
                >
                  <Heart size={16} className={inWishlist ? "fill-pink-500" : ""} />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
              
              {addedToCart && (
                <div className="mt-2 text-green-500 text-sm animate-pulse">
                  Added to cart!
                </div>
              )}
            </div>
            
            {/* Platforms & Genres */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-400">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms?.slice(0, 5).map((p, index) => (
                    <span key={index} className="bg-gray-700 px-2 py-1 text-xs rounded">
                      {p.platform.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-400">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {game.genres?.map((genre, index) => (
                    <span key={index} className="bg-gray-700 px-2 py-1 text-xs rounded">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300">
                  {game.description_raw?.slice(0, 500)}
                  {game.description_raw?.length > 500 ? '...' : ''}
                </p>
              </div>
            </div>
            
            {/* Developers */}
            {game.developers?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-400">Developers</h3>
                <div className="bg-gray-800 p-3 rounded">
                  {game.developers.map(dev => dev.name).join(', ')}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
}