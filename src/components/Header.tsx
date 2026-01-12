'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

/**
 * Header Component - Kopi Cerita
 * 
 * Features:
 * - Sticky header yang transparan, lalu berubah solid saat scroll
 * - Logo di kiri
 * - Navigation links di tengah/kanan
 * - Cart icon dengan badge
 * - Mobile hamburger menu
 */

const navLinks = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'Tentang' },
  { href: '/contact', label: 'Kontak' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  // Detect scroll untuk mengubah style header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isScrolled ? 'rgba(245, 239, 230, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        boxShadow: isScrolled ? '0 2px 10px rgba(43, 33, 24, 0.08)' : 'none',
      }}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-[family-name:var(--font-heading)] text-2xl font-bold transition-colors duration-300"
            style={{ color: '#2B2118' }}
          >
            Kopi Cerita
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium transition-colors duration-300 hover:opacity-70"
                style={{ color: '#5C4A3D' }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg transition-colors duration-300 hover:bg-[#EBE4D8]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#5C4A3D" strokeWidth="1.5">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {totalItems > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* CTA Button */}
            <Link
              href="/menu"
              className="px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Pesan
            </Link>
          </div>

          {/* Mobile Right Section */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#5C4A3D" strokeWidth="1.5">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {totalItems > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg transition-colors duration-300"
              style={{ color: '#2B2118' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-80 pb-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t" style={{ borderColor: '#E0D6C8' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium py-2 transition-colors duration-300"
                style={{ color: '#5C4A3D' }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile CTA Button */}
            <Link
              href="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-3 font-semibold rounded-lg text-center transition-all duration-300 mt-2"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
