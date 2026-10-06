"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProtectedRoute from "../../components/ProtectedRoute";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { GetBuyerOrders } from "../../application/orders/GetBuyerOrders";
import { UploadPaymentProof } from "../../application/orders/UploadPaymentProof";
import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  getOrderStatusBadge,
} from "../../utils/formatCurrency";

/**
 * Returns inline style for a status badge based on status_order value
 */
function getStatusStyle(status) {
  switch (status) {
    case "menunggu_pembayaran":
      return { backgroundColor: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" };
    case "menunggu_konfirmasi":
      return { backgroundColor: "#DBEAFE", color: "#1E40AF", border: "1px solid #BFDBFE" };
    case "diproses":
      return { backgroundColor: "#EDE9FE", color: "#6D28D9", border: "1px solid #DDD6FE" };
    case "dikirim":
      return { backgroundColor: "#E0F2FE", color: "#0369A1", border: "1px solid #BAE6FD" };
    case "selesai":
      return { backgroundColor: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0" };
    case "dibatalkan":
      return { backgroundColor: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" };
  }
}

/**
 * Halaman Order Pembeli
 * Menampilkan daftar order milik pembeli yang login
 * Memungkinkan upload bukti pembayaran
 */
function OrderContent() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk upload bukti bayar
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRefs = useRef({});

  // Ambil order milik pembeli yang sedang login
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await GetBuyerOrders(user.id);
      setOrders(data);
    } catch (err) {
      setError("Gagal memuat pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Handle upload bukti pembayaran ke Supabase Storage
  const handleUploadBukti = async (orderId, file) => {
    if (!file) return;

    setUploadingId(orderId);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Upload file dan update status order melalui use case
      await UploadPaymentProof(orderId, file);

      setUploadSuccess(orderId);
      // Refresh daftar order setelah upload
      await fetchOrders();
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err) {
      setUploadError(`Gagal upload: ${err.message}`);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ backgroundColor: "#F8FAF6", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>

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
                <i className="bi bi-bag-check" style={{ fontSize: "1.25rem", color: "#176B43" }} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: "2px", color: "#1F2937", fontSize: "1.4rem" }}>
                  Pesanan Saya
                </h4>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "0.875rem" }}>
                  Riwayat dan status pesanan Anda
                </p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "1.5rem",
                color: "#DC2626",
                fontSize: "0.9rem",
              }}
            >
              <i className="bi bi-exclamation-circle" />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <Loading message="Memuat pesanan..." />
          ) : orders.length === 0 ? (
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
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "#EAF6EF",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <i className="bi bi-bag-x" style={{ fontSize: "2.2rem", color: "#176B43" }} />
              </div>
              <h5 style={{ fontWeight: 600, color: "#1F2937", marginBottom: "0.5rem" }}>
                Belum ada pesanan
              </h5>
              <p style={{ color: "#6B7280", marginBottom: "1.75rem" }}>
                Yuk belanja dan buat pesanan pertama kamu!
              </p>
              <a
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
              </a>
            </div>
          ) : (
            /* Orders List */
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {orders.map((order) => {
                const statusStyle = getStatusStyle(order.status_order);
                return (
                  <div
                    key={order.id_order}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Order Card Header */}
                    <div
                      style={{
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid #F3F4F6",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <h6
                          style={{
                            fontWeight: 700,
                            margin: "0 0 2px",
                            color: "#1F2937",
                            fontSize: "0.95rem",
                          }}
                        >
                          Order #{order.id_order}
                        </h6>
                        <small style={{ color: "#6B7280", fontSize: "0.8rem" }}>
                          {formatDate(order.tgl_order)}
                        </small>
                      </div>
                      {/* Status Badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "5px 14px",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          ...statusStyle,
                        }}
                      >
                        {formatOrderStatus(order.status_order)}
                      </span>
                    </div>

                    {/* Order Card Body */}
                    <div style={{ padding: "1.25rem 1.5rem" }}>
                      {/* Detail Grid */}
                      <div className="row g-3" style={{ marginBottom: "1rem" }}>
                        <div className="col-sm-5">
                          <p style={{ margin: "0 0 4px", color: "#6B7280", fontSize: "0.78rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Alamat Pengiriman
                          </p>
                          <p style={{ margin: 0, color: "#1F2937", fontSize: "0.875rem" }}>
                            {order.alamat_pengiriman}
                          </p>
                        </div>
                        <div className="col-sm-3">
                          <p style={{ margin: "0 0 4px", color: "#6B7280", fontSize: "0.78rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Total Pembayaran
                          </p>
                          <p style={{ margin: 0, fontWeight: 700, color: "#176B43", fontSize: "0.95rem" }}>
                            {formatCurrency(order.total_harga)}
                          </p>
                        </div>
                        <div className="col-sm-4">
                          <p style={{ margin: "0 0 4px", color: "#6B7280", fontSize: "0.78rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Bukti Pembayaran
                          </p>
                          <p style={{ margin: 0 }}>
                            {order.bukti_bayar ? (
                              <a
                                href={order.bukti_bayar}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  color: "#176B43",
                                  textDecoration: "none",
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                }}
                              >
                                <i className="bi bi-eye" />
                                Lihat Bukti
                              </a>
                            ) : (
                              <span style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                                Belum diupload
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Upload Success Alert */}
                      {uploadSuccess === order.id_order && (
                        <div
                          style={{
                            backgroundColor: "#DCFCE7",
                            border: "1px solid #BBF7D0",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#166534",
                            fontSize: "0.875rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <i className="bi bi-check-circle" />
                          Bukti pembayaran berhasil diupload!
                        </div>
                      )}

                      {/* Upload Error Alert */}
                      {uploadingId === null && uploadError && (
                        <div
                          style={{
                            backgroundColor: "#FEF2F2",
                            border: "1px solid #FECACA",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#DC2626",
                            fontSize: "0.875rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <i className="bi bi-exclamation-circle" />
                          {uploadError}
                        </div>
                      )}

                      {/* Upload Section (only for menunggu_pembayaran) */}
                      {order.status_order === "menunggu_pembayaran" && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                            paddingTop: "1rem",
                            borderTop: "1px solid #F3F4F6",
                          }}
                        >
                          {/* Bank Info */}
                          <div
                            style={{
                              backgroundColor: "#EAF6EF",
                              borderRadius: "10px",
                              padding: "10px 14px",
                              flex: 1,
                              minWidth: "200px",
                            }}
                          >
                            <p style={{ margin: "0 0 3px", fontWeight: 600, color: "#176B43", fontSize: "0.82rem" }}>
                              <i className="bi bi-info-circle me-1" />
                              Transfer ke rekening:
                            </p>
                            <p style={{ margin: 0, color: "#374151", fontSize: "0.85rem" }}>
                              BCA 1234567890 a/n Marketku
                            </p>
                          </div>

                          {/* Upload Button */}
                          <div>
                            <input
                              type="file"
                              id={`upload-${order.id_order}`}
                              accept="image/*,application/pdf"
                              className="d-none"
                              ref={(el) => {
                                if (el) fileInputRefs.current[order.id_order] = el;
                              }}
                              onChange={(e) =>
                                handleUploadBukti(order.id_order, e.target.files[0])
                              }
                            />
                            <label
                              htmlFor={`upload-${order.id_order}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                backgroundColor: "#176B43",
                                color: "#FFFFFF",
                                padding: "10px 18px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {uploadingId === order.id_order ? (
                                <>
                                  <span className="spinner-border spinner-border-sm" />
                                  Mengupload...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-upload" />
                                  Upload Bukti Bayar
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function OrderPage() {
  return (
    <ProtectedRoute requiredRole="pembeli">
      <OrderContent />
    </ProtectedRoute>
  );
}
