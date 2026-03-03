import { products, categories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Clock, Star } from "lucide-react";

export default function Home() {
  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.filter(p => p.badge === "Bestseller").slice(0, 4);
  const newArrivals = products.filter(p => p.badge === "New").slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-stone-900 text-white text-center py-2 text-sm">
        🚚 Free shipping on orders over €79 | 2-year warranty | 30-day returns
      </div>

      {/* Hero Section */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-amber-500 font-medium">New Collection 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              Timeless
              <br />
              <span className="text-amber-500">Elegance</span>
            </h1>
            <p className="text-xl text-stone-300 mb-8 max-w-lg">
              Discover our collection of vintage-inspired watches. 
              Crafted with precision, designed for the modern gentleman.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#products"
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#collections"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur"
              >
                View Collections
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mt-12 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-stone-700 border-2 border-stone-800" />
                  ))}
                </div>
                <span>2,000+ Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over €79" },
              { icon: ShieldCheck, title: "2-Year Warranty", desc: "Full coverage" },
              { icon: RotateCcw, title: "30-Day Returns", desc: "No questions asked" },
              { icon: Clock, title: "Fast Delivery", desc: "9-15 days to EU" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-stone-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section id="collections" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Shop by Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each collection tells a story. Find the perfect timepiece that matches your style.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(c => c !== "All").slice(0, 4).map((category, i) => (
              <Link
                key={category}
                href={`/collection/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="font-serif text-lg md:text-xl">{category.replace(' Collection', '')}</h3>
                    <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif mb-2">Bestsellers</h2>
              <p className="text-gray-600">Our most loved timepieces</p>
            </div>
            <Link 
              href="/shop?sort=bestsellers" 
              className="hidden md:flex items-center gap-1 text-stone-900 font-medium hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.length > 0 ? bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            )) : featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">All Watches</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of vintage-inspired timepieces.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
            >
              View All {products.length} Watches
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20 px-4 bg-stone-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-500 text-stone-900 text-xs font-bold px-2 py-1 rounded">NEW</span>
                  <h2 className="text-3xl font-serif">New Arrivals</h2>
                </div>
                <p className="text-stone-400">Fresh from our workshop</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shipping Info */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Shipping Information</h2>
          <p className="text-gray-600 mb-8">
            We ship to all EU countries. Delivery time: 9-15 business days.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { flag: "🇬🇧", name: "UK", price: "€8" },
              { flag: "🇩🇪", name: "Germany", price: "€6" },
              { flag: "🇫🇷", name: "France", price: "€6" },
              { flag: "🇮🇹", name: "Italy", price: "€7" },
              { flag: "🇪🇸", name: "Spain", price: "€7" },
            ].map(({ flag, name, price }) => (
              <div key={name} className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-2xl mb-1">{flag}</div>
                <p className="font-medium text-sm">{name}</p>
                <p className="text-stone-600">{price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
