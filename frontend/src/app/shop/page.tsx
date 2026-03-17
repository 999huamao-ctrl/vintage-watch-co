"use client";

import { useState, useEffect } from "react";
import { categories } from "@/lib/data";
import { useLanguage } from "@/lib/language";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  caseSize?: string;
  movement?: string;
  strap?: string;
  waterResistance?: string;
}

export default function ShopPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-2 text-gray-900">{t('shop.title')}</h1>
          <p className="text-gray-800">{products.length} {t('shop.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-gray-900" />
                <h2 className="font-semibold text-gray-900">{t('shop.filters')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3 text-gray-900">{t('shop.collections')}</h3>
                  <div className="space-y-2">
                    {categories.filter(c => c !== "All").slice(0, 6).map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm text-gray-900">{category.replace(' Collection', '')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-900">{t('shop.showing')} {products.length} {t('shop.products')}</p>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                <option>{t('shop.sortFeatured')}</option>
                <option>{t('shop.sortPriceLow')}</option>
                <option>{t('shop.sortPriceHigh')}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">€{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{product.stock} in stock</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
