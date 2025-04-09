"use client";

import { CartProvider } from "@/contexts/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <CartProvider>{children}</CartProvider>
    </GoogleOAuthProvider>
  );
}
