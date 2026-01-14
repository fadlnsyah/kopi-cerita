'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
  isLoginModalOpen: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

/**
 * AuthModalProvider
 * 
 * Context untuk mengontrol visibility login modal
 * dan menyimpan pending action setelah login
 */
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const showLoginModal = () => setIsLoginModalOpen(true);
  const hideLoginModal = () => {
    setIsLoginModalOpen(false);
    setPendingAction(null);
  };

  return (
    <AuthModalContext.Provider 
      value={{ 
        isLoginModalOpen, 
        showLoginModal, 
        hideLoginModal,
        pendingAction,
        setPendingAction,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
