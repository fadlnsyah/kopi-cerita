import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth API Route Handler
 * 
 * Handles all authentication requests:
 * - GET /api/auth/session
 * - GET /api/auth/csrf
 * - GET /api/auth/providers
 * - POST /api/auth/signin
 * - POST /api/auth/signout
 * - etc.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
