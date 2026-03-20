"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  stock: number;
}

export default function ShopPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 筛选状态
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // 根据筛选条件过滤产品
    let filtered = products;
    
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedBrands, selectedCategories]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
        
        // 提取品牌列表
        const uniqueBrands = [...new Set(data.data.map((p: Product) => p.brand).filter(Boolean))];
        setBrands(uniqueBrands as string[]);
        
        // 提取分类列表
        const uniqueCategories = [...new Set(data.data.map((p: Product) => p.category).filter(Boolean))];
        setCategories(uniqueCategories as string[]);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
          <p className="text-gray-800">{filteredProducts.length} {t('shop.subtitle')}</p>
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
                {/* 品牌筛选 */}
                {brands.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3 text-gray-900">{t('shop.brands') || 'Brands'}</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                          />
                          <span className="text-sm text-gray-900">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 分类筛选 */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3 text-gray-900">{t('shop.categories') || 'Categories'}</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                          />
                          <span className="text-sm text-gray-900">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 清除筛选 */}
                {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-900">{t('shop.showing')} {filteredProducts.length} {t('shop.products')}</p>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white">
                <option>{t('shop.sortFeatured')}</option>
                <option>{t('shop.sortPriceLow')}</option>
                <option>{t('shop.sortPriceHigh')}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
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
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No products found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
