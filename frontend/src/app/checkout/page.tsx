"use client";

import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/language";
import { shippingRates, freeShippingThreshold } from "@/lib/data";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Truck, Copy, CheckCircle, Wallet, AlertCircle, Loader2, Search } from "lucide-react";
import Navbar from "@/components/Navbar";

const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const DEFAULT_USDT_ADDRESS = "TGPBhfjSuwjrfGUtdqt6EZUbzhbRCGfC5c";

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

  const validateTxid = (value: string): boolean => {
    const txidRegex = /^[0-9a-fA-F]{64}$/;
    return txidRegex.test(value.trim());
  };

  const handleOrderComplete = () => {
    setShowTxidInput(true);
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

  const verifyPayment = async () => {
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
      
      const transferEvent = data.data.find((event: any) => 
        event.contract_address === USDT_CONTRACT && event.event_name === "Transfer"
      );
      if (!transferEvent) throw new Error(t('checkout.verificationFailed'));

      const { to, value } = transferEvent.result;
      const receivedAmount = parseInt(value) / 1e6;
      const expectedAddress = usdtAddress.toLowerCase().replace(/^0x/, '');
      const actualToAddress = to.toLowerCase().replace(/^0x/, '');
      const addressMatch = actualToAddress === expectedAddress || actualToAddress.slice(-32) === expectedAddress.slice(-32);
      
      if (!addressMatch) throw new Error(t('checkout.verificationFailed'));
      const tolerance = totalUSDT * 0.1;
      if (receivedAmount < totalUSDT - tolerance) throw new Error(t('checkout.verificationFailed'));

      setVerificationResult("success");
      await completeOrder(txid.trim(), receivedAmount);
    } catch (err: any) {
      setError(err.message || t('checkout.verificationFailed'));
      setVerificationResult("error");
    } finally {
      setIsVerifying(false);
    }
  };

  const completeOrder = async (verifiedTxid: string, receivedAmount: number) => {
    const order = {
      id: `ORD-${Date.now()}`,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: country,
      },
      items: items.map((item: any) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      total: totalEUR,
      totalUSDT: totalUSDT,
      receivedUSDT: receivedAmount,
      status: "paid",
      txid: verifiedTxid,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const existingOrders = JSON.parse(localStorage.getItem("admin_orders") || "[]");
    existingOrders.unshift(order);
    localStorage.setItem("admin_orders", JSON.stringify(existingOrders));
    setTimeout(() => {
      clearCart();
      window.location.href = "/success?verified=true";
    }, 2000);
  };

  const handleConfirmPayment = () => verifyPayment();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <Navbar />
        <div className="max-w-md mx-auto text-center pt-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-gray-800" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">{t('checkout.cartEmpty')}</h1>
          <Link href="/" className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-lg hover:bg-stone-800 transition-colors">
            {t('checkout.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  const isFormComplete = formData.email && formData.firstName && formData.lastName && 
                         formData.address && formData.city && formData.postalCode;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-800 hover:text-stone-900">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">{t('checkout.continueShopping')}</span>
          </Link>
          <span className="text-lg font-serif font-medium">HØRIZON</span>
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <Lock className="w-4 h-4" />
            <span>{t('checkout.title')}</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <section className="bg-white rounded-xl border shadow-sm mb-6">
              <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium">1</div>
                  <h2 className="text-lg font-semibold">{t('checkout.contactInfo')}</h2>
                </div>
              </div>
              <div className="p-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.email')} *</label>
                  <input type="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 text-gray-900"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border shadow-sm mb-6">
              <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium">2</div>
                  <h2 className="text-lg font-semibold">{t('checkout.shipping')}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.country')} *</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 text-gray-900"
                    >
                      {Object.entries(shippingRates).map(([code, { name }]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.firstName')} *</label>
                    <input type="text" required value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.lastName')} *</label>
                    <input type="text" required value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.address')} *</label>
                    <input type="text" required value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.city')} *</label>
                    <input type="text" required value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">{t('checkout.postalCode')} *</label>
                    <input type="text" required value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-stone-900 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium">3</div>
                  <h2 className="text-lg font-semibold">{t('checkout.payment')}</h2>
                </div>
              </div>
              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
                )}

                {!isFormComplete ? (
                  <div className="text-center py-8 text-gray-900">
                    <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-800" />
                    <p>{t('checkout.completeShipping')}</p>
                  </div>
                ) : !usdtAddress ? (
                  <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                    <p>{t('checkout.notConfigured')}</p>
                  </div>
                ) : (
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
                        <button onClick={handleOrderComplete}
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
                  <div className="flex justify-between text-sm text-green-600 mt-1">
                    <span>{t('checkout.payWithUSDT')}</span>
                    <span>{totalUSDT} USDT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
