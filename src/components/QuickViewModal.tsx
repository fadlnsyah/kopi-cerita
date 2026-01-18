'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import StarRating from './StarRating';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from './Icons';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isPopular: boolean;
  isNew: boolean;
  averageRating?: number | null;
  reviewCount?: number;
  discountPercent?: number | null;
}

interface Modifier {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options: { label: string; price: number }[];
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { name: string };
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
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

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { success } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch modifiers and reviews when product changes
  useEffect(() => {
    if (product && isOpen) {
      setQuantity(1);
      setSelectedModifiers({});
      fetchModifiers(product.id);
      fetchReviews(product.id);
    }
  }, [product, isOpen]);
  
  const fetchModifiers = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}/modifiers`);
      const data = await res.json();
      setModifiers(data.modifiers || []);
      
      // Set default selections for required modifiers
      const defaults: Record<string, string | string[]> = {};
      data.modifiers?.forEach((mod: Modifier) => {
        if (mod.required && mod.options.length > 0) {
          defaults[mod.name] = mod.options[0].label;
        }
      });
      setSelectedModifiers(defaults);
    } catch (error) {
      console.error('Error fetching modifiers:', error);
    }
  };
  
  const fetchReviews = async (productId: string) => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews((data.reviews || []).slice(0, 3)); // Show only 3 latest reviews
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  
  const handleModifierChange = useCallback((modifierName: string, value: string, type: string) => {
    setSelectedModifiers(prev => {
      if (type === 'multi') {
        const current = (prev[modifierName] as string[]) || [];
        if (current.includes(value)) {
          return { ...prev, [modifierName]: current.filter(v => v !== value) };
        } else {
          return { ...prev, [modifierName]: [...current, value] };
        }
      }
      return { ...prev, [modifierName]: value };
    });
  }, []);
  
  // Calculate total price with modifiers
  const calculateTotalPrice = useCallback(() => {
    if (!product) return 0;
    let total = product.price;
    
    modifiers.forEach(mod => {
      const selected = selectedModifiers[mod.name];
      if (selected) {
        if (Array.isArray(selected)) {
          selected.forEach(sel => {
            const option = mod.options.find(o => o.label === sel);
            if (option) total += option.price;
          });
        } else {
          const option = mod.options.find(o => o.label === selected);
          if (option) total += option.price;
        }
      }
    });
    
    return total * quantity;
  }, [product, modifiers, selectedModifiers, quantity]);
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsLoading(true);
    try {
      // Add to cart (quantity handled separately via multiple adds or extending addToCart)
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
        });
      }
      
      success(`${product.name} ditambahkan ke keranjang!`);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen || !product) return null;
  
  const IconComponent = getCategoryIcon(product.category);
  const discountedPrice = product.discountPercent 
    ? product.price - (product.price * product.discountPercent / 100)
    : product.price;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          style={{ backgroundColor: '#FFFDF9' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="#5C4A3D" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex gap-6 mb-6">
              {/* Product Image/Icon */}
              <div 
                className="w-32 h-32 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#EBE4D8' }}
              >
                <IconComponent className="w-16 h-16" color="#6F4E37" />
              </div>
              
              {/* Product Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {product.isNew && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: '#7A8450', color: '#FFFDF9' }}>
                      NEW
                    </span>
                  )}
                  {product.isPopular && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: '#F59E0B', color: '#FFFDF9' }}>
                      🔥 Popular
                    </span>
                  )}
                </div>
                
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2" style={{ color: '#2B2118' }}>
                  {product.name}
                </h2>
                
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
                
                <p className="text-sm mb-3" style={{ color: '#5C4A3D' }}>
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2">
                  {product.discountPercent ? (
                    <>
                      <span className="text-xl font-bold" style={{ color: '#6F4E37' }}>
                        {formatPrice(discountedPrice)}
                      </span>
                      <span className="text-sm line-through" style={{ color: '#8B7355' }}>
                        {formatPrice(product.price)}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: '#DC2626', color: '#FFFDF9' }}>
                        -{product.discountPercent}%
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold" style={{ color: '#6F4E37' }}>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modifiers */}
            {modifiers.length > 0 && (
              <div className="space-y-4 mb-6">
                {modifiers.map(modifier => (
                  <div key={modifier.id} className="p-4 rounded-xl" style={{ backgroundColor: '#F5EFE6' }}>
                    <p className="font-medium mb-3" style={{ color: '#2B2118' }}>
                      {modifier.name}
                      {modifier.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {modifier.options.map(option => {
                        const isSelected = modifier.type === 'multi'
                          ? (selectedModifiers[modifier.name] as string[])?.includes(option.label)
                          : selectedModifiers[modifier.name] === option.label;
                        
                        return (
                          <button
                            key={option.label}
                            onClick={() => handleModifierChange(modifier.name, option.label, modifier.type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              isSelected ? 'shadow-md' : 'hover:shadow-sm'
                            }`}
                            style={{
                              backgroundColor: isSelected ? '#6F4E37' : '#FFFDF9',
                              color: isSelected ? '#FFFDF9' : '#5C4A3D',
                              border: isSelected ? 'none' : '1px solid #E0D6C8',
                            }}
                          >
                            {option.label}
                            {option.price > 0 && (
                              <span className="ml-1 opacity-75">+{formatPrice(option.price)}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: '#E0D6C8' }}>
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors"
                  style={{ backgroundColor: '#EBE4D8', color: '#6F4E37' }}
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold text-lg" style={{ color: '#2B2118' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors"
                  style={{ backgroundColor: '#EBE4D8', color: '#6F4E37' }}
                >
                  +
                </button>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 py-4 font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
              >
                {isLoading ? 'Menambahkan...' : `Tambah ke Keranjang - ${formatPrice(calculateTotalPrice())}`}
              </button>
            </div>
            
            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="mt-6 pt-4 border-t" style={{ borderColor: '#E0D6C8' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#2B2118' }}>
                    Ulasan Terbaru
                  </h3>
                  <Link 
                    href={`/product/${product.id}`}
                    className="text-sm hover:underline"
                    style={{ color: '#6F4E37' }}
                    onClick={onClose}
                  >
                    Lihat Semua →
                  </Link>
                </div>
                <div className="space-y-3">
                  {reviews.map(review => (
                    <div key={review.id} className="p-3 rounded-lg" style={{ backgroundColor: '#F5EFE6' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: '#2B2118' }}>
                          {review.user.name}
                          {review.isVerified && (
                            <span className="ml-1 text-xs" style={{ color: '#22C55E' }}>✓</span>
                          )}
                        </span>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      {review.comment && (
                        <p className="text-sm" style={{ color: '#5C4A3D' }}>
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
