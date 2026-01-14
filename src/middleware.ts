import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware untuk proteksi routes
 * 
 * - Admin routes (/admin/*) hanya bisa diakses admin
 * - Admin API (/api/admin/*) hanya bisa diakses admin
 * - User API (/api/cart, etc) hanya bisa diakses user biasa (bukan admin)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token/session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // === ADMIN ROUTES ===
  // Jika mengakses /admin/* (kecuali /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Jika belum login, redirect ke admin login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Jika bukan admin, redirect ke homepage
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // === ADMIN API ROUTES ===
  // Jika mengakses /api/admin/*, harus admin
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

  // === USER API ROUTES ===
  // Cart API hanya untuk user biasa (customer)
  if (pathname.startsWith('/api/cart')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      );
    }
    
    // Admin tidak boleh akses cart API
    if (token.role === 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Customer access only' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

// Specify which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/cart/:path*',
  ],
};
