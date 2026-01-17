'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useOrderNotification } from '@/hooks/useOrderNotification';

/**
 * Admin Layout
 * 
 * Layout khusus untuk halaman admin dengan:
 * - Sidebar navigation dengan badge notifikasi
 * - Auth check (redirect jika bukan admin)
 * - Toast notification untuk order baru
 * - Coffee theme (warna coklat)
 */

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'chart' },
  { href: '/admin/products', label: 'Produk', icon: 'box' },
  { href: '/admin/orders', label: 'Pesanan', icon: 'cart', showBadge: true },
  { href: '/admin/settings', label: 'Pengaturan', icon: 'settings' },
];

function NavIcon({ type }: { type: string }) {
  switch (type) {
    case 'chart':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'box':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'cart':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'settings':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Order notification hook
  const { pendingCount, hasNewOrder, dismissNotification } = useOrderNotification();

  // Jika di halaman login admin, render children langsung tanpa layout
  const isLoginPage = pathname === '/admin/login';

  // Check if user is admin (skip untuk halaman login)
  useEffect(() => {
    if (isLoginPage) return; // Skip auth check untuk login page
    if (status === 'loading') return;

    if (!session) {
      router.push('/admin/login'); // Redirect ke admin login, bukan user login
      return;
    }

    if (session.user?.role !== 'admin') {
      router.push('/'); // Non-admin redirect ke homepage
      return;
    }
  }, [session, status, router, isLoginPage]);

  // Jika halaman login, render tanpa layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">☕</div>
          <div style={{ color: '#5C4A3D' }}>Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex font-[family-name:var(--font-body)]" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Toast Notification for New Order */}
      {hasNewOrder && (
        <div 
          className="fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce"
          style={{ backgroundColor: '#22C55E', color: '#FFFDF9' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div>
            <p className="font-bold">Pesanan Baru!</p>
            <p className="text-sm">Ada pesanan baru masuk</p>
          </div>
          <button
            onClick={dismissNotification}
            className="ml-2 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full transition-all duration-300 z-40 shadow-lg ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
        style={{ backgroundColor: '#2B2118' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: '#3D3027' }}>
          {isSidebarOpen && (
            <Link href="/admin" className="text-xl font-bold font-[family-name:var(--font-heading)]" style={{ color: '#FFFDF9' }}>
              ☕ Admin
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg transition-colors hover:bg-[#3D3027]"
            style={{ color: '#A89585' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'} />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative"
                style={{ 
                  color: isActive ? '#FFFDF9' : '#E0D6C8',
                  backgroundColor: isActive ? '#6F4E37' : 'transparent',
                }}
              >
                <NavIcon type={item.icon} />
                {isSidebarOpen && <span>{item.label}</span>}
                
                {/* Badge for Pending Orders */}
                {item.showBadge && pendingCount > 0 && (
                  <span 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                    style={{ backgroundColor: '#F59E0B', color: '#FFFDF9' }}
                  >
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-900/30"
            style={{ color: '#E57373' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-6 border-b shadow-sm"
          style={{ backgroundColor: '#FFFDF9', borderColor: '#E0D6C8' }}
        >
          <h1 className="text-lg font-semibold font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>
            Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            {pendingCount > 0 && (
              <Link 
                href="/admin/orders" 
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="#6F4E37" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: '#F59E0B', color: '#FFFDF9' }}
                >
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              </Link>
            )}
            <span style={{ color: '#5C4A3D' }}>{session.user?.name}</span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#6F4E37' }}
            >
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
