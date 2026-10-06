import SellerSidebar from "../../components/SellerSidebar";

/**
 * Layout khusus untuk halaman penjual
 * Menyediakan sidebar navigasi di sisi kiri
 */
export default function SellerLayout({ children }) {
  return (
    <div className="d-lg-flex" style={{ minHeight: "100vh" }}>
      <SellerSidebar />
      <div className="flex-grow-1" style={{ backgroundColor: "#F8FAF6" }}>
        {children}
      </div>
    </div>
  );
}

