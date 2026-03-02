"use client";

import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import Link from "next/link";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone-600 mb-8">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/" className="hover:text-stone-900">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 aspect-square flex items-center justify-center relative">
            <div className="absolute top-4 left-4">
              <span className="bg-amber-700 text-white text-xs px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <svg
              className="w-64 h-64 text-stone-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-serif mb-4">{product.name}</h1>
            
            <p className="text-3xl font-semibold text-amber-800 mb-6">
              €{product.price}
            </p>

            <p className="text-stone-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-stone-500">Case Size:</span>
                  <p className="font-medium">{product.specs.caseSize}</p>
                </div>
                <div>
                  <span className="text-stone-500">Movement:</span>
                  <p className="font-medium">{product.specs.movement}</p>
                </div>
                <div>
                  <span className="text-stone-500">Strap:</span>
                  <p className="font-medium">{product.specs.strap}</p>
                </div>
                <div>
                  <span className="text-stone-500">Water Resistance:</span>
                  <p className="font-medium">{product.specs.waterResistance}</p>
                </div>
                <div>
                  <span className="text-stone-500">Crystal:</span>
                  <p className="font-medium">{product.specs.crystal}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-stone-100 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Free shipping on orders over €79</span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-medium transition-all ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
