"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import CartDrawer from "./CartDrawer";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCart((state) => state.getTotalItems());

  return (
    <>
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-serif font-medium">
            Vintage Watch Co.
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/shop"
              className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
            >
              全部产品
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
