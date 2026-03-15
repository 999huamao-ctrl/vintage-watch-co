"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "en" | "de" | "fr" | "es" | "it" | "zh";

const translations = {
  en: {
    // Banner
    banner: {
      weekendSale: "Weekend Sale",
      offWithCode: "20% OFF with code",
      endsIn: "Ends in"
    },
    // Nav
    nav: { 
      men: "Men", 
      women: "Women", 
      sale: "Sale", 
      cart: "Cart", 
      back: "Back to Home" 
    },
    // Hero
    hero: { 
      shopNow: "Shop Now", 
      viewCollection: "View Collection",
      badge: "Trusted by 10,000+ Customers",
      title1: "Timeless",
      title2: "Elegance",
      subtitle: "European-inspired premium watches. Free shipping across 17 countries. 2-year warranty.",
      saleEnds: "Limited Time Offer",
      useCode: "Use Code: WEEK20",
      startingAt: "Starting at",
      price: "€69"
    },
    // Trust Bar
    trust: {
      freeShipping: "Free Shipping",
      freeShippingDesc: "On orders over €100",
      warranty: "2-Year Warranty",
      warrantyDesc: "Full coverage",
      returns: "30-Day Returns",
      returnsDesc: "Hassle-free",
      customers: "10,000+ Happy",
      customersDesc: "Customers"
    },
    // Cart
    cart: { 
      empty: "Your cart is empty", 
      checkout: "Checkout",
      yourCart: "Your Cart",
      continueShopping: "Continue Shopping",
      remove: "Remove",
      addMoreForFreeShipping: "Add €{amount} more for free shipping",
      freeShippingQualified: "You qualify for free shipping!",
      subtotal: "Subtotal",
      proceedToCheckout: "Proceed to Checkout",
      clearCart: "Clear Cart",
      item: "item",
      items: "items"
    },
    // Shop Page
    shop: {
      title: "All Watches",
      subtitle: "products",
      filters: "Filters",
      collections: "Collections",
      showing: "Showing",
      products: "products",
      sortFeatured: "Featured",
      sortPriceLow: "Price: Low to High",
      sortPriceHigh: "Price: High to Low",
      sortNewest: "Newest First",
      noResults: "No products found",
      clearFilters: "Clear Filters"
    },
    // Product
    product: {
      quantity: "Quantity",
      shipping: "Shipping",
      freeShipping: "Free",
      addToCart: "Add to Cart",
      quickAdd: "Quick Add to Cart",
      added: "Added!",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      lowStock: "Only {count} left",
      sku: "SKU",
      category: "Category",
      description: "Description",
      specifications: "Specifications",
      reviews: "Reviews",
      relatedProducts: "You May Also Like",
      badgeHot: "Hot",
      badgeNew: "New",
      badgeSale: "Sale",
      badgeBestseller: "Bestseller"
    },
    // Bestsellers
    bestsellers: {
      subtitle: "Most Popular",
      title: "Bestsellers",
      viewAll: "View All"
    },
    // Home
    home: {
      bestsellerDesc: "Our most loved timepieces, chosen by customers across Europe",
      storyLabel: "Our Story",
      storyTitle: "Crafted for the Modern Gentleman",
      storyDesc1: "Founded in 2020, Horizon Watches brings timeless design to contemporary wrists. Each piece is meticulously crafted with attention to detail that rivals luxury brands at a fraction of the price.",
      storyDesc2: "We believe everyone deserves a watch that tells more than time—it tells your story. From boardrooms to weekend getaways, our watches are designed to accompany life's every moment.",
      exploreCollection: "Explore Collection",
      countriesShipped: "Countries Shipped",
      reviewsTitle: "What Our Customers Say",
      reviewsSubtitle: "Join thousands of satisfied watch enthusiasts",
      securePayment: "Secure Payment Methods"
    },
    // Footer
    footer: {
      brand: "HØRIZON",
      brandDesc: "Premium timepieces for the modern era. Quality craftsmanship meets accessible luxury.",
      shop: "Shop",
      newArrivals: "New Arrivals",
      bestSellers: "Bestsellers",
      customerService: "Customer Service",
      shippingInfo: "Shipping Info",
      returns: "Returns & Exchanges",
      contactUs: "Contact Us",
      contact: "Contact",
      email: "support@horizonwatches.com",
      payment: "We accept: PayPal, USDT, Cards",
      copyright: "© 2024 Horizon Watches. All rights reserved."
    },
    // Checkout
    checkout: {
      title: "Secure Checkout",
      cartEmpty: "Your cart is empty",
      continueShopping: "Continue Shopping",
      contactInfo: "Contact Information",
      email: "Email",
      shipping: "Shipping Address",
      country: "Country",
      firstName: "First Name",
      lastName: "Last Name",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      payment: "Payment",
      completeShipping: "Please complete shipping information",
      notConfigured: "Payment not configured",
      totalAmount: "Total Amount",
      sendToAddress: "Send USDT to this address",
      copy: "Copy",
      copied: "Copied!",
      paymentInstructions: "Please send the exact amount. Your order will be processed once payment is confirmed.",
      completePayment: "I've Completed the Payment",
      enterTxidDesc: "Enter your transaction hash to verify payment",
      txidPlaceholder: "Enter transaction hash (TXID)...",
      txidError: "Please enter a valid transaction hash (64 characters)",
      back: "Back",
      verifyConfirm: "Verify & Confirm",
      verifying: "Verifying...",
      verified: "Verified!",
      paymentVerified: "Payment verified successfully!",
      verificationFailed: "Verification failed. Please check your transaction hash.",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      total: "Total",
      payWithUSDT: "Pay with USDT",
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Retry",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      close: "Close",
      open: "Open",
      yes: "Yes",
      no: "No",
      or: "or",
      and: "and"
    }
  },
  
  de: {
    banner: {
      weekendSale: "Wochenend-Sale",
      offWithCode: "20% RABATT mit Code",
      endsIn: "Endet in"
    },
    nav: { 
      men: "Herren", 
      women: "Damen", 
      sale: "SALE", 
      cart: "Warenkorb", 
      back: "Zurück zur Startseite" 
    },
    hero: { 
      shopNow: "Jetzt kaufen", 
      viewCollection: "Kollektion ansehen",
      badge: "Vertraut von 10.000+ Kunden",
      title1: "Zeitlose",
      title2: "Eleganz",
      subtitle: "Premium-Uhren im europäischen Stil. Kostenloser Versand in 17 Länder. 2 Jahre Garantie.",
      saleEnds: "Zeitlich begrenztes Angebot",
      useCode: "Code: WEEK20",
      startingAt: "Ab",
      price: "69 €"
    },
    trust: {
      freeShipping: "Kostenloser Versand",
      freeShippingDesc: "Ab 100 € Bestellwert",
      warranty: "2 Jahre Garantie",
      warrantyDesc: "Volle Abdeckung",
      returns: "30 Tage Rückgabe",
      returnsDesc: "Problemlose Rückgabe",
      customers: "10.000+ Zufriedene",
      customersDesc: "Kunden"
    },
    cart: { 
      empty: "Ihr Warenkorb ist leer", 
      checkout: "Zur Kasse",
      yourCart: "Ihr Warenkorb",
      continueShopping: "Weiter einkaufen",
      remove: "Entfernen",
      addMoreForFreeShipping: "Noch {amount} € für kostenlosen Versand",
      freeShippingQualified: "Sie qualifizieren sich für kostenlosen Versand!",
      subtotal: "Zwischensumme",
      proceedToCheckout: "Zur Kasse gehen",
      clearCart: "Warenkorb leeren",
      item: "Artikel",
      items: "Artikel"
    },
    shop: {
      title: "Alle Uhren",
      subtitle: "Produkte",
      filters: "Filter",
      collections: "Kollektionen",
      showing: "Zeige",
      products: "Produkte",
      sortFeatured: "Empfohlen",
      sortPriceLow: "Preis: Niedrig zu Hoch",
      sortPriceHigh: "Preis: Hoch zu Niedrig",
      sortNewest: "Neueste zuerst",
      noResults: "Keine Produkte gefunden",
      clearFilters: "Filter zurücksetzen"
    },
    product: {
      quantity: "Menge",
      shipping: "Versand",
      freeShipping: "Kostenlos",
      addToCart: "In den Warenkorb",
      quickAdd: "Schnell hinzufügen",
      added: "Hinzugefügt!",
      inStock: "Auf Lager",
      outOfStock: "Nicht auf Lager",
      lowStock: "Nur noch {count} verfügbar",
      sku: "Artikelnummer",
      category: "Kategorie",
      description: "Beschreibung",
      specifications: "Spezifikationen",
      reviews: "Bewertungen",
      relatedProducts: "Das könnte Ihnen auch gefallen",
      badgeHot: "Beliebt",
      badgeNew: "Neu",
      badgeSale: "Sale",
      badgeBestseller: "Bestseller"
    },
    bestsellers: {
      subtitle: "Beliebteste",
      title: "Bestseller",
      viewAll: "Alle ansehen"
    },
    home: {
      bestsellerDesc: "Unser beliebteste Zeitmesser, ausgewählt von Kunden in ganz Europa",
      storyLabel: "Unsere Geschichte",
      storyTitle: "Für den modernen Gentleman",
      storyDesc1: "Gegründet 2020, bringt Horizon Watches zeitloses Design auf zeitgenössische Handgelenke. Jedes Stück wird sorgfältig mit Liebe zum Detail gefertigt, das Luxusmarken zum Bruchteil des Preises konkurrenziert.",
      storyDesc2: "Wir glauben, jeder verdient eine Uhr, die mehr als Zeit erzählt – sie erzählt Ihre Geschichte. Von Vorstandsetagen bis zu Wochenendausflügen sind unsere Uhren darauf ausgelegt, jeden Moment des Lebens zu begleiten.",
      exploreCollection: "Kollektion erkunden",
      countriesShipped: "Länder beliefert",
      reviewsTitle: "Was unsere Kunden sagen",
      reviewsSubtitle: "Schließen Sie sich Tausenden zufriedener Uhrenliebhaber an",
      securePayment: "Sichere Zahlungsmethoden"
    },
    footer: {
      brand: "HØRIZON",
      brandDesc: "Premium-Uhren für die moderne Ära. Qualität trifft auf erschwinglichen Luxus.",
      shop: "Shop",
      newArrivals: "Neuheiten",
      bestSellers: "Bestseller",
      customerService: "Kundenservice",
      shippingInfo: "Versandinfo",
      returns: "Rückgabe & Umtausch",
      contactUs: "Kontakt",
      contact: "Kontakt",
      email: "support@horizonwatches.com",
      payment: "Akzeptiert: PayPal, USDT, Karten",
      copyright: "© 2024 Horizon Watches. Alle Rechte vorbehalten."
    },
    checkout: {
      title: "Sichere Kasse",
      cartEmpty: "Ihr Warenkorb ist leer",
      continueShopping: "Weiter einkaufen",
      contactInfo: "Kontaktinformationen",
      email: "E-Mail",
      shipping: "Lieferadresse",
      country: "Land",
      firstName: "Vorname",
      lastName: "Nachname",
      address: "Adresse",
      city: "Stadt",
      postalCode: "Postleitzahl",
      payment: "Zahlung",
      completeShipping: "Bitte vervollständigen Sie die Versandinformationen",
      notConfigured: "Zahlung nicht konfiguriert",
      totalAmount: "Gesamtbetrag",
      sendToAddress: "USDT an diese Adresse senden",
      copy: "Kopieren",
      copied: "Kopiert!",
      paymentInstructions: "Bitte senden Sie den genauen Betrag. Ihre Bestellung wird nach Zahlungsbestätigung bearbeitet.",
      completePayment: "Ich habe die Zahlung abgeschlossen",
      enterTxidDesc: "Geben Sie Ihren Transaktionshash ein",
      txidPlaceholder: "Transaktionshash (TXID)...",
      txidError: "Bitte geben Sie einen gültigen Transaktionshash ein (64 Zeichen)",
      back: "Zurück",
      verifyConfirm: "Überprüfen & Bestätigen",
      verifying: "Überprüfung...",
      verified: "Verifiziert!",
      paymentVerified: "Zahlung erfolgreich verifiziert!",
      verificationFailed: "Überprüfung fehlgeschlagen. Bitte TXID prüfen.",
      orderSummary: "Bestellübersicht",
      subtotal: "Zwischensumme",
      total: "Gesamt",
      payWithUSDT: "Mit USDT bezahlen"
    },
    common: {
      loading: "Laden...",
      error: "Ein Fehler ist aufgetreten",
      retry: "Wiederholen",
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      create: "Erstellen",
      search: "Suchen",
      filter: "Filter",
      sort: "Sortieren",
      close: "Schließen",
      open: "Öffnen",
      yes: "Ja",
      no: "Nein",
      or: "oder",
      and: "und"
    }
  },

  fr: {
    banner: {
      weekendSale: "Soldes du Weekend",
      offWithCode: "20% DE RÉDUC avec le code",
      endsIn: "Termine dans"
    },
    nav: { 
      men: "Homme", 
      women: "Femme", 
      sale: "SOLDES", 
      cart: "Panier", 
      back: "Retour à l'accueil" 
    },
    hero: { 
      shopNow: "Acheter", 
      viewCollection: "Voir la collection",
      badge: "Approuvé par 10 000+ clients",
      title1: "Élégance",
      title2: "Intemporelle",
      subtitle: "Montres premium d'inspiration européenne. Livraison gratuite dans 17 pays. Garantie 2 ans.",
      saleEnds: "Offre à durée limitée",
      useCode: "Code: WEEK20",
      startingAt: "À partir de",
      price: "69 €"
    },
    trust: {
      freeShipping: "Livraison Gratuite",
      freeShippingDesc: "Dès 100 € d'achat",
      warranty: "Garantie 2 Ans",
      warrantyDesc: "Couverture complète",
      returns: "Retours 30 Jours",
      returnsDesc: "Sans tracas",
      customers: "10 000+ Clients",
      customersDesc: "Satisfaits"
    },
    cart: { 
      empty: "Votre panier est vide", 
      checkout: "Commander",
      yourCart: "Votre Panier",
      continueShopping: "Continuer les achats",
      remove: "Supprimer",
      addMoreForFreeShipping: "Ajoutez {amount} € pour la livraison gratuite",
      freeShippingQualified: "Vous bénéficiez de la livraison gratuite!",
      subtotal: "Sous-total",
      proceedToCheckout: "Passer la commande",
      clearCart: "Vider le panier",
      item: "article",
      items: "articles"
    },
    shop: {
      title: "Toutes les Montres",
      subtitle: "produits",
      filters: "Filtres",
      collections: "Collections",
      showing: "Affichage de",
      products: "produits",
      sortFeatured: "Populaires",
      sortPriceLow: "Prix: Croissant",
      sortPriceHigh: "Prix: Décroissant",
      sortNewest: "Nouveautés",
      noResults: "Aucun produit trouvé",
      clearFilters: "Réinitialiser"
    },
    product: {
      quantity: "Quantité",
      shipping: "Livraison",
      freeShipping: "Gratuit",
      addToCart: "Ajouter au panier",
      quickAdd: "Ajout rapide",
      added: "Ajouté!",
      inStock: "En stock",
      outOfStock: "Rupture de stock",
      lowStock: "Plus que {count} disponibles",
      sku: "Référence",
      category: "Catégorie",
      description: "Description",
      specifications: "Spécifications",
      reviews: "Avis",
      relatedProducts: "Vous aimerez aussi",
      badgeHot: "Populaire",
      badgeNew: "Nouveau",
      badgeSale: "Promo",
      badgeBestseller: "Top vente"
    },
    bestsellers: {
      subtitle: "Les Plus Populaires",
      title: "Best-sellers",
      viewAll: "Voir tout"
    },
    home: {
      bestsellerDesc: "Nos montres les plus appréciées, choisies par des clients à travers l'Europe",
      storyLabel: "Notre Histoire",
      storyTitle: "Conçu pour le Gentleman Moderne",
      storyDesc1: "Fondée en 2020, Horizon Watches apporte un design intemporel aux poignets contemporains. Chaque pièce est méticuleusement fabriquée avec une attention aux détails qui rivalise avec les marques de luxe à une fraction du prix.",
      storyDesc2: "Nous croyons que chacun mérite une montre qui raconte plus que l'heure – elle raconte votre histoire. Des salles de réunion aux escapades de week-end, nos montres sont conçues pour accompagner chaque moment de la vie.",
      exploreCollection: "Explorer la collection",
      countriesShipped: "Pays livrés",
      reviewsTitle: "Ce que disent nos clients",
      reviewsSubtitle: "Rejoignez des milliers de passionnés d'horlogerie satisfaits",
      securePayment: "Moyens de paiement sécurisés"
    },
    footer: {
      brand: "HØRIZON",
      brandDesc: "Montres premium pour l'ère moderne. Artisanat de qualité rencontre luxe accessible.",
      shop: "Boutique",
      newArrivals: "Nouveautés",
      bestSellers: "Best-sellers",
      customerService: "Service Client",
      shippingInfo: "Infos Livraison",
      returns: "Retours & Échanges",
      contactUs: "Contactez-nous",
      contact: "Contact",
      email: "support@horizonwatches.com",
      payment: "Accepté: PayPal, USDT, Cartes",
      copyright: "© 2024 Horizon Watches. Tous droits réservés."
    },
    checkout: {
      title: "Paiement Sécurisé",
      cartEmpty: "Votre panier est vide",
      continueShopping: "Continuer les achats",
      contactInfo: "Informations de contact",
      email: "E-mail",
      shipping: "Adresse de livraison",
      country: "Pays",
      firstName: "Prénom",
      lastName: "Nom",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      payment: "Paiement",
      completeShipping: "Veuillez compléter les informations de livraison",
      notConfigured: "Paiement non configuré",
      totalAmount: "Montant total",
      sendToAddress: "Envoyez USDT à cette adresse",
      copy: "Copier",
      copied: "Copié!",
      paymentInstructions: "Veuillez envoyer le montant exact. Votre commande sera traitée après confirmation.",
      completePayment: "J'ai effectué le paiement",
      enterTxidDesc: "Entrez votre hash de transaction",
      txidPlaceholder: "Hash de transaction (TXID)...",
      txidError: "Veuillez entrer un hash valide (64 caractères)",
      back: "Retour",
      verifyConfirm: "Vérifier & Confirmer",
      verifying: "Vérification...",
      verified: "Vérifié!",
      paymentVerified: "Paiement vérifié avec succès!",
      verificationFailed: "Échec de la vérification. Veuillez vérifier votre TXID.",
      orderSummary: "Résumé de la commande",
      subtotal: "Sous-total",
      total: "Total",
      payWithUSDT: "Payer avec USDT"
    },
    common: {
      loading: "Chargement...",
      error: "Une erreur s'est produite",
      retry: "Réessayer",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      create: "Créer",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      close: "Fermer",
      open: "Ouvrir",
      yes: "Oui",
      no: "Non",
      or: "ou",
      and: "et"
    }
  },

  es: {
    banner: {
      weekendSale: "Oferta de Fin de Semana",
      offWithCode: "20% DTO con código",
      endsIn: "Termina en"
    },
    nav: { 
      men: "Hombre", 
      women: "Mujer", 
      sale: "REBAJAS", 
      cart: "Carrito", 
      back: "Volver al inicio" 
    },
    hero: { 
      shopNow: "Comprar", 
      viewCollection: "Ver colección",
      badge: "Confiado por 10,000+ clientes",
      title1: "Elegancia",
      title2: "Atemporal",
      subtitle: "Relojes premium de inspiración europea. Envío gratis a 17 países. 2 años de garantía.",
      saleEnds: "Oferta por tiempo limitado",
      useCode: "Código: WEEK20",
      startingAt: "Desde",
      price: "€69"
    },
    trust: {
      freeShipping: "Envío Gratis",
      freeShippingDesc: "En pedidos +€100",
      warranty: "Garantía 2 Años",
      warrantyDesc: "Cobertura total",
      returns: "Devoluciones 30 Días",
      returnsDesc: "Sin complicaciones",
      customers: "10,000+ Clientes",
      customersDesc: "Felices"
    },
    cart: { 
      empty: "Tu carrito está vacío", 
      checkout: "Pagar",
      yourCart: "Tu Carrito",
      continueShopping: "Seguir comprando",
      remove: "Eliminar",
      addMoreForFreeShipping: "Añade €{amount} más para envío gratis",
      freeShippingQualified: "¡Calificas para envío gratis!",
      subtotal: "Subtotal",
      proceedToCheckout: "Proceder al pago",
      clearCart: "Vaciar carrito",
      item: "artículo",
      items: "artículos"
    },
    shop: {
      title: "Todos los Relojes",
      subtitle: "productos",
      filters: "Filtros",
      collections: "Colecciones",
      showing: "Mostrando",
      products: "productos",
      sortFeatured: "Destacados",
      sortPriceLow: "Precio: Menor a Mayor",
      sortPriceHigh: "Precio: Mayor a Menor",
      sortNewest: "Nuevos primero",
      noResults: "No se encontraron productos",
      clearFilters: "Limpiar filtros"
    },
    product: {
      quantity: "Cantidad",
      shipping: "Envío",
      freeShipping: "Gratis",
      addToCart: "Añadir al carrito",
      quickAdd: "Añadir rápido",
      added: "¡Añadido!",
      inStock: "En stock",
      outOfStock: "Agotado",
      lowStock: "Solo quedan {count}",
      sku: "SKU",
      category: "Categoría",
      description: "Descripción",
      specifications: "Especificaciones",
      reviews: "Reseñas",
      relatedProducts: "También te puede gustar",
      badgeHot: "Popular",
      badgeNew: "Nuevo",
      badgeSale: "Oferta",
      badgeBestseller: "Más vendido"
    },
    bestsellers: {
      subtitle: "Más Populares",
      title: "Más Vendidos",
      viewAll: "Ver todo"
    },
    home: {
      bestsellerDesc: "Nuestros relojes más queridos, elegidos por clientes en toda Europa",
      storyLabel: "Nuestra Historia",
      storyTitle: "Diseñado para el Caballero Moderno",
      storyDesc1: "Fundada en 2020, Horizon Watches trae diseño atemporal a muñecas contemporáneas. Cada pieza está meticulosamente elaborada con atención al detalle que compite con marcas de lujo a una fracción del precio.",
      storyDesc2: "Creemos que todos merecen un reloj que cuente más que tiempo—cuenta tu historia. De salas de juntas a escapadas de fin de semana, nuestros relojes están diseñados para acompañar cada momento de la vida.",
      exploreCollection: "Explorar colección",
      countriesShipped: "Países enviados",
      reviewsTitle: "Lo que dicen nuestros clientes",
      reviewsSubtitle: "Únete a miles de entusiastas de relojes satisfechos",
      securePayment: "Métodos de pago seguros"
    },
    footer: {
      brand: "HØRIZON",
      brandDesc: "Relojes premium para la era moderna. Artesanía de calidad se encuentra con lujo accesible.",
      shop: "Tienda",
      newArrivals: "Novedades",
      bestSellers: "Más vendidos",
      customerService: "Atención al Cliente",
      shippingInfo: "Info de Envío",
      returns: "Devoluciones",
      contactUs: "Contáctanos",
      contact: "Contacto",
      email: "support@horizonwatches.com",
      payment: "Aceptamos: PayPal, USDT, Tarjetas",
      copyright: "© 2024 Horizon Watches. Todos los derechos reservados."
    },
    checkout: {
      title: "Pago Seguro",
      cartEmpty: "Tu carrito está vacío",
      continueShopping: "Seguir comprando",
      contactInfo: "Información de contacto",
      email: "Correo electrónico",
      shipping: "Dirección de envío",
      country: "País",
      firstName: "Nombre",
      lastName: "Apellido",
      address: "Dirección",
      city: "Ciudad",
      postalCode: "Código postal",
      payment: "Pago",
      completeShipping: "Completa la información de envío",
      notConfigured: "Pago no configurado",
      totalAmount: "Importe total",
      sendToAddress: "Envía USDT a esta dirección",
      copy: "Copiar",
      copied: "¡Copiado!",
      paymentInstructions: "Envía el monto exacto. Tu pedido se procesará al confirmar el pago.",
      completePayment: "He completado el pago",
      enterTxidDesc: "Ingresa tu hash de transacción",
      txidPlaceholder: "Hash de transacción (TXID)...",
      txidError: "Ingresa un hash válido (64 caracteres)",
      back: "Atrás",
      verifyConfirm: "Verificar y Confirmar",
      verifying: "Verificando...",
      verified: "¡Verificado!",
      paymentVerified: "¡Pago verificado exitosamente!",
      verificationFailed: "Verificación fallida. Verifica tu TXID.",
      orderSummary: "Resumen del pedido",
      subtotal: "Subtotal",
      total: "Total",
      payWithUSDT: "Pagar con USDT"
    },
    common: {
      loading: "Cargando...",
      error: "Algo salió mal",
      retry: "Reintentar",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      create: "Crear",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      close: "Cerrar",
      open: "Abrir",
      yes: "Sí",
      no: "No",
      or: "o",
      and: "y"
    }
  },

  it: {
    banner: {
      weekendSale: "Offerta Weekend",
      offWithCode: "20% DI SCONTO con codice",
      endsIn: "Termina tra"
    },
    nav: { 
      men: "Uomo", 
      women: "Donna", 
      sale: "SALDI", 
      cart: "Carrello", 
      back: "Torna alla home" 
    },
    hero: { 
      shopNow: "Acquista", 
      viewCollection: "Vedi collezione",
      badge: "Fidato da 10.000+ clienti",
      title1: "Eleganza",
      title2: "Senza Tempo",
      subtitle: "Orologi premium d'ispirazione europea. Spedizione gratuita in 17 paesi. Garanzia 2 anni.",
      saleEnds: "Offerta a tempo limitato",
      useCode: "Codice: WEEK20",
      startingAt: "A partire da",
      price: "€69"
    },
    trust: {
      freeShipping: "Spedizione Gratuita",
      freeShippingDesc: "Su ordini +€100",
      warranty: "Garanzia 2 Anni",
      warrantyDesc: "Copertura completa",
      returns: "Resi 30 Giorni",
      returnsDesc: "Senza problemi",
      customers: "10.000+ Clienti",
      customersDesc: "Soddisfatti"
    },
    cart: { 
      empty: "Il tuo carrello è vuoto", 
      checkout: "Checkout",
      yourCart: "Il tuo Carrello",
      continueShopping: "Continua a fare acquisti",
      remove: "Rimuovi",
      addMoreForFreeShipping: "Aggiungi €{amount} per spedizione gratuita",
      freeShippingQualified: "Hai diritto alla spedizione gratuita!",
      subtotal: "Subtotale",
      proceedToCheckout: "Procedi al checkout",
      clearCart: "Svuota carrello",
      item: "articolo",
      items: "articoli"
    },
    shop: {
      title: "Tutti gli Orologi",
      subtitle: "prodotti",
      filters: "Filtri",
      collections: "Collezioni",
      showing: "Mostrando",
      products: "prodotti",
      sortFeatured: "In evidenza",
      sortPriceLow: "Prezzo: Crescente",
      sortPriceHigh: "Prezzo: Decrescente",
      sortNewest: "Più recenti",
      noResults: "Nessun prodotto trovato",
      clearFilters: "Cancella filtri"
    },
    product: {
      quantity: "Quantità",
      shipping: "Spedizione",
      freeShipping: "Gratis",
      addToCart: "Aggiungi al carrello",
      quickAdd: "Aggiungi veloce",
      added: "Aggiunto!",
      inStock: "Disponibile",
      outOfStock: "Esaurito",
      lowStock: "Solo {count} rimasti",
      sku: "Codice",
      category: "Categoria",
      description: "Descrizione",
      specifications: "Specifiche",
      reviews: "Recensioni",
      relatedProducts: "Potrebbe interessarti anche",
      badgeHot: "Popolare",
      badgeNew: "Nuovo",
      badgeSale: "Offerta",
      badgeBestseller: "Best seller"
    },
    bestsellers: {
      subtitle: "Più Popolari",
      title: "Best Seller",
      viewAll: "Vedi tutti"
    },
    home: {
      bestsellerDesc: "I nostri orologi più amati, scelti da clienti in tutta Europa",
      storyLabel: "La Nostra Storia",
      storyTitle: "Creato per il Gentleman Moderno",
      storyDesc1: "Fondata nel 2020, Horizon Watches porta un design senza tempo ai polsi contemporanei. Ogni pezzo è meticolosamente realizzato con attenzione ai dettagli che rivaleggia con i marchi di lusso a una frazione del prezzo.",
      storyDesc2: "Crediamo che tutti meritino un orologio che racconti più dell'ora—racconta la tua storia. Dalle sale riunioni alle gite di fine settimana, i nostri orologi sono progettati per accompagnare ogni momento della vita.",
      exploreCollection: "Esplora collezione",
      countriesShipped: "Paesi serviti",
      reviewsTitle: "Cosa dicono i nostri clienti",
      reviewsSubtitle: "Unisciti a migliaia di appassionati di orologi soddisfatti",
      securePayment: "Metodi di pagamento sicuri"
    },
    footer: {
      brand: "HØRIZON",
      brandDesc: "Orologi premium per l'era moderna. Artigianato di qualità incontra lusso accessibile.",
      shop: "Negozio",
      newArrivals: "Nuovi Arrivi",
      bestSellers: "Best Seller",
      customerService: "Servizio Clienti",
      shippingInfo: "Info Spedizione",
      returns: "Resi & Cambi",
      contactUs: "Contattaci",
      contact: "Contatto",
      email: "support@horizonwatches.com",
      payment: "Accettiamo: PayPal, USDT, Carte",
      copyright: "© 2024 Horizon Watches. Tutti i diritti riservati."
    },
    checkout: {
      title: "Checkout Sicuro",
      cartEmpty: "Il tuo carrello è vuoto",
      continueShopping: "Continua a fare acquisti",
      contactInfo: "Informazioni di contatto",
      email: "Email",
      shipping: "Indirizzo di spedizione",
      country: "Paese",
      firstName: "Nome",
      lastName: "Cognome",
      address: "Indirizzo",
      city: "Città",
      postalCode: "CAP",
      payment: "Pagamento",
      completeShipping: "Completa le informazioni di spedizione",
      notConfigured: "Pagamento non configurato",
      totalAmount: "Importo totale",
      sendToAddress: "Invia USDT a questo indirizzo",
      copy: "Copia",
      copied: "Copiato!",
      paymentInstructions: "Invia l'importo esatto. L'ordine verrà elaborato dopo la conferma.",
      completePayment: "Ho completato il pagamento",
      enterTxidDesc: "Inserisci il tuo hash di transazione",
      txidPlaceholder: "Hash transazione (TXID)...",
      txidError: "Inserisci un hash valido (64 caratteri)",
      back: "Indietro",
      verifyConfirm: "Verifica & Conferma",
      verifying: "Verifica in corso...",
      verified: "Verificato!",
      paymentVerified: "Pagamento verificato con successo!",
      verificationFailed: "Verifica fallita. Controlla il tuo TXID.",
      orderSummary: "Riepilogo ordine",
      subtotal: "Subtotale",
      total: "Totale",
      payWithUSDT: "Paga con USDT"
    },
    common: {
      loading: "Caricamento...",
      error: "Qualcosa è andato storto",
      retry: "Riprova",
      save: "Salva",
      cancel: "Annulla",
      delete: "Elimina",
      edit: "Modifica",
      create: "Crea",
      search: "Cerca",
      filter: "Filtra",
      sort: "Ordina",
      close: "Chiudi",
      open: "Apri",
      yes: "Sì",
      no: "No",
      or: "o",
      and: "e"
    }
  },

  zh: {
    banner: {
      weekendSale: "周末特惠",
      offWithCode: "使用优惠码立减20%",
      endsIn: "距结束"
    },
    nav: { 
      men: "男士", 
      women: "女士", 
      sale: "促销", 
      cart: "购物车", 
      back: "返回首页" 
    },
    hero: { 
      shopNow: "立即购买", 
      viewCollection: "查看系列",
      badge: "10,000+ 客户信赖",
      title1: "永恒",
      title2: "优雅",
      subtitle: "欧洲风格高端腕表。覆盖17国免费配送。2年质保。",
      saleEnds: "限时优惠",
      useCode: "优惠码：WEEK20",
      startingAt: "起售价",
      price: "€69"
    },
    trust: {
      freeShipping: "免费配送",
      freeShippingDesc: "满€100即享",
      warranty: "2年质保",
      warrantyDesc: "全面保障",
      returns: "30天退换",
      returnsDesc: "无忧退货",
      customers: "10,000+ 满意",
      customersDesc: "客户"
    },
    cart: { 
      empty: "您的购物车是空的", 
      checkout: "去结算",
      yourCart: "购物车",
      continueShopping: "继续购物",
      remove: "删除",
      addMoreForFreeShipping: "再购 €{amount} 享免运费",
      freeShippingQualified: "您已享免运费!",
      subtotal: "小计",
      proceedToCheckout: "去结算",
      clearCart: "清空购物车",
      item: "件商品",
      items: "件商品"
    },
    shop: {
      title: "全部腕表",
      subtitle: "件商品",
      filters: "筛选",
      collections: "系列",
      showing: "显示",
      products: "件商品",
      sortFeatured: "精选推荐",
      sortPriceLow: "价格：低到高",
      sortPriceHigh: "价格：高到低",
      sortNewest: "最新上架",
      noResults: "未找到商品",
      clearFilters: "清除筛选"
    },
    product: {
      quantity: "数量",
      shipping: "配送",
      freeShipping: "免费",
      addToCart: "加入购物车",
      quickAdd: "快速添加",
      added: "已添加!",
      inStock: "有货",
      outOfStock: "缺货",
      lowStock: "仅剩 {count} 件",
      sku: "商品编号",
      category: "分类",
      description: "商品详情",
      specifications: "规格参数",
      reviews: "用户评价",
      relatedProducts: "猜你喜欢",
      badgeHot: "热卖",
      badgeNew: "新品",
      badgeSale: "特惠",
      badgeBestseller: "畅销"
    },
    bestsellers: {
      subtitle: "最受欢迎",
      title: "畅销单品",
      viewAll: "查看全部"
    },
    home: {
      bestsellerDesc: "全欧洲客户最喜爱的腕表臻选",
      storyLabel: "品牌故事",
      storyTitle: "为现代绅士打造",
      storyDesc1: "成立于2020年，Horizon Watches 将永恒设计带到当代腕间。每一枚腕表都精心打造，以亲民价格呈现媲美奢侈品牌的精致细节。",
      storyDesc2: "我们相信，每个人都值得拥有不止于计时的腕表——它诉说你的故事。从会议室到周末度假，我们的腕表陪伴人生每一刻。",
      exploreCollection: "探索系列",
      countriesShipped: "个国家已发货",
      reviewsTitle: "客户评价",
      reviewsSubtitle: "加入数千名满意的腕表爱好者",
      securePayment: "安全支付方式"
    },
    footer: {
      brand: "HØRIZON",
      brandDesc: "现代奢华腕表。精湛工艺，触手可及。",
      shop: "商城",
      newArrivals: "新品上市",
      bestSellers: "畅销单品",
      customerService: "客户服务",
      shippingInfo: "配送信息",
      returns: "退换货政策",
      contactUs: "联系我们",
      contact: "联系方式",
      email: "support@horizonwatches.com",
      payment: "支付方式：PayPal、USDT、银行卡",
      copyright: "© 2024 Horizon Watches. 保留所有权利。"
    },
    checkout: {
      title: "安全结账",
      cartEmpty: "购物车为空",
      continueShopping: "继续购物",
      contactInfo: "联系信息",
      email: "电子邮箱",
      shipping: "配送地址",
      country: "国家/地区",
      firstName: "名",
      lastName: "姓",
      address: "地址",
      city: "城市",
      postalCode: "邮编",
      payment: "支付",
      completeShipping: "请完善配送信息",
      notConfigured: "支付未配置",
      totalAmount: "总金额",
      sendToAddress: "发送 USDT 至此地址",
      copy: "复制",
      copied: "已复制!",
      paymentInstructions: "请发送准确金额。付款确认后处理订单。",
      completePayment: "我已完成付款",
      enterTxidDesc: "输入交易哈希验证付款",
      txidPlaceholder: "输入交易哈希 (TXID)...",
      txidError: "请输入有效的交易哈希 (64位字符)",
      back: "返回",
      verifyConfirm: "验证并确认",
      verifying: "验证中...",
      verified: "已验证!",
      paymentVerified: "付款验证成功!",
      verificationFailed: "验证失败。请检查交易哈希。",
      orderSummary: "订单摘要",
      subtotal: "小计",
      total: "总计",
      payWithUSDT: "使用 USDT 支付"
    },
    common: {
      loading: "加载中...",
      error: "出错了",
      retry: "重试",
      save: "保存",
      cancel: "取消",
      delete: "删除",
      edit: "编辑",
      create: "创建",
      search: "搜索",
      filter: "筛选",
      sort: "排序",
      close: "关闭",
      open: "打开",
      yes: "是",
      no: "否",
      or: "或",
      and: "和"
    }
  }
};

const languageNames = {
  en: { name: "English", flag: "🇬🇧", region: "United Kingdom" },
  de: { name: "Deutsch", flag: "🇩🇪", region: "Germany" },
  fr: { name: "Français", flag: "🇫🇷", region: "France" },
  es: { name: "Español", flag: "🇪🇸", region: "Spain" },
  it: { name: "Italiano", flag: "🇮🇹", region: "Italy" },
  zh: { name: "中文", flag: "🇨🇳", region: "China" },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  languages: typeof languageNames;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("preferred-language") as Locale;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("preferred-language", newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, languages: languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export { languageNames, translations };
