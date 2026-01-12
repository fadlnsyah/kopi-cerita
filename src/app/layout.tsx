import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

/**
 * Source Sans 3 - Font untuk body text
 */
const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/**
 * Lora - Font untuk heading
 */
const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/**
 * Metadata untuk SEO
 */
export const metadata: Metadata = {
  title: {
    default: "Kopi Cerita - Setiap Kopi Punya Cerita",
    template: "%s | Kopi Cerita",
  },
  description:
    "Kopi Cerita adalah kedai kopi dengan konsep minimalis dan sentuhan tradisional Indonesia.",
  keywords: ["kopi", "coffee shop", "kedai kopi", "kopi indonesia", "coffee"],
  authors: [{ name: "Kopi Cerita" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Kopi Cerita",
    title: "Kopi Cerita - Setiap Kopi Punya Cerita",
    description: "Kedai kopi dengan konsep minimalis dan sentuhan tradisional Indonesia.",
  },
};

/**
 * Root Layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sourceSans.variable} ${lora.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

