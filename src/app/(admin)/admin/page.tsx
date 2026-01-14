'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  monthlySales: { month: string; sales: number }[];
  topProducts: { name: string; sold: number }[];
  recentOrders: {
    id: string;
    customer: string;
    total: number;
    status: string;
    date: string;
  }[];
}

/**
 * Admin Dashboard
 * 
 * Menampilkan:
 * - Stats cards
 * - Chart penjualan bulanan
 * - Chart produk terlaris
 * - Tabel order terbaru
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      preparing: '#8b5cf6',
      ready: '#22c55e',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: '#5C4A3D' }}>Memuat data...</div>
      </div>
    );
  }

  // Default data jika tidak ada stats
  const defaultStats: Stats = stats || {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlySales: [],
    topProducts: [],
    recentOrders: [],
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>Dashboard</h2>
        <p className="font-[family-name:var(--font-body)]" style={{ color: '#5C4A3D' }}>Selamat datang di Admin Panel Kopi Cerita</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pesanan"
          value={defaultStats.totalOrders.toString()}
          icon="cart"
          color="#6F4E37"
        />
        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(defaultStats.totalRevenue)}
          icon="money"
          color="#22c55e"
        />
        <StatsCard
          title="Produk"
          value={defaultStats.totalProducts.toString()}
          icon="box"
          color="#8B7355"
        />
        <StatsCard
          title="Pelanggan"
          value={defaultStats.totalUsers.toString()}
          icon="users"
          color="#A89585"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div
          className="p-6 rounded-xl shadow-sm"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
        >
          <h3 className="text-lg font-semibold mb-4 font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>
            Penjualan Bulanan
          </h3>
          <div className="h-64">
            {defaultStats.monthlySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={defaultStats.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0D6C8" />
                  <XAxis dataKey="month" stroke="#5C4A3D" />
                  <YAxis stroke="#5C4A3D" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      border: '1px solid #E0D6C8',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#2B2118' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#6F4E37"
                    strokeWidth={3}
                    dot={{ fill: '#6F4E37' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center" style={{ color: '#8B7355' }}>
                Belum ada data penjualan
              </div>
            )}
          </div>
        </div>

        {/* Top Products Chart */}
        <div
          className="p-6 rounded-xl shadow-sm"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
        >
          <h3 className="text-lg font-semibold mb-4 font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>
            Produk Terlaris
          </h3>
          <div className="h-64">
            {defaultStats.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defaultStats.topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0D6C8" />
                  <XAxis type="number" stroke="#5C4A3D" />
                  <YAxis dataKey="name" type="category" stroke="#5C4A3D" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      border: '1px solid #E0D6C8',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#2B2118' }}
                  />
                  <Bar dataKey="sold" fill="#6F4E37" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center" style={{ color: '#8B7355' }}>
                Belum ada data produk
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div
        className="p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
      >
        <h3 className="text-lg font-semibold mb-4 font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>
          Pesanan Terbaru
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #E0D6C8' }}>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#5C4A3D' }}>ID</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#5C4A3D' }}>Pelanggan</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#5C4A3D' }}>Total</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#5C4A3D' }}>Status</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#5C4A3D' }}>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {defaultStats.recentOrders.length > 0 ? (
                defaultStats.recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #EBE4D8' }}>
                    <td className="py-3 px-4 font-mono text-sm" style={{ color: '#5C4A3D' }}>
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4" style={{ color: '#2B2118' }}>{order.customer}</td>
                    <td className="py-3 px-4" style={{ color: '#2B2118' }}>{formatCurrency(order.total)}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4" style={{ color: '#8B7355' }}>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center" style={{ color: '#8B7355' }}>
                    Belum ada pesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  const renderIcon = () => {
    switch (icon) {
      case 'cart':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'money':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'box':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="p-6 rounded-xl shadow-sm"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: '#5C4A3D' }}>{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#2B2118' }}>{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
