import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';
import { RELIGION_OPTIONS } from '@/constants/demographics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const religions = await prisma.casteLookup.findMany({
      select: {
        religion: true,
      },
      distinct: ['religion'],
      orderBy: {
        religion: 'asc',
      },
    });

    if (!religions || religions.length === 0) {
      console.warn('Database returned no religions, using fallback.');
      return NextResponse.json(RELIGION_OPTIONS);
    }

    const religionNames = religions.map((r) => r.religion);
    return NextResponse.json(religionNames);
  } catch (error) {
    console.warn('Database connection failed, returning fallback religions:', error);
    return NextResponse.json(RELIGION_OPTIONS, { status: 200 });
  }
}
