"use client";

import { shippingRates } from "@/lib/data";
import { useLanguage } from "@/lib/language";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw, Star, Clock, Check, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  detailImage1?: string;
  detailImage2?: string;
  detailImage3?: string;
  detailImage4?: string;
  category: string;
  brand?: string;
  stock: number;
  // 规格参数
  caseMaterial?: string;
  dial?: string;
  movement?: string;
  powerReserve?: string;
  functions?: string;
  // 运营字段（前端展示）
  waterResistance?: string;
  sku?: string;
  weight?: number;
  description?: string;
  inStock?: boolean;
  badge?: string;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("DE");
  const [activeTab, setActiveTab] = useState("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [whatsAppLink, setWhatsAppLink] = useState<string | null>(null);
  
  // 构建图片数组（首图 + 最多4张细节图）
  const productImages = [product.image];
  if (product.detailImage1) productImages.push(product.detailImage1);
  if (product.detailImage2) productImages.push(product.detailImage2);
  if (product.detailImage3) productImages.push(product.detailImage3);
  if (product.detailImage4) productImages.push(product.detailImage4);
  
  const addItem = useCart((state) => state.addItem);

  // 获取随机 WhatsApp 链接
  useEffect(() => {
    const fetchWhatsAppLink = async () => {
      try {
        const res = await fetch('/api/whatsapp');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setWhatsAppLink(data.data.url);
          }
        }
      } catch (err) {
        console.error('Failed to fetch WhatsApp link:', err);
      }
    };
    fetchWhatsAppLink();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppClick = () => {
    if (whatsAppLink) {
      window.open(whatsAppLink, '_blank');
    }
  };

  const thumbnails = productImages.map((img, i) => ({
    label: i === 0 ? "Front" : `Detail ${i}`,
    image: img,
  }));

  const shipping = shippingRates[selectedCountry];
  const hasFreeShipping = product.price >= 79;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
            {t('nav.back')}
          </Link>
        </div>
      </div>

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4">
          <Clock className="w-5 h-5" />
          <span className="font-medium">{t('hero.saleEnds')}:</span>
          <div className="flex items-center gap-2 font-mono text-lg font-bold">
            <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <span className="text-rose-100">· {t('hero.useCode')}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl">
              {product.badge && (
                <div className="absolute top-6 left-6 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                  {product.badge}
                </div>
              )}
              <div className="absolute top-6 right-6 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                -30%
              </div>
              
              <img 
                src={productImages[activeImageIndex]} 
                alt={product.name}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails - 最多显示5张 */}
            {productImages.length > 1 && (
              <div className={`grid gap-3 ${productImages.length <= 3 ? 'grid-cols-3' : productImages.length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
                {thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-lg ${
                      i === activeImageIndex ? 'ring-2 ring-amber-500 ring-offset-2 shadow-lg' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={thumb.image} 
                      alt={thumb.label}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-amber-600 font-medium">{product.brand}</span>
                <span className="text-gray-900">·</span>
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" /> {t('product.inStock')}
                </span>
              </div>
              
              <h1 className="text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-900">128 {t('product.reviews')}</span>
                <span className="text-gray-900">·</span>
                <span className="text-sm text-green-600">1,284 {t('product.sold')}</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-stone-900">
                  €{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-800 line-through">€{product.originalPrice}</span>
                    <span className="bg-rose-100 text-rose-600 text-sm font-medium px-3 py-1 rounded-full">
                      {t('product.save')} €{Math.round(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{t('product.quantity')}</span>
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

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">{t('product.shipTo')}</span>
                  <select 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="text-sm border rounded-lg px-3 py-1 bg-white"
                  >
                    {Object.entries(shippingRates).map(([code, { name }]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800">
                    {hasFreeShipping ? t('product.freeShipping') : `${t('product.shipping')}:`}
                  </span>
                  <span className={hasFreeShipping ? "text-green-600 font-medium" : "font-medium"}>
                    {hasFreeShipping ? t('product.freeShipping') : `€${shipping?.rate}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Truck className="w-4 h-4" />
                  <span>{t('product.estimatedDelivery')}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  added
                    ? "bg-emerald-500 text-white"
                    : "bg-stone-900 text-white hover:bg-stone-800 hover:shadow-lg"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? t('product.addedToCart') : `${t('product.addToCart')} - €${(product.price * quantity).toFixed(2)}`}
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                通过WhatsApp获取优惠
              </button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-900 mb-2">{t('product.secureCheckout')}</p>
                <div className="flex items-center justify-center gap-3">
                  {['PayPal', 'USDT', 'Visa', 'MC'].map(method => (
                    <span key={method} className="text-xs bg-gray-100 px-2 py-1 rounded">{method}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: t('trust.warranty'), sublabel: t('trust.warrantyDesc') },
                { icon: RotateCcw, label: t('trust.returns'), sublabel: t('trust.returnsDesc') },
                { icon: Check, label: t('product.authenticGuarantee'), sublabel: t('product.authenticDesc') },
                { icon: Truck, label: t('product.trackedShipping'), sublabel: t('product.trackedDesc') },
              ].map(({ icon: Icon, label, sublabel }) => (
                <div key={label} className="flex items-center gap-3 bg-white p-3 rounded-xl border">
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-stone-800" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-stone-900">{label}</p>
                    <p className="text-xs text-gray-900">{sublabel}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="flex border-b">
                {[
                  { id: "description", label: t('product.description') },
                  { id: "specs", label: t('product.specifications') },
                  { id: "reviews", label: t('product.reviews') },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-stone-900 border-b-2 border-amber-500 bg-amber-50/50"
                        : "text-gray-900 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="p-6">
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <p className="text-gray-800 leading-relaxed">
                      {product.description || `${product.brand} ${product.name} - ${t('product.premiumWatch')}`}
                    </p>
                    <div className="bg-stone-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-gray-900">{t('product.whatsInBox')}</h4>
                      <ul className="text-sm text-gray-900 space-y-1">
                        <li>• {product.name} {t('product.watch')}</li>
                        <li>• {t('product.presentationBox')}</li>
                        <li>• {t('product.instructionManual')}</li>
                        <li>• {t('product.warrantyCard')}</li>
                        <li>• {t('product.cleaningCloth')}</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === "specs" && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: t('product.brand'), value: product.brand },
                      { label: t('product.sku'), value: product.sku },
                      { label: t('product.caseMaterial'), value: product.caseMaterial },
                      { label: t('product.dial'), value: product.dial },
                      { label: t('product.movement'), value: product.movement },
                      { label: t('product.powerReserve'), value: product.powerReserve },
                      { label: t('product.functions'), value: product.functions },
                      { label: t('product.waterResistance'), value: product.waterResistance },
                      { label: t('product.weight'), value: product.weight ? `${product.weight}kg` : undefined },
                    ].map(({ label, value }) => (
                      value && (
                        <div key={label} className="py-2 border-b last:border-0">
                          <p className="text-sm text-gray-900">{label}</p>
                          <p className="font-medium text-gray-900">{value}</p>
                        </div>
                      )
                    ))}
                  </div>
                )}
                
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {[
                      { name: "Markus K.", rating: 5, text: "Excellent quality for the price. Fast shipping to Germany!" },
                      { name: "Sophie L.", rating: 5, text: "Beautiful design, exactly as pictured. Will buy again." },
                    ].map((review, i) => (
                      <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(review.rating)].map((_, j) => (
                            <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-gray-800 text-sm mb-1">{review.text}</p>
                        <p className="text-xs text-gray-800">{review.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
