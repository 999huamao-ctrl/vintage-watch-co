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

  const thumbnails = [
    { label: "正面", color: "from-stone-800 to-stone-900", icon: "◯" },
    { label: "侧面", color: "from-stone-700 to-stone-800", icon: "◐" },
    { label: "背面", color: "from-stone-800 to-stone-900", icon: "◉" },
    { label: "细节", color: "from-amber-900/40 to-stone-900", icon: "✦" },
    { label: "佩戴", color: "from-stone-700 to-stone-800", icon: "⌚" },
    { label: "包装", color: "from-stone-800 to-stone-900", icon: "🎁" },
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
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-stone-800 via-stone-900 to-black rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl">
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-6 left-6 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                  {product.badge}
                </div>
              )}
              
              {/* Ambient glow */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
              </div>
              
              {/* Watch SVG */}
              <div className="relative z-10 w-80 h-80">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="watchFace" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fafafa" stopOpacity="0.95"/>
                      <stop offset="100%" stopColor="#e5e5e5" stopOpacity="0.9"/>
                    </linearGradient>
                  </defs>
                  
                  <circle cx="100" cy="100" r="96" fill="none" stroke="url(#watchFace)" strokeWidth="3"/>
                  <circle cx="100" cy="100" r="88" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.15"/>
                  
                  {/* Hour markers */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const isMain = i % 3 === 0;
                    const x1 = 100 + (isMain ? 70 : 76) * Math.cos(angle);
                    const y1 = 100 + (isMain ? 70 : 76) * Math.sin(angle);
                    const x2 = 100 + 85 * Math.cos(angle);
                    const y2 = 100 + 85 * Math.sin(angle);
                    return (
                      <line 
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2} 
                        stroke="white" 
                        strokeWidth={isMain ? "4" : "2"}
                        strokeLinecap="round"
                        opacity={isMain ? "0.95" : "0.5"}
                      />
                    );
                  })}
                  
                  {/* Hands */}
                  <line x1="100" y1="100" x2="100" y2="38" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                  <line x1="100" y1="100" x2="138" y2="100" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="100" y1="100" x2="100" y2="65" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                  
                  <circle cx="100" cy="100" r="8" fill="white"/>
                  <circle cx="100" cy="100" r="4" fill="#1c1917"/>
                </svg>
                
                {/* Product name */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p className="text-white/70 text-lg font-serif">{product.name}</p>
                  <p className="text-white/40 text-sm mt-1">{product.specs.caseSize} · {product.specs.movement}</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-6 gap-3">
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  className={`aspect-square bg-gradient-to-br ${thumb.color} rounded-xl flex flex-col items-center justify-center text-white/80 hover:text-white transition-all hover:scale-105 hover:shadow-lg ${
                    i === 0 ? 'ring-2 ring-amber-500 ring-offset-2 shadow-lg' : ''
                  }`}
                >
                  <span className="text-2xl mb-1">{thumb.icon}</span>
                  <span className="text-xs font-medium">{thumb.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">{product.category}</span>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-green-600 font-medium">✓ 有库存</span>
              </div>
              <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">128 条评价</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-stone-900">
                  €{product.price}
                </span>
                <span className="text-gray-400 line-through">€{Math.round(product.price * 1.3)}</span>
                <span className="bg-rose-100 text-rose-600 text-sm font-medium px-2 py-1 rounded">省 €{Math.round(product.price * 0.3)}</span>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span>规格参数</span>
                <span className="text-xs text-gray-400 font-normal">高品质保证</span>
              </h3>
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
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">数量</span>
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 rounded-l-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 rounded-r-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  added
                    ? "bg-emerald-500 text-white"
                    : "bg-stone-900 text-white hover:bg-stone-800 hover:shadow-lg"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "✓ 已加入购物车" : `加入购物车 - €${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm bg-gray-50 p-4 rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Truck className="w-5 h-5 text-stone-600" />
                </div>
                <span className="text-gray-600">免费配送</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5 text-stone-600" />
                </div>
                <span className="text-gray-600">2年质保</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <RotateCcw className="w-5 h-5 text-stone-600" />
                </div>
                <span className="text-gray-600">30天退换</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-serif mb-6">相关推荐</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-white rounded-xl border p-4 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="aspect-square bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <div className="w-20 h-20">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
                        <circle cx="50" cy="50" r="4" fill="white"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-medium mb-2 group-hover:text-stone-700">{p.name}</h3>
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
