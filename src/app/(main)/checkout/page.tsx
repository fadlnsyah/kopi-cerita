'use client';

import { useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Format harga ke Rupiah
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

interface AppliedCoupon {
  id: string;
  code: string;
  discount: number;
  discountAmount: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    orderType: 'dine-in', // dine-in atau takeaway
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  // Validate and apply coupon
  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    setCouponError('');
    
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponCode.trim(), 
          subtotal: totalPrice 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Kupon tidak valid');
      }
      
      setAppliedCoupon(data.coupon);
      setCouponCode('');
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Kupon tidak valid');
    } finally {
      setIsValidatingCoupon(false);
    }
  }, [couponCode, totalPrice]);
  
  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError('');
  }, []);
  
  // Calculate final total
  const serviceFee = 2000;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotal = totalPrice + serviceFee - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: formData.notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat pesanan');
      }

      // Order berhasil dibuat
      setOrderId(data.orderId);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect jika cart kosong dan belum sukses
  if (items.length === 0 && !orderSuccess) {
    return (
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <div className="max-w-md mx-auto text-center py-16">
            <h1 
              className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4"
              style={{ color: '#2B2118' }}
            >
              Keranjang Kosong
            </h1>
            <p className="mb-6" style={{ color: '#5C4A3D' }}>
              Tambahkan item ke keranjang terlebih dahulu.
            </p>
            <Link
              href="/menu"
              className="inline-block px-6 py-3 font-semibold rounded-xl"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Lihat Menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Order Success State
  if (orderSuccess) {
    return (
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <div className="max-w-md mx-auto text-center py-16">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#7A8450' }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L10 17L19 7" stroke="#FFFDF9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 
              className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-4"
              style={{ color: '#2B2118' }}
            >
              Pesanan Anda Berhasil!
            </h1>
            <p className="mb-2" style={{ color: '#5C4A3D' }}>
              Terima kasih atas pesanan Anda.
            </p>
            <p className="text-lg font-semibold mb-8" style={{ color: '#6F4E37' }}>
              Order ID: {orderId}
            </p>
            <div className="space-y-3">
              <Link
                href="/menu"
                className="block w-full py-3 font-semibold rounded-xl"
                style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
              >
                Pesan Lagi
              </Link>
              <Link
                href="/"
                className="block w-full py-3 font-medium rounded-xl border"
                style={{ borderColor: '#E0D6C8', color: '#5C4A3D' }}
              >
                Kembali ke Beranda
              </Link>
            </div>
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
            style={{ color: '#7A8450' }}
          >
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
            Checkout
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
          </p>
          <h1 
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold"
            style={{ color: '#2B2118' }}
          >
            Selesaikan Pesanan
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Error Message */}
            {error && (
              <div 
                className="mb-6 p-4 rounded-xl text-center"
                style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div 
                className="p-6 rounded-xl mb-6"
                style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
              >
                <h2 
                  className="font-[family-name:var(--font-heading)] text-xl font-bold mb-6"
                  style={{ color: '#2B2118' }}
                >
                  Informasi Pemesan
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2B2118' }}>
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:shadow-md"
                      style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2B2118' }}>
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:shadow-md"
                      style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div 
                className="p-6 rounded-xl mb-6"
                style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
              >
                <h2 
                  className="font-[family-name:var(--font-heading)] text-xl font-bold mb-6"
                  style={{ color: '#2B2118' }}
                >
                  Tipe Pesanan
                </h2>

                <div className="flex gap-4">
                  <label 
                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.orderType === 'dine-in' ? 'border-[#6F4E37]' : 'border-[#E0D6C8]'
                    }`}
                    style={{ backgroundColor: formData.orderType === 'dine-in' ? 'rgba(111, 78, 55, 0.1)' : '#FFFDF9' }}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="dine-in"
                      checked={formData.orderType === 'dine-in'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <span className="text-2xl block mb-2">🪑</span>
                      <span className="font-semibold" style={{ color: '#2B2118' }}>Dine In</span>
                      <p className="text-xs mt-1" style={{ color: '#5C4A3D' }}>Makan di tempat</p>
                    </div>
                  </label>

                  <label 
                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.orderType === 'takeaway' ? 'border-[#6F4E37]' : 'border-[#E0D6C8]'
                    }`}
                    style={{ backgroundColor: formData.orderType === 'takeaway' ? 'rgba(111, 78, 55, 0.1)' : '#FFFDF9' }}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="takeaway"
                      checked={formData.orderType === 'takeaway'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <span className="text-2xl block mb-2">🥤</span>
                      <span className="font-semibold" style={{ color: '#2B2118' }}>Take Away</span>
                      <p className="text-xs mt-1" style={{ color: '#5C4A3D' }}>Dibawa pulang</p>
                    </div>
                  </label>
                </div>
              </div>

              <div 
                className="p-6 rounded-xl mb-6"
                style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
              >
                <h2 
                  className="font-[family-name:var(--font-heading)] text-xl font-bold mb-6"
                  style={{ color: '#2B2118' }}
                >
                  Catatan (Opsional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border outline-none resize-none transition-all focus:shadow-md"
                  style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                  placeholder="Contoh: Gula dikurangi, es sedikit, dll..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
              >
                {isSubmitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              className="p-6 rounded-xl sticky top-24"
              style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
            >
              <h2 
                className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4"
                style={{ color: '#2B2118' }}
              >
                Pesanan Kamu
              </h2>

              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span style={{ color: '#5C4A3D' }}>
                      {item.name} x{item.quantity}
                    </span>
                    <span style={{ color: '#2B2118' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4" style={{ borderColor: '#E0D6C8' }} />
              
              {/* Coupon Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>
                  Kode Promo
                </label>
                {appliedCoupon ? (
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: '#F0FDF4', border: '1px solid #22C55E' }}
                  >
                    <div>
                      <span className="font-mono font-semibold" style={{ color: '#16A34A' }}>
                        {appliedCoupon.code}
                      </span>
                      <span className="text-sm ml-2" style={{ color: '#22C55E' }}>
                        (-{appliedCoupon.discount}%)
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm hover:underline"
                      style={{ color: '#DC2626' }}
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Masukkan kode"
                      className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm font-mono uppercase"
                      style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ backgroundColor: '#7A8450', color: '#FFFDF9' }}
                    >
                      {isValidatingCoupon ? '...' : 'Pakai'}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-sm mt-2" style={{ color: '#DC2626' }}>
                    {couponError}
                  </p>
                )}
              </div>

              <hr className="my-4" style={{ borderColor: '#E0D6C8' }} />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: '#5C4A3D' }}>Subtotal</span>
                  <span style={{ color: '#2B2118' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5C4A3D' }}>Biaya Layanan</span>
                  <span style={{ color: '#2B2118' }}>{formatPrice(serviceFee)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span style={{ color: '#22C55E' }}>Diskon ({appliedCoupon.discount}%)</span>
                    <span style={{ color: '#22C55E' }}>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              <hr className="my-4" style={{ borderColor: '#E0D6C8' }} />

              <div className="flex justify-between font-bold text-lg">
                <span style={{ color: '#2B2118' }}>Total</span>
                <span style={{ color: '#6F4E37' }}>{formatPrice(finalTotal)}</span>
              </div>

              <Link
                href="/cart"
                className="block text-center text-sm mt-4 hover:underline"
                style={{ color: '#5C4A3D' }}
              >
                ← Kembali ke Keranjang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
