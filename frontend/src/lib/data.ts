export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  specs: {
    caseSize: string;
    movement: string;
    strap: string;
    waterResistance: string;
    crystal: string;
    caseMaterial: string;
  };
  inStock: boolean;
  stock: number;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "daytona-black",
    name: "Daytona Black Steel",
    description: "Iconic chronograph with 4131 automatic movement. 904L stainless steel case, sapphire crystal, 100m water resistance. The ultimate racing chronograph.",
    price: 1350,
    originalPrice: 3500,
    image: "/products/laoli/image1.webp",
    images: ["/products/laoli/image1.webp", "/products/laoli/image2.jpeg", "/products/laoli/image3.jpeg"],
    category: "Men",
    specs: {
      caseSize: "40mm",
      movement: "4131 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50,
    badge: "Hot"
  },
  {
    id: "submariner-black",
    name: "Submariner Black",
    description: "Legendary dive watch with 3235 automatic movement. 300m water resistance, ceramic bezel, date function. The reference among divers' watches.",
    price: 1165,
    originalPrice: 2500,
    image: "/products/laoli/image4.jpeg",
    images: ["/products/laoli/image4.jpeg", "/products/laoli/image5.jpeg", "/products/laoli/image6.webp"],
    category: "Men",
    specs: {
      caseSize: "41mm",
      movement: "3235 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "300M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50,
    badge: "Bestseller"
  },
  {
    id: "submariner-green",
    name: "Submariner Green",
    description: "Stunning green bezel and dial with 3235 automatic movement. 300m water resistance, iconic design that commands attention.",
    price: 1165,
    originalPrice: 2800,
    image: "/products/laoli/image7.jpeg",
    images: ["/products/laoli/image7.jpeg", "/products/laoli/image8.jpeg", "/products/laoli/image9.jpeg"],
    category: "Men",
    specs: {
      caseSize: "41mm",
      movement: "3235 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "300M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50,
    badge: "Hot"
  },
  {
    id: "submariner-no-date",
    name: "Submariner No-Date",
    description: "Pure, clean design with 3230 automatic movement. No date window for perfect symmetry. 300m water resistance, timeless elegance.",
    price: 1165,
    originalPrice: 2200,
    image: "/products/laoli/image10.jpeg",
    images: ["/products/laoli/image10.jpeg", "/products/laoli/image11.jpeg", "/products/laoli/image12.jpeg"],
    category: "Men",
    specs: {
      caseSize: "41mm",
      movement: "3230 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "300M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "gmt-pepsi",
    name: "GMT-Master II Pepsi",
    description: "Dual-time zone with iconic red-blue ceramic bezel. 3285 automatic GMT movement, perfect for international travelers.",
    price: 1440,
    originalPrice: 3500,
    image: "/products/laoli/image13.jpeg",
    images: ["/products/laoli/image13.jpeg", "/products/laoli/image14.jpeg", "/products/laoli/image15.jpeg"],
    category: "Men",
    specs: {
      caseSize: "40mm",
      movement: "3285 Automatic GMT",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50,
    badge: "New"
  },
  {
    id: "gmt-batman",
    name: "GMT-Master II Batman",
    description: "Black-blue ceramic bezel dual-time watch. 3285 automatic GMT movement, sleek design for the modern explorer.",
    price: 1440,
    originalPrice: 3500,
    image: "/products/laoli/image16.jpeg",
    images: ["/products/laoli/image16.jpeg", "/products/laoli/image17.jpeg", "/products/laoli/image18.jpeg"],
    category: "Men",
    specs: {
      caseSize: "40mm",
      movement: "3285 Automatic GMT",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "gmt-sprite",
    name: "GMT-Master II Sprite",
    description: "Unique black-green ceramic bezel with left-handed crown. 3285 automatic GMT movement, stand out from the crowd.",
    price: 1440,
    originalPrice: 3200,
    image: "/products/laoli/image19.jpeg",
    images: ["/products/laoli/image19.jpeg", "/products/laoli/image20.jpeg", "/products/laoli/image21.jpeg"],
    category: "Men",
    specs: {
      caseSize: "40mm",
      movement: "3285 Automatic GMT",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "datejust-41-blue",
    name: "Datejust 41 Blue",
    description: "41mm dress watch with stunning blue sunburst dial. 3235 automatic movement, fluted bezel, refined sophistication.",
    price: 1440,
    originalPrice: 3000,
    image: "/products/laoli/image22.jpeg",
    images: ["/products/laoli/image22.jpeg", "/products/laoli/image23.jpeg", "/products/laoli/image24.jpeg"],
    category: "Men",
    specs: {
      caseSize: "41mm",
      movement: "3235 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "datejust-36-blue",
    name: "Datejust 36 Blue",
    description: "36mm classic size with blue sunburst dial. 3235 automatic movement, perfect proportions for elegant wrists.",
    price: 1260,
    originalPrice: 2800,
    image: "/products/laoli/image25.jpeg",
    images: ["/products/laoli/image25.jpeg", "/products/laoli/image26.jpeg", "/products/laoli/image27.jpeg"],
    category: "Men",
    specs: {
      caseSize: "36mm",
      movement: "3235 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "explorer-36",
    name: "Explorer 36",
    description: "36mm field watch with iconic 3-6-9 Arabic numerals. 3230 automatic movement, built for exploration.",
    price: 1360,
    originalPrice: 2800,
    image: "/products/laoli/image28.jpeg",
    images: ["/products/laoli/image28.jpeg", "/products/laoli/image29.jpeg", "/products/laoli/image30.jpeg"],
    category: "Men",
    specs: {
      caseSize: "36mm",
      movement: "3230 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "explorer-ii-white",
    name: "Explorer II White",
    description: "42mm white dial with orange 24-hour hand. 3285 automatic GMT movement, designed for cave exploration.",
    price: 1360,
    originalPrice: 3200,
    image: "/products/laoli/image31.jpeg",
    images: ["/products/laoli/image31.jpeg", "/products/laoli/image32.jpeg", "/products/laoli/image33.jpeg"],
    category: "Men",
    specs: {
      caseSize: "42mm",
      movement: "3285 Automatic GMT",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "sea-dweller-red",
    name: "Sea-Dweller Single Red",
    description: "43mm professional deep dive watch with single red line. 3235 automatic movement, 1220m water resistance.",
    price: 1165,
    originalPrice: 3500,
    image: "/products/laoli/image34.webp",
    images: ["/products/laoli/image34.webp", "/products/laoli/image35.jpeg", "/products/laoli/image36.jpeg"],
    category: "Men",
    specs: {
      caseSize: "43mm",
      movement: "3235 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "1220M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "sky-dweller-blue",
    name: "Sky-Dweller Blue",
    description: "42mm annual calendar with dual-time display. 9001 automatic movement, most sophisticated complication.",
    price: 1660,
    originalPrice: 3800,
    image: "/products/laoli/image37.jpeg",
    images: ["/products/laoli/image37.jpeg", "/products/laoli/image38.jpeg", "/products/laoli/image39.jpeg"],
    category: "Men",
    specs: {
      caseSize: "42mm",
      movement: "9001 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50
  },
  {
    id: "oyster-perpetual-turquoise",
    name: "Oyster Perpetual 41 Turquoise",
    description: "41mm vibrant turquoise dial, 3230 automatic movement. Colorful expression of timeless oyster design.",
    price: 1360,
    originalPrice: 2200,
    image: "/products/laoli/image40.jpeg",
    images: ["/products/laoli/image40.jpeg", "/products/laoli/image41.jpeg", "/products/laoli/image42.jpeg"],
    category: "Unisex",
    specs: {
      caseSize: "41mm",
      movement: "3230 Automatic",
      strap: "904L Stainless Steel",
      waterResistance: "100M",
      crystal: "Sapphire",
      caseMaterial: "904L Steel"
    },
    inStock: true,
    stock: 50,
    badge: "Trending"
  },
  {
    id: "test-product-1euro",
    name: "TEST PRODUCT - DO NOT BUY",
    description: "Internal testing product for payment flow verification. Not for sale to customers.",
    price: 1,
    originalPrice: 99,
    image: "/products/laoli/image1.webp",
    images: ["/products/laoli/image1.webp"],
    category: "Test",
    specs: {
      caseSize: "Test",
      movement: "Test",
      strap: "Test",
      waterResistance: "Test",
      crystal: "Test",
      caseMaterial: "Test"
    },
    inStock: true,
    stock: 999,
    badge: "TEST"
  }
];

export const shippingRates: Record<string, { name: string; rate: number }> = {
  DE: { name: "Germany", rate: 6 },
  FR: { name: "France", rate: 6.5 },
  IT: { name: "Italy", rate: 6.5 },
  ES: { name: "Spain", rate: 6 },
  PT: { name: "Portugal", rate: 6 },
  NL: { name: "Netherlands", rate: 6.5 },
  BE: { name: "Belgium", rate: 6.5 },
  AT: { name: "Austria", rate: 7 },
  PL: { name: "Poland", rate: 7 },
  CZ: { name: "Czech Republic", rate: 8 },
  SE: { name: "Sweden", rate: 9 },
  DK: { name: "Denmark", rate: 9 },
  FI: { name: "Finland", rate: 10 },
  IE: { name: "Ireland", rate: 10 },
  GR: { name: "Greece", rate: 9 },
  HU: { name: "Hungary", rate: 7 },
  RO: { name: "Romania", rate: 7 },
  SK: { name: "Slovakia", rate: 7.5 },
  GB: { name: "United Kingdom", rate: 7 },
};

export const freeShippingThreshold = 150;

export const categories = ["Men", "Unisex", "Diver", "GMT"];
