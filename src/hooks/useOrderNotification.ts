'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface OrderNotification {
  count: number;
  newOrderIds: string[];
}

/**
 * Hook untuk notifikasi order baru di admin panel
 * Polling setiap 10 detik untuk check pending orders
 */
export function useOrderNotification() {
  const [pendingCount, setPendingCount] = useState(0);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const previousCountRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Buat audio untuk notification sound (bisa pakai built-in browser sound)
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.volume = 0.5;
    
    return () => {
      audioRef.current = null;
    };
  }, []);

  const fetchPendingOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders?status=pending');
      if (response.ok) {
        const data = await response.json();
        const newCount = data.orders?.length || 0;
        
        // Check if there's new order
        if (previousCountRef.current !== null && newCount > previousCountRef.current) {
          setHasNewOrder(true);
          
          // Play notification sound
          if (audioRef.current) {
            audioRef.current.play().catch(() => {
              // Ignore autoplay restrictions
            });
          }
          
          // Auto-hide notification after 5 seconds
          setTimeout(() => setHasNewOrder(false), 5000);
        }
        
        previousCountRef.current = newCount;
        setPendingCount(newCount);
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  }, []);

  // Polling setiap 10 detik
  useEffect(() => {
    fetchPendingOrders(); // Initial fetch
    
    const interval = setInterval(fetchPendingOrders, 10000);
    
    return () => clearInterval(interval);
  }, [fetchPendingOrders]);

  const dismissNotification = () => setHasNewOrder(false);

  return {
    pendingCount,
    hasNewOrder,
    dismissNotification,
    refresh: fetchPendingOrders,
  };
}
