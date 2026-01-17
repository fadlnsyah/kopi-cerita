import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { WishlistProvider } from "@/context/WishlistContext";
import LoginModal from "@/components/LoginModal";

/**
 * Main Layout untuk User/Customer
 * 
 * Layout untuk semua halaman customer (bukan admin)
 * Include: Header, Cart, Wishlist, Login Modal
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <CartProvider>
        <WishlistProvider>
          <Header />
          {children}
          <LoginModal />
        </WishlistProvider>
      </CartProvider>
    </AuthModalProvider>
  );
}

