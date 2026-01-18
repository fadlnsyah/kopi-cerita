'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from './Icons';
import StarRating from './StarRating';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isPopular: boolean;
  isNew: boolean;
  averageRating: number | null;
  reviewCount: number;
  discountPercent: number | null;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'espresso': return CoffeeCupIcon;
    case 'manual-brew': return PourOverIcon;
    case 'non-coffee': return LeafIcon;
    case 'snack': return PastryIcon;
    default: return CoffeeCupIcon;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function FavoriteProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchFavorites();
  }, []);
  
  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/products/favorites');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <section className="py-24" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (products.length === 0) return null;
  
  return (
    <section className="py-24" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="container">
        <div className="text-center mb-12">
          <p 
            className="font-semibold tracking-widest uppercase text-sm mb-3 flex items-center justify-center gap-2"
            style={{ color: '#7A8450' }}
          >
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
            Menu Favorit
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
          </p>
          <h2 
            className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#2B2118' }}
          >
            Yang Paling Disukai
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5C4A3D' }}>
            Pilihan favorit para pecinta kopi. Sudah dicoba ribuan pelanggan.
          </p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.map(product => {
            const IconComponent = getCategoryIcon(product.category);
            const discountedPrice = product.discountPercent 
              ? Math.round(product.price * (1 - product.discountPercent / 100))
              : product.price;
            
            return (
              <Link 
                key={product.id}
                href={`/product/${product.id}`}
                className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8', width: '280px' }}
              >
                {/* Image */}
                <div 
                  className="h-36 flex items-center justify-center relative"
                  style={{ backgroundColor: '#EBE4D8' }}
                >
                  <IconComponent className="w-14 h-14 opacity-50 group-hover:scale-110 transition-transform" color="#6F4E37" />
                  {product.isPopular && (
                    <span 
                      className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full"
                      style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                    >
                      🔥 Popular
                    </span>
                  )}
                  {product.discountPercent && (
                    <span 
                      className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full"
                      style={{ backgroundColor: '#DC2626', color: '#FFFDF9' }}
                    >
                      -{product.discountPercent}%
                    </span>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 
                    className="font-[family-name:var(--font-heading)] text-base font-semibold mb-1 truncate"
                    style={{ color: '#2B2118' }}
                  >
                    {product.name}
                  </h3>
                  
                  {product.averageRating && product.averageRating > 0 && (
                    <div className="mb-2">
                      <StarRating 
                        rating={product.averageRating} 
                        size="sm" 
                        showCount 
                        count={product.reviewCount} 
                      />
                    </div>
                  )}
                  
                  <p 
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: '#5C4A3D' }}
                  >
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {product.discountPercent ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: '#6F4E37' }}>
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-xs line-through" style={{ color: '#8B7355' }}>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold text-sm" style={{ color: '#6F4E37' }}>
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link
            href="/menu"
            className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg"
            style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
          >
            Lihat Semua Menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
