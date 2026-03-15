"use client";

import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/language";
import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "New": return "bg-emerald-500";
      case "Bestseller": return "bg-amber-500";
      case "Sale": return "bg-rose-500";
      case "Popular": return "bg-blue-500";
      case "Premium": return "bg-violet-500";
      default: return "bg-stone-800";
    }
  };

  const getCategoryColor = (category: string) => {
    if (category.includes("Heritage")) return "from-amber-900 to-stone-800";
    if (category.includes("Aviator")) return "from-slate-800 to-blue-900";
    if (category.includes("Diver")) return "from-cyan-900 to-blue-950";
    if (category.includes("Minimalist")) return "from-gray-800 to-stone-900";
    if (category.includes("Chronograph")) return "from-orange-900 to-stone-800";
    if (category.includes("Dress")) return "from-purple-900 to-stone-800";
    return "from-stone-800 to-gray-900";
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className={`relative aspect-square bg-gradient-to-br ${getCategoryColor(product.category)} overflow-hidden`}>
          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg`}>
              {product.badge === 'Hot' ? t('product.badgeHot') : 
               product.badge === 'New' ? t('product.badgeNew') :
               product.badge === 'Sale' ? t('product.badgeSale') :
               product.badge === 'Bestseller' ? t('product.badgeBestseller') : product.badge}
            </div>
          )}
          
          {/* Sale Badge */}
          <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
            -30%
          </div>

          {/* Product Image */}
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Hover Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-gradient-to-t from-black/50 to-transparent">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-xl font-semibold text-sm shadow-xl transition-all ${
                added 
                  ? "bg-emerald-500 text-white" 
                  : "bg-white text-stone-900 hover:bg-gray-50"
              }`}
            >
              {added ? `✓ ${t('product.added')}` : t('product.quickAdd')}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs text-gray-800">(128)</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 group-hover:text-stone-700 transition-colors mb-1 line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-xs text-gray-900 mb-3">
            {product.category.replace(' Collection', '')}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">
                €{product.price}
              </span>
              <span className="text-sm text-gray-800 line-through">
                €{Math.round(product.price * 1.4)}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>{t('product.inStock')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
