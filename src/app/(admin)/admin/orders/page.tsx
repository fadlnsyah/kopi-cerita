'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  notes: string | null;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'confirmed', label: 'Dikonfirmasi', color: '#3b82f6' },
  { value: 'preparing', label: 'Diproses', color: '#8b5cf6' },
  { value: 'ready', label: 'Siap', color: '#22c55e' },
  { value: 'delivered', label: 'Selesai', color: '#10b981' },
  { value: 'cancelled', label: 'Dibatalkan', color: '#ef4444' },
];

/**
 * Admin Orders Page
 */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const url = filterStatus === 'all' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?status=${filterStatus}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: '#5C4A3D' }}>Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>Pesanan</h2>
          <p className="font-[family-name:var(--font-body)]" style={{ color: '#5C4A3D' }}>Kelola pesanan pelanggan</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors`}
          style={filterStatus === 'all' 
            ? { backgroundColor: '#6F4E37', color: '#FFFDF9' }
            : { backgroundColor: '#E0D6C8', color: '#5C4A3D' }
          }
        >
          Semua
        </button>
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={filterStatus === status.value 
              ? { backgroundColor: status.color, color: '#FFFDF9' }
              : { backgroundColor: '#E0D6C8', color: '#5C4A3D' }
            }
          >
            {status.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div
            className="rounded-xl overflow-hidden shadow-sm"
            style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E0D6C8', backgroundColor: '#F5EFE6' }}>
                  <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Order</th>
                  <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Pelanggan</th>
                  <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Total</th>
                  <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="cursor-pointer transition-colors"
                      style={{ 
                        borderBottom: '1px solid #EBE4D8',
                        backgroundColor: selectedOrder?.id === order.id ? '#F5EFE6' : 'transparent'
                      }}
                    >
                      <td className="py-4 px-6">
                        <p className="font-mono text-sm" style={{ color: '#2B2118' }}>
                          #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm" style={{ color: '#8B7355' }}>
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p style={{ color: '#2B2118' }}>{order.user.name}</p>
                        <p className="text-sm" style={{ color: '#8B7355' }}>{order.user.email}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span style={{ color: '#2B2118' }}>{formatCurrency(order.total)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${getStatusInfo(order.status).color}20`,
                            color: getStatusInfo(order.status).color,
                          }}
                        >
                          {getStatusInfo(order.status).label}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center" style={{ color: '#8B7355' }}>
                      Tidak ada pesanan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail */}
        <div
          className="rounded-xl p-6 shadow-sm"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
        >
          {selectedOrder ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>
                  Detail Pesanan
                </h3>
                <p className="font-mono text-sm" style={{ color: '#8B7355' }}>
                  #{selectedOrder.id}
                </p>
              </div>

              {/* Customer */}
              <div>
                <p className="text-sm mb-1" style={{ color: '#8B7355' }}>Pelanggan</p>
                <p style={{ color: '#2B2118' }}>{selectedOrder.user.name}</p>
                <p className="text-sm" style={{ color: '#8B7355' }}>{selectedOrder.user.email}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm mb-2" style={{ color: '#8B7355' }}>Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span style={{ color: '#5C4A3D' }}>
                        {item.product.name} x{item.quantity}
                      </span>
                      <span style={{ color: '#2B2118' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-4" style={{ borderTop: '1px solid #E0D6C8' }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#8B7355' }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: '#2B2118' }}>
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm mb-1" style={{ color: '#8B7355' }}>Catatan</p>
                  <p className="text-sm" style={{ color: '#5C4A3D' }}>{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <p className="text-sm mb-2" style={{ color: '#8B7355' }}>Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  disabled={updatingId === selectedOrder.id}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 disabled:opacity-50"
                  style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center" style={{ color: '#8B7355' }}>
              Pilih pesanan untuk melihat detail
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
