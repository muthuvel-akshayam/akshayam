import { NextResponse } from "next/server";
import prisma from "@/backend/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch active profiles for females and males that are marked as featured
    const [femaleProfiles, maleProfiles] = await Promise.all([
      prisma.profile.findMany({
        where: { gender: "FEMALE" },
        include: { educations: true },
        take: 12,
      }),
      prisma.profile.findMany({
        where: { gender: "MALE" },
        include: { educations: true },
        take: 12,
      }),
    ]);

    // Shuffle arrays for random display
    const shuffle = (array: any[]) => array.sort(() => 0.5 - Math.random());

    let finalBrides = femaleProfiles;
    let finalGrooms = maleProfiles;

    // Fallback dummy data if DB is empty for demonstration
    if (finalBrides.length === 0 && finalGrooms.length === 0) {
      const dummyBride = {
        id: 'dummy-bride',
        displayId: 'AK1001',
        name: 'ரம்யா',
        gender: 'FEMALE',
        dob: new Date('1998-05-10'),
        educations: [{ degree: 'B.E Computer Science' }],
        rasi: 'கன்னி',
        nakshatra: 'அஸ்தம்',
        dosham: 'சுத்த ஜாதகம்',
        city: 'கோயம்புத்தூர்',
        photoUrl: null, // will trigger lock/placeholder
        hidePhoto: true,
      };
      
      const dummyGroom = {
        id: 'dummy-groom',
        displayId: 'AK2001',
        name: 'கார்த்திக்',
        gender: 'MALE',
        dob: new Date('1996-08-15'),
        educations: [{ degree: 'M.B.A' }],
        rasi: 'சிம்மம்',
        nakshatra: 'மகம்',
        dosham: 'ராகு கேது தோஷம்',
        city: 'ஈரோடு',
        photoUrl: null,
        hidePhoto: false,
      };

      finalBrides = [dummyBride, { ...dummyBride, id: 'b2', name: 'சங்கீதா', city: 'திருப்பூர்' }, { ...dummyBride, id: 'b3', name: 'பிரியா', city: 'சேலம்' }];
      finalGrooms = [dummyGroom, { ...dummyGroom, id: 'g2', name: 'அரவிந்த்', city: 'கரூர்' }, { ...dummyGroom, id: 'g3', name: 'சூர்யா', city: 'சென்னை' }];
    }

    return NextResponse.json({
      success: true,
      brides: shuffle(finalBrides),
      grooms: shuffle(finalGrooms),
    });
  } catch (error: any) {
    console.error("API CRASHED:", error);
    return NextResponse.json({ success: false, error: String(error), brides: [], grooms: [] });
  }
}
