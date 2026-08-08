import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { CASTE_OPTIONS } from '@/constants/demographics';

export const dynamic = 'force-dynamic';

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

    if (!castes || castes.length === 0) {
      console.warn('Database returned no castes, using fallback.');
      return NextResponse.json(CASTE_OPTIONS);
    }

    const casteNames = castes.map((c) => c.caste);
    return NextResponse.json(casteNames);
  } catch (error) {
    console.warn('Database connection failed, returning fallback castes:', error);
    return NextResponse.json(CASTE_OPTIONS, { status: 200 });
  }
}
