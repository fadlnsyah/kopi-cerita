'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Admin Login Page
 * 
 * Halaman login khusus untuk admin - terpisah dari user
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
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
        setIsLoading(false);
        return;
      }

      // Fetch session untuk cek role
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();

      // Pastikan user adalah admin
      if (session?.user?.role !== 'admin') {
        setError('Akun ini bukan admin. Gunakan halaman login user.');
        // Sign out user non-admin
        await fetch('/api/auth/signout', { method: 'POST' });
        setIsLoading(false);
        return;
      }

      // Redirect ke admin dashboard
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#2B2118' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#FFFDF9' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">☕</div>
          <h1 
            className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2"
            style={{ color: '#2B2118' }}
          >
            Admin Login
          </h1>
          <p style={{ color: '#5C4A3D' }}>
            Masuk ke Admin Panel Kopi Cerita
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg text-center text-sm"
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
              Email Admin
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
              placeholder="admin@kopicerita.com"
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
            {isLoading ? 'Memproses...' : 'Masuk ke Admin'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm" style={{ color: '#8B7355' }}>
          Bukan admin?{' '}
          <a 
            href="/login" 
            className="font-semibold hover:underline"
            style={{ color: '#6F4E37' }}
          >
            Login sebagai user
          </a>
        </p>
      </div>
    </main>
  );
}
