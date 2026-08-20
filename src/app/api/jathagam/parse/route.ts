import { NextResponse } from 'next/server';
import { supabase } from '@/backend/supabase';
import { GoogleGenAI } from '@google/genai';
import prisma from '@/backend/prisma';

export async function POST(req: Request) {
  try {
    const { imageBase64, jathakamUrl, userId } = await req.json();
    
    let base64Data = imageBase64;

    if (!base64Data && jathakamUrl) {
      let finalUrl = jathakamUrl;
      if (!jathakamUrl.startsWith('http')) {
        const { data } = supabase.storage.from('user-documents').getPublicUrl(jathakamUrl);
        if (data && data.publicUrl) {
          finalUrl = data.publicUrl;
        } else {
          throw new Error("Could not generate public url for jathakamUrl");
        }
      }
      
      const imageRes = await fetch(finalUrl);
      if (!imageRes.ok) throw new Error("Failed to fetch image from storage");
      const arrayBuffer = await imageRes.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString('base64');
    }

    if (!base64Data) {
      throw new Error("No image data provided");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert Tamil Astrologer and Document OCR Parser.
Analyze this uploaded South Indian Jathagam (Horoscope) document image thoroughly.

Extract ALL text and astrological details dynamically into a JSON object strictly following this structure:
{
"name": string or null,
"fatherName": string or null,
"motherName": string or null,
"dateOfBirth": string or null (DD-MM-YYYY),
"timeOfBirth": string or null (HH:MM AM/PM),
"dayOfBirth": string or null (e.g., திங்கள் / Monday),
"placeOfBirth": string or null,
"rasi": string or null (e.g., சிம்மம்),
"nakshatra": string or null (e.g., உத்திரம்),
"padam": string or null (e.g., 1),
"lagnam": string or null (e.g., மீனம்),
"kulam": string or null (e.g., ஆவன் குலம் / கண்ணன் குலம்),
"kovil": string or null,
"dasaBalance": string or null (e.g., சூரியன் 5 வருடம், 10 மாதம்),
"occupation": string or null,
"monthlyIncome": string or null,
"propertyDetails": string or null,
"siblings": string or null,
"nativePlace": string or null,
"rasiChart": {
"0": ["லக்னம்"], "1": ["பு(வ)", "செ"], "2": ["சூ"], "3": ["சு(வ)"],
"4": [], "5": ["சந்"], "6": ["ரா"], "7": [], "8": [], "9": ["குரு(வ)"],
"10": ["மா"], "11": ["சனி", "கே"]
},
"navamsamChart": {
"0": ["சனி"], "1": [], "2": ["ரா"], "3": [], "4": [], "5": [],
"6": ["பு(வ)", "சு(வ)", "செ"], "7": ["குரு(வ)"], "8": [], "9": ["சந்"],
"10": ["கே"], "11": ["லக்"]
}
}
Note for chart house indices: 0 = Meenam, 1 = Mesham, 2 = Rishabam, 3 = Mithunam, 4 = Kadagam, 5 = Simmam, 6 = Kanni, 7 = Thulaam, 8 = Vrischikam, 9 = Dhanusu, 10 = Magaram, 11 = Kumbam.
Return ONLY raw JSON without markdown codeblock backticks.
`;

    let text = null;
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
        });
        text = response.text;
        break;
      } catch (err: any) {
        if (err.message?.includes('503') || err.message?.includes('UNAVAILABLE')) {
          retries--;
          if (retries === 0) throw err;
          // Wait 2 seconds before retrying
          await new Promise(r => setTimeout(r, 2000));
        } else {
          throw err;
        }
      }
    }
    
    if (!text) {
        throw new Error("No response from Gemini");
    }

    // Clean up potential markdown formatting (```json ... ```)
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(cleanText);

    // Save to database if userId is provided
    if (userId) {
      await prisma.profile.update({
        where: { userId },
        data: {
          jathagamData: parsedData,
          rasiGrid: parsedData.rasiChart || null,
          amsamGrid: parsedData.navamsamChart || null,
        }
      });
    }

    return NextResponse.json({ success: true, jathagamData: parsedData });

  } catch (error: any) {
    console.error("API /jathagam/parse Error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse jathagam" }, { status: 500 });
  }
}
