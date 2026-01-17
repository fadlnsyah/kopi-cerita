'use client';

/**
 * Empty State Components dengan Ilustrasi SVG
 * 
 * Komponen untuk menampilkan state kosong dengan ilustrasi menarik
 */

import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

// Ilustrasi Cart Kosong
function CartIllustration() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="mx-auto">
      {/* Background Circle */}
      <circle cx="100" cy="100" r="80" fill="#EBE4D8" />
      
      {/* Cart Body */}
      <path
        d="M60 80 L70 140 C70 145 75 150 80 150 L130 150 C135 150 140 145 140 140 L150 80 Z"
        fill="#FFFDF9"
        stroke="#6F4E37"
        strokeWidth="3"
      />
      
      {/* Cart Handle */}
      <path
        d="M55 80 L45 60"
        stroke="#6F4E37"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Cart Lines */}
      <line x1="75" y1="100" x2="135" y2="100" stroke="#E0D6C8" strokeWidth="2" strokeLinecap="round" />
      <line x1="77" y1="115" x2="133" y2="115" stroke="#E0D6C8" strokeWidth="2" strokeLinecap="round" />
      <line x1="79" y1="130" x2="131" y2="130" stroke="#E0D6C8" strokeWidth="2" strokeLinecap="round" />
      
      {/* Sad Face */}
      <circle cx="90" cy="110" r="3" fill="#8B7355" />
      <circle cx="120" cy="110" r="3" fill="#8B7355" />
      <path d="M95 130 Q105 120 115 130" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" fill="none" />
      
      {/* Floating Items */}
      <g className="animate-bounce" style={{ animationDuration: '3s' }}>
        <circle cx="160" cy="60" r="15" fill="#D4A574" opacity="0.5" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        <circle cx="45" cy="70" r="10" fill="#7A8450" opacity="0.4" />
      </g>
    </svg>
  );
}

// Ilustrasi Order Kosong
function OrderIllustration() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="mx-auto">
      {/* Background Circle */}
      <circle cx="100" cy="100" r="80" fill="#EBE4D8" />
      
      {/* Receipt */}
      <rect x="60" y="50" width="80" height="110" rx="5" fill="#FFFDF9" stroke="#6F4E37" strokeWidth="3" />
      
      {/* Receipt Lines */}
      <line x1="75" y1="75" x2="125" y2="75" stroke="#E0D6C8" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="90" x2="115" y2="90" stroke="#E0D6C8" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="105" x2="120" y2="105" stroke="#E0D6C8" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="120" x2="105" y2="120" stroke="#E0D6C8" strokeWidth="3" strokeLinecap="round" />
      
      {/* Coffee Cup on Receipt */}
      <ellipse cx="100" cy="145" rx="20" ry="5" fill="#D4A574" opacity="0.5" />
      
      {/* Question Mark */}
      <text x="100" y="100" textAnchor="middle" fill="#8B7355" fontSize="40" fontWeight="bold" opacity="0.3">?</text>
      
      {/* Floating Coffee Bean */}
      <g className="animate-bounce" style={{ animationDuration: '3s' }}>
        <ellipse cx="155" cy="65" rx="12" ry="18" fill="#6F4E37" opacity="0.4" />
      </g>
    </svg>
  );
}

// Ilustrasi Wishlist Kosong
function WishlistIllustration() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="mx-auto">
      {/* Background Circle */}
      <circle cx="100" cy="100" r="80" fill="#FEE2E2" />
      
      {/* Heart Outline */}
      <path
        d="M100 160 L50 110 C30 90 30 60 55 50 C80 40 100 60 100 80 C100 60 120 40 145 50 C170 60 170 90 150 110 Z"
        fill="none"
        stroke="#DC2626"
        strokeWidth="4"
        strokeDasharray="8 4"
        opacity="0.5"
      />
      
      {/* Small Hearts */}
      <g className="animate-bounce" style={{ animationDuration: '2s' }}>
        <path d="M160 60 L155 55 C152 52 152 47 155 45 C158 43 162 45 162 48 C162 45 166 43 169 45 C172 47 172 52 169 55 Z" fill="#DC2626" opacity="0.6" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
        <path d="M45 75 L42 72 C40 70 40 67 42 66 C44 65 47 66 47 68 C47 66 50 65 52 66 C54 67 54 70 52 72 Z" fill="#DC2626" opacity="0.4" />
      </g>
      
      {/* Dotted Line */}
      <path d="M70 100 L130 100" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
    </svg>
  );
}

