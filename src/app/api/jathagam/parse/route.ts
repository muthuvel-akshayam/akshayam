import { NextResponse } from 'next/server';
import { supabase } from '@/backend/supabase';
import { GoogleGenAI } from '@google/genai';
import prisma from '@/backend/prisma';

export async function POST(req: Request) {
  try {
    const { jathakamUrl, userId } = await req.json();

    if (!jathakamUrl || !userId) {
      return NextResponse.json({ error: "Missing jathakamUrl or userId" }, { status: 400 });
    }

    // Since the image might be a public URL or a supabase path, we handle it:
    let base64Data = "";
    let mimeType = "image/jpeg";

    if (jathakamUrl.startsWith('http')) {
      const response = await fetch(jathakamUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      base64Data = buffer.toString('base64');
      mimeType = response.headers.get('content-type') || 'image/jpeg';
    } else {
      // It's a supabase storage path
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('user-documents')
        .download(jathakamUrl);
        
      if (downloadError || !fileData) {
        throw new Error("Failed to download image: " + downloadError?.message);
      }
      
      const buffer = Buffer.from(await fileData.arrayBuffer());
      base64Data = buffer.toString('base64');
      mimeType = fileData.type || 'image/jpeg';
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
Analyze this South Indian Jathagam chart image. Extract the planet placements for both the Rasi (ராசி) and Navamsam (நவாம்சம்) charts into a structured JSON array of 12 houses (0 to 11 clockwise starting from top-left Pisces/Meena).
Return strictly JSON with this structure:
{
  "rasi": [{ "houseIndex": 0, "planets": ["சனி", "கேது"] }, ...],
  "navamsam": [{ "houseIndex": 0, "planets": ["மாந்"] }, ...]
}
Include all 12 houses (0 to 11). If a house is empty, return an empty array for planets [].
Ensure the response is raw JSON without markdown formatting (\`\`\`json).
`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
            prompt,
            { inlineData: { data: base64Data, mimeType: mimeType } }
        ]
    });
    
    let text = response.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }

    // Clean up markdown if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(text);

    // Save the extracted JSON directly in the Prisma Profile table
    await prisma.profile.update({
        where: { userId },
        data: { jathagamData: parsedData }
    });

    return NextResponse.json({ success: true, jathagamData: parsedData });

  } catch (error: any) {
    console.error("API /jathagam/parse Error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse jathagam" }, { status: 500 });
  }
}
