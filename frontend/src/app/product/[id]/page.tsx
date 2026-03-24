"use client";

import { useEffect, useState } from "react";
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

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/products`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const found = data.data.find((p: Product) => p.id === id);
            setProduct(found || null);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
