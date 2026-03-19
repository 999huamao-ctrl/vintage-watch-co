import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
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

// 硬编码所有产品ID，确保静态导出时能生成所有页面
export async function generateStaticParams() {
  return [
    { id: 'daytona-black' },
    { id: 'submariner-black' },
    { id: 'submariner-green' },
    { id: 'submariner-no-date' },
    { id: 'gmt-pepsi' },
    { id: 'gmt-batman' },
    { id: 'gmt-sprite' },
    { id: 'datejust-41-blue' },
    { id: 'datejust-36-blue' },
    { id: 'explorer-36' },
    { id: 'explorer-ii-white' },
    { id: 'sea-dweller-red' },
    { id: 'sky-dweller-blue' },
    { id: 'oyster-perpetual-turquoise' },
  ];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
