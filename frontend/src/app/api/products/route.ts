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
      description: product.description,
      price: product.price,
      originalPrice: Number(product.originalPrice) || Number(product.price) * 1.5,
      category: product.category,
      image: product.image,
      images: product.images || [product.image],
      stock: product.stock,
      caseSize: product.caseSize,
      movement: product.movement,
      strap: product.strap,
      waterResistance: product.waterResistance,
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
