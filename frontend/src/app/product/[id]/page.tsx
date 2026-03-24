import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    // 使用相对路径或环境变量
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://horizonoo.cc';
    
    const res = await fetch(`${baseUrl}/api/products`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
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

// 强制使用 SSR，在请求时动态获取产品数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;
