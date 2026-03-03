import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Star, Truck, Shield, RotateCcw } from "lucide-react";

export default function Home() {
  const bestSellers = products.filter(p => p.badge === "Bestseller").slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-700"></div>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm">瑞士机芯 · 欧洲直邮</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                简约而不简单
              </h1>

              <p className="text-xl md:text-2xl text-stone-300 mb-4">
                瑞士机芯 · 欧洲直邮
              </p>

              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-8">
                €99 起
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-colors"
              >
                查看全部
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex items-center gap-6 mt-12 text-sm text-stone-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>免费配送</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>2年质保</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>30天退换</span>
                </div>
              </div>
            </div>

            {/* Right - Watch Image */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                {/* Watch Circle */}
                <div className="w-80 h-80 rounded-full border-4 border-white/20 flex items-center justify-center relative">
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center shadow-2xl">
                    {/* Clock Face */}
                    <div className="relative w-60 h-60">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="100" cy="100" r="95" fill="none" stroke="white" strokeWidth="2" />
                        {/* Hour markers */}
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30 - 90) * (Math.PI / 180);
                          const x1 = 100 + 80 * Math.cos(angle);
                          const y1 = 100 + 80 * Math.sin(angle);
                          const x2 = 100 + 85 * Math.cos(angle);
                          const y2 = 100 + 85 * Math.sin(angle);
                          return (
                            <line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="white"
                              strokeWidth={i % 3 === 0 ? "3" : "1"}
                            />
                          );
                        })}
                        
                        {/* Hands */}
                        <line x1="100" y1="100" x2="100" y2="40" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <line x1="100" y1="100" x2="130" y2="100" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="8" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-4">热销推荐</h2>
          <p className="text-gray-600">深受顾客喜爱的经典款式</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.length > 0 ? bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          )) : products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border-2 border-stone-900 text-stone-900 px-8 py-3 rounded-lg font-semibold hover:bg-stone-900 hover:text-white transition-colors"
          >
            查看全部 {products.length} 款手表
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">客户评价</h2>
            <p className="text-gray-600">来自全球 2000+ 满意客户的声音</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: "Markus K.",
                country: "Germany",
                rating: 5,
                text: "Excellent quality for the price. The automatic movement keeps perfect time. Highly recommend!"
              },
              {
                name: "Sophie L.",
                country: "France", 
                rating: 5,
                text: "Beautiful vintage design. Got many compliments. Fast shipping to Paris. Will buy again."
              },
              {
                name: "James M.",
                country: "UK",
                rating: 5,
                text: "Great value for money. The watch looks much more expensive than it is. Love it!"
              }
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{review.text}""</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-semibold text-stone-600">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">安全支付方式</p>
            <div className="flex items-center justify-center gap-6">
              {['PayPal', 'Visa', 'Mastercard', 'AMEX'].map(method => (
                <div key={method} className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-gray-600">
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
