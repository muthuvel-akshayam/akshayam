import { NextRequest, NextResponse } from 'next/server';
import { getProfileById } from '@/backend/actions/matches';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('Missing id', { status: 400 });
    }

    const profileData = await getProfileById(id);
    const photoUrl = profileData?.profile?.photoUrl;

    if (!photoUrl) {
      // Fallback to logo if no photo
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.akshayamtamilmatrimony.com';
      return NextResponse.redirect(`${baseUrl}/akshayam_logo.png`);
    }

    // Convert to Supabase render API with required transformations
    let renderUrl = photoUrl;
    if (renderUrl.includes('.supabase.co/storage/v1/object/public/')) {
      renderUrl = renderUrl.replace('/object/public/', '/render/image/public/');
      // Append query parameters internally. WhatsApp scraper won't see these and can't strip them!
      renderUrl += '?width=1200&height=630&resize=contain';
    }

    // Fetch the transformed image directly from Supabase
    const res = await fetch(renderUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/jpeg, image/png, image/webp, */*',
      }
    });

    if (!res.ok) {
      throw new Error(`Supabase returned ${res.status}`);
    }

    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new NextResponse('Error generating image', { status: 500 });
  }
}
