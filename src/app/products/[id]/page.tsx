"use client";

// 多图功能已启用 - 2026-03-25
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "./ProductDetails";
import Navbar from "@/components/Navbar";

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
  waterResistance?: string;
  sku?: string;
  weight?: number;
  stock: number;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const id = params?.id as string;
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setProduct(null);
          } else {
            setError(`Failed to load product: ${res.status}`);
          }
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
