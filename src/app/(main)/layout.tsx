import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import LoginModal from "@/components/LoginModal";

/**
 * Main Layout untuk User/Customer
 * 
 * Layout untuk semua halaman customer (bukan admin)
 * Include: Header, Cart, Login Modal
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <CartProvider>
        <Header />
        {children}
        <LoginModal />
      </CartProvider>
    </AuthModalProvider>
  );
}
