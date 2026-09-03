import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.mediaUrl) {
      return NextResponse.json({ success: false, error: 'Media URL is required' }, { status: 400 });
    }

    const newItem = await prisma.heroCarouselItem.create({
      data: {
        mediaUrl: data.mediaUrl,
        type: data.type || 'IMAGE',
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error creating carousel item:', error);
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const updatedItem = await prisma.heroCarouselItem.update({
      where: { id: data.id },
      data: {
        mediaUrl: data.mediaUrl,
        type: data.type,
        order: data.order,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating carousel item:', error);
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    await prisma.heroCarouselItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting carousel item:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}
