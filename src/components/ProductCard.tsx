'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from './Icons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useSession } from 'next-auth/react';
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
  discountPercent?: number | null;
  averageRating?: number | null;
  reviewCount?: number;
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
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { success } = useToast();
  const { status: authStatus } = useSession();
  const [isAdded, setIsAdded] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  
  // Calculate discounted price
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price * (1 - (product.discountPercent! / 100)))
    : product.price;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      category: product.category,
    });
    
    // Show feedback with toast
    setIsAdded(true);
    success(`${product.name} ditambahkan ke keranjang`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistToggle = () => {
    if (authStatus !== 'authenticated') return;
    
    // Trigger animation
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 400);
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
      success(`${product.name} ditambahkan ke wishlist`);
    }
  };

  return (
    <div 
      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      {/* Image atau Icon Placeholder - Clickable */}
      <Link 
        href={`/product/${product.id}`}
        className="aspect-square flex items-center justify-center relative overflow-hidden block"
        style={{ backgroundColor: '#EBE4D8' }}
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <IconComponent className="w-16 h-16 opacity-40 transition-transform duration-300 group-hover:scale-110" color="#6F4E37" />
        )}
        
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
          {hasDiscount && (
            <span 
              className="px-2 py-1 text-xs font-semibold rounded-full"
              style={{ backgroundColor: '#DC2626', color: '#FFFDF9' }}
            >
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        {authStatus === 'authenticated' && (
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ 
              backgroundColor: isWishlisted ? '#DC2626' : 'rgba(255,255,255,0.9)',
            }}
          >
            <svg 
              className="w-5 h-5" 
              fill={isWishlisted ? '#FFFDF9' : 'none'} 
              stroke={isWishlisted ? '#FFFDF9' : '#6F4E37'} 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <h3 
          className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-1"
          style={{ color: '#2B2118' }}
        >
          {product.name}
        </h3>
        {/* Rating Display */}
        {product.averageRating && product.averageRating > 0 && (
          <div className="mb-2">
            <StarRating 
              rating={product.averageRating} 
              size="sm" 
              showCount 
              count={product.reviewCount || 0} 
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
          <div>
            {hasDiscount ? (
              <>
                <span 
                  className="font-semibold"
                  style={{ color: '#6F4E37' }}
                >
                  {formatPrice(discountedPrice)}
                </span>
                <span 
                  className="text-sm line-through ml-2"
                  style={{ color: '#8B7355' }}
                >
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span 
                className="font-semibold"
                style={{ color: '#6F4E37' }}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </div>
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
