"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { Menu, X, Search, ShoppingCart, User, Home, Gamepad2, Crown, Library } from "lucide-react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, isLoaded } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);

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

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Gamepad2 },
    { href: "/membership", label: "Membership", icon: Crown },
    { href: "/library", label: "Library", icon: Library },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-gray-900/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center gap-3 flex-shrink-0 group"
          >
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
              <Image
                src="/logo.svg"
                alt="404 Gamers"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold hidden sm:block">
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                404 Gamers
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-auto">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-200 
                      ${isActive 
                        ? 'text-white bg-gray-700/50' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}
                    `}
                    onMouseEnter={() => setActiveLink(item.label.toLowerCase())}
                    onMouseLeave={() => setActiveLink(null)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              <Search size={18} />
              <span className="hidden lg:inline">Search</span>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ShoppingCart size={20} />
              {isMounted && isLoaded && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
              >
                {user && user.picture ? (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-gray-700">
                    <Image
                      src={user.picture}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <User size={20} />
                )}
              </button>

              {/* User Dropdown - Updated styling */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl shadow-lg bg-gray-800/95 backdrop-blur-sm ring-1 ring-gray-700 border border-gray-700">
                  {user ? (
                    <div className="py-1" role="menu">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative w-10 h-10">
                            <Image
                              src={user.picture}
                              alt="Profile"
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-sm text-gray-300 mb-4">
                        Sign in with Google:
                      </p>
                      <div className="flex justify-center">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={() => console.log("Login Failed")}
                          useOneTap
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Updated styling */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
