import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const religion = searchParams.get('religion');

    if (!religion) {
      return NextResponse.json({ error: 'Religion is required' }, { status: 400 });
    }

    const castes = await prisma.casteLookup.findMany({
      where: {
        religion,
      },
      select: {
        caste: true,
      },
      distinct: ['caste'],
      orderBy: {
        caste: 'asc',
      },
    });

    const casteNames = castes.map((c) => c.caste);

    return NextResponse.json(casteNames);
  } catch (error) {
    console.error('Error fetching castes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
