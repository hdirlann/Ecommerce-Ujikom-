"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, profile, logout, loading } = useAuth();
  const { getCartCount } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const cartCount = getCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isPenjual = profile?.role === "penjual";
  const displayName = profile?.nama_user || user?.email?.split("@")[0] || "Pengguna";

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top navbar-marketku"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.05)",
        height: "70px",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              backgroundColor: "#EAF6EF",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <i className="bi bi-shop" style={{ color: "#176B43", fontSize: "1.1rem" }}></i>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#176B43", letterSpacing: "-0.5px" }}>
            Marketku
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          style={{ color: "#6B7280" }}
        >
          <i className="bi bi-list" style={{ fontSize: "1.5rem", color: "#1F2937" }}></i>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {/* Left links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-lg-1">
            <li className="nav-item">
              <Link href="/" className="nav-link" style={{ color: "#1F2937", fontWeight: 500, fontSize: "0.9rem" }}>
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#produk" className="nav-link" style={{ color: "#1F2937", fontWeight: 500, fontSize: "0.9rem" }}>
                Produk
              </Link>
            </li>
          </ul>

          {/* Right side */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            {loading ? (
              <li className="nav-item">
                <span style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>Memuat...</span>
              </li>
            ) : user ? (
              <>
                {/* Cart (pembeli only) */}
                {!isPenjual && (
                  <li className="nav-item">
                    <Link
                      href="/keranjang"
                      className="d-flex align-items-center justify-content-center position-relative"
                      style={{
                        width: 40, height: 40,
                        borderRadius: 10,
                        backgroundColor: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        color: "#6B7280",
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                    >
                      <i className="bi bi-bag" style={{ fontSize: "1rem" }}></i>
                      {cartCount > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: -6, right: -6,
                            backgroundColor: "#176B43",
                            color: "white",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            borderRadius: "50%",
                            width: 18, height: 18,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {/* Profile dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="dropdown-toggle border-0 d-flex align-items-center gap-2"
                    style={{
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB !important",
                      borderRadius: 12,
                      padding: "8px 14px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    data-bs-toggle="dropdown"
                  >
                    <div
                      style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#EAF6EF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i className="bi bi-person-fill" style={{ color: "#176B43", fontSize: "0.9rem" }}></i>
                    </div>
                    <div className="d-none d-md-block text-start" style={{ lineHeight: 1.2 }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1F2937", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {displayName}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                        {isPenjual ? "Penjual" : "Pembeli"}
                      </div>
                    </div>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border" style={{ borderRadius: 16, padding: 8, minWidth: 220, borderColor: "#E5E7EB", marginTop: 8 }}>
                    <li className="px-3 py-2 mb-1">
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1F2937" }}>{displayName}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{isPenjual ? "🏪 Penjual" : "🛒 Pembeli"}</div>
                    </li>
                    <li><hr className="dropdown-divider" style={{ margin: "4px 0" }} /></li>

                    {isPenjual ? (
                      <>
                        <li>
                          <Link href="/penjual/produk" className="dropdown-item d-flex align-items-center gap-2" style={{ borderRadius: 8, padding: "9px 12px" }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="bi bi-box-seam" style={{ color: "#4F46E5" }}></i>
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Produk Saya</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/penjual/order" className="dropdown-item d-flex align-items-center gap-2" style={{ borderRadius: 8, padding: "9px 12px" }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="bi bi-receipt" style={{ color: "#15803D" }}></i>
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Order Masuk</span>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link href="/keranjang" className="dropdown-item d-flex align-items-center gap-2" style={{ borderRadius: 8, padding: "9px 12px" }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#FEF9C3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="bi bi-bag" style={{ color: "#CA8A04" }}></i>
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Keranjang</span>
                            {cartCount > 0 && <span className="badge ms-auto" style={{ backgroundColor: "#176B43", color: "white", borderRadius: 6, padding: "2px 7px" }}>{cartCount}</span>}
                          </Link>
                        </li>
                        <li>
                          <Link href="/order" className="dropdown-item d-flex align-items-center gap-2" style={{ borderRadius: 8, padding: "9px 12px" }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="bi bi-clock-history" style={{ color: "#7C3AED" }}></i>
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Riwayat Pesanan</span>
                          </Link>
                        </li>
                      </>
                    )}

                    <li><hr className="dropdown-divider" style={{ margin: "4px 0" }} /></li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        style={{ borderRadius: 8, padding: "9px 12px", border: "none", width: "100%", background: "none", cursor: "pointer" }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="bi bi-box-arrow-right" style={{ color: "#DC2626" }}></i>
                        </div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Keluar</span>
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex gap-2 mt-3 mt-lg-0">
                <Link
                  href="/login"
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    color: "#1F2937",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    backgroundColor: "#176B43",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "all 0.15s",
                    boxShadow: "0 2px 8px rgba(23,107,67,0.25)",
                  }}
                >
                  Daftar
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
