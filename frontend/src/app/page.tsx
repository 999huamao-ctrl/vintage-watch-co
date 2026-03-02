import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-900 text-stone-100 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto mb-8">
            Discover our collection of vintage-inspired watches. 
            Crafted with precision, designed for the modern gentleman.
          </p>
          <a
            href="#products"
            className="inline-block bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-stone-600">On orders over €79 to EU countries</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-semibold mb-2">2-Year Warranty</h3>
            <p className="text-stone-600">All watches come with our guarantee</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">↩️</div>
            <h3 className="font-semibold mb-2">30-Day Returns</h3>
            <p className="text-stone-600">Not satisfied? Return within 30 days</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12">
            Our Collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-12 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-serif mb-6">Shipping Information</h2>
          <p className="text-stone-600 mb-4">
            We ship to all EU countries. Delivery time: 9-15 business days.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">🇬🇧 UK: €8</div>
            <div className="bg-white p-4 rounded-lg">🇩🇪 Germany: €6</div>
            <div className="bg-white p-4 rounded-lg">🇫🇷 France: €6</div>
            <div className="bg-white p-4 rounded-lg">🇮🇹 Italy: €7</div>
          </div>
        </div>
      </section>
    </div>
  );
}
