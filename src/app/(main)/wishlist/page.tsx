'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { CoffeeCupIcon } from '@/components/Icons';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isPopular: boolean;
  isNew: boolean;
  discountPercent?: number | null;
}

export default function WishlistPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect jika belum login
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, router]);

  // Fetch wishlist
  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchWishlist();
    }
  }, [authStatus]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (authStatus === 'loading' || isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <div className="text-center py-16">
            <div 
              className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" 
              style={{ borderColor: '#6F4E37', borderTopColor: 'transparent' }}
            />
            <p className="mt-4" style={{ color: '#5C4A3D' }}>Memuat wishlist...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <p 
            className="font-semibold tracking-widest uppercase text-sm mb-3 flex items-center justify-center gap-2"
            style={{ color: '#DC2626' }}
          >
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#DC2626' }}></span>
            Favorit
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#DC2626' }}></span>
          </p>
          <h1 
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#2B2118' }}
          >
            Wishlist Kamu
          </h1>
          <p style={{ color: '#5C4A3D' }}>
            Produk favorit yang sudah kamu simpan
          </p>
        </div>

        {/* Wishlist Products */}
        {products.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <svg className="w-12 h-12" fill="none" stroke="#DC2626" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </div>
            <h2 
              className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4"
              style={{ color: '#2B2118' }}
            >
              Wishlist Kosong
            </h2>
            <p className="mb-8" style={{ color: '#5C4A3D' }}>
              Kamu belum menyimpan produk favorit. Klik icon ❤️ di produk untuk menambahkannya.
            </p>
            <Link
              href="/menu"
              className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Jelajahi Menu
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center mb-8" style={{ color: '#5C4A3D' }}>
              <strong style={{ color: '#6F4E37' }}>{products.length}</strong> produk di wishlist
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
