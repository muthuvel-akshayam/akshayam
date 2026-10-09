'use server';

import { supabase } from '../supabase';
import { GoogleGenAI } from '@google/genai';

export async function extractAstrologyData(jathakamPath: string) {
  try {
    // Download image from Supabase
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user-documents')
      .download(jathakamPath);
      
    if (downloadError || !fileData) {
      throw new Error("Failed to download image: " + downloadError?.message);
    }
    
    // Convert blob to base64
    const buffer = Buffer.from(await fileData.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const mimeType = fileData.type || 'image/jpeg';
    
    // Call Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
Extract the following details from this South Indian astrology chart (Jathakam) image:
1. Rasi (ராசி) and Navamsam (நவாம்சம்) planetary positions. There are two 4x4 grids.
2. Dasa Balance (திசை இருப்பு) text if present.
3. Personal details: Date of Birth (dob), Time of Birth (tob), Place of Birth (lob), Rasi (rasi), Star (nakshatra), Padam (padam), Lagnam (lagnam), and Dosham Type (dosham).

Return the result strictly as a JSON object (without markdown code blocks) with this exact structure:
{
  "rasiGrid": { "mesham": [], "rishabham": [], "mithunam": [], "kadagam": [], "simmam": [], "kanni": [], "thulam": [], "viruchigam": [], "dhanusu": [], "magaram": [], "kumbam": [], "meenam": [] },
  "amsamGrid": { "mesham": [], "rishabham": [], "mithunam": [], "kadagam": [], "simmam": [], "kanni": [], "thulam": [], "viruchigam": [], "dhanusu": [], "magaram": [], "kumbam": [], "meenam": [] },
  "dasaBalance": "extracted dasa balance string or null",
  "dob": "extracted date in DD-MM-YYYY format or null",
  "tob": "extracted time or null",
  "lob": "extracted place of birth or null",
  "nakshatra": "exact Tamil name of the star or null",
  "rasi": "exact Tamil name of the rasi or null",
  "padam": "extracted padam number or null",
  "lagnam": "exact Tamil name of the lagnam or null",
  "dosham": "NO / RAHU_KETU / SEVVAI / BOTH (if both present) or null"
}
The array for each rasi (zodiac sign) should contain the Tamil short names of planets present in that box (e.g., ["சூரி", "புத"], ["சந்"], ["லக்", "சனி"]).
If a box is empty, return an empty array.
Zodiac Mapping (Clockwise from top-left):
- Top-Left: meenam
- Top-Row (left to right): meenam, mesham, rishabham, mithunam
- Right-Column (top to bottom): mithunam, kadagam, simmam, kanni
- Bottom-Row (right to left): kanni, thulam, viruchigam, dhanusu
- Left-Column (bottom to top): dhanusu, magaram, kumbam, meenam
`;

    let response;
    let retries = 4;
    let delay = 2000;
    
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ],
            config: {
                responseMimeType: 'application/json'
            }
        });
        break;
      } catch (err: any) {
        const errMsg = err.message || '';
        if (errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('429')) {
          retries--;
          if (retries === 0) throw err;
          console.warn(`Gemini API busy (503/429). Retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(r => setTimeout(r, delay));
          delay *= 2; // Exponential backoff
        } else {
          throw err;
        }
      }
    }

    const resultText = response.text;
    if (!resultText) {
        throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(resultText);

    return { success: true, data: parsedData };
    
  } catch (error: any) {
    console.error("extractAstrologyData error:", error);
    return { success: false, error: error.message };
  }
}
