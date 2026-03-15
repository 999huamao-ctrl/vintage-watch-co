"use client";

import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/language";
import Link from "next/link";
import { freeShippingThreshold } from "@/lib/data";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const subtotal = getTotalPrice();
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-xl font-serif">{t('cart.yourCart')} ({items.length})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-700 mb-4">{t('cart.empty')}</p>
              <button
                onClick={onClose}
                className="text-amber-700 hover:underline"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-stone-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-stone-800">€{item.product.price}</p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50">
            {remainingForFreeShipping > 0 ? (
              <p className="text-sm text-stone-800 mb-4">
                {t('cart.addMoreForFreeShipping').replace('{amount}', remainingForFreeShipping.toFixed(0))}
              </p>
            ) : (
              <p className="text-sm text-green-600 mb-4">
                ✓ {t('cart.freeShippingQualified')}
              </p>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">{t('cart.subtotal')}</span>
              <span className="text-xl font-semibold">€{subtotal.toFixed(2)}</span>
            </div>
            
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-stone-900 text-white text-center py-3 rounded-lg hover:bg-stone-800 transition-colors font-medium"
            >
              {t('cart.proceedToCheckout')}
            </Link>
            
            <button
              onClick={clearCart}
              className="block w-full text-center text-stone-700 hover:text-stone-700 mt-3 text-sm"
            >
              {t('cart.clearCart')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
