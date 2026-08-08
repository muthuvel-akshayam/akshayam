import { NextResponse } from 'next/server';
import prisma from '@/backend/prisma';

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

    const religionNames = religions.map((r) => r.religion);

    return NextResponse.json(religionNames);
  } catch (error) {
    console.error('Error fetching religions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
