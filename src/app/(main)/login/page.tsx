'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Login Page
 * 
 * Halaman untuk user login dengan email dan password
 */
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error saat user mengetik
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Fetch session untuk cek role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        // Jika admin, redirect ke admin login
        if (session?.user?.role === 'admin') {
          setError('Akun admin tidak bisa login di sini. Gunakan halaman Admin Login.');
          // Sign out admin
          await fetch('/api/auth/signout', { method: 'POST' });
          setIsLoading(false);
          return;
        }
        
        // User biasa redirect ke menu
        router.push('/menu');
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: '#F5EFE6' }}>
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg"
        style={{ backgroundColor: '#FFFDF9' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-2"
            style={{ color: '#2B2118' }}
          >
            Selamat Datang
          </h1>
          <p style={{ color: '#5C4A3D' }}>
            Masuk ke akun Kopi Cerita kamu
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg text-center"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#5C4A3D' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                borderColor: '#E0D6C8', 
                backgroundColor: '#FFFDF9',
                color: '#2B2118',
              }}
              placeholder="email@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#5C4A3D' }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                borderColor: '#E0D6C8', 
                backgroundColor: '#FFFDF9',
                color: '#2B2118',
              }}
              placeholder="Masukkan password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center" style={{ color: '#5C4A3D' }}>
          Belum punya akun?{' '}
          <Link 
            href="/register" 
            className="font-semibold hover:underline"
            style={{ color: '#6F4E37' }}
          >
            Daftar sekarang
          </Link>
        </p>

        {/* Admin Link */}
        <p className="mt-4 text-center text-sm" style={{ color: '#8B7355' }}>
          Admin?{' '}
          <Link 
            href="/admin/login" 
            className="hover:underline"
            style={{ color: '#6F4E37' }}
          >
            Login ke Admin Panel
          </Link>
        </p>
      </div>
    </main>
  );
}
