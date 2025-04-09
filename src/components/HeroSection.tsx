"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const games = [
    {
      id: "rdr2",
      title: "Red Dead Redemption 2",
      image: "/games/rdr2.jpg",
      description: "An epic tale of life in America's unforgiving heartland",
      price: "$59.99",
      discount: "$39.99",
      tag: "Best Seller",
      genre: "Action Adventure"
    },
    {
      id: "lastofus",
      title: "The Last of Us Part II",
      image: "/games/lastofus.webp",
      description: "Experience a brutal post-apocalyptic world",
      price: "$49.99",
      discount: "$34.99",
      tag: "Trending",
      genre: "Survival Horror"
    },
    {
      id: "alanwake",
      title: "Alan Wake 2",
      image: "/games/alanwake.webp",
      description: "Dive into a psychological horror story",
      price: "$59.99",
      discount: null,
      tag: "New Release",
      genre: "Psychological Horror"
    },
    {
      id: "re7",
      title: "Resident Evil 7",
      image: "/games/re7.jpg",
      description: "Fear and isolation in a terrifying survival horror",
      price: "$29.99",
      discount: "$19.99",
      tag: "Horror",
      genre: "Survival Horror"
    }
  ];

  // Auto-change slide every 5 seconds, but only if not hovering
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === games.length - 1 ? 0 : current + 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [games.length, isHovering]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current === games.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? games.length - 1 : current - 1));
  };

  return (
    <section className="w-full py-12 px-4 md:py-16 md:px-8 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Content */}
        <div className="flex flex-col md:flex-row items-center mb-16 md:mb-24">
          <div className="w-full md:w-1/2 text-left mb-10 md:mb-0 md:pr-12">
            <div className="relative mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Find your next game here
              </h1>
              <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
            </div>
            
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
              Explore our massive collection of top-rated games with exclusive deals and instant access. Your journey begins here.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/browse"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors flex items-center justify-center group"
              >
                Browse Games
                <span className="group-hover:translate-x-1 transition-transform ml-2">→</span>
              </Link>
              <Link
                href="/membership"
                className="bg-transparent border border-blue-600 text-blue-400 hover:bg-blue-600/10 font-medium py-3 px-8 rounded-full transition-colors"
              >
                Join Membership
              </Link>
            </div>
          </div>

          {/* Carousel */}
          <div 
            className="w-full md:w-1/2 relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Carousel navigation buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all opacity-70 hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all opacity-70 hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          
            <div className="h-[420px] md:h-[480px] relative rounded-xl overflow-hidden">
              {/* Gradient overlays for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none w-1/3"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent z-10 pointer-events-none w-1/3 right-0"></div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
              
              <div 
                className="absolute w-[200%] flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeIndex * 25}%)` }}
              >
                {games.map((game, index) => (
                  <div 
                    key={game.id} 
                    className="w-1/4 px-2 flex-shrink-0"
                  >
                    <div className={`rounded-lg overflow-hidden h-full flex flex-col transform transition-all duration-500 ${
                      index === activeIndex ? "scale-105 shadow-2xl shadow-blue-900/30" : "scale-95 brightness-75"
                    }`}>
                      <div className="relative h-64 md:h-72">
                        <Image 
                          src={game.image}
                          alt={game.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === activeIndex}
                          className="object-cover"
                        />
                        
                        {/* Game tags and badges */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
                          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            {game.genre}
                          </span>
                          
                          {game.tag && (
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {game.tag}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5 flex-grow flex flex-col bg-gray-800/95 backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                        <p className="text-sm text-gray-300 mb-4 flex-grow">{game.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {game.discount ? (
                              <>
                                <span className="text-gray-400 line-through text-sm mr-2">{game.price}</span>
                                <span className="text-lg font-bold text-white">{game.discount}</span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-white">{game.price}</span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="bg-transparent border border-gray-600 hover:border-gray-400 text-white p-2 rounded transition-colors">
                              <ShoppingCart size={18} />
                            </button>
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded transition-colors font-medium">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-6 space-x-3">
              {games.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === activeIndex 
                      ? "w-10 bg-gradient-to-r from-blue-600 to-purple-600" 
                      : "w-3 bg-gray-700 hover:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}