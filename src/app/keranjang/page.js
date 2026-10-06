"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";

// Ongkos kirim tetap untuk semua order
const ONGKOS_KIRIM = 15000;

/**
 * Halaman Keranjang Belanja
 * Data keranjang diambil dari CartContext (localStorage)
 * Hanya bisa diakses oleh pembeli yang sudah login
 */
function KeranjangContent() {
  const {
    cartItems,
    selectedItems,
    toggleSelection,
    toggleAllSelection,
    getSelectedCartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    isLoaded,
  } = useCart();
  const { profile } = useAuth();
  const router = useRouter();

  const subtotal = getSelectedCartTotal();
  const total = selectedItems.length > 0 ? subtotal + ONGKOS_KIRIM : 0;

  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8FAF6",
        }}
      >
        <div
          className="spinner-border"
          style={{ color: "#176B43", width: "2.5rem", height: "2.5rem" }}
        />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ backgroundColor: "#F8FAF6", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>

          {/* Page Header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "#EAF6EF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i className="bi bi-cart3" style={{ fontSize: "1.25rem", color: "#176B43" }} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: "2px", color: "#1F2937", fontSize: "1.4rem" }}>
                  Keranjang Belanja
                </h4>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "0.875rem" }}>
                  {cartItems.length} item dalam keranjang
                </p>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                border: "1px solid #E5E7EB",
                padding: "4rem 2rem",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#EAF6EF",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <i className="bi bi-cart-x" style={{ fontSize: "2.5rem", color: "#176B43" }} />
              </div>
              <h5 style={{ fontWeight: 600, color: "#1F2937", marginBottom: "0.5rem" }}>
                Keranjang masih kosong
              </h5>
              <p style={{ color: "#6B7280", marginBottom: "1.75rem" }}>
                Yuk tambahkan produk yang kamu suka!
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#176B43",
                  color: "#FFFFFF",
                  padding: "10px 28px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <i className="bi bi-shop" />
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {/* Left: Cart Items */}
              <div className="col-lg-8">
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      padding: "1.25rem 1.5rem",
                      borderBottom: "1px solid #E5E7EB",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      style={{ cursor: "pointer", margin: 0 }}
                      checked={selectedItems.length > 0 && selectedItems.length === cartItems.length}
                      onChange={toggleAllSelection}
                    />
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>
                      Pilih Semua ({cartItems.length} Produk)
                    </span>
                  </div>

                  {/* Items List */}
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id_produk}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1.25rem 1.5rem",
                        borderBottom: index < cartItems.length - 1 ? "1px solid #F3F4F6" : "none",
                        gap: "1rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ cursor: "pointer", margin: 0 }}
                        checked={selectedItems.includes(item.id_produk)}
                        onChange={() => toggleSelection(item.id_produk)}
                      />
                      
                      {/* Product Image */}
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          backgroundColor: "#EAF6EF",
                          flexShrink: 0,
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        {item.gambar_produk ? (
                          <img
                            src={item.gambar_produk.split(',')[0]}
                            alt={item.nama_produk}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/80x80/EAF6EF/176B43?text=P`;
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i className="bi bi-image" style={{ color: "#9CA3AF" }} />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h6
                          style={{
                            fontWeight: 600,
                            marginBottom: "4px",
                            color: "#1F2937",
                            fontSize: "0.95rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.nama_produk}
                        </h6>
                        <p style={{ margin: "0 0 2px", fontWeight: 700, color: "#176B43", fontSize: "0.95rem" }}>
                          {formatCurrency(item.harga)}
                        </p>
                        <small style={{ color: "#6B7280", fontSize: "0.78rem" }}>
                          Subtotal: {formatCurrency(item.harga * item.quantity)}
                        </small>
                      </div>

                      {/* Quantity + Delete */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        {/* Quantity Controls */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E5E7EB",
                            borderRadius: "10px",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() => decreaseQuantity(item.id_produk)}
                            style={{
                              width: "34px",
                              height: "34px",
                              border: "none",
                              backgroundColor: "#F8FAF6",
                              color: "#176B43",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "1rem",
                            }}
                          >
                            <i className="bi bi-dash" />
                          </button>
                          <span
                            style={{
                              width: "36px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: "#1F2937",
                              fontSize: "0.9rem",
                              borderLeft: "1px solid #E5E7EB",
                              borderRight: "1px solid #E5E7EB",
                              lineHeight: "34px",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id_produk)}
                            disabled={Number(item.quantity) >= (Number(item.stok) || 999)}
                            style={{
                              width: "34px",
                              height: "34px",
                              border: "none",
                              backgroundColor: "#F8FAF6",
                              color: "#176B43",
                              cursor: Number(item.quantity) >= (Number(item.stok) || 999) ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "1rem",
                              opacity: Number(item.quantity) >= (Number(item.stok) || 999) ? 0.4 : 1,
                            }}
                          >
                            <i className="bi bi-plus" />
                          </button>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeFromCart(item.id_produk)}
                          title="Hapus dari keranjang"
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            border: "1px solid #FEE2E2",
                            backgroundColor: "#FFF5F5",
                            color: "#DC2626",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="bi bi-trash" style={{ fontSize: "0.85rem" }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="col-lg-4">
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    padding: "1.5rem",
                    position: "sticky",
                    top: "80px",
                  }}
                >
                  {/* Summary Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "1.25rem",
                      paddingBottom: "1rem",
                      borderBottom: "1px solid #F3F4F6",
                    }}
                  >
                    <i className="bi bi-receipt" style={{ color: "#176B43" }} />
                    <h6 style={{ fontWeight: 700, margin: 0, color: "#1F2937" }}>
                      Ringkasan Pembayaran
                    </h6>
                  </div>

                  {/* Summary Rows */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>
                      Subtotal ({selectedItems.length} produk)
                    </span>
                    <span style={{ color: "#1F2937", fontSize: "0.9rem" }}>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>Ongkos Kirim</span>
                    <span style={{ color: "#1F2937", fontSize: "0.9rem" }}>
                      {selectedItems.length > 0 ? formatCurrency(ONGKOS_KIRIM) : formatCurrency(0)}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "1rem", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: "#1F2937" }}>Total Pembayaran</span>
                      <span style={{ fontWeight: 700, fontSize: "1.15rem", color: "#176B43" }}>
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => router.push("/checkout")}
                    disabled={selectedItems.length === 0}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: selectedItems.length === 0 ? "#D1D5DB" : "#176B43",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <i className="bi bi-credit-card" />
                    Checkout {selectedItems.length > 0 ? `(${selectedItems.length})` : ""}
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    href="/"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "11px",
                      backgroundColor: "#EAF6EF",
                      color: "#176B43",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    <i className="bi bi-arrow-left" />
                    Lanjut Belanja
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function KeranjangPage() {
  return (
    <ProtectedRoute requiredRole="pembeli">
      <KeranjangContent />
    </ProtectedRoute>
  );
}
