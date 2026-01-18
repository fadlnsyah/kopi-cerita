'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useSession } from 'next-auth/react';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from '@/components/Icons';
import StarRating from '@/components/StarRating';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    name: string;
  };
}

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { success } = useToast();
  const { status: authStatus } = useSession();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchReviews();
    }
  }, [productId]);
  
  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discountPercent 
          ? Math.round(product.price * (1 - product.discountPercent / 100))
          : product.price,
        category: product.category,
      });
    }
    success(`${product.name} ditambahkan ke keranjang!`);
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (!product) {
    return (
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container text-center py-16">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#2B2118' }}>
            Produk tidak ditemukan
          </h1>
          <Link href="/menu" className="text-[#6F4E37] hover:underline">
            ← Kembali ke Menu
          </Link>
        </div>
      </main>
    );
  }
  
  const IconComponent = getCategoryIcon(product.category);
  const discountedPrice = product.discountPercent 
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;
  
  return (
    <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link href="/menu" className="text-sm hover:underline" style={{ color: '#6F4E37' }}>
            ← Kembali ke Menu
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div 
              className="aspect-square rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#EBE4D8' }}
            >
              <IconComponent className="w-32 h-32 opacity-40" color="#6F4E37" />
            </div>
            
            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.isNew && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#7A8450', color: '#FFFDF9' }}>
                    NEW
                  </span>
                )}
                {product.isPopular && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}>
                    Popular
                  </span>
                )}
              </div>
              
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-3" style={{ color: '#2B2118' }}>
                {product.name}
              </h1>
              
              {product.averageRating && product.averageRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.averageRating} size="md" />
                  <span className="text-sm" style={{ color: '#5C4A3D' }}>
                    ({product.reviewCount} ulasan)
                  </span>
                </div>
              )}
              
              <p className="text-lg mb-6" style={{ color: '#5C4A3D' }}>
                {product.description}
              </p>
              
              <div className="flex items-center gap-3 mb-6">
                {product.discountPercent ? (
                  <>
                    <span className="text-3xl font-bold" style={{ color: '#6F4E37' }}>
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-xl line-through" style={{ color: '#8B7355' }}>
                      {formatPrice(product.price)}
                    </span>
                    <span className="px-2 py-1 text-sm font-semibold rounded-full" style={{ backgroundColor: '#DC2626', color: '#FFFDF9' }}>
                      -{product.discountPercent}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold" style={{ color: '#6F4E37' }}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-medium"
                    style={{ backgroundColor: '#EBE4D8', color: '#6F4E37' }}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-lg" style={{ color: '#2B2118' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-medium"
                    style={{ backgroundColor: '#EBE4D8', color: '#6F4E37' }}
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 font-semibold rounded-xl transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                >
                  Tambah ke Keranjang - {formatPrice(discountedPrice * quantity)}
                </button>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="p-6 rounded-2xl" style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-6" style={{ color: '#2B2118' }}>
              Ulasan ({reviews.length})
            </h2>
            
            {reviews.length === 0 ? (
              <p className="text-center py-8" style={{ color: '#5C4A3D' }}>
                Belum ada ulasan untuk produk ini
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div 
                    key={review.id} 
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: '#F5EFE6' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{ color: '#2B2118' }}>
                          {review.user.name}
                        </span>
                        {review.isVerified && (
                          <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: '#22C55E', color: '#FFFDF9' }}>
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <span className="text-sm" style={{ color: '#8B7355' }}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                    {review.comment && (
                      <p className="mt-2" style={{ color: '#5C4A3D' }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
