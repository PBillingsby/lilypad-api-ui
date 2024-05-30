import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Access-Control-Allow-Credentials', 'true');
  requestHeaders.set('Access-Control-Allow-Origin', '*');
  requestHeaders.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  requestHeaders.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Authorization'
  );

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      headers: requestHeaders,
      status: 200,
    });
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
