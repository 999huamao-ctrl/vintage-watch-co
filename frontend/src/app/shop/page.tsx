import { products, categories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-2">All Watches</h1>
          <p className="text-gray-600">Discover our collection of {products.length} vintage-inspired timepieces</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
