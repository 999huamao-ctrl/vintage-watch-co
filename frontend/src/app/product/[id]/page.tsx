"use client";

import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { useCart } from "@/lib/cart";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

function ProductDetails({ product }: { product: typeof products[0] }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);
  
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Generate 6 placeholder images
  const images = [
    { id: 1, alt: "Front view" },
    { id: 2, alt: "Side view" },
    { id: 3, alt: "Back view" },
    { id: 4, alt: "Detail" },
    { id: 5, alt: "On wrist" },
    { id: 6, alt: "Box" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl border flex items-center justify-center relative">
              {product.badge && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {product.badge}
                </div>
              )}
              <div className="w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#333" strokeWidth="2" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#666" strokeWidth="1" />
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const x1 = 100 + 70 * Math.cos(angle);
                    const y1 = 100 + 70 * Math.sin(angle);
                    const x2 = 100 + 75 * Math.cos(angle);
                    const y2 = 100 + 75 * Math.sin(angle);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth={i % 3 === 0 ? "3" : "1"} />;
                  })}
                  <line x1="100" y1="100" x2="100" y2="45" stroke="#333" strokeWidth="4" strokeLinecap="round" />
                  <line x1="100" y1="100" x2="130" y2="100" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="100" cy="100" r="6" fill="#333" />
                </svg>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-6 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  className={`aspect-square bg-white rounded-lg border-2 flex items-center justify-center text-xs text-gray-400 hover:border-stone-900 transition-colors ${
                    i === 0 ? 'border-stone-900' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
              <h1 className="text-3xl font-serif mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">128 评价</span>
              </div>

              <div className="text-4xl font-bold text-stone-900 mb-4">
                €{product.price}
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold mb-4">规格参数</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "表径", value: product.specs.caseSize },
                  { label: "机芯", value: product.specs.movement },
                  { label: "表带", value: product.specs.strap },
                  { label: "防水", value: product.specs.waterResistance },
                  { label: "表镜", value: product.specs.crystal },
                  { label: "产地", value: "中国" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">数量</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-stone-900 text-white hover:bg-stone-800"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "已加入购物车 ✓" : `加入购物车 - €${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex flex-col items-center gap-2">
                <Truck className="w-6 h-6 text-stone-600" />
                <span>免费配送</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-6 h-6 text-stone-600" />
                <span>2年质保</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <RotateCcw className="w-6 h-6 text-stone-600" />
                <span>30天退换</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif mb-6">相关推荐</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-white rounded-xl border p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-gray-400" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2">{p.name}</h3>
                  <p className="text-lg font-bold">€{p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
