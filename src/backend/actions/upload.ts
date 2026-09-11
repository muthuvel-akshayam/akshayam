'use server';

import { supabase } from '../supabase';
import sharp from 'sharp';

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const path = formData.get('path') as string;

    if (!file || !bucket || !path) {
      throw new Error('Missing file, bucket, or path');
    }

    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    // Add watermark for images in specific buckets
    if (file.type.startsWith('image/') && (bucket === 'profile-photos' || bucket === 'jathagam')) {
      try {
        const image = sharp(buffer);
        const metadata = await image.metadata();
        
        if (metadata.width && metadata.height) {
          // Adjust pattern size based on image size to ensure it looks good on different resolutions
          const patternWidth = Math.max(300, metadata.width / 4);
          const patternHeight = Math.max(250, metadata.height / 4);
          const fontSize = Math.max(32, patternWidth / 6);
          
          const svgText = `
            <svg width="${metadata.width}" height="${metadata.height}">
              <defs>
                <pattern id="watermark" x="0" y="0" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
                  <text 
                    x="50" 
                    y="${patternHeight / 2}" 
                    font-family="Arial, sans-serif" 
                    font-size="${fontSize}" 
                    font-weight="900" 
                    fill="rgba(255, 255, 255, 0.35)" 
                    stroke="rgba(0, 0, 0, 0.2)" 
                    stroke-width="1.5"
                    style="letter-spacing: 4px;"
                  >
                    AKSHAYAM
                  </text>
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#watermark)" />
            </svg>
          `;
          
          buffer = await image
            .composite([{
              input: Buffer.from(svgText),
              top: 0,
              left: 0,
            }])
            .toBuffer();
        }
      } catch (err) {
        console.error("Watermark generation error:", err);
        // Continue with original buffer if watermarking fails
      }
    }

    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(path, buffer, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error(error.message);
    }

    // Get public URL if it's the public bucket, else we just return the path
    if (bucket === 'profile-photos') {
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
      return { success: true, url: publicUrlData.publicUrl, path };
    }

    return { success: true, path };
  } catch (error: any) {
    console.error("uploadFile error:", error);
    return { success: false, error: error.message };
  }
}
