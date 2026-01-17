'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { GridIcon, CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from '@/components/Icons';

// Type untuk Product dari database
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

// Category data with icon components
const menuCategories = [
  { id: 'all', label: 'Semua', Icon: GridIcon },
  { id: 'espresso', label: 'Espresso', Icon: CoffeeCupIcon },
  { id: 'manual-brew', label: 'Manual Brew', Icon: PourOverIcon },
  { id: 'non-coffee', label: 'Non-Coffee', Icon: LeafIcon },
  { id: 'snack', label: 'Snack', Icon: PastryIcon },
];

// Sort options
const sortOptions = [
  { id: 'default', label: 'Default' },
  { id: 'price-asc', label: 'Harga Terendah' },
  { id: 'price-desc', label: 'Harga Tertinggi' },
  { id: 'name-asc', label: 'A - Z' },
  { id: 'name-desc', label: 'Z - A' },
];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  // Fetch products dari API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Pastikan data adalah array
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('API did not return an array:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter dan sort products menggunakan useMemo
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by Popular only
    if (showPopularOnly) {
      result = result.filter((p) => p.isPopular);
    }

    // Filter by New only
    if (showNewOnly) {
      result = result.filter((p) => p.isNew);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy, showPopularOnly, showNewOnly]);

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('default');
    setShowPopularOnly(false);
    setShowNewOnly(false);
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery || sortBy !== 'default' || showPopularOnly || showNewOnly;

  return (
    <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <p 
            className="font-semibold tracking-widest uppercase text-sm mb-3 flex items-center justify-center gap-2"
            style={{ color: '#7A8450' }}
          >
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
            Menu Kami
            <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
          </p>
          <h1 
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#2B2118' }}
          >
            Pilih Kopimu
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5C4A3D' }}>
            Dari espresso yang bold hingga manual brew yang smooth, 
            temukan kopi yang cocok dengan mood-mu hari ini.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
              fill="none" 
              stroke="#8B7355" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari kopi atau snack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all focus:shadow-md"
              style={{ 
                borderColor: '#E0D6C8', 
                backgroundColor: '#FFFDF9',
                color: '#2B2118',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters Row - Redesigned */}
        <div 
          className="max-w-xl mx-auto mb-8 p-4 rounded-xl flex flex-wrap items-center justify-center gap-4"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
        >
          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: '#8B7355' }}>Filter:</span>
            <button
              onClick={() => setShowPopularOnly(!showPopularOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showPopularOnly ? 'shadow-md' : 'hover:shadow-sm'
              }`}
              style={{
                backgroundColor: showPopularOnly ? '#6F4E37' : 'transparent',
                color: showPopularOnly ? '#FFFDF9' : '#5C4A3D',
                border: showPopularOnly ? 'none' : '1px solid #E0D6C8',
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={showPopularOnly ? '#FFFDF9' : '#F59E0B'}>
                <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C6.77 18.96 8 19.93 9.37 20.39C10.84 20.88 12.47 20.9 14 20.53C15.64 20.13 17.1 19.11 18.04 17.7C19.09 16.12 19.38 14.12 18.78 12.32L18.66 12.1C18.38 11.74 18.04 11.45 17.66 11.2ZM14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z"/>
              </svg>
              Popular
            </button>
            <button
              onClick={() => setShowNewOnly(!showNewOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showNewOnly ? 'shadow-md' : 'hover:shadow-sm'
              }`}
              style={{
                backgroundColor: showNewOnly ? '#7A8450' : 'transparent',
                color: showNewOnly ? '#FFFDF9' : '#5C4A3D',
                border: showNewOnly ? 'none' : '1px solid #E0D6C8',
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={showNewOnly ? '#FFFDF9' : '#7A8450'}>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              New
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 hidden sm:block" style={{ backgroundColor: '#E0D6C8' }}></div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: '#8B7355' }}>Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border outline-none cursor-pointer hover:shadow-sm transition-all"
              style={{ 
                borderColor: '#E0D6C8', 
                backgroundColor: '#FFFDF9',
                color: '#2B2118',
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {menuCategories.map((cat) => {
            const IconComponent = cat.Icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive ? 'shadow-md' : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: isActive ? '#6F4E37' : '#FFFDF9',
                  color: isActive ? '#FFFDF9' : '#5C4A3D',
                  border: isActive ? 'none' : '1px solid #E0D6C8',
                }}
              >
                <IconComponent className="w-5 h-5" color={isActive ? '#FFFDF9' : '#6F4E37'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6F4E37', borderTopColor: 'transparent' }}></div>
            <p className="mt-4" style={{ color: '#5C4A3D' }}>Memuat menu...</p>
          </div>
        ) : (
          <>
            {/* Product Count & Clear Filters */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <p style={{ color: '#5C4A3D' }}>
                Menampilkan <strong style={{ color: '#6F4E37' }}>{filteredProducts.length}</strong> produk
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm underline hover:no-underline"
                  style={{ color: '#6F4E37' }}
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🔍</p>
                <p className="mb-4" style={{ color: '#5C4A3D' }}>
                  {searchQuery 
                    ? `Tidak ditemukan produk untuk "${searchQuery}"`
                    : 'Tidak ada produk dalam kategori ini.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 rounded-xl font-medium"
                  style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                >
                  Reset Filter
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}