import { NextResponse } from 'next/server';

function isForbiddenHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  // Block localhost and internal names
  if (
    lower === 'localhost' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.endsWith('.localhost')
  ) {
    return true;
  }

  // IPv4 checks
  const ipv4Match = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [_, a, b] = ipv4Match.map(Number);
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (Private)
    if (a === 10) return true;
    // 172.16.0.0/12 (Private)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (Link-local / Cloud metadata service)
    if (a === 169 && b === 254) return true;
    // 0.0.0.0/8
    if (a === 0) return true;
  }

  // IPv6 loopback
  if (lower === '::1' || lower === '[::1]' || lower === '::' || lower === '[::]') {
    return true;
  }

  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);

    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return new NextResponse('Invalid protocol', { status: 400 });
    }

    // SSRF Protection: forbid private/internal addresses
    if (isForbiddenHost(parsed.hostname)) {
      return new NextResponse('Forbidden target host', { status: 403 });
    }

    const res = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!res.ok) {
      return new NextResponse('Failed to fetch remote asset', { status: res.status });
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Target resource is not an image', { status: 400 });
    }

    const blob = await res.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*', // Crucial for html-to-image / html2canvas CORS
      },
    });
  } catch (error) {
    console.error('Image proxy failed:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
