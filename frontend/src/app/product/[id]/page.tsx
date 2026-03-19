import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    // 使用 headers() 获取当前请求的 host
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const host = headersList.get("host") || "vintage-watch-co.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    
    const res = await fetch(`${baseUrl}/api/products`, { 
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
