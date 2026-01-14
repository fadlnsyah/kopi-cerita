'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const categories = [
  { value: 'espresso', label: 'Espresso' },
  { value: 'manual-brew', label: 'Manual Brew' },
  { value: 'non-coffee', label: 'Non-Coffee' },
  { value: 'snack', label: 'Snack' },
];

/**
 * Admin New Product Page
 */
export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'espresso',
    image: '',
    isPopular: false,
    isNew: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validasi
    if (!formData.name || !formData.description || !formData.price) {
      setError('Nama, deskripsi, dan harga harus diisi');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Gagal menambahkan produk');
        return;
      }

      router.push('/admin/products');
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 mb-4 transition-colors"
          style={{ color: '#5C4A3D' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </Link>
        <h2 className="text-2xl font-bold" style={{ color: '#2B2118' }}>Tambah Produk Baru</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          className="p-6 rounded-xl space-y-6 shadow-sm"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
        >
          {/* Error */}
          {error && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block mb-2" style={{ color: '#5C4A3D' }}>Nama Produk</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
              placeholder="Contoh: Kopi Susu Gula Aren"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2" style={{ color: '#5C4A3D' }}>Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
              placeholder="Deskripsi singkat produk"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ color: '#5C4A3D' }}>Harga (Rp)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block mb-2" style={{ color: '#5C4A3D' }}>Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-2" style={{ color: '#5C4A3D' }}>URL Gambar (opsional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
                className="w-5 h-5 rounded"
              />
              <span style={{ color: '#5C4A3D' }}>Produk Populer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="w-5 h-5 rounded"
              />
              <span style={{ color: '#5C4A3D' }}>Produk Baru</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4" style={{ borderTop: '1px solid #E0D6C8' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#6F4E37' }}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#E0D6C8', color: '#5C4A3D' }}
            >
              Batal
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