// Ilustrasi Search No Results
function SearchIllustration() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="mx-auto">
      {/* Background Circle */}
      <circle cx="100" cy="100" r="80" fill="#EBE4D8" />
      
      {/* Magnifying Glass */}
      <circle cx="90" cy="90" r="35" fill="#FFFDF9" stroke="#6F4E37" strokeWidth="4" />
      <line x1="115" y1="115" x2="145" y2="145" stroke="#6F4E37" strokeWidth="6" strokeLinecap="round" />
      
      {/* X Mark inside */}
      <line x1="75" y1="75" x2="105" y2="105" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="105" y1="75" x2="75" y2="105" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      
      {/* Coffee Beans */}
      <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
        <ellipse cx="50" cy="60" rx="8" ry="12" fill="#6F4E37" opacity="0.3" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}>
        <ellipse cx="155" cy="75" rx="6" ry="10" fill="#8B6B47" opacity="0.3" />
      </g>
    </svg>
  );
}

// Main Empty State Component
export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 animate-fade-in-up">
      <h2
        className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4"
        style={{ color: '#2B2118' }}
      >
        {title}
      </h2>
      <p className="mb-8 max-w-md mx-auto" style={{ color: '#5C4A3D' }}>
        {description}
      </p>
      {(actionLabel && actionHref) && (
        <Link
          href={actionHref}
          className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg"
          style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction) && (
        <button
          onClick={onAction}
          className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg"
          style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Pre-built Empty States
export function EmptyCart() {
  return (
    <div className="text-center py-12 animate-fade-in-up">
      <CartIllustration />
      <h2
        className="font-[family-name:var(--font-heading)] text-2xl font-bold mt-6 mb-4"
        style={{ color: '#2B2118' }}
      >
        Keranjang Kosong
      </h2>
      <p className="mb-8 max-w-md mx-auto" style={{ color: '#5C4A3D' }}>
        Belum ada produk di keranjang kamu. Yuk, jelajahi menu dan temukan kopi favoritmu!
      </p>
      <Link
        href="/menu"
        className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
      >
        Jelajahi Menu
      </Link>
    </div>
  );
}

export function EmptyOrders() {
  return (
    <div className="text-center py-12 animate-fade-in-up">
      <OrderIllustration />
      <h2
        className="font-[family-name:var(--font-heading)] text-2xl font-bold mt-6 mb-4"
        style={{ color: '#2B2118' }}
      >
        Belum Ada Pesanan
      </h2>
      <p className="mb-8 max-w-md mx-auto" style={{ color: '#5C4A3D' }}>
        Kamu belum pernah melakukan pemesanan. Pesan kopi pertamamu sekarang!
      </p>
      <Link
        href="/menu"
        className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
      >
        Mulai Belanja
      </Link>
    </div>
  );
}

export function EmptyWishlist() {
  return (
    <div className="text-center py-12 animate-fade-in-up">
      <WishlistIllustration />
      <h2
        className="font-[family-name:var(--font-heading)] text-2xl font-bold mt-6 mb-4"
        style={{ color: '#2B2118' }}
      >
        Wishlist Kosong
      </h2>
      <p className="mb-8 max-w-md mx-auto" style={{ color: '#5C4A3D' }}>
        Kamu belum menyimpan produk favorit. Klik icon ❤️ di produk untuk menambahkannya.
      </p>
      <Link
        href="/menu"
        className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
      >
        Jelajahi Menu
      </Link>
    </div>
  );
}

export function EmptySearchResults({ query }: { query?: string }) {
  return (
    <div className="text-center py-12 animate-fade-in-up">
      <SearchIllustration />
      <h2
        className="font-[family-name:var(--font-heading)] text-2xl font-bold mt-6 mb-4"
        style={{ color: '#2B2118' }}
      >
        Tidak Ada Hasil
      </h2>
      <p className="mb-8 max-w-md mx-auto" style={{ color: '#5C4A3D' }}>
        {query 
          ? `Tidak ditemukan produk untuk "${query}". Coba kata kunci lain.`
          : 'Tidak ada produk yang sesuai dengan filter kamu.'}
      </p>
    </div>
  );
}
