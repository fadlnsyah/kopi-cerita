'use client';

import { useState } from 'react';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from './Icons';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isPopular: boolean;
  isNew: boolean;
}

// Format harga ke Rupiah
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

// Get icon berdasarkan kategori
function getCategoryIcon(category: string) {
  switch (category) {
    case 'espresso': return CoffeeCupIcon;
    case 'manual-brew': return PourOverIcon;
    case 'non-coffee': return LeafIcon;
    case 'snack': return PastryIcon;
    default: return CoffeeCupIcon;
  }
}

export default function ProductCard({ product }: { product: Product }) {
  const IconComponent = getCategoryIcon(product.category);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
    
    // Show feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div 
      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      {/* Image/Icon Placeholder */}
      <div 
        className="aspect-square flex items-center justify-center relative"
        style={{ backgroundColor: '#EBE4D8' }}
      >
        <IconComponent className="w-16 h-16 opacity-40" color="#6F4E37" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isPopular && (
            <span 
              className="px-2 py-1 text-xs font-semibold rounded-full"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Popular
            </span>
          )}
          {product.isNew && (
            <span 
              className="px-2 py-1 text-xs font-semibold rounded-full"
              style={{ backgroundColor: '#7A8450', color: '#FFFDF9' }}
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 
          className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-1"
          style={{ color: '#2B2118' }}
        >
          {product.name}
        </h3>
        <p 
          className="text-sm mb-3 line-clamp-2"
          style={{ color: '#5C4A3D' }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span 
            className="font-semibold"
            style={{ color: '#6F4E37' }}
          >
            {formatPrice(product.price)}
          </span>
          <button 
            onClick={handleAddToCart}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-md"
            style={{ 
              backgroundColor: isAdded ? '#7A8450' : '#6F4E37', 
              color: '#FFFDF9' 
            }}
          >
            {isAdded ? '✓ Ditambahkan' : '+ Keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}
