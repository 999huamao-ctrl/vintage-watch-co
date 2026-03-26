"use client";

import { useState } from "react";
import { useLanguage, languageNames, type Locale } from "@/lib/language";
import { Globe, Check } from "lucide-react";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, languages } = useLanguage();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {languages[locale].flag}
        </span>
        <span className="hidden sm:inline text-xs text-gray-600 uppercase">
          {locale}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Select Language / 选择语言
              </p>
            </div>
            <div className="py-1">
              {(Object.keys(languages) as Locale[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                    locale === lang ? "bg-amber-50/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{languages[lang].flag}</span>
                    <div>
                      <p className={`text-sm ${locale === lang ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {languages[lang].name}
                      </p>
                      <p className="text-xs text-gray-400">{languages[lang].region}</p>
                    </div>
                  </div>
                  {locale === lang && (
                    <Check className="w-4 h-4 text-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
