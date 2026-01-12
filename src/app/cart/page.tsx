'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from '@/components/Icons';

// Format harga ke Rupiah
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

// Get icon by category
function getCategoryIcon(category: string) {
  switch (category) {
    case 'espresso': return CoffeeCupIcon;
    case 'manual-brew': return PourOverIcon;
    case 'non-coffee': return LeafIcon;
    case 'snack': return PastryIcon;
    default: return CoffeeCupIcon;
  }
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#EBE4D8' }}
            >
              <CoffeeCupIcon className="w-12 h-12" color="#6F4E37" />
            </div>
            <h1 
              className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-4"
              style={{ color: '#2B2118' }}
            >
              Keranjang Kosong
            </h1>
            <p className="mb-8" style={{ color: '#5C4A3D' }}>
              Belum ada item di keranjang. Yuk, pilih kopi favoritmu!
            </p>
            <Link
              href="/menu"
              className="inline-block px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Lihat Menu
            </Link>
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
            Keranjang
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
          </p>
          <h1 
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#2B2118' }}
          >
            Pesanan Kamu
          </h1>
          <p style={{ color: '#5C4A3D' }}>
            {totalItems} item dalam keranjang
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const IconComponent = getCategoryIcon(item.category);
              return (
                <div 
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
                >
                  {/* Icon */}
                  <div 
                    className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#EBE4D8' }}
                  >
                    <IconComponent className="w-10 h-10" color="#6F4E37" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 
                      className="font-[family-name:var(--font-heading)] font-semibold mb-1"
                      style={{ color: '#2B2118' }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: '#5C4A3D' }}>
                      {formatPrice(item.price)} / item
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#EBE4D8', color: '#6F4E37' }}
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center" style={{ color: '#2B2118' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#EBE4D8', color: '#6F4E37' }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-sm hover:underline"
                        style={{ color: '#dc2626' }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: '#6F4E37' }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm hover:underline"
              style={{ color: '#dc2626' }}
            >
              Kosongkan Keranjang
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              className="p-6 rounded-xl sticky top-24"
              style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
            >
              <h2 
                className="font-[family-name:var(--font-heading)] text-xl font-bold mb-6"
                style={{ color: '#2B2118' }}
              >
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: '#5C4A3D' }}>Subtotal ({totalItems} item)</span>
                  <span style={{ color: '#2B2118' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5C4A3D' }}>Biaya Layanan</span>
                  <span style={{ color: '#2B2118' }}>{formatPrice(2000)}</span>
                </div>
                <hr style={{ borderColor: '#E0D6C8' }} />
                <div className="flex justify-between font-bold text-lg">
                  <span style={{ color: '#2B2118' }}>Total</span>
                  <span style={{ color: '#6F4E37' }}>{formatPrice(totalPrice + 2000)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-4 text-center font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
              >
                Lanjut ke Pembayaran
              </Link>

              <Link
                href="/menu"
                className="block w-full py-3 text-center font-medium mt-3 rounded-xl border transition-all duration-300"
                style={{ borderColor: '#E0D6C8', color: '#5C4A3D' }}
              >
                Tambah Item Lain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
