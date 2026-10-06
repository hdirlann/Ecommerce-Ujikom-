"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { GetProducts } from "../application/products/GetProducts";

const CATEGORIES = [
  { name: "Semua", icon: "bi-grid-3x3" },
  { name: "Elektronik", icon: "bi-laptop" },
  { name: "Pakaian", icon: "bi-bag" },
  { name: "Makanan & Minuman", icon: "bi-cup-hot" },
  { name: "Kesehatan", icon: "bi-heart-pulse" },
  { name: "Olahraga", icon: "bi-bicycle" },
  { name: "Rumah Tangga", icon: "bi-house-heart" },
  { name: "Buku & Stationery", icon: "bi-book" },
  { name: "Otomotif", icon: "bi-car-front" },
  { name: "Lainnya", icon: "bi-three-dots" },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await GetProducts({ status: "tersedia" });
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError("Gagal memuat produk. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter((p) => p.kategori === selectedCategory);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section style={{ backgroundColor: "#F8FAF6", padding: "72px 0" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left */}
            <div className="col-lg-6">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#EAF6EF",
                  border: "1px solid #C6E9D8",
                  borderRadius: 100,
                  padding: "6px 16px",
                  marginBottom: 24,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#176B43", display: "inline-block" }}></span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#176B43" }}>Marketplace UMKM Terpercaya</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 800,
                  color: "#1F2937",
                  lineHeight: 1.2,
                  marginBottom: 20,
                }}
              >
                Temukan Produk Terbaik
                <br />
                <span style={{ color: "#176B43" }}>dari Penjual Terpercaya</span>
              </h1>

              <p style={{ fontSize: "1.05rem", color: "#6B7280", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                Belanja berbagai kebutuhan dengan mudah, aman, dan nyaman hanya di Marketku.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <a
                  href="#produk"
                  style={{
                    padding: "14px 32px",
                    borderRadius: 12,
                    backgroundColor: "#176B43",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 14px rgba(23,107,67,0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  <i className="bi bi-bag"></i>
                  Mulai Belanja
                </a>
                <Link
                  href="/register"
                  style={{
                    padding: "14px 32px",
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                    color: "#1F2937",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1.5px solid #E5E7EB",
                    transition: "all 0.2s",
                  }}
                >
                  <i className="bi bi-person-plus"></i>
                  Daftar Gratis
                </Link>
              </div>

              {/* Stats */}
              <div className="d-flex gap-4 mt-5 flex-wrap">
                {[
                  { num: products.length + "+", label: "Produk Tersedia" },
                  { num: "100%", label: "Transaksi Aman" },
                  { num: "24/7", label: "Layanan Online" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#176B43" }}>{s.num}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="col-lg-6 d-none d-lg-block">
              <div
                style={{
                  borderRadius: 24,
                  overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  padding: 24,
                }}
              >
                <div className="row g-3">
                  {[
                    { icon: "bi-bag-check", label: "Produk Berkualitas", color: "#EAF6EF", iconColor: "#176B43" },
                    { icon: "bi-shield-check", label: "Transaksi Aman", color: "#EEF2FF", iconColor: "#4F46E5" },
                    { icon: "bi-grid", label: "Pilihan Lengkap", color: "#FEF9C3", iconColor: "#CA8A04" },
                    { icon: "bi-headset", label: "Dukungan 24/7", color: "#FCE7F3", iconColor: "#DB2777" },
                  ].map((f) => (
                    <div key={f.label} className="col-6">
                      <div
                        style={{
                          backgroundColor: f.color,
                          borderRadius: 16,
                          padding: "20px 16px",
                          textAlign: "center",
                        }}
                      >
                        <i className={`bi ${f.icon}`} style={{ fontSize: "1.8rem", color: f.iconColor }}></i>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1F2937", marginTop: 8 }}>{f.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "16px 20px", backgroundColor: "#F8FAF6", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  <i className="bi bi-truck" style={{ fontSize: "1.5rem", color: "#176B43" }}></i>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1F2937" }}>Pengiriman ke Seluruh Indonesia</div>
                    <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Aman & Terpercaya</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "56px 0", borderTop: "1px solid #F3F4F6" }}>
        <div className="container">
          <div className="row g-4">
            {[
              { icon: "bi-patch-check", title: "Produk Berkualitas", desc: "Dari penjual UMKM terpercaya", color: "#EAF6EF", iconColor: "#176B43" },
              { icon: "bi-shield-lock", title: "Transaksi Aman", desc: "Pembayaran terjamin 100%", color: "#EEF2FF", iconColor: "#4F46E5" },
              { icon: "bi-grid-3x3-gap", title: "Pilihan Lengkap", desc: "Banyak kategori produk", color: "#FEF9C3", iconColor: "#CA8A04" },
              { icon: "bi-headset", title: "Dukungan 24/7", desc: "Siap membantu kapan saja", color: "#FCE7F3", iconColor: "#DB2777" },
            ].map((b) => (
              <div key={b.title} className="col-6 col-md-3">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: b.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`bi ${b.icon}`} style={{ fontSize: "1.25rem", color: b.iconColor }}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1F2937", marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>{b.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main style={{ backgroundColor: "#F8FAF6", padding: "56px 0" }} id="produk">
        <div className="container">

          {/* Section header */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#1F2937", marginBottom: 4 }}>Kategori Populer</h2>
              <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>Temukan produk sesuai kebutuhanmu</p>
            </div>
          </div>

          {/* Category pills */}
          <div className="d-flex gap-2 flex-wrap mb-6" style={{ marginBottom: 40 }}>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 100,
                    border: isActive ? "1.5px solid #176B43" : "1.5px solid #E5E7EB",
                    backgroundColor: isActive ? "#176B43" : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : "#6B7280",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <i className={`bi ${cat.icon}`} style={{ fontSize: "0.85rem" }}></i>
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: 40, maxWidth: 560 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #E5E7EB",
                borderRadius: 14,
                padding: "10px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <i className="bi bi-search" style={{ color: "#9CA3AF", fontSize: "1rem", flexShrink: 0 }}></i>
              <input
                type="text"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.9rem",
                  color: "#1F2937",
                  backgroundColor: "transparent",
                }}
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, flexShrink: 0 }}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>

          {/* Products header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.5rem", color: "#1F2937", marginBottom: 2 }}>
                {selectedCategory === "Semua" ? "Produk Terbaru" : selectedCategory}
              </h2>
              <p style={{ color: "#9CA3AF", fontSize: "0.85rem", margin: 0 }}>{filteredProducts.length} produk ditemukan</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert" style={{ backgroundColor: "#FEF9C3", border: "1px solid #FDE68A", borderRadius: 12, color: "#854D0E", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="bi bi-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <Loading message="Memuat produk..." />
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <i className="bi bi-search" style={{ fontSize: "2rem", color: "#9CA3AF" }}></i>
              </div>
              <p style={{ color: "#6B7280", fontSize: "1rem", marginBottom: 16 }}>
                {searchQuery ? `Produk "${searchQuery}" tidak ditemukan` : "Belum ada produk tersedia"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ padding: "10px 24px", borderRadius: 10, border: "none", backgroundColor: "#EAF6EF", color: "#176B43", fontWeight: 600, cursor: "pointer" }}
                >
                  Hapus Pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {filteredProducts.map((product) => (
                <div key={product.id_produk} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ===== CTA SECTION ===== */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "64px 0", borderTop: "1px solid #F3F4F6" }}>
        <div className="container">
          <div
            style={{
              backgroundColor: "#F8FAF6",
              borderRadius: 24,
              padding: "48px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
              border: "1px solid #E5E7EB",
            }}
          >
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#176B43", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Untuk Penjual</div>
              <h3 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1F2937", marginBottom: 8 }}>Mulai Berjualan di Marketku</h3>
              <p style={{ color: "#6B7280", margin: 0, fontSize: "0.9rem" }}>Daftar sebagai penjual dan kelola produk Anda sekarang.</p>
            </div>
            <Link
              href="/register"
              style={{
                padding: "14px 28px",
                borderRadius: 12,
                backgroundColor: "#176B43",
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 14px rgba(23,107,67,0.25)",
                whiteSpace: "nowrap",
              }}
            >
              <i className="bi bi-shop"></i>
              Daftar Sebagai Penjual
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
