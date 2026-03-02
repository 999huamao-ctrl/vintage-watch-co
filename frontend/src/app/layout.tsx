import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vintage Watch Co. | Timeless Elegance",
  description: "Discover our collection of vintage-inspired watches. Crafted with precision, designed for the modern gentleman. Free shipping on orders over €79.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        
        {/* Footer */}
        <footer className="bg-stone-900 text-stone-400 py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-serif text-lg mb-4">Vintage Watch Co.</h3>
              <p className="text-sm">Timeless elegance for the modern gentleman.</p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white">All Watches</a></li>
                <li><a href="/" className="hover:text-white">New Arrivals</a></li>
                <li><a href="/" className="hover:text-white">Best Sellers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Contact</h4>
              <p className="text-sm">Email: support@vintagewatchco.com</p>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-stone-800 text-sm text-center">
            <p>© 2026 Vintage Watch Co. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
