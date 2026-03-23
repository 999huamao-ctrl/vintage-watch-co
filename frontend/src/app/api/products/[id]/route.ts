import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const formattedProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: Number(product.price),
      originalPrice: Number(product.originalPrice) || Number(product.price) * 1.5,
      category: product.category,
      image: product.image,
      images: [
        product.image,
        product.detailImage1,
        product.detailImage2,
        product.detailImage3,
        product.detailImage4,
      ].filter(Boolean),
      stock: product.stock,
      specs: {
        caseMaterial: product.caseMaterial || 'Stainless Steel',
        dial: product.dial || 'Black',
        movement: product.movement || 'Automatic',
        powerReserve: product.powerReserve || '72 hours',
        functions: product.functions || 'Date',
      },
      // 新增字段
      waterResistance: product.waterResistance,
      sku: product.sku,
      weight: product.weight ? Number(product.weight) : undefined,
      description: product.description,
      inStock: product.stock > 0,
      badge: product.stock < 10 ? 'Hot' : undefined
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
