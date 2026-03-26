"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function SuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center pt-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-serif mb-4">{t('success.title')}</h1>
          <p className="text-xl text-stone-700 mb-4">{t('success.subtitle')}</p>
          
          <p className="text-stone-800 mb-8">
            {t('success.message')}
          </p>

          <div className="bg-white p-6 rounded-xl mb-8 shadow-sm">
            <h2 className="font-semibold mb-4">{t('success.orderDetails')}</h2>
            <ul className="text-left text-stone-800 space-y-2">
              <li>📧 {t('success.emailNotice')}</li>
              <li>📦 {t('success.packing')}</li>
              <li>🚚 {t('success.tracking')}</li>
              <li>✨ {t('success.delivery')}</li>
            </ul>
          </div>

          <Link href="/" className="inline-block bg-stone-900 text-white px-8 py-3 rounded-lg hover:bg-stone-800">
            {t('success.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}
