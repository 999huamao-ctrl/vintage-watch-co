import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductDetails from "./ProductDetails";

// 强制使用动态渲染
export const dynamic = 'force-dynamic';

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
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || !product.isActive) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: Number(product.price),
      originalPrice: Number(product.originalPrice) || Number(product.price) * 1.5,
      category: product.category,
      image: product.image,
      images: [
        product.image,
        product.detailImage1,
        product.detailImage2,
        product.detailImage3,
        product.detailImage4,
      ].filter(Boolean),
      description: product.description,
      caseMaterial: product.caseMaterial || 'Stainless Steel',
      waterResistance: product.waterResistance,
      sku: product.sku,
      weight: product.weight ? Number(product.weight) : undefined,
    };
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
