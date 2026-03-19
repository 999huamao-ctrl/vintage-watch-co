import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    // SSR 模式下使用相对 URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/products`, { 
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.success) return null;
    
    return data.data.find((p: any) => p.id === id) || null;
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

// 允许动态参数，不预生成
export const dynamicParams = true;
