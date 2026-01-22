import Link from 'next/link';
import Image from 'next/image';

interface Game {
  id: string;
  name: string;
  image: string;
  genre: string;
}

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all cursor-pointer group">
        <div className="relative h-48 w-full">
          <Image 
            src={game.image} 
            alt={game.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4">
          <h3 className="text-white font-bold truncate">{game.name}</h3>
          <p className="text-gray-400 text-sm">{game.genre}</p>
        </div>
      </div>
    </Link>
  );
}