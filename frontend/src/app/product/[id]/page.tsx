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

// 为了静态生成，我们需要知道所有产品ID
export async function generateStaticParams() {
  // 构建时不预生成任何页面，全部使用 SSR
  // 避免构建时 API 未运行导致的错误
  return [];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
