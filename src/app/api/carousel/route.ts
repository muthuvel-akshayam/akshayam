import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export async function GET() {
  try {
    const items = await prisma.heroCarouselItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch carousel items' }, { status: 500 });
  }
}
