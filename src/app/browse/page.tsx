"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, ChevronDown, Search, Star } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

// Types for API responses
interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  platforms?: { platform: { name: string } }[];
  genres?: { name: string }[];
  metacritic?: number;
  price?: number;
}

interface Genre {
  id: number;
  name: string;
  image_background: string;
}

interface Platform {
  id: number;
  name: string;
  slug: string;
}

const BrowsePage = () => {
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useCart();
  
  // Add these new pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // State for filters and games
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-rating');
  
  // UI states
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_RAW_GAME_API;
  const API_BASE = 'https://api.rawg.io/api';

  // Fetch games based on filters
  const fetchGames = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/games?key=${API_KEY}&page=${currentPage}&page_size=${itemsPerPage}&ordering=${ordering}`;
      
      if (selectedGenre) {
        url += `&genres=${selectedGenre}`;
      }
      
      if (selectedPlatform) {
        url += `&platforms=${selectedPlatform}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        setGames(data.results);
        // Calculate total pages from the count
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } else {
        setError('Failed to fetch games');
      }
    } catch (err) {
      setError('An error occurred while fetching games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [API_KEY, selectedGenre, selectedPlatform, searchQuery, ordering, currentPage]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE}/genres?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.results) {
          setGenres(data.results);
        }
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, [API_KEY]);

  // Fetch platforms
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch(`${API_BASE}/platforms?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.results) {
          setPlatforms(data.results);
        }
      } catch (err) {
        console.error('Error fetching platforms:', err);
      }
    };

    fetchPlatforms();
  }, [API_KEY]);

  // Update these filter handlers
  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); // Reset to first page
    setShowGenreDropdown(false);
  };

  const handlePlatformChange = (platformId: number | null) => {
    setSelectedPlatform(platformId);
    setCurrentPage(1); // Reset to first page
    setShowPlatformDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
  };

  // Add this function with your other functions
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="px-4 py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Games</h1>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-gray-800 border border-gray-700 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-md transition-colors"
            >
              Search
            </button>
          </form>
          
          <div className="flex flex-wrap gap-4">
            {/* Genre Filter */}
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
              >
                Genre
                <ChevronDown size={16} />
              </button>
              
              {showGenreDropdown && (
                <div className="absolute z-10 mt-1 w-60 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-y-auto max-h-80">
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleGenreChange(null)}
                  >
                    All Genres
                  </div>
                  {genres.map(genre => (
                    <div
                      key={genre.id}
                      className="p-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleGenreChange(genre.id)}
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Platform Filter */}
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              >
                Platform
                <ChevronDown size={16} />
              </button>
              
              {showPlatformDropdown && (
                <div className="absolute z-10 mt-1 w-60 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-y-auto max-h-80">
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handlePlatformChange(null)}
                  >
                    All Platforms
                  </div>
                  {platforms.map(platform => (
                    <div
                      key={platform.id}
                      className="p-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handlePlatformChange(platform.id)}
                    >
                      {platform.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sort Order */}
            <div className="relative ml-auto">
              <button
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                onClick={() => setShowOrderDropdown(!showOrderDropdown)}
              >
                <Filter size={16} />
                Sort By
                <ChevronDown size={16} />
              </button>
              
              {showOrderDropdown && (
                <div className="absolute right-0 z-10 mt-1 w-60 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setOrdering('-rating');
                      setShowOrderDropdown(false);
                    }}
                  >
                    Rating (High to Low)
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setOrdering('rating');
                      setShowOrderDropdown(false);
                    }}
                  >
                    Rating (Low to High)
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setOrdering('-released');
                      setShowOrderDropdown(false);
                    }}
                  >
                    Release Date (Newest)
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setOrdering('released');
                      setShowOrderDropdown(false);
                    }}
                  >
                    Release Date (Oldest)
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setOrdering('name');
                      setShowOrderDropdown(false);
                    }}
                  >
                    Name (A-Z)
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setOrdering('-name');
                      setShowOrderDropdown(false);
                    }}
                  >
                    Name (Z-A)
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Active filters display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedGenre && genres.find(g => g.id === selectedGenre) && (
              <div className="bg-blue-900 text-sm rounded-full px-3 py-1 flex items-center">
                Genre: {genres.find(g => g.id === selectedGenre)?.name}
                <button 
                  className="ml-2 hover:text-blue-300"
                  onClick={() => handleGenreChange(null)}
                >
                  ×
                </button>
              </div>
            )}
            
            {selectedPlatform && platforms.find(p => p.id === selectedPlatform) && (
              <div className="bg-blue-900 text-sm rounded-full px-3 py-1 flex items-center">
                Platform: {platforms.find(p => p.id === selectedPlatform)?.name}
                <button 
                  className="ml-2 hover:text-blue-300"
                  onClick={() => handlePlatformChange(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Games Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : games.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No games found. Try different filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map(game => (
              <Link href={`/games/${game.id}`} key={game.id}>
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-600 transition-colors h-full flex flex-col">
                  <div className="relative h-48">
                    {game.background_image ? (
                      <Image
                        src={game.background_image}
                        alt={game.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    
                    {game.metacritic && (
                      <div className={`absolute bottom-2 right-2 ${
                        game.metacritic >= 75 ? 'bg-green-700' : 
                        game.metacritic >= 50 ? 'bg-yellow-700' : 'bg-red-700'
                      } text-white text-xs font-bold px-1.5 py-0.5 rounded`}>
                        {game.metacritic}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold mb-2 line-clamp-1">{game.name}</h3>
                    
                    <div className="flex items-center mb-2 text-sm text-gray-400">
                      <Star size={16} className="text-yellow-500 mr-1" />
                      {game.rating.toFixed(1)}
                    </div>
                    
                    {game.released && (
                      <p className="text-sm text-gray-400 mb-2">
                        Released: {new Date(game.released).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="mt-auto">
                      {game.genres && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {game.genres.slice(0, 2).map(genre => (
                            <span key={genre.name} className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {game.platforms && (
                        <div className="text-xs text-gray-400 line-clamp-1">
                          {game.platforms.slice(0, 3).map(p => p.platform.name).join(', ')}
                          {game.platforms.length > 3 ? ' & more' : ''}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation
                          addToCart({
                            id: game.id,
                            name: game.name,
                            price: game.price || 19.99, // Default price if not available
                            image: game.background_image,
                          });
                        }}
                        className={`text-xs px-2 py-1 rounded ${
                          isInCart(game.id)
                            ? 'bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isInCart(game.id) ? 'In Cart' : 'Add to Cart'}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation
                          addToWishlist({
                            id: game.id,
                            name: game.name,
                            price: game.price || 19.99,
                            image: game.background_image,
                          });
                        }}
                        className="text-xs px-2 py-1 rounded border border-gray-600 hover:border-pink-500 hover:text-pink-400"
                      >
                        Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {/* Show current page and total pages */}
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrowsePage;