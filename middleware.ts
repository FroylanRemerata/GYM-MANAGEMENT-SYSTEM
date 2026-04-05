import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware - runs on every request
 * Uncomment and configure as needed
 */

export function middleware(request: NextRequest) {
  // Add custom headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Log request (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configure which routes use this middleware
 * Edit the matcher array to include/exclude routes
 */
export const config = {
  matcher: [
    // Match all except static files and _next
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
