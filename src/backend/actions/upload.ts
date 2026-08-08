'use server';

import { supabase } from '../supabase';

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const path = formData.get('path') as string;

    if (!file || !bucket || !path) {
      throw new Error('Missing file, bucket, or path');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
