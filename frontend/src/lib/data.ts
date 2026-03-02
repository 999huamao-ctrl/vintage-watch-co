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
}

export const products: Product[] = [
  {
    id: "heritage-42",
    name: "The Heritage 42",
    description: "A timeless vintage dress watch featuring a 42mm case, automatic movement, and genuine leather strap. Perfect for the modern gentleman who appreciates classic design.",
    price: 79,
    image: "/products/heritage-42.jpg",
    category: "Dress Watches",
    specs: {
      caseSize: "42mm",
      movement: "Automatic mechanical",
      strap: "Genuine leather",
      waterResistance: "3ATM",
      crystal: "Mineral glass"
    },
    inStock: true
  },
  {
    id: "classic-chrono",
    name: "The Classic Chrono",
    description: "A sophisticated vintage chronograph featuring precise quartz movement and stainless steel construction. The perfect blend of retro style and modern reliability.",
    price: 89,
    image: "/products/classic-chrono.jpg",
    category: "Chronographs",
    specs: {
      caseSize: "40mm",
      movement: "Quartz chronograph",
      strap: "Stainless steel bracelet",
      waterResistance: "5ATM",
      crystal: "Mineral glass"
    },
    inStock: true
  },
  {
    id: "minimalist",
    name: "The Minimalist",
    description: "Embrace timeless simplicity with this elegant minimalist watch. Clean lines, refined details, and a comfortable mesh band make it the perfect everyday companion.",
    price: 69,
    image: "/products/minimalist.jpg",
    category: "Minimalist",
    specs: {
      caseSize: "38mm",
      movement: "Japanese quartz",
      strap: "Milanese mesh band",
      waterResistance: "3ATM",
      crystal: "Mineral glass"
    },
    inStock: true
  }
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
