"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import Link from "next/link";
import { ArrowRight, Star, Truck, Shield, RotateCcw, Clock, Users, Award } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  badge?: string;
  stock: number;
  specs: {
    caseSize: string;
    movement: string;
    strap: string;
    waterResistance: string;
    crystal: string;
    caseMaterial: string;
  };
  inStock: boolean;
}

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const bestSellers = products.length > 0 
    ? products.slice(0, 4) 
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800"></div>
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">{t('hero.badge')}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight tracking-tight">
                {t('hero.title1')}
                <br />
                <span className="text-amber-400">{t('hero.title2')}</span>
              </h1>

              <p className="text-lg md:text-xl text-stone-100 mb-8 max-w-lg">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 text-stone-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-colors"
                >
                  {t('hero.shopNow')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  {t('hero.viewCollection')}
                </Link>
              </div>

              {/* Promo Code */}
              <div className="inline-flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 px-6 py-3 rounded-xl">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-amber-200">{t('hero.saleEnds')}</p>
                  <p className="text-lg font-bold text-amber-400">{t('hero.useCode')}</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="hidden md:flex justify-center relative">
              <div className="relative">
                {/* Main Watch Display */}
                <div className="w-96 h-96 rounded-full border-2 border-white/10 flex items-center justify-center relative">
                  <div className="w-80 h-80 rounded-full bg-gradient-to-br from-stone-800 to-stone-950 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    {/* Watch Face */}
                    <div className="relative w-64 h-64">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <defs>
                          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f5f5f5" />
                            <stop offset="100%" stopColor="#e5e5e5" />
                          </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r="98" fill="url(#faceGrad)" />
                        <circle cx="100" cy="100" r="95" fill="none" stroke="#d4d4d4" strokeWidth="1" />
                        
                        {/* Hour markers */}
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30 - 90) * (Math.PI / 180);
                          const isMain = i % 3 === 0;
                          const x1 = 100 + (isMain ? 75 : 82) * Math.cos(angle);
                          const y1 = 100 + (isMain ? 75 : 82) * Math.sin(angle);
                          const x2 = 100 + 88 * Math.cos(angle);
                          const y2 = 100 + 88 * Math.sin(angle);
                          return (
                            <line
                              key={i}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#1a1a1a"
                              strokeWidth={isMain ? "4" : "2"}
                              strokeLinecap="round"
                            />
                          );
                        })}
                        
                        {/* Brand text */}
                        <text x="100" y="45" textAnchor="middle" fontSize="8" fill="#666" fontFamily="serif">HØRIZON</text>
                        
                        {/* Hands */}
                        <line x1="100" y1="100" x2="100" y2="35" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />
                        <line x1="100" y1="100" x2="135" y2="100" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
                        <line x1="100" y1="100" x2="100" y2="70" stroke="#c9a962" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="6" fill="#1a1a1a" />
                        <circle cx="100" cy="100" r="3" fill="#c9a962" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
                
                {/* Floating badges */}
                <div className="absolute -right-4 top-1/4 bg-white/10 backdrop-blur px-4 py-2 rounded-xl border border-white/20">
                  <p className="text-xs text-white/90">{t('hero.startingAt')}</p>
                  <p className="text-2xl font-bold text-amber-400">{t('hero.price')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-stone-50 border-y">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: t('trust.freeShipping'), sublabel: t('trust.freeShippingDesc') },
              { icon: Shield, label: t('trust.warranty'), sublabel: t('trust.warrantyDesc') },
              { icon: RotateCcw, label: t('trust.returns'), sublabel: t('trust.returnsDesc') },
              { icon: Users, label: t('trust.customers'), sublabel: t('trust.customersDesc') },
            ].map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-stone-800" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-stone-900">{label}</p>
                  <p className="text-xs text-gray-800">{sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-medium mb-2">{t('bestsellers.subtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">{t('bestsellers.title')}</h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            {t('home.bestsellerDesc')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-12">{t('common.loading')}</div>
          ) : bestSellers.length > 0 ? (
            bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-12 text-gray-500">
              {t('common.noProducts')}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border-2 border-stone-900 text-stone-900 px-8 py-3 rounded-lg font-semibold hover:bg-stone-900 hover:text-white transition-colors"
          >
            {t('bestsellers.viewAll')} {products.length}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-600 font-medium mb-2">{t('home.storyLabel')}</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                {t('home.storyTitle')}
              </h2>
              <p className="text-gray-800 mb-6 leading-relaxed">
                {t('home.storyDesc1')}
              </p>
              <p className="text-gray-800 mb-8 leading-relaxed">
                {t('home.storyDesc2')}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-stone-900 font-semibold hover:text-amber-600 transition-colors"
              >
                {t('home.exploreCollection')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl flex items-center justify-center">
                <Award className="w-32 h-32 text-white/20" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
                <p className="text-4xl font-bold text-stone-900">17</p>
                <p className="text-sm text-gray-800">{t('home.countriesShipped')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl font-serif mb-4">{t('home.reviewsTitle')}</h2>
          <p className="text-gray-800">{t('home.reviewsSubtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              name: "Markus K.",
              country: "Germany",
              rating: 5,
              text: "Excellent quality for the price. The automatic movement keeps perfect time. Shipping to Berlin took just 10 days!"
            },
            {
              name: "Sophie L.",
              country: "France", 
              rating: 5,
              text: "Beautiful vintage design. Got many compliments at work. The packaging was elegant - perfect for gifting."
            },
            {
              name: "James M.",
              country: "UK",
              rating: 5,
              text: "Great value for money. The watch looks much more expensive than it is. Customer service was excellent too."
            }
          ].map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-800 mb-4 italic">&ldquo;{review.text}&rdquo;</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-semibold text-stone-800">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-medium">{review.name}</p>
                  <p className="text-sm text-gray-900">{review.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center pt-8 border-t">
          <p className="text-sm text-gray-900 mb-4">{t('home.securePayment')}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['PayPal', 'Visa', 'Mastercard', 'USDT'].map(method => (
              <div key={method} className="bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-800">
                {method}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-200 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-serif text-lg mb-4">{t('footer.brand')}</h3>
            <p className="text-sm">{t('footer.brandDesc')}</p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">{t('footer.shop')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">{t('bestsellers.viewAll')}</a></li>
              <li><a href="/shop" className="hover:text-white">{t('footer.newArrivals')}</a></li>
              <li><a href="/shop" className="hover:text-white">{t('footer.bestSellers')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">{t('footer.shippingInfo')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.returns')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.contactUs')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">{t('footer.contact')}</h4>
            <p className="text-sm">{t('footer.email')}</p>
            <p className="text-sm mt-2">{t('footer.payment')}</p>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-stone-800 text-sm text-center">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}
