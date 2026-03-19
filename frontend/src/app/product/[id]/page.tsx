import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    // 在服务端直接调用数据库或使用绝对URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
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
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    
    if (!data.success) return [];
    
    return data.data.map((product: any) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
