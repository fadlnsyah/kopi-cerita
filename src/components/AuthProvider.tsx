'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * AuthProvider Component
 * 
 * Wrapper untuk SessionProvider dari NextAuth
 * Harus client component karena menggunakan React Context
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
