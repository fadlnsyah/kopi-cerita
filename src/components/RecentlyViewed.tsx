'use client';

import Link from 'next/link';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from './Icons';

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

export default function RecentlyViewed() {
  const { recentProducts, clearRecentlyViewed } = useRecentlyViewed();
  
  if (recentProducts.length === 0) {
    return null;
  }
  
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="font-[family-name:var(--font-heading)] text-xl font-bold"
          style={{ color: '#2B2118' }}
        >
          Baru Dilihat
        </h3>
        <button
          onClick={clearRecentlyViewed}
          className="text-sm hover:underline"
          style={{ color: '#8B7355' }}
        >
          Hapus Semua
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {recentProducts.map(product => {
          const IconComponent = getCategoryIcon(product.category);
          
          return (
            <Link
              key={product.id}
              href={`/menu?product=${product.id}`}
              className="flex-shrink-0 w-40 p-3 rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
            >
              <div 
                className="w-full aspect-square rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: '#EBE4D8' }}
              >
                <IconComponent className="w-10 h-10" color="#6F4E37" />
              </div>
              <p 
                className="font-medium text-sm mb-1 line-clamp-1"
                style={{ color: '#2B2118' }}
              >
                {product.name}
              </p>
              <p 
                className="text-sm font-semibold"
                style={{ color: '#6F4E37' }}
              >
                {formatPrice(product.price)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
