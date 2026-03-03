import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
