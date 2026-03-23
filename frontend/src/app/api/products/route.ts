import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? {
          category: category === 'women'
            ? { in: ['Lady-Datejust', 'Pearlmaster'] }
            : { notIn: ['Lady-Datejust', 'Pearlmaster'] }
        } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProducts = products.map(product => ({
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
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedProducts,
      count: formattedProducts.length 
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
