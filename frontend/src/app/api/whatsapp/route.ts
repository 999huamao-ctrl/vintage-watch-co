import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all active WhatsApp links
    const links = await prisma.whatsAppLink.findMany({
      where: { isActive: true },
    });

    if (links.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active WhatsApp links found' },
        { status: 404 }
      );
    }

    // Randomly select one link
    const randomLink = links[Math.floor(Math.random() * links.length)];

    return NextResponse.json({
      success: true,
      data: {
        id: randomLink.id,
        name: randomLink.name,
        url: randomLink.url,
      },
    });
  } catch (error) {
    console.error('Failed to fetch WhatsApp link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch WhatsApp link' },
      { status: 500 }
    );
  }
}
