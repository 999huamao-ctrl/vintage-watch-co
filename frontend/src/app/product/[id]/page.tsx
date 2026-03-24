import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  images: string[];
  description?: string;
  caseMaterial?: string;
  caseDiameter?: number;
  powerReserve?: string;
  waterResistance?: string;
  sku?: string;
  weight?: number;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://horizonoo.cc";
    const res = await fetch(`${apiUrl}/api/products`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.error("API response not OK:", res.status);
      return null;
    }
    
    const data = await res.json();
    
    if (!data.success || !Array.isArray(data.data)) {
      console.error("Invalid API response format");
      return null;
    }
    
    const product = data.data.find((p: Product) => p.id === id);
    return product || null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
