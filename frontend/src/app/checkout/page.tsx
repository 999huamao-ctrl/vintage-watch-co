"use client";

import { useCart } from "@/lib/cart";
import { shippingRates, freeShippingThreshold } from "@/lib/data";
import { useState, useEffect } from "react";
import Link from "next/link";

// Hardcoded PayPal Client ID for now - replace with your own
const PAYPAL_CLIENT_ID = "AbHq-PZViSEb8tZPjsJ2RNb9sbl0BN71KzTuJ8OQmLsXSDofOfC3PkvBHRhM5o2aYHkV7JLb5vytFtIm";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [country, setCountry] = useState("DE");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [paypalReady, setPaypalReady] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getTotalPrice();
  const shipping = subtotal >= freeShippingThreshold ? 0 : (shippingRates[country]?.rate || 10);
  const total = subtotal + shipping;

  // Load PayPal SDK
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('paypal-sdk')) {
      if (window.paypal) {
        setPaypalReady(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR&intent=capture`;
    script.async = true;
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      setPaypalReady(true);
    };
    script.onerror = (e) => {
      console.error('PayPal SDK failed to load', e);
      setError('Failed to load PayPal. Please refresh the page.');
    };
    document.body.appendChild(script);
  }, []);

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalReady || !window.paypal || items.length === 0) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    // Clear previous buttons
    container.innerHTML = '';

    try {
      window.paypal.Buttons({
        createOrder: async () => {
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

            if (!response.ok) {
              throw new Error('Failed to create order');
            }

            const data = await response.json();
            return data.orderId;
          } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to create order. Please try again.");
            throw error;
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const details = await actions.order.capture();
            clearCart();
            window.location.href = `/success?order_id=${details.id}`;
          } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
          }
        },
        onError: (err: any) => {
          console.error("PayPal error:", err);
          setError('Payment error. Please try again.');
        },
        onCancel: () => {
          console.log('Payment cancelled');
        },
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
        },
      }).render('#paypal-button-container');
    } catch (e) {
      console.error('Failed to render PayPal buttons:', e);
      setError('Failed to initialize PayPal. Please refresh.');
    }
  }, [paypalReady, items, shipping, total, country, formData, clearCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
          <p className="text-stone-600 mb-8">Add some items to proceed with checkout.</p>
          <Link
            href="/"
            className="inline-block bg-stone-900 text-white px-8 py-3 rounded-lg hover:bg-stone-800"
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
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-serif mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <div>
            <div className="bg-white p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
              
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
              >
                {Object.entries(shippingRates).map(([code, { name }]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>

            {/* PayPal Button */}
            <div className="mt-6 bg-white p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              
              {!isFormComplete ? (
                <p className="text-stone-500 text-center py-4">
                  Please fill in all shipping information to proceed with payment.
                </p>
              ) : (
                <div id="paypal-button-container" className="min-h-[150px]">
                  {!paypalReady && (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
                      <p className="mt-2 text-stone-500">Loading PayPal...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl h-fit">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-200">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
