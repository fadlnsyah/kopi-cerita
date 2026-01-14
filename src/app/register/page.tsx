'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Register Page
 * 
 * Halaman untuk user registrasi akun baru
 */
export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error saat user mengetik
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validasi password match
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setIsLoading(false);
      return;
    }

    // Validasi panjang password
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registrasi gagal');
        return;
      }

      // Redirect ke login page setelah registrasi berhasil
      router.push('/login?registered=true');
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10" style={{ backgroundColor: '#F5EFE6' }}>
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
            Buat Akun
          </h1>
          <p style={{ color: '#5C4A3D' }}>
            Daftar untuk menikmati Kopi Cerita
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
          {/* Name */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#5C4A3D' }}
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                borderColor: '#E0D6C8', 
                backgroundColor: '#FFFDF9',
                color: '#2B2118',
              }}
              placeholder="Nama kamu"
            />
          </div>

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
              placeholder="Minimal 6 karakter"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#5C4A3D' }}
            >
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                borderColor: '#E0D6C8', 
                backgroundColor: '#FFFDF9',
                color: '#2B2118',
              }}
              placeholder="Ulangi password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center" style={{ color: '#5C4A3D' }}>
          Sudah punya akun?{' '}
          <Link 
            href="/login" 
            className="font-semibold hover:underline"
            style={{ color: '#6F4E37' }}
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
