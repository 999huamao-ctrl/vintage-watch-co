"use client";

import { useCart } from "@/lib/cart";
import { shippingRates, freeShippingThreshold } from "@/lib/data";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Truck, Copy, CheckCircle, Wallet, AlertCircle } from "lucide-react";

// 默认 USDT 收款地址
const DEFAULT_USDT_ADDRESS = "TYRo5Tq9F1ZVngfTdU2heAwmpZbqsWKGXJ";

// 从 localStorage 获取 USDT 地址，如果没有则使用默认地址
function getUSDTAddress(): string {
  if (typeof window === 'undefined') return DEFAULT_USDT_ADDRESS;
  return localStorage.getItem('usdt_address') || DEFAULT_USDT_ADDRESS;
}

// 欧元转 USDT（1:1 简化，实际应该用实时汇率）
function eurToUSDT(eur: number): number {
  return Math.ceil(eur * 1.1); // 加 10% 缓冲应对波动
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("DE");
  const [copied, setCopied] = useState(false);
  const [usdtAddress, setUsdtAddress] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    setUsdtAddress(getUSDTAddress());
  }, []);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= freeShippingThreshold ? 0 : (shippingRates[country]?.rate || 10);
  const totalEUR = subtotal + shipping;
  const totalUSDT = eurToUSDT(totalEUR);

  const handleCopyAddress = () => {
    if (usdtAddress) {
      navigator.clipboard.writeText(usdtAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOrderComplete = () => {
    // 方案A：手动确认后清除购物车
    alert("Thank you for your order! We'll verify your payment and ship your watch soon.");
    clearCart();
    window.location.href = "/success";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-gray-400" />
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
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                    <p className="text-xs text-gray-600 mt-1 font-medium">We'll send your order confirmation here</p>
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
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Country/Region *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors text-gray-900"
                    >
                      {Object.entries(shippingRates).map(([code, { name }]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
                    <input
                      type="text"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Street Address *</label>
                    <input
                      type="text"
                      placeholder="123 Main Street, Apt 4B"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">City *</label>
                    <input
                      type="text"
                      placeholder="Berlin"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      placeholder="10115"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Section - USDT */}
            <section className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium">3</div>
                  <h2 className="text-lg font-semibold">Payment (USDT - TRC20)</h2>
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
                    <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Complete shipping information to see payment details</p>
                  </div>
                ) : !usdtAddress ? (
                  <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                    <p>USDT payment address not configured.</p>
                    <p className="text-sm mt-2">Please contact support.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Payment Amount */}
                    <div className="bg-stone-900 text-white rounded-xl p-6">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-2">Total Amount to Pay</p>
                        <div className="text-4xl font-bold">{totalUSDT} USDT</div>
                        <p className="text-gray-400 text-sm mt-2">≈ €{totalEUR.toFixed(2)} (including 10% buffer)</p>
                      </div>
                    </div>

                    {/* USDT Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Send USDT (TRC20) to this address:
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-100 px-4 py-3 rounded-lg font-mono text-sm break-all">
                          {usdtAddress}
                        </div>
                        <button
                          onClick={handleCopyAddress}
                          className="px-4 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
                        >
                          {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-blue-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Payment Instructions
                      </h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Copy the USDT address above</li>
                        <li>Open your crypto wallet (TronLink, Trust Wallet, etc.)</li>
                        <li>Send exactly <strong>{totalUSDT} USDT</strong> via TRC20 network</li>
                        <li>Keep the transaction ID (TXID) for reference</li>
                        <li>Click "I've completed the payment" below</li>
                      </ol>
                    </div>

                    {/* Network Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <strong>Important:</strong> Only send USDT via <strong>TRC20 (Tron)</strong> network. 
                        Sending via other networks may result in permanent loss.
                      </p>
                    </div>

                    {/* Complete Button */}
                    <button
                      onClick={handleOrderComplete}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
                    >
                      <CheckCircle className="w-6 h-6" />
                      I've completed the payment
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Your order will be processed after payment verification. 
                      You'll receive a confirmation email within 24 hours.
                    </p>
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
                    <span>€{totalEUR.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 mt-1">
                    <span>Pay with USDT</span>
                    <span>{totalUSDT} USDT</span>
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
