'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from '@/components/Icons';
import { useToast } from '@/context/ToastContext';
import ReviewForm from '@/components/ReviewForm';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    category: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

// Status configuration
const statusConfig: Record<string, { label: string; color: string; step: number }> = {
  pending: { label: 'Menunggu Konfirmasi', color: '#f59e0b', step: 1 },
  confirmed: { label: 'Dikonfirmasi', color: '#3b82f6', step: 2 },
  preparing: { label: 'Sedang Diproses', color: '#8b5cf6', step: 3 },
  ready: { label: 'Siap Diambil', color: '#22c55e', step: 4 },
  delivered: { label: 'Selesai', color: '#10b981', step: 5 },
  cancelled: { label: 'Dibatalkan', color: '#ef4444', step: -1 },
};

// Format harga ke Rupiah
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

// Format tanggal
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

/**
 * Orders Page - Halaman daftar pesanan customer
 */
export default function OrdersPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reviewingProduct, setReviewingProduct] = useState<{
    orderId: string;
    productId: string;
    productName: string;
  } | null>(null);
  
  // Handle reorder
  const handleReorder = useCallback(async (orderId: string) => {
    setReorderingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/reorder`, {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan ke keranjang');
      }
      
      success(`${data.itemCount} item ditambahkan ke keranjang!`);
      router.push('/cart');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setReorderingId(null);
    }
  }, [success, showError, router]);

  // Redirect jika belum login
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, router]);

  // Fetch orders
  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchOrders();
    }
  }, [authStatus]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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
            <p className="mt-4" style={{ color: '#5C4A3D' }}>Memuat pesanan...</p>
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
            Riwayat
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
          </p>
          <h1 
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#2B2118' }}
          >
            Pesanan Kamu
          </h1>
          <p style={{ color: '#5C4A3D' }}>
            Lacak status pesanan kamu di sini
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#EBE4D8' }}
            >
              <CoffeeCupIcon className="w-12 h-12" color="#6F4E37" />
            </div>
            <h2 
              className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4"
              style={{ color: '#2B2118' }}
            >
              Belum Ada Pesanan
            </h2>
            <p className="mb-8" style={{ color: '#5C4A3D' }}>
              Kamu belum pernah memesan. Yuk, pesan kopi pertamamu!
            </p>
            <Link
              href="/menu"
              className="inline-block px-8 py-4 font-semibold rounded-xl transition-all hover:shadow-lg"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Lihat Menu
            </Link>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expandedOrder === order.id;

              return (
                <div 
                  key={order.id}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
                >
                  {/* Order Header - Clickable */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-[#F5EFE6] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span 
                          className="font-mono text-sm"
                          style={{ color: '#8B7355' }}
                        >
                          #{order.id.slice(0, 8)}
                        </span>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${status.color}20`,
                            color: status.color 
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#5C4A3D' }}>
                        {formatDate(order.createdAt)} • {order.items.length} item
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="font-semibold" style={{ color: '#6F4E37' }}>
                        {formatPrice(order.total)}
                      </span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="#5C4A3D" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: '#E0D6C8' }}>
                      {/* Status Progress */}
                      {order.status !== 'cancelled' && (
                        <div className="py-5">
                          <div className="flex items-center justify-between">
                            {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((step, index) => {
                              const stepConfig = statusConfig[step];
                              const currentStep = statusConfig[order.status]?.step || 1;
                              const isCompleted = stepConfig.step <= currentStep;
                              const isCurrent = step === order.status;

                              return (
                                <div key={step} className="flex-1 flex items-center">
                                  <div className="flex flex-col items-center">
                                    <div 
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isCompleted ? '' : 'border-2'
                                      }`}
                                      style={{
                                        backgroundColor: isCompleted ? stepConfig.color : 'transparent',
                                        borderColor: isCompleted ? stepConfig.color : '#E0D6C8',
                                        color: isCompleted ? '#FFFDF9' : '#8B7355',
                                      }}
                                    >
                                      {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <span 
                                      className={`text-xs mt-2 text-center ${isCurrent ? 'font-semibold' : ''}`}
                                      style={{ color: isCurrent ? stepConfig.color : '#8B7355' }}
                                    >
                                      {stepConfig.label.split(' ')[0]}
                                    </span>
                                  </div>
                                  {index < 4 && (
                                    <div 
                                      className="flex-1 h-1 mx-2"
                                      style={{ 
                                        backgroundColor: stepConfig.step < currentStep ? stepConfig.color : '#E0D6C8' 
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Cancelled Notice */}
                      {order.status === 'cancelled' && (
                        <div 
                          className="py-4 px-4 rounded-lg my-4 text-center"
                          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                        >
                          Pesanan ini telah dibatalkan
                        </div>
                      )}

                      {/* Items List */}
                      <div className="space-y-3 mt-4">
                        <p className="text-sm font-medium" style={{ color: '#8B7355' }}>Detail Pesanan</p>
                        {order.items.map((item) => {
                          const IconComponent = getCategoryIcon(item.product.category);
                          return (
                            <div 
                              key={item.id}
                              className="flex items-center gap-3"
                            >
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: '#EBE4D8' }}
                              >
                                <IconComponent className="w-5 h-5" color="#6F4E37" />
                              </div>
                              <div className="flex-1">
                                <p style={{ color: '#2B2118' }}>{item.product.name}</p>
                                <p className="text-sm" style={{ color: '#8B7355' }}>
                                  {formatPrice(item.price)} x {item.quantity}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium" style={{ color: '#2B2118' }}>
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                {order.status === 'delivered' && (
                                  <button
                                    onClick={() => setReviewingProduct({
                                      orderId: order.id,
                                      productId: item.product.id,
                                      productName: item.product.name,
                                    })}
                                    className="px-2 py-1 text-xs font-medium rounded-lg transition-colors hover:opacity-80"
                                    style={{ backgroundColor: '#F59E0B', color: '#FFFDF9' }}
                                  >
                                    ⭐ Review
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E0D6C8' }}>
                          <p className="text-sm" style={{ color: '#8B7355' }}>Catatan:</p>
                          <p style={{ color: '#5C4A3D' }}>{order.notes}</p>
                        </div>
                      )}

                      {/* Total */}
                      <div 
                        className="mt-4 pt-4 flex justify-between items-center border-t"
                        style={{ borderColor: '#E0D6C8' }}
                      >
                        <span className="font-medium" style={{ color: '#5C4A3D' }}>Total</span>
                        <span className="text-xl font-bold" style={{ color: '#6F4E37' }}>
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      
                      {/* Order Again Button */}
                      {(order.status === 'delivered' || order.status === 'cancelled') && (
                        <button
                          onClick={() => handleReorder(order.id)}
                          disabled={reorderingId === order.id}
                          className="w-full mt-4 py-3 font-semibold rounded-xl transition-all hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                        >
                          {reorderingId === order.id ? (
                            <span>Menambahkan...</span>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Pesan Lagi</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Review Modal */}
      {reviewingProduct && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setReviewingProduct(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 pointer-events-auto"
              style={{ backgroundColor: '#FFFDF9' }}
            >
              <button
                onClick={() => setReviewingProduct(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <ReviewForm
                productId={reviewingProduct.productId}
                productName={reviewingProduct.productName}
                orderId={reviewingProduct.orderId}
                onSuccess={() => {
                  setReviewingProduct(null);
                  success('Review berhasil dikirim!');
                }}
                onCancel={() => setReviewingProduct(null)}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
