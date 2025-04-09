import Image from "next/image";

interface GameCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function GameCard({ title, description, imageUrl }: GameCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <Image
        src={imageUrl}
        alt={`${title} Thumbnail`}
        width={300}
        height={200}
        className="rounded-lg"
      />
      <h4 className="text-xl font-semibold mt-4">{title}</h4>
      <p className="text-gray-400 mt-2">{description}</p>
      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        Learn More
      </button>
    </div>
  );
}