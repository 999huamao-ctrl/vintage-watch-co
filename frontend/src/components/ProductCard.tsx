"use client";

import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
      case "New": return "bg-green-500";
      case "Bestseller": return "bg-amber-500";
      case "Sale": return "bg-red-500";
      case "Popular": return "bg-blue-500";
      case "Premium": return "bg-purple-500";
      default: return "bg-stone-900";
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-3 left-3 ${getBadgeColor(product.badge)} text-white text-xs font-bold px-2 py-1 rounded-full z-10`}>
              {product.badge}
            </div>
          )}
          
          {/* Category Tag */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs text-gray-600 px-2 py-1 rounded-full">
            {product.category.replace(' Collection', '')}
          </div>
          
          {/* Watch Icon Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 relative">
              <svg
                className="w-full h-full text-gray-300 group-hover:scale-105 transition-transform duration-500"
                viewBox="0 0 200 200"
                fill="none"
              >
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" />
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="100" y1="30" x2="100" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="150" x2="100" y2="170" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="30" y1="100" x2="50" y2="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="150" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="100" x2="100" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="100" x2="130" y2="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="100" r="6" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Hover Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                added 
                  ? "bg-green-600 text-white" 
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              {added ? "✓ Added" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">{product.category}</div>
          
          <h3 className="font-medium text-gray-900 group-hover:text-stone-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-stone-900">
              €{product.price}
            </span>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{product.specs.caseSize}</span>
              <span>•</span>
              <span>{product.specs.movement.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
