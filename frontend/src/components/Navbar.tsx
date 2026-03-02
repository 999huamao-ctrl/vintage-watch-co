"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCart((state) => state.getTotalItems());

  return (
    <>
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-serif text-stone-900">
            Vintage Watch Co.
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-stone-600 hover:text-stone-900 transition-colors hidden sm:block"
            >
              Shop
            </Link>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Open cart"
            >
              <svg
                className="w-6 h-6 text-stone-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
