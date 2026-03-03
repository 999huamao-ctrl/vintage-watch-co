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
        {/* Image Container with Gradient */}
        <div className={`relative aspect-square bg-gradient-to-br ${getCategoryColor(product.category)} overflow-hidden`}>
          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg`}>
              {product.badge}
            </div>
          )}
          
          {/* Category Tag */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full shadow-sm">
            {product.category.replace(' Collection', '')}
          </div>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            {/* Watch Icon */}
            <div className="w-32 h-32 mb-4 opacity-90">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="watchFace" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#e5e5e5" stopOpacity="0.8"/>
                  </linearGradient>
                </defs>
                {/* Outer ring */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#watchFace)" strokeWidth="3"/>
                <circle cx="100" cy="100" r="82" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3"/>
                
                {/* Hour markers */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const isMain = i % 3 === 0;
                  const x1 = 100 + (isMain ? 70 : 75) * Math.cos(angle);
                  const y1 = 100 + (isMain ? 70 : 75) * Math.sin(angle);
                  const x2 = 100 + 80 * Math.cos(angle);
                  const y2 = 100 + 80 * Math.sin(angle);
                  return (
                    <line 
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2} 
                      stroke="white" 
                      strokeWidth={isMain ? "3" : "1.5"}
                      strokeLinecap="round"
                      opacity={isMain ? "0.9" : "0.5"}
                    />
                  );
                })}
                
                {/* Hands */}
                <line x1="100" y1="100" x2="100" y2="45" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                <line x1="100" y1="100" x2="130" y2="100" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                
                {/* Center dot */}
                <circle cx="100" cy="100" r="6" fill="white"/>
              </svg>
            </div>
            
            {/* Product Name on Image */}
            <div className="text-center px-4">
              <p className="text-lg font-serif font-medium opacity-90">{product.name}</p>
              <p className="text-sm opacity-60 mt-1">{product.specs.caseSize} · {product.specs.movement.split(' ')[0]}</p>
            </div>
          </div>

          {/* Hover Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-xl font-semibold text-sm shadow-xl transition-all ${
                added 
                  ? "bg-emerald-500 text-white" 
                  : "bg-white text-stone-900 hover:bg-gray-50"
              }`}
            >
              {added ? "✓ 已加入购物车" : "加入购物车"}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {product.category.replace(' Collection', '')}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500">{product.specs.caseSize}</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 group-hover:text-stone-700 transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-stone-900">
                €{product.price}
              </span>
              <span className="text-xs text-gray-400">含增值税</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>有库存</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
