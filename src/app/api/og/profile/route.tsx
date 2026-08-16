import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const photoUrl = searchParams.get('photo');
    const name = searchParams.get('name') || 'Profile';
    const desc = searchParams.get('desc') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f4c3a',
            backgroundImage: 'linear-gradient(to bottom right, #0f4c3a 0%, #062c20 100%)',
          }}
        >
          {photoUrl ? (
            <div style={{ display: 'flex', width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
              <img
                src={photoUrl}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
               <div style={{ width: '100%', height: '100%', background: '#062c20', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 60 }}>Akshayam</span>
               </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', width: '50%', padding: '40px 60px 40px 0', justifyContent: 'center' }}>
            <h1 style={{ fontSize: 64, fontWeight: 'bold', color: 'white', marginBottom: '20px', lineHeight: 1.1 }}>
              {name}
            </h1>
            {desc && (
              <p style={{ fontSize: 36, color: '#a7f3d0', lineHeight: 1.4, margin: 0 }}>
                {desc}
              </p>
            )}
            <div style={{ display: 'flex', marginTop: '60px' }}>
              <div style={{ background: '#dc2626', color: 'white', padding: '16px 32px', borderRadius: '16px', fontSize: 32, fontWeight: 'bold', letterSpacing: '1px' }}>
                Akshayam Matrimony
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
