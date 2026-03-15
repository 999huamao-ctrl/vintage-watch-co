"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/language";
import CartDrawer from "./CartDrawer";
import LanguageSwitcher from "./LanguageSwitcher";
import { ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const totalItems = useCart((state) => state.getTotalItems());

  return (
    <>
      {/* Top Banner */}
      <div className="bg-stone-900 text-white text-center py-2 text-sm">
        <span className="font-medium">{t('banner.weekendSale')}</span> {t('banner.offWithCode')}{" "}
        <span className="font-bold text-amber-400">WEEK20</span>
        <span className="hidden sm:inline ml-2 text-stone-500">· {t('banner.endsIn')} 23:59:59</span>
      </div>

      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl font-serif font-medium tracking-tight text-gray-900">
            HØRIZON
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/shop?category=Heritage+Collection"
              className="text-gray-800 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              {t('nav.men')}
            </Link>
            <Link
              href="/shop?category=Minimalist+Collection"
              className="text-gray-800 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              {t('nav.women')}
            </Link>
            <Link
              href="/shop"
              className="text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium"
            >
              {t('nav.sale')}
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6 text-gray-900" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
              <Link
                href="/shop?category=Heritage+Collection"
                className="block py-2 text-gray-800 hover:text-gray-900 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.men')}
              </Link>
              <Link
                href="/shop?category=Minimalist+Collection"
                className="block py-2 text-gray-800 hover:text-gray-900 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.women')}
              </Link>
              <Link
                href="/shop"
                className="block py-2 text-amber-600 hover:text-amber-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.sale')}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
