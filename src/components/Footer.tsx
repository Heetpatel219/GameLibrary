import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-black to-gray-900 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-8 px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo - Left Side */}
          <Link href="/" className="mb-6 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo.svg" 
                  alt="GameStore Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                404 Gamers
              </h2>
            </div>
          </Link>
          
          {/* Social Links - Right Side */}
          <div>
            <div className="flex space-x-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-500 hover:text-pink-500 transition-all hover:scale-110 transform duration-200">
                <Instagram size={22} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-500 hover:text-red-500 transition-all hover:scale-110 transform duration-200">
                <Youtube size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-500 hover:text-blue-400 transition-all hover:scale-110 transform duration-200">
                <Twitter size={22} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-500 hover:text-blue-600 transition-all hover:scale-110 transform duration-200">
                <Facebook size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto py-6 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} GameStore. All rights reserved.</p>
          <div className="flex mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-gray-300 transition-colors mr-6">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}