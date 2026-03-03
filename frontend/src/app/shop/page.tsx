import { products, categories } from "@/lib/data";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-2">All Watches</h1>
          <p className="text-gray-600">{products.length} vintage-inspired timepieces</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Collections</h3>
                  <div className="space-y-2">
                    {categories.filter(c => c !== "All").slice(0, 6).map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm text-gray-600">{category.replace(' Collection', '')}</span>
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
              <p className="text-gray-600">Showing {products.length} products</p>
              <select className="border rounded-lg px-3 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-xl border overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-square bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center relative">
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.badge}
                      </div>
                    )}
                    <div className="w-24 h-24">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
                        <line x1="50" y1="50" x2="50" y2="20" stroke="white" strokeWidth="2"/>
                        <line x1="50" y1="50" x2="70" y2="50" stroke="white" strokeWidth="2"/>
                        <circle cx="50" cy="50" r="4" fill="white"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{product.category.replace(' Collection', '')}</div>
                    <h3 className="font-medium mb-2 group-hover:text-stone-700">{product.name}</h3>
                    <p className="text-lg font-bold">€{product.price}</p>
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
