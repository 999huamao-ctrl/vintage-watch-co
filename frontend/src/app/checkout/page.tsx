"use client";

import { useCart } from "@/lib/cart";
import { shippingRates, freeShippingThreshold } from "@/lib/data";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Truck, CreditCard, ShieldCheck, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("DE");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal >= freeShippingThreshold ? 0 : (shippingRates[country]?.rate || 10);
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setError("");
    
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.postalCode) {
      setError("Please fill in all shipping information");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shipping,
          total,
          customer: formData,
          country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        setError("Failed to get PayPal URL. Please try again.");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some items to proceed with checkout.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-lg hover:bg-stone-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const isFormComplete = formData.email && formData.firstName && formData.lastName && 
                         formData.address && formData.city && formData.postalCode;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-stone-900">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <span className="text-lg font-serif font-medium">Vintage Watch Co.</span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7">
            {/* Contact Section */}
            <section className="bg-white rounded-xl border shadow-sm mb-6">
              <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium">1</div>
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">We'll send your order confirmation here</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Section */}
            <section className="bg-white rounded-xl border shadow-sm mb-6">
              <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium">2</div>
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    >
                      {Object.entries(shippingRates).map(([code, { name }]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      placeholder="123 Main Street, Apt 4B"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      placeholder="Berlin"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      placeholder="10115"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium">3</div>
                  <h2 className="text-lg font-semibold">Payment</h2>
                </div>
              </div>
              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                {!isFormComplete ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Complete shipping information to proceed with payment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.63l-1.496 9.478h2.79c.457 0 .85-.334.922-.788l.04-.19.73-4.627.047-.255a.933.933 0 0 1 .922-.788h.58c3.76 0 6.704-1.528 7.565-5.62.317-1.629.196-2.987-.407-4.005z"/>
                          </svg>
                          Pay €{total.toFixed(2)} with PayPal
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 pt-2">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        <span>SSL Encrypted</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border shadow-sm sticky top-24">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 rounded-b-xl">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span>{shipping === 0 ? 'FREE' : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && (
                    <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded">
                      ✓ You qualify for free shipping!
                    </div>
                  )}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
