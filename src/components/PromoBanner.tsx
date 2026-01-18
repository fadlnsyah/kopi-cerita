'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  minPurchase: number | null;
  validUntil: string;
}

export default function PromoBanner() {
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchActiveCoupons();
  }, []);
  
  // Auto rotate coupons
  useEffect(() => {
    if (activeCoupons.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeCoupons.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeCoupons.length]);
  
  const fetchActiveCoupons = async () => {
    try {
      const res = await fetch('/api/coupons/active');
      if (res.ok) {
        const data = await res.json();
        setActiveCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading || activeCoupons.length === 0) {
    return null;
  }
  
  const currentCoupon = activeCoupons[currentIndex];
  const validUntil = new Date(currentCoupon.validUntil).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  return (
    <div 
      className="relative overflow-hidden rounded-2xl mb-8"
      style={{ 
        background: 'linear-gradient(135deg, #7A8450 0%, #5F6840 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#FFFDF9' }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: '#FFFDF9' }} />
      
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,253,249,0.8)' }}>
            🎉 Promo Spesial
          </p>
          <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#FFFDF9' }}>
            Diskon {currentCoupon.discount}%
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,253,249,0.8)' }}>
            Gunakan kode: 
            <span 
              className="ml-2 px-3 py-1 rounded-lg font-mono font-bold"
              style={{ backgroundColor: 'rgba(255,253,249,0.2)', color: '#FFFDF9' }}
            >
              {currentCoupon.code}
            </span>
          </p>
          {currentCoupon.minPurchase && (
            <p className="text-xs mt-2" style={{ color: 'rgba(255,253,249,0.7)' }}>
              Min. pembelian Rp {currentCoupon.minPurchase.toLocaleString('id-ID')}
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: 'rgba(255,253,249,0.6)' }}>
            Berlaku hingga {validUntil}
          </p>
        </div>
        
        <Link
          href="/menu"
          className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ backgroundColor: '#FFFDF9', color: '#5F6840' }}
        >
          Pesan Sekarang
        </Link>
      </div>
      
      {/* Pagination dots */}
      {activeCoupons.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {activeCoupons.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-6' : ''
              }`}
              style={{ 
                backgroundColor: index === currentIndex 
                  ? '#FFFDF9' 
                  : 'rgba(255,253,249,0.4)' 
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
