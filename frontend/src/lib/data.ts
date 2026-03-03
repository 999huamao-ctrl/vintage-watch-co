export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  specs: {
    caseSize: string;
    movement: string;
    strap: string;
    waterResistance: string;
    crystal: string;
  };
  inStock: boolean;
  badge?: string; // Optional badge like "New", "Bestseller", "Sale"
}

export const products: Product[] = [
  // Heritage Collection - Classic Dress Watches
  {
    id: "heritage-42",
    name: "The Heritage 42",
    description: "A timeless vintage dress watch featuring a 42mm case, automatic movement, and genuine leather strap. Perfect for the modern gentleman.",
    price: 79,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
    category: "Heritage Collection",
    specs: { caseSize: "42mm", movement: "Automatic", strap: "Genuine Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true,
    badge: "Bestseller"
  },
  {
    id: "heritage-38",
    name: "The Heritage 38",
    description: "Elegant 38mm dress watch with automatic movement. A refined choice for those who prefer subtle sophistication.",
    price: 69,
    image: "/products/heritage-38.jpg",
    category: "Heritage Collection",
    specs: { caseSize: "38mm", movement: "Automatic", strap: "Genuine Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "heritage-40",
    name: "The Heritage 40",
    description: "Classic 40mm automatic watch with Roman numerals. The perfect balance of tradition and contemporary style.",
    price: 75,
    image: "/products/heritage-40.jpg",
    category: "Heritage Collection",
    specs: { caseSize: "40mm", movement: "Automatic", strap: "Genuine Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "heritage-slim",
    name: "The Heritage Slim",
    description: "Ultra-thin 38mm dress watch with Swiss quartz movement. Slips effortlessly under any cuff.",
    price: 59,
    image: "/products/heritage-slim.jpg",
    category: "Heritage Collection",
    specs: { caseSize: "38mm", movement: "Swiss Quartz", strap: "Genuine Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "heritage-gold",
    name: "The Heritage Gold",
    description: "Luxurious gold-tone dress watch with automatic movement. For those special occasions that demand elegance.",
    price: 89,
    image: "/products/heritage-gold.jpg",
    category: "Heritage Collection",
    specs: { caseSize: "40mm", movement: "Automatic", strap: "Brown Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true,
    badge: "New"
  },
  {
    id: "heritage-silver",
    name: "The Heritage Silver",
    description: "Polished silver-tone case with blue dial. A modern classic that pairs with any outfit.",
    price: 69,
    image: "/products/heritage-silver.jpg",
    category: "Heritage Collection",
    specs: { caseSize: "40mm", movement: "Japanese Quartz", strap: "Black Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },

  // Aviator Collection - Pilot Style
  {
    id: "aviator-44",
    name: "The Aviator 44",
    description: "Bold pilot watch with 44mm case, luminous hands, and aviation-inspired design. Ready for takeoff.",
    price: 99,
    image: "/products/aviator-44.jpg",
    category: "Aviator Collection",
    specs: { caseSize: "44mm", movement: "Automatic", strap: "Brown Leather", waterResistance: "5ATM", crystal: "Sapphire" },
    inStock: true
  },
  {
    id: "aviator-chrono",
    name: "The Aviator Chrono",
    description: "Precision chronograph with slide rule bezel. The ultimate tool watch for aviation enthusiasts.",
    price: 119,
    image: "/products/aviator-chrono.jpg",
    category: "Aviator Collection",
    specs: { caseSize: "42mm", movement: "Quartz Chronograph", strap: "Stainless Steel", waterResistance: "10ATM", crystal: "Sapphire" },
    inStock: true,
    badge: "Popular"
  },
  {
    id: "aviator-classic",
    name: "The Aviator Classic",
    description: "Clean pilot watch design with Arabic numerals and onion crown. Timeless aviation heritage.",
    price: 89,
    image: "/products/aviator-classic.jpg",
    category: "Aviator Collection",
    specs: { caseSize: "40mm", movement: "Automatic", strap: "Black Leather", waterResistance: "5ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "aviator-dual",
    name: "The Aviator Dual Time",
    description: "GMT function for the global traveler. Track two time zones with elegant simplicity.",
    price: 109,
    image: "/products/aviator-dual.jpg",
    category: "Aviator Collection",
    specs: { caseSize: "42mm", movement: "Quartz GMT", strap: "Brown Leather", waterResistance: "5ATM", crystal: "Sapphire" },
    inStock: true
  },
  {
    id: "aviator-sport",
    name: "The Aviator Sport",
    description: "Rugged pilot watch with canvas strap and super luminous dial. Built for adventure.",
    price: 79,
    image: "/products/aviator-sport.jpg",
    category: "Aviator Collection",
    specs: { caseSize: "42mm", movement: "Japanese Quartz", strap: "Canvas", waterResistance: "10ATM", crystal: "Mineral" },
    inStock: true,
    badge: "Sale"
  },

  // Diver Collection - Dive Watches
  {
    id: "diver-300",
    name: "The Diver 300",
    description: "Professional 300m dive watch with rotating bezel and screw-down crown. Ready for the deep.",
    price: 129,
    image: "/products/diver-300.jpg",
    category: "Diver Collection",
    specs: { caseSize: "42mm", movement: "Automatic", strap: "Stainless Steel", waterResistance: "30ATM", crystal: "Sapphire" },
    inStock: true,
    badge: "Bestseller"
  },
  {
    id: "diver-200",
    name: "The Diver 200",
    description: "200m water resistance with classic dive watch aesthetics. Professional grade, everyday wear.",
    price: 99,
    image: "/products/diver-200.jpg",
    category: "Diver Collection",
    specs: { caseSize: "40mm", movement: "Automatic", strap: "Rubber", waterResistance: "20ATM", crystal: "Sapphire" },
    inStock: true
  },
  {
    id: "diver-vintage",
    name: "The Vintage Diver",
    description: "Retro-inspired dive watch with gilt dial and aged lume. Nostalgia meets functionality.",
    price: 89,
    image: "/products/diver-vintage.jpg",
    category: "Diver Collection",
    specs: { caseSize: "40mm", movement: "Automatic", strap: "Tropic Rubber", waterResistance: "20ATM", crystal: "Domed Acrylic" },
    inStock: true
  },
  {
    id: "diver-chrono",
    name: "The Diver Chrono",
    description: "Chronograph dive watch with 200m water resistance. Perfect for timing your dives.",
    price: 139,
    image: "/products/diver-chrono.jpg",
    category: "Diver Collection",
    specs: { caseSize: "44mm", movement: "Quartz Chronograph", strap: "Stainless Steel", waterResistance: "20ATM", crystal: "Sapphire" },
    inStock: true
  },

  // Minimalist Collection - Clean Design
  {
    id: "minimalist",
    name: "The Minimalist",
    description: "Embrace timeless simplicity. Clean lines, refined details, and a comfortable mesh band.",
    price: 69,
    image: "/products/minimalist.jpg",
    category: "Minimalist Collection",
    specs: { caseSize: "38mm", movement: "Japanese Quartz", strap: "Milanese Mesh", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "minimalist-36",
    name: "The Minimalist 36",
    description: "Ultra-clean 36mm case with no date window. Pure, understated elegance.",
    price: 59,
    image: "/products/minimalist-36.jpg",
    category: "Minimalist Collection",
    specs: { caseSize: "36mm", movement: "Swiss Quartz", strap: "Black Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "minimalist-rose",
    name: "The Minimalist Rose",
    description: "Rose gold case with white dial. Modern femininity meets minimalist design.",
    price: 79,
    image: "/products/minimalist-rose.jpg",
    category: "Minimalist Collection",
    specs: { caseSize: "36mm", movement: "Japanese Quartz", strap: "Rose Gold Mesh", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true,
    badge: "New"
  },
  {
    id: "minimalist-black",
    name: "The Minimalist Black",
    description: "All-black design with black case, dial, and strap. Stealth sophistication.",
    price: 69,
    image: "/products/minimalist-black.jpg",
    category: "Minimalist Collection",
    specs: { caseSize: "40mm", movement: "Quartz", strap: "Black Leather", waterResistance: "5ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "minimalist-bauhaus",
    name: "The Bauhaus",
    description: "Inspired by classic German design. Form follows function in perfect harmony.",
    price: 89,
    image: "/products/minimalist-bauhaus.jpg",
    category: "Minimalist Collection",
    specs: { caseSize: "38mm", movement: "Automatic", strap: "Brown Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },

  // Chrono Collection - Chronographs
  {
    id: "classic-chrono",
    name: "The Classic Chrono",
    description: "Sophisticated chronograph with quartz movement and stainless steel construction.",
    price: 89,
    image: "/products/classic-chrono.jpg",
    category: "Chronograph Collection",
    specs: { caseSize: "40mm", movement: "Quartz Chronograph", strap: "Stainless Steel", waterResistance: "5ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "chrono-sport",
    name: "The Sport Chrono",
    description: "Tachymeter bezel and three sub-dials. Built for speed and precision.",
    price: 99,
    image: "/products/chrono-sport.jpg",
    category: "Chronograph Collection",
    specs: { caseSize: "42mm", movement: "Quartz Chronograph", strap: "Stainless Steel", waterResistance: "10ATM", crystal: "Sapphire" },
    inStock: true,
    badge: "Popular"
  },
  {
    id: "chrono-vintage",
    name: "The Vintage Chrono",
    description: "Panda dial chronograph with cream sub-dials. Racing heritage on your wrist.",
    price: 109,
    image: "/products/chrono-vintage.jpg",
    category: "Chronograph Collection",
    specs: { caseSize: "40mm", movement: "Quartz Chronograph", strap: "Brown Leather", waterResistance: "5ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "chrono-mechanical",
    name: "The Mechanical Chrono",
    description: "Automatic chronograph movement. The pinnacle of watchmaking craft.",
    price: 199,
    image: "/products/chrono-mechanical.jpg",
    category: "Chronograph Collection",
    specs: { caseSize: "42mm", movement: "Automatic Chronograph", strap: "Black Leather", waterResistance: "5ATM", crystal: "Sapphire" },
    inStock: true,
    badge: "Premium"
  },

  // Field Collection - Military Style
  {
    id: "field-watch",
    name: "The Field Watch",
    description: "Military-inspired field watch with 24-hour dial and canvas strap. Rugged reliability.",
    price: 69,
    image: "/products/field-watch.jpg",
    category: "Field Collection",
    specs: { caseSize: "38mm", movement: "Japanese Quartz", strap: "Canvas", waterResistance: "5ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "field-auto",
    name: "The Field Automatic",
    description: "Automatic field watch with screw-down crown. Built for the outdoors.",
    price: 89,
    image: "/products/field-auto.jpg",
    category: "Field Collection",
    specs: { caseSize: "40mm", movement: "Automatic", strap: "Canvas", waterResistance: "10ATM", crystal: "Sapphire" },
    inStock: true
  },
  {
    id: "field-chrono",
    name: "The Field Chrono",
    description: "Chronograph field watch with compass bezel. Navigate in style.",
    price: 99,
    image: "/products/field-chrono.jpg",
    category: "Field Collection",
    specs: { caseSize: "42mm", movement: "Quartz Chronograph", strap: "Green Canvas", waterResistance: "10ATM", crystal: "Mineral" },
    inStock: true
  },

  // Dress Collection - Elegant Evening
  {
    id: "dress-ultra",
    name: "The Ultra Slim",
    description: "6.5mm thin dress watch. Disappears on the wrist, commands attention.",
    price: 79,
    image: "/products/dress-ultra.jpg",
    category: "Dress Collection",
    specs: { caseSize: "38mm", movement: "Swiss Quartz", strap: "Black Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "dress-moon",
    name: "The Moon Phase",
    description: "Elegant moon phase complication. Track lunar cycles with sophistication.",
    price: 119,
    image: "/products/dress-moon.jpg",
    category: "Dress Collection",
    specs: { caseSize: "40mm", movement: "Quartz", strap: "Brown Leather", waterResistance: "3ATM", crystal: "Sapphire" },
    inStock: true,
    badge: "Elegant"
  },
  {
    id: "dress-square",
    name: "The Art Deco",
    description: "Square case with art deco numerals. A statement piece for formal occasions.",
    price: 89,
    image: "/products/dress-square.jpg",
    category: "Dress Collection",
    specs: { caseSize: "34mm x 40mm", movement: "Japanese Quartz", strap: "Black Leather", waterResistance: "3ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "dress-open",
    name: "The Open Heart",
    description: "Open-heart dial revealing the automatic movement. Watchmaking as art.",
    price: 129,
    image: "/products/dress-open.jpg",
    category: "Dress Collection",
    specs: { caseSize: "40mm", movement: "Automatic", strap: "Brown Leather", waterResistance: "3ATM", crystal: "Sapphire" },
    inStock: true
  },

  // Sport Collection - Active Lifestyle
  {
    id: "sport-digital",
    name: "The Digital Chrono",
    description: "Ana-digi display with chronograph and alarm. Maximum functionality.",
    price: 59,
    image: "/products/sport-digital.jpg",
    category: "Sport Collection",
    specs: { caseSize: "44mm", movement: "Quartz Digital", strap: "Rubber", waterResistance: "10ATM", crystal: "Mineral" },
    inStock: true
  },
  {
    id: "sport-race",
    name: "The Racing Chrono",
    description: "Carbon fiber dial and red accents. Born for the track.",
    price: 109,
    image: "/products/sport-race.jpg",
    category: "Sport Collection",
    specs: { caseSize: "42mm", movement: "Quartz Chronograph", strap: "Black Rubber", waterResistance: "10ATM", crystal: "Sapphire" },
    inStock: true,
    badge: "Sport"
  },
  {
    id: "sport-titanium",
    name: "The Titanium",
    description: "Lightweight titanium case with 200m water resistance. Strong yet light.",
    price: 149,
    image: "/products/sport-titanium.jpg",
    category: "Sport Collection",
    specs: { caseSize: "42mm", movement: "Japanese Quartz", strap: "Titanium Bracelet", waterResistance: "20ATM", crystal: "Sapphire" },
    inStock: true
  }
];

export const categories = [
  "All",
  "Heritage Collection",
  "Aviator Collection", 
  "Diver Collection",
  "Minimalist Collection",
  "Chronograph Collection",
  "Field Collection",
  "Dress Collection",
  "Sport Collection"
];

export const shippingRates: Record<string, { rate: number; name: string }> = {
  GB: { rate: 8, name: "United Kingdom" },
  DE: { rate: 6, name: "Germany" },
  FR: { rate: 6, name: "France" },
  NL: { rate: 6, name: "Netherlands" },
  BE: { rate: 6, name: "Belgium" },
  AT: { rate: 6, name: "Austria" },
  IT: { rate: 7, name: "Italy" },
  ES: { rate: 7, name: "Spain" },
  PT: { rate: 7, name: "Portugal" },
  SE: { rate: 10, name: "Sweden" },
  DK: { rate: 10, name: "Denmark" },
  FI: { rate: 10, name: "Finland" },
  IE: { rate: 8, name: "Ireland" },
  PL: { rate: 7, name: "Poland" },
  CZ: { rate: 8, name: "Czech Republic" }
};

export const freeShippingThreshold = 79;
// Image URLs for 30 products
const imageUrls = [
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1434056886845-dbd53c8f6d7a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=600&h=600&fit=crop",
];
