import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const caste = searchParams.get('caste');

    if (!caste) {
      return NextResponse.json({ error: 'Caste is required' }, { status: 400 });
    }

    const subcastes = await prisma.casteLookup.findMany({
      where: {
        caste,
      },
      select: {
        subcaste: true,
      },
      distinct: ['subcaste'],
      orderBy: {
        subcaste: 'asc',
      },
    });

    const subcasteNames = subcastes.map((s) => s.subcaste);

    return NextResponse.json(subcasteNames);
  } catch (error) {
    console.error('Error fetching subcastes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
