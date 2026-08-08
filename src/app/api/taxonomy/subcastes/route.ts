import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { SUB_CASTE_OPTIONS } from '@/constants/demographics';

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

    if (!subcastes || subcastes.length === 0) {
      console.warn('Database returned no subcastes, using fallback.');
      return NextResponse.json(SUB_CASTE_OPTIONS);
    }

    const subcasteNames = subcastes.map((s) => s.subcaste);
    return NextResponse.json(subcasteNames);
  } catch (error) {
    console.warn('Database connection failed, returning fallback subcastes:', error);
    return NextResponse.json(SUB_CASTE_OPTIONS, { status: 200 });
  }
}
