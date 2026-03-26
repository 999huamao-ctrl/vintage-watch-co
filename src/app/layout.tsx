import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1c1917",
};

export const metadata: Metadata = {
  title: "Horizon Watches | Premium Timepieces",
  description: "European-inspired premium watches. Free shipping across 17 countries. 2-year warranty. Shop vintage-style timepieces at accessible prices.",
  keywords: ["watches", "premium watches", "vintage watches", "European watches", "luxury watches", "affordable luxury", "automatic watches", "quartz watches"],
  authors: [{ name: "Horizon Watches" }],
  creator: "Horizon Watches",
  publisher: "Horizon Watches",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://horizon-watch-store-1773050228.surge.sh/",
    siteName: "Horizon Watches",
    title: "Horizon Watches | Premium Timepieces",
    description: "European-inspired premium watches. Free shipping across 17 countries. 2-year warranty.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Horizon Watches - Premium Timepieces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Horizon Watches | Premium Timepieces",
    description: "European-inspired premium watches. Free shipping across 17 countries. 2-year warranty.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=630&fit=crop"],
    creator: "@horizonwatches",
  },
  alternates: {
    canonical: "https://horizon-watch-store-1773050228.surge.sh/",
    languages: {
      "en": "https://horizon-watch-store-1773050228.surge.sh/",
      "de": "https://horizon-watch-store-1773050228.surge.sh/de/",
      "fr": "https://horizon-watch-store-1773050228.surge.sh/fr/",
      "es": "https://horizon-watch-store-1773050228.surge.sh/es/",
      "it": "https://horizon-watch-store-1773050228.surge.sh/it/",
      "zh": "https://horizon-watch-store-1773050228.surge.sh/zh/",
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code when available
  },
  category: "shopping",
  classification: "E-commerce, Watches, Fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Horizon Watches",
              url: "https://horizon-watch-store-1773050228.surge.sh/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://horizon-watch-store-1773050228.surge.sh/shop/?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Horizon Watches",
              url: "https://horizon-watch-store-1773050228.surge.sh/",
              logo: "https://horizon-watch-store-1773050228.surge.sh/logo.png",
              sameAs: [
                "https://facebook.com/horizonwatches",
                "https://instagram.com/horizonwatches",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-800-HORIZON",
                contactType: "customer service",
                email: "support@horizonwatches.com",
                availableLanguage: ["English", "German", "French", "Spanish", "Italian", "Chinese"],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Horizon Watches",
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=630&fit=crop",
              address: {
                "@type": "PostalAddress",
                addressCountry: "DE",
              },
              priceRange: "€€",
              currenciesAccepted: "EUR, USDT",
              paymentAccepted: "USDT (TRC20), PayPal",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: "0",
                  currency: "EUR",
                },
                shippingDestination: {
                  "@type": "DefinedRegion",
                  addressCountry: ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "PL", "CZ", "HU", "RO", "BG", "HR", "SI", "SK", "LT", "LV", "EE", "FI", "SE", "DK", "IE", "PT", "GR", "LU", "MT", "CY"],
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: {
                    "@type": "QuantitativeValue",
                    minValue: 1,
                    maxValue: 2,
                    unitCode: "d",
                  },
                  transitTime: {
                    "@type": "QuantitativeValue",
                    minValue: 9,
                    maxValue: 15,
                    unitCode: "d",
                  },
                },
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Watches",
                itemListElement: {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Premium Watches",
                  },
                },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
