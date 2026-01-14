'use client';

import { useState, useEffect } from 'react';
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

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

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

  // Filter products berdasarkan kategori
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

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

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
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
            {/* Product Count */}
            <p className="text-center mb-8" style={{ color: '#5C4A3D' }}>
              Menampilkan <strong style={{ color: '#6F4E37' }}>{filteredProducts.length}</strong> produk
            </p>

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
                <p style={{ color: '#5C4A3D' }}>
                  Tidak ada produk dalam kategori ini.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}