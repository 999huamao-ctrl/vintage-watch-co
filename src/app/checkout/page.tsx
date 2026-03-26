"use client";

import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/language";
import { shippingRates, freeShippingThreshold } from "@/lib/data";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Truck, Copy, CheckCircle, Wallet, AlertCircle, Loader2, Search, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import { isCreemProductConfigured } from "@/lib/creem-products";

const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const DEFAULT_USDT_ADDRESS = "TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c";

type PaymentMethod = 'usdt' | 'card';

function getUSDTAddress(): string {
  if (typeof window === 'undefined') return DEFAULT_USDT_ADDRESS;
  return localStorage.getItem('usdt_address') || DEFAULT_USDT_ADDRESS;
}

function eurToUSDT(eur: number): number {
  return Math.ceil(eur * 1.1);
}

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { items, getTotalPrice, clearCart } = useCart();
  const [error, setError] = useState("");
  const [country, setCountry] = useState("DE");
  const [copied, setCopied] = useState(false);
  const [usdtAddress, setUsdtAddress] = useState("");
  const [txid, setTxid] = useState("");
  const [showTxidInput, setShowTxidInput] = useState(false);
  const [txidError, setTxidError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"idle" | "success" | "error">("idle");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('usdt');
  const [isCreemLoading, setIsCreemLoading] = useState(false);
  const [creemEnabled, setCreemEnabled] = useState(false);
  const [creemProductsConfigured, setCreemProductsConfigured] = useState(false);
  
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
    // 检查 CREEM 是否已配置 - 通过 API
    fetch('/api/creem/status')
      .then(res => res.json())
      .then(data => setCreemEnabled(data.configured))
      .catch(() => setCreemEnabled(false));
    
    // 检查购物车商品是否已配置 CREEM Product ID
    const allConfigured = items.every(item => isCreemProductConfigured(item.product.id));
    setCreemProductsConfigured(allConfigured);
  }, [items]);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= freeShippingThreshold ? 0 : (shippingRates[country]?.rate || 10);
  const totalEUR = subtotal + shipping;
  const totalUSDT = eurToUSDT(totalEUR);

  const validateTxid = (value: string): boolean => {
    const txidRegex = /^[0-9a-fA-F]{64}$/;
    return txidRegex.test(value.trim());
  };

  const handleCopyAddress = async () => {
    if (!usdtAddress) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(usdtAddress);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = usdtAddress;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) throw new Error('Copy failed');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(`${t('checkout.sendToAddress')}\n\n${usdtAddress}`);
    }
  };

  const handleCreemCheckout = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError(t('checkout.fillRequired'));
      return;
    }

    setIsCreemLoading(true);
    setError("");

    try {
      const orderId = `ORD-${Date.now()}`;
      
      const response = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            description: item.product.name,
          })),
          customer: {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
          },
          orderId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout');
      }

      const { checkoutUrl } = await response.json();
      
      // 保存订单信息到 localStorage（用于支付成功后的处理）
      localStorage.setItem('pending_order', JSON.stringify({
        orderId,
        items,
        total: totalEUR,
        customer: formData,
        paymentMethod: 'creem',
      }));
      
      // 跳转到 CREEM 结账页
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || t('checkout.creemError'));
    } finally {
      setIsCreemLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!validateTxid(txid)) {
      setTxidError(t('checkout.txidError'));
      return;
    }
    setIsVerifying(true);
    setError("");
    setVerificationResult("idle");

    try {
      const response = await fetch(`https://api.trongrid.io/v1/transactions/${txid.trim()}/events`);
      if (!response.ok) throw new Error(t('checkout.verificationFailed'));
      const data = await response.json();
      if (!data.data || data.data.length === 0) throw new Error(t('checkout.verificationFailed'));
      
      const events = data.data;
      const transferEvent = events.find((e: any) => 
        e.event_name === 'Transfer' && 
        e.contract_address === USDT_CONTRACT
      );

      if (!transferEvent) throw new Error(t('checkout.notUSDT'));

      const { from, to, value } = transferEvent.result;
      const amount = parseInt(value) / 1_000_000;

      if (to.toLowerCase() !== usdtAddress.toLowerCase()) {
        throw new Error(t('checkout.wrongAddress'));
      }

      const expectedAmount = totalUSDT;
      const tolerance = 0.5;
      if (Math.abs(amount - expectedAmount) > tolerance) {
        throw new Error(`${t('checkout.wrongAmount')} ${amount} USDT`);
      }

      setVerificationResult("success");
      setTimeout(() => {
        clearCart();
        window.location.href = `/success?txid=${txid}&amount=${amount}`;
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('checkout.verificationFailed'));
      setVerificationResult("error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUSDTOrderComplete = () => {
    setShowTxidInput(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-3xl font-serif mb-4">{t('checkout.title')}</h1>
          <p className="text-gray-600 mb-8">{t('cart.empty')}</p>
          <Link href="/shop" className="inline-block bg-stone-900 text-white px-8 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/shop" className="inline-flex items-center text-stone-900 hover:text-stone-600 mb-8 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          {t('checkout.backToShop')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <section className="bg-white rounded-xl border shadow-sm mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t('checkout.contactInfo')}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.email')}</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border shadow-sm mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">{t('checkout.shippingAddress')}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.firstName')}</label>
                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.lastName')}</label>
                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.country')}</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                  >
                    {Object.entries(shippingRates).map(([code, info]) => (
                      <option key={code} value={code}>{info.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.address')}</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.city')}</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.postalCode')}</label>
                    <input type="text" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  {t('checkout.paymentMethod')}
                </h2>
              </div>
              <div className="p-6">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('usdt')}
                    className={`p-4 border-2 rounded-xl text-center transition-colors ${
                      paymentMethod === 'usdt' 
                        ? 'border-stone-900 bg-stone-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Wallet className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'usdt' ? 'text-stone-900' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-900">USDT (TRC20)</p>
                    <p className="text-sm text-gray-500">Crypto Payment</p>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('card')}
                    disabled={!creemEnabled || !creemProductsConfigured}
                    className={`p-4 border-2 rounded-xl text-center transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-stone-900 bg-stone-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${(!creemEnabled || !creemProductsConfigured) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CreditCard className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-stone-900' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-900">Credit Card</p>
                    <p className="text-sm text-gray-500">
                      {!creemEnabled 
                        ? 'Coming Soon' 
                        : !creemProductsConfigured 
                          ? 'Setup Required' 
                          : 'Powered by CREEM'}
                    </p>
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {/* USDT Payment Flow */}
                {paymentMethod === 'usdt' && (
                  <div className="space-y-6">
                    <div className="bg-stone-900 text-white rounded-xl p-6">
                      <div className="text-center">
                        <p className="text-stone-100 text-sm mb-2">{t('checkout.totalAmount')}</p>
                        <div className="text-4xl font-bold">{totalUSDT} USDT</div>
                        <p className="text-stone-100 text-sm mt-2">≈ €{totalEUR.toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.sendToAddress')}</label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-100 px-4 py-3 rounded-lg font-mono text-sm break-all text-gray-900 font-semibold border-2 border-gray-300">{usdtAddress}</div>
                        <button onClick={handleCopyAddress}
                          className="px-4 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          {copied ? t('checkout.copied') : t('checkout.copy')}
                        </button>
                      </div>
                    </div>

                    {!showTxidInput ? (
                      <>
                        <p className="text-sm text-gray-600">{t('checkout.paymentInstructions')}</p>
                        <button onClick={handleUSDTOrderComplete}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
                        >
                          <CheckCircle className="w-6 h-6" />
                          {t('checkout.completePayment')}
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 text-amber-900">
                          <AlertCircle className="w-5 h-5" />
                          <h4 className="font-semibold">{t('checkout.enterTxidDesc')}</h4>
                        </div>
                        
                        {verificationResult === "success" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-800">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">{t('checkout.paymentVerified')}</span>
                            </div>
                          </div>
                        )}
                        
                        {verificationResult === "error" && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-red-800">
                              <AlertCircle className="w-5 h-5" />
                              <span className="font-semibold">{t('checkout.verificationFailed')}</span>
                            </div>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                          </div>
                        )}
                        
                        <div>
                          <input type="text" value={txid}
                            onChange={(e) => { setTxid(e.target.value); setTxidError(""); setVerificationResult("idle"); }}
                            placeholder={t('checkout.txidPlaceholder')}
                            disabled={isVerifying || verificationResult === "success"}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none text-gray-900 font-mono text-sm disabled:bg-gray-100"
                          />
                          {txidError && <p className="text-red-600 text-sm mt-2">{txidError}</p>}
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setShowTxidInput(false)}
                            disabled={isVerifying || verificationResult === "success"}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                          >{t('checkout.back')}</button>
                          <button onClick={handleConfirmPayment}
                            disabled={!txid.trim() || isVerifying || verificationResult === "success"}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            {isVerifying ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('checkout.verifying')}</> :
                             verificationResult === "success" ? <><CheckCircle className="w-5 h-5" /> {t('checkout.verified')}</> :
                             <><Search className="w-5 h-5" /> {t('checkout.verifyConfirm')}</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Payment Flow */}
                {paymentMethod === 'card' && (
                  <div className="space-y-6">
                    {!creemProductsConfigured && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-900">Card Payment Setup Required</h4>
                            <p className="text-sm text-amber-700 mt-1">
                              This product is not yet configured for card payments. 
                              Please use USDT payment or contact support.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Secure Card Payment</h4>
                          <p className="text-sm text-blue-700">Powered by CREEM</p>
                        </div>
                      </div>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li>• 支持 Visa, Mastercard, Amex</li>
                        <li>• 自动处理欧洲 VAT 税务</li>
                        <li>• 安全加密，符合 PCI DSS 标准</li>
                      </ul>
                    </div>

                    <div className="bg-stone-900 text-white rounded-xl p-6">
                      <div className="text-center">
                        <p className="text-stone-100 text-sm mb-2">{t('checkout.totalAmount')}</p>
                        <div className="text-4xl font-bold">€{totalEUR.toFixed(2)}</div>
                        <p className="text-stone-100 text-sm mt-2">{t('checkout.includesVAT')}</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleCreemCheckout}
                      disabled={isCreemLoading || !formData.email || !formData.firstName || !formData.lastName || !creemProductsConfigured}
                      className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
                    >
                      {isCreemLoading ? (
                        <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                      ) : (
                        <><CreditCard className="w-6 h-6" /> Pay with Card</>
                      )}
                    </button>
                    
                    {!formData.email || !formData.firstName || !formData.lastName ? (
                      <p className="text-sm text-amber-600 text-center">
                        Please fill in contact and shipping information first
                      </p>
                    ) : !creemProductsConfigured ? (
                      <p className="text-sm text-amber-600 text-center">
                        Card payment not available for this product yet
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border shadow-sm sticky top-24">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">{t('checkout.orderSummary')}</h2>
                <p className="text-sm text-gray-900">{items.length} {items.length === 1 ? t('cart.item') : t('cart.items')}</p>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-900">{t('product.quantity')}: {item.quantity}</p>
                    </div>
                    <p className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 rounded-b-xl">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-800">{t('checkout.subtotal')}</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      {t('product.shipping')}
                    </span>
                    <span>{shipping === 0 ? t('product.freeShipping') : `€${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('checkout.total')}</span>
                    <span>€{totalEUR.toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'usdt' && (
                    <div className="flex justify-between text-sm text-green-600 mt-1">
                      <span>{t('checkout.payWithUSDT')}</span>
                      <span>{totalUSDT} USDT</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}