"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, isLoaded } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check for stored user data on component mount
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isUserMenuOpen]);

  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
    setIsUserMenuOpen(false);
    // Redirect to library page after successful sign-in
    router.push("/library");
  };

  const handleSignOut = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user");
    setIsUserMenuOpen(false);
    // Redirect to home page after sign-out
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo.svg"
                alt="GameStore Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold hidden md:block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              404 Gamers
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/membership"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Membership
            </Link>
            <Link
              href="/library"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Library
            </Link>
          </nav>

          {/* Right Section - Search & Cart */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>

            <Link
              href="/cart"
              className="text-gray-400 hover:text-white transition-colors relative"
            >
              <ShoppingCart size={20} />
              {/* Only render cart badge on client-side */}
              {isMounted && isLoaded && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
              >
                {user && user.picture ? (
                  <Image
                    src={user.picture}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User size={20} />
                )}
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user ? (
                    <div className="py-1" role="menu">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Image
                            src={user.picture}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-sm text-gray-300 mb-3">
                        Sign in with Google:
                      </p>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log("Login Failed")}
                        useOneTap
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/membership"
              className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Membership
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
