"use client";

import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-stone-100 relative">
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <svg
              className="w-32 h-32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-xs text-stone-500 uppercase tracking-wider">
              {product.category}
            </p>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-serif mb-2 hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-stone-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-amber-800">
            €{product.price}
          </span>
          
          <button
            onClick={() => addItem(product)}
            className="bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
