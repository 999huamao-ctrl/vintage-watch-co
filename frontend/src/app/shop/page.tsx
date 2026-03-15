"use client";

import { products, categories } from "@/lib/data";
import { useLanguage } from "@/lib/language";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ShopPage() {
  const { t } = useLanguage();

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
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center relative overflow-hidden">
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        {product.badge}
                      </div>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-gray-900 mb-1">{product.category.replace(' Collection', '')}</div>
                    <h3 className="font-medium mb-2 text-gray-900 group-hover:text-stone-700">{product.name}</h3>
                    <p className="text-lg font-bold text-gray-900">€{product.price}</p>
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
