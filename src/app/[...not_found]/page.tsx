"use client";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Simple 404 Text */}
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4">
          404
        </h1>
        
        {/* Error Message */}
        <h2 className="text-xl font-medium text-white mb-6">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Action Button */}
        <Link 
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center justify-center gap-2 transition-colors mx-auto w-max"
        >
          <Home size={18} />
          Return Home
        </Link>
      </div>
    </main>
  );
}