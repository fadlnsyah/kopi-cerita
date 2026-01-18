'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kopi-cerita-recently-viewed';
const MAX_ITEMS = 10;

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  viewedAt: number;
}

export function useRecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentProduct[];
        // Filter out items older than 7 days
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const filtered = parsed.filter(p => p.viewedAt > sevenDaysAgo);
        setRecentProducts(filtered);
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    }
  }, []);
  
  // Add a product to recently viewed
  const addToRecentlyViewed = useCallback((product: Omit<RecentProduct, 'viewedAt'>) => {
    setRecentProducts(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.id !== product.id);
      // Add to beginning with timestamp
      const newList = [
        { ...product, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      } catch (error) {
        console.error('Error saving recently viewed:', error);
      }
      
      return newList;
    });
  }, []);
  
  // Clear all recently viewed
  const clearRecentlyViewed = useCallback(() => {
    setRecentProducts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  }, []);
  
  return {
    recentProducts,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}
