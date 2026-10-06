"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#F8FAF6", borderTop: "1px solid #E5E7EB", paddingTop: 48, paddingBottom: 32 }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EAF6EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-shop" style={{ color: "#176B43" }}></i>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#176B43" }}>Marketku</span>
            </div>
            <p style={{ color: "#6B7280", fontSize: "0.875rem", lineHeight: 1.7 }}>
              Marketplace UMKM terpercaya untuk belanja produk berkualitas dari penjual lokal Indonesia.
            </p>
          </div>
          <div className="col-6 col-md-2 offset-md-2">
            <h6 style={{ fontWeight: 700, color: "#1F2937", marginBottom: 16, fontSize: "0.875rem" }}>Belanja</h6>
            <ul className="list-unstyled" style={{ fontSize: "0.875rem" }}>
              <li className="mb-2"><Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Beranda</Link></li>
              <li className="mb-2"><Link href="/#produk" style={{ color: "#6B7280", textDecoration: "none" }}>Produk</Link></li>
              <li className="mb-2"><Link href="/keranjang" style={{ color: "#6B7280", textDecoration: "none" }}>Keranjang</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h6 style={{ fontWeight: 700, color: "#1F2937", marginBottom: 16, fontSize: "0.875rem" }}>Akun</h6>
            <ul className="list-unstyled" style={{ fontSize: "0.875rem" }}>
              <li className="mb-2"><Link href="/login" style={{ color: "#6B7280", textDecoration: "none" }}>Masuk</Link></li>
              <li className="mb-2"><Link href="/register" style={{ color: "#6B7280", textDecoration: "none" }}>Daftar</Link></li>
              <li className="mb-2"><Link href="/order" style={{ color: "#6B7280", textDecoration: "none" }}>Pesanan Saya</Link></li>
            </ul>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontWeight: 700, color: "#1F2937", marginBottom: 16, fontSize: "0.875rem" }}>Jual</h6>
            <ul className="list-unstyled" style={{ fontSize: "0.875rem" }}>
              <li className="mb-2"><Link href="/register" style={{ color: "#6B7280", textDecoration: "none" }}>Daftar Penjual</Link></li>
              <li className="mb-2"><Link href="/penjual/produk" style={{ color: "#6B7280", textDecoration: "none" }}>Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: 0 }}>
            © {new Date().getFullYear()} Marketku. Semua hak dilindungi.
          </p>
          <div className="d-flex gap-3">
            <span style={{ color: "#9CA3AF", fontSize: "0.8rem" }}><i className="bi bi-shield-check me-1" style={{ color: "#176B43" }}></i>Transaksi Aman</span>
            <span style={{ color: "#9CA3AF", fontSize: "0.8rem" }}><i className="bi bi-truck me-1" style={{ color: "#176B43" }}></i>Pengiriman Terpercaya</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
