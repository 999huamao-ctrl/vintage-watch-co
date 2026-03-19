import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true },
    });
    
    if (!product) return null;
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      originalPrice: Number(product.originalPrice) || Number(product.price) * 1.5,
      category: product.category,
      image: product.image,
      images: product.images || [product.image],
      stock: product.stock,
      specs: {
        caseSize: product.caseSize || '40mm',
        movement: product.movement || 'Automatic',
        strap: product.strap || 'Steel',
        waterResistance: product.waterResistance || '100M',
        crystal: 'Sapphire',
        caseMaterial: 'Stainless Steel'
      },
      inStock: product.stock > 0,
      badge: product.stock < 10 ? 'Hot' : undefined
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

// 允许动态参数
export const dynamicParams = true;
export const revalidate = 0;
