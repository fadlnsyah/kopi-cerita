import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

/**
 * NextAuth Configuration
 * 
 * Menggunakan Credentials Provider untuk autentikasi email + password
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validasi input
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('Email tidak terdaftar');
        }

        // Verifikasi password
        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Password salah');
        }

        // Return user object (tanpa password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  
  // Konfigurasi session
  session: {
    strategy: 'jwt',
    maxAge: 60, // 1 menit - session akan expire dan user harus login ulang
  },

  // Konfigurasi JWT
  jwt: {
    maxAge: 60, // 1 menit - token akan expire
  },

  // Custom pages
  pages: {
    signIn: '/login',
    error: '/login', // Redirect ke login page jika error
  },

  // Callbacks untuk menambah data ke token dan session
  callbacks: {
    async jwt({ token, user }) {
      // Saat login, tambahkan data user ke token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Tambahkan data dari token ke session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  // Secret untuk enkripsi
  secret: process.env.NEXTAUTH_SECRET,

  // Debug mode (hanya di development)
  debug: process.env.NODE_ENV === 'development',
};
