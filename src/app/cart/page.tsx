"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Trash2, CreditCard, ChevronLeft, AlertCircle, ChevronRight } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";
import { useRouter } from "next/navigation";

const DuplicateGamesError = ({ error, router }: { error: any; router: any }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500/10 rounded-full">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium text-yellow-500">{error.title}</h3>
      </div>

      <p className="text-gray-300 mb-4">{error.message}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {error.games.map((game: any) => (
          <div
            key={game.id}
            className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3"
          >
            <div className="relative w-12 h-12">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <span className="text-sm text-gray-300">{game.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => router.push("/library")}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View in Library
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [duplicateError, setDuplicateError] = useState<{ title: string; message: string; games: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const subtotal = cartTotal;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.13;
  const total = subtotal - discount + tax;

  const applyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === "game10") {
      setPromoApplied(true);
    }
  };

  const handleCheckout = async () => {
    try {
      setDuplicateError(null);
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;

      if (!userData) {
        setError('Please sign in to proceed');
        return;
      }

      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userData.sub
        },
        body: JSON.stringify({
          games: cartItems,
          totalAmount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.error) {
          setDuplicateError(data.error);
          return;
        }
        throw new Error("Checkout failed");
      }

      // Clear cart and redirect to library only on successful purchase
      if (data.success) {
        localStorage.removeItem("cartItems");
        
        router.push("/library");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Failed to complete checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow px-4 py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

        {duplicateError && <DuplicateGamesError error={duplicateError} router={router} />}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven't added any games to your cart yet.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              <ChevronLeft size={18} className="mr-2" />
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <div className="hidden md:grid md:grid-cols-12 text-sm text-gray-400 p-4 border-b border-gray-700">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 p-4 border-b border-gray-700 last:border-b-0 items-center"
                  >
                    <div className="col-span-6 flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-700 rounded overflow-hidden relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Digital Download
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-gray-300 mb-2 md:mb-0">
                      <div className="md:hidden inline text-gray-500 mr-2">
                        Price:
                      </div>
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="col-span-2 text-center mb-2 md:mb-0">
                      <div className="md:hidden inline text-gray-500 mr-2">
                        Quantity:
                      </div>
                      <div className="flex items-center justify-center">
                        <button
                          className="w-8 h-8 bg-gray-700 text-gray-300 rounded-l"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-12 h-8 bg-gray-700 text-center text-white border-none outline-none"
                        />
                        <button
                          className="w-8 h-8 bg-gray-700 text-gray-300 rounded-r"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between md:justify-end">
                      <div>
                        <div className="md:hidden inline text-gray-500 mr-2">
                          Subtotal:
                        </div>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <Link
                  href="/browse"
                  className="inline-flex items-center text-blue-500 hover:text-blue-400"
                >
                  <ChevronLeft size={18} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax (13%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={applyPromoCode} className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      placeholder={
                        promoApplied ? "GAME10 Applied" : "Enter code"
                      }
                      className="flex-grow bg-gray-700 border border-gray-600 rounded-l px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={promoApplied}
                      className={`px-3 py-2 text-sm rounded-r ${
                        promoApplied
                          ? "bg-green-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-500 text-xs mt-1">
                      Promo code applied successfully!
                    </p>
                  )}
                  {!promoApplied && (
                    <p className="text-gray-500 text-xs mt-1">
                      Try "GAME10" for 10% off
                    </p>
                  )}
                </form>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded flex items-center justify-center transition-colors"
                >
                  <CreditCard size={18} className="mr-2" />
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Note: This is a student project for WEB 422. No actual
                  payments will be processed.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSuccess={handleCheckout}
        total={total}
      />
    </div>
  );
}
