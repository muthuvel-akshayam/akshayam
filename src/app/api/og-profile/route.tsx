import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const photoUrl = searchParams.get('photoUrl');

    if (!photoUrl) {
      return new Response('Missing photoUrl', { status: 400 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#faf8f5', // Akshayam light background
          }}
        >
          {/* Blurred background layer */}
          <img
            src={photoUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(40px)',
              opacity: 0.5,
            }}
          />
          {/* Main portrait image properly contained */}
          <img
            src={photoUrl}
            style={{
              position: 'relative',
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
