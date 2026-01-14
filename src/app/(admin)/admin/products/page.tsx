'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

/**
 * Admin Products List Page
 */
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    setDeleteId(id);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Gagal menghapus produk');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Terjadi kesalahan');
    } finally {
      setDeleteId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
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
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>Produk</h2>
          <p className="font-[family-name:var(--font-body)]" style={{ color: '#5C4A3D' }}>Kelola produk Kopi Cerita</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-md"
          style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </Link>
      </div>

      {/* Products Table */}
      <div
        className="rounded-xl overflow-hidden shadow-sm"
        style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #E0D6C8', backgroundColor: '#F5EFE6' }}>
              <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Produk</th>
              <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Kategori</th>
              <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Harga</th>
              <th className="text-left py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Status</th>
              <th className="text-right py-4 px-6 font-medium" style={{ color: '#5C4A3D' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #EBE4D8' }}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: '#F5EFE6' }}
                      >
                        ☕
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2B2118' }}>{product.name}</p>
                        <p className="text-sm truncate max-w-xs" style={{ color: '#8B7355' }}>
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize" style={{ color: '#5C4A3D' }}>{product.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span style={{ color: '#2B2118' }}>{formatCurrency(product.price)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      {product.isPopular && (
                        <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                          Populer
                        </span>
                      )}
                      {product.isNew && (
                        <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
                          Baru
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#5C4A3D' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteId === product.id}
                        className="p-2 rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: '#DC2626' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center" style={{ color: '#8B7355' }}>
                  Belum ada produk. <Link href="/admin/products/new" className="hover:underline" style={{ color: '#6F4E37' }}>Tambah produk pertama</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
