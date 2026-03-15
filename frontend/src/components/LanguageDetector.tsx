'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { X, Globe } from 'lucide-react';

// IP to country/language mapping
const countryToLocale: Record<string, string> = {
  'DE': 'de',
  'AT': 'de',
  'CH': 'de',
  'FR': 'fr',
  'BE': 'fr',
  'LU': 'fr',
  'ES': 'es',
  'IT': 'it',
  'GB': 'en',
  'IE': 'en',
  'US': 'en',
  'CA': 'en',
  'AU': 'en',
  'CN': 'zh',
};

const countryNames: Record<string, string> = {
  'DE': 'Germany',
  'AT': 'Austria',
  'CH': 'Switzerland',
  'FR': 'France',
  'BE': 'Belgium',
  'LU': 'Luxembourg',
  'ES': 'Spain',
  'IT': 'Italy',
  'GB': 'United Kingdom',
  'IE': 'Ireland',
  'US': 'United States',
  'CA': 'Canada',
  'AU': 'Australia',
  'CN': 'China',
};

const localeNames: Record<string, string> = {
  'en': 'English',
  'de': 'German',
  'fr': 'French',
  'es': 'Spanish',
  'it': 'Italian',
  'zh': 'Chinese',
};

export default function LanguageDetector() {
  const t = useTranslations('language');
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState('');
  const [suggestedLocale, setSuggestedLocale] = useState('');

  useEffect(() => {
    // Check if user has already made a choice
    const hasChosen = document.cookie.includes('locale-choice=');
    if (hasChosen) return;

    // Detect country by IP (simplified - in production use a proper IP geolocation service)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data.country_code;
        const suggested = countryToLocale[countryCode];
        
        if (suggested && suggested !== currentLocale) {
          setDetectedCountry(countryNames[countryCode] || countryCode);
          setSuggestedLocale(suggested);
          setShowBanner(true);
        }
      })
      .catch(() => {
        // Silently fail - don't show banner if we can't detect
      });
  }, [currentLocale]);

  const handleSwitch = () => {
    // Set cookie to remember choice
    document.cookie = `locale-choice=true; max-age=${60*60*24*30}; path=/`;
    
    // Navigate to new locale
    const newPath = pathname.replace(`/${currentLocale}`, `/${suggestedLocale}`);
    router.push(newPath);
    setShowBanner(false);
  };

  const handleStay = () => {
    document.cookie = `locale-choice=true; max-age=${60*60*24*30}; path=/`;
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-4">
      <div className="max-w-4xl mx-auto bg-amber-50 border border-amber-200 rounded-xl shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm text-gray-800">
              {t('detected', { country: detectedCountry })}
            </p>
            <p className="text-sm font-medium text-amber-700">
              {t('switch', { language: localeNames[suggestedLocale] })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleStay}
            className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            {t('stay')}
          </button>
          <button
            onClick={handleSwitch}
            className="px-4 py-1.5 bg-amber-500 text-stone-900 text-sm font-medium rounded-lg hover:bg-amber-400 transition-colors"
          >
            {t('switchButton')}
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={t('close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}