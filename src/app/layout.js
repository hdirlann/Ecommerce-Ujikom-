import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import BootstrapInit from "../components/BootstrapInit";

export const metadata = {
  title: "Marketku - Marketplace UMKM Terpercaya",
  description: "Belanja berbagai kebutuhan dengan mudah, aman, dan nyaman hanya di Marketku.",
};

/**
 * Root layout aplikasi
 * Menyediakan AuthProvider dan CartProvider ke seluruh aplikasi
 */
export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        {/* Bootstrap Icons CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        {/* Inter Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body style={{ backgroundColor: "#FFFFFF", color: "#1F2937", margin: 0 }}>
        <AuthProvider>
          <CartProvider>
            <BootstrapInit />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

