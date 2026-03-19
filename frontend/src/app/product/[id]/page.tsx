"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  stock: number;
  specs: {
    caseSize: string;
    movement: string;
    strap: string;
    waterResistance: string;
    crystal: string;
    caseMaterial: string;
  };
  inStock: boolean;
  badge?: string;
}

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((p: Product) => p.id === id);
          if (found) {
            setProduct(found);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(true);
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

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you are looking for does not exist.</p>
          <a href="/" className="text-amber-600 hover:underline">Go back to homepage</a>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
