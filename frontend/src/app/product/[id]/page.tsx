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

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("API response not OK:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Invalid API response format");
          setLoading(false);
          return;
        }

        const foundProduct = data.data.find((p: Product) => p.id === id);
        setProduct(foundProduct || null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
