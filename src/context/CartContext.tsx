'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthModal } from './AuthModalContext';

// Types
export interface CartItem {
  id: string;        // CartItem ID from database
  productId: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; category: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const { showLoginModal, setPendingAction } = useAuthModal();

  // Fetch cart dari API
  const fetchCart = useCallback(async () => {
    if (status !== 'authenticated') {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  // Load cart saat session berubah
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    } else if (status === 'unauthenticated') {
      setItems([]);
    }
  }, [status, fetchCart]);

  const addToCart = (product: { id: string; name: string; price: number; category: string }) => {
    // Jika belum login, tampilkan modal dan simpan action
    if (status !== 'authenticated') {
      setPendingAction(() => () => addToCartAPI(product));
      showLoginModal();
      return;
    }

    addToCartAPI(product);
  };

  const addToCartAPI = async (product: { id: string; name: string; price: number; category: string }) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (response.ok) {
        // Refresh cart untuk mendapat data terbaru
        await fetchCart();
      } else {
        const data = await response.json();
        console.error('Error adding to cart:', data.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    if (status !== 'authenticated') return;

    try {
      const response = await fetch(`/api/cart?itemId=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (status !== 'authenticated') return;

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, quantity }),
      });

      if (response.ok) {
        setItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (status !== 'authenticated') return;

    // Hapus semua items satu per satu
    for (const item of items) {
      await removeFromCart(item.id);
    }
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isLoading,
      refreshCart: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
