"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "../../product/[id]/ProductDetails";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  stock: number;
  specs?: {
    caseSize?: string;
    movement?: string;
    strap?: string;
    waterResistance?: string;
    crystal?: string;
    caseMaterial?: string;
    dial?: string;
    powerReserve?: string;
    functions?: string;
  };
  inStock?: boolean;
  badge?: string;
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((p: Product) => p.id === id);
          setProduct(found || null);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <a href="/" className="text-amber-600 hover:underline">Go back to homepage</a>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
