'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';

/**
 * Login Modal Component
 * 
 * Modal popup untuk login/register dengan form yang sama seperti halaman login
 */
export default function LoginModal() {
  const router = useRouter();
  const { isLoginModalOpen, hideLoginModal, pendingAction } = useAuthModal();
  const [isLogin, setIsLogin] = useState(true); // Toggle antara login dan register
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isLoginModalOpen) {
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setError('');
      setIsLogin(true);
    }
  }, [isLoginModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
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
        hideLoginModal();
        router.refresh();
        
        // Jalankan pending action jika ada
        if (pendingAction) {
          setTimeout(() => pendingAction(), 100);
        }
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setIsLoading(false);
      return;
    }

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

      // Auto login setelah register
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.error) {
        // Jika auto login gagal, suruh login manual
        setIsLogin(true);
        setError('Registrasi berhasil! Silakan login.');
      } else {
        hideLoginModal();
        router.refresh();
        
        if (pendingAction) {
          setTimeout(() => pendingAction(), 100);
        }
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoginModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) hideLoginModal();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeIn"
        style={{ backgroundColor: '#FFFDF9' }}
      >
        {/* Close Button */}
        <button
          onClick={hideLoginModal}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-[#F5EFE6]"
          style={{ color: '#5C4A3D' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 
            className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2"
            style={{ color: '#2B2118' }}
          >
            {isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru'}
          </h2>
          <p style={{ color: '#5C4A3D' }}>
            {isLogin ? 'Masuk untuk melanjutkan belanja' : 'Daftar untuk mulai memesan'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-3 rounded-lg text-center text-sm"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {/* Name (only for register) */}
          {!isLogin && (
            <div>
              <label 
                htmlFor="modal-name" 
                className="block text-sm font-medium mb-1"
                style={{ color: '#5C4A3D' }}
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="modal-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: '#E0D6C8', 
                  backgroundColor: '#FFFDF9',
                  color: '#2B2118',
                }}
                placeholder="Nama kamu"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label 
              htmlFor="modal-email" 
              className="block text-sm font-medium mb-1"
              style={{ color: '#5C4A3D' }}
            >
              Email
            </label>
            <input
              type="email"
              id="modal-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
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
              htmlFor="modal-password" 
              className="block text-sm font-medium mb-1"
              style={{ color: '#5C4A3D' }}
            >
              Password
            </label>
            <input
              type="password"
              id="modal-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{ 
                borderColor: '#E0D6C8', 
                backgroundColor: '#FFFDF9',
                color: '#2B2118',
              }}
              placeholder={isLogin ? 'Masukkan password' : 'Minimal 6 karakter'}
            />
          </div>

          {/* Confirm Password (only for register) */}
          {!isLogin && (
            <div>
              <label 
                htmlFor="modal-confirmPassword" 
                className="block text-sm font-medium mb-1"
                style={{ color: '#5C4A3D' }}
              >
                Konfirmasi Password
              </label>
              <input
                type="password"
                id="modal-confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: '#E0D6C8', 
                  backgroundColor: '#FFFDF9',
                  color: '#2B2118',
                }}
                placeholder="Ulangi password"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
          >
            {isLoading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="mt-4 text-center text-sm" style={{ color: '#5C4A3D' }}>
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="font-semibold hover:underline"
            style={{ color: '#6F4E37' }}
          >
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </button>
        </p>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
