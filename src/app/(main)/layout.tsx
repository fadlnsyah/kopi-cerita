import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import LoginModal from "@/components/LoginModal";

/**
 * Main Layout untuk User/Customer
 * 
 * Layout untuk semua halaman customer (bukan admin)
 * Include: Header, Cart, Wishlist, Toast, Login Modal
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <Header />
            {children}
            <Footer />
            <LoginModal />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthModalProvider>
  );
}


