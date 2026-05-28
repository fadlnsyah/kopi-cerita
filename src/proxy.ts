import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Route protection for admin and customer-only pages/APIs.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      );
    }

    if (token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access only' },
        { status: 403 }
      );
    }
  }

  if (pathname.startsWith('/api/cart')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      );
    }

    if (token.role === 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Customer access only' },
        { status: 403 }
      );
    }
  }

  if (pathname === '/account' || pathname.startsWith('/api/account')) {
    if (!token) {
      if (pathname === '/account') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      );
    }

    if (token.role === 'admin') {
      if (pathname === '/account') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      return NextResponse.json(
        { error: 'Forbidden - Customer access only' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/cart/:path*',
    '/account',
    '/api/account/:path*',
  ],
};
