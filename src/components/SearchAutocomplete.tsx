'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CoffeeCupIcon, PourOverIcon, LeafIcon, PastryIcon } from './Icons';
import StarRating from './StarRating';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  averageRating: number | null;
  discountPercent: number | null;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'espresso': return CoffeeCupIcon;
    case 'manual-brew': return PourOverIcon;
    case 'non-coffee': return LeafIcon;
    case 'snack': return PastryIcon;
    default: return CoffeeCupIcon;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onProductSelect?: (product: SearchResult) => void;
}

export default function SearchAutocomplete({
  value,
  onChange,
  placeholder = 'Cari kopi atau snack...',
  onProductSelect,
}: SearchAutocompleteProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.products || []);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, results, highlightedIndex]);
  
  const handleSelect = (product: SearchResult) => {
    onChange(product.name);
    setIsOpen(false);
    onProductSelect?.(product);
  };
  
  return (
    <div className="relative">
      {/* Search Input */}
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
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl border outline-none transition-all focus:shadow-md"
          style={{ 
            borderColor: '#E0D6C8', 
            backgroundColor: '#FFFDF9',
            color: '#2B2118',
          }}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div 
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#6F4E37', borderTopColor: 'transparent' }}
            />
          </div>
        )}
        {value && !isLoading && (
          <button
            onClick={() => {
              onChange('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg overflow-hidden z-50"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
        >
          {results.map((product, index) => {
            const IconComponent = getCategoryIcon(product.category);
            const isHighlighted = index === highlightedIndex;
            
            return (
              <Link
                key={product.id}
                href={`/menu?product=${product.id}`}
                onClick={() => handleSelect(product)}
                className={`flex items-center gap-3 p-3 transition-colors ${
                  isHighlighted ? 'bg-[#F5EFE6]' : 'hover:bg-[#F5EFE6]'
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#EBE4D8' }}
                >
                  <IconComponent className="w-6 h-6" color="#6F4E37" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: '#2B2118' }}>
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: '#6F4E37' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.averageRating && product.averageRating > 0 && (
                      <StarRating rating={product.averageRating} size="sm" />
                    )}
                  </div>
                </div>
                {product.discountPercent && (
                  <span 
                    className="px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#DC2626', color: '#FFFDF9' }}
                  >
                    -{product.discountPercent}%
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
      
      {/* No results */}
      {isOpen && value.length >= 2 && results.length === 0 && !isLoading && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl text-center"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
        >
          <p style={{ color: '#5C4A3D' }}>Tidak ditemukan hasil untuk "{value}"</p>
        </div>
      )}
    </div>
  );
}
