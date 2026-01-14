import 'next-auth';
import { DefaultSession } from 'next-auth';

/**
 * Type Augmentation untuk NextAuth
 * 
 * Menambahkan field custom ke User dan Session
 */
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
