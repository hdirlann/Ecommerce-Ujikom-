"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import OrderTable from "../../../components/OrderTable";
import OrderDetail from "../../../components/OrderDetail";
import Loading from "../../../components/Loading";
import { GetSellerOrders } from "../../../application/orders/GetSellerOrders";
import { UpdateOrderStatus } from "../../../application/orders/UpdateOrderStatus";
import { formatCurrency, formatOrderStatus, getOrderStatusBadge } from "../../../utils/formatCurrency";

// Status yang bisa dipilih penjual secara manual
const STATUS_OPTIONS = [
  { value: "menunggu_pembayaran", label: "Menunggu Pembayaran" },
  { value: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
  { value: "diproses", label: "Diproses" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

// Color config per filter pill (inactive state accent)
const PILL_COLORS = {
  menunggu_pembayaran: { bg: "#FFF7ED", color: "#C2410C", activeBg: "#EA580C" },
  menunggu_konfirmasi: { bg: "#EEF2FF", color: "#4338CA", activeBg: "#6366F1" },
  diproses: { bg: "#FFFBEB", color: "#B45309", activeBg: "#F59E0B" },
  dikirim: { bg: "#EFF6FF", color: "#1D4ED8", activeBg: "#3B82F6" },
  selesai: { bg: "#F0FDF4", color: "#15803D", activeBg: "#22C55E" },
  dibatalkan: { bg: "#FEF2F2", color: "#B91C1C", activeBg: "#EF4444" },
};

/**
 * Halaman Manajemen Order Penjual
 * Menampilkan daftar order, detail, terima, tolak, dan ubah status
 */
function PenjualOrderContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State untuk modal detail
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State untuk filter status
  const [filterStatus, setFilterStatus] = useState("semua");
  // State untuk sort
  const [sortOrder, setSortOrder] = useState("terbaru");

  // Ambil semua order dari Supabase melalui use case
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await GetSellerOrders();
      setOrders(data);
    } catch (err) {
      setError("Gagal memuat order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Update status order
  const handleUpdateStatus = async (orderId, newStatus) => {
    const statusLabel = formatOrderStatus(newStatus);
    const confirmed = window.confirm(
      `Ubah status order #${orderId} menjadi "${statusLabel}"?`
    );
    if (!confirmed) return;

    try {
      await UpdateOrderStatus(orderId, newStatus);
      showSuccess(`Status order #${orderId} diperbarui menjadi "${statusLabel}"`);
      await fetchOrders();
    } catch (err) {
      setError(`Gagal mengubah status: ${err.message}`);
    }
  };

  // Penghasilan (hanya dari order selesai)
  const totalPenghasilan = orders
    .filter((o) => o.status_order === "selesai")
    .reduce((acc, curr) => acc + (curr.total_harga || 0), 0);

  // Filter orders berdasarkan status
  const filteredOrders =
    filterStatus === "semua"
      ? orders
      : orders.filter((o) => o.status_order === filterStatus);

  // Sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === "terbaru") {
      return new Date(b.tgl_order) - new Date(a.tgl_order);
    } else if (sortOrder === "terlama") {
      return new Date(a.tgl_order) - new Date(b.tgl_order);
    } else if (sortOrder === "tertinggi") {
      return b.total_harga - a.total_harga;
    } else if (sortOrder === "terendah") {
      return a.total_harga - b.total_harga;
    }
    return 0;
  });

  return (
    <div style={{ padding: "32px", backgroundColor: "#F8FAF6", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h4
          style={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#1F2937",
            marginBottom: "4px",
          }}
        >
          Order Masuk
        </h4>
        <p style={{ color: "#6B7280", margin: 0, fontSize: "0.925rem" }}>
          Kelola semua pesanan dari pembeli &mdash;{" "}
          <span style={{ fontWeight: 600, color: "#176B43" }}>
            {orders.length} order
          </span>
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#EAF6EF",
            border: "1px solid #A7D7C5",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "20px",
            color: "#0F5132",
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          <i
            className="bi bi-check-circle-fill"
            style={{ fontSize: "1.1rem", color: "#176B43" }}
          ></i>
          {successMessage}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "20px",
            color: "#991B1B",
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          <i
            className="bi bi-exclamation-circle-fill"
            style={{ fontSize: "1.1rem", color: "#DC2626" }}
          ></i>
          <span style={{ flex: 1 }}>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#991B1B",
              padding: "0",
              lineHeight: 1,
              fontSize: "1rem",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      {/* Statistik Cepat */}
      {!loading && (
        <>
          {/* Card Penghasilan Khusus (Lebar penuh) */}
          <div
            style={{
              backgroundColor: "#176B43",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(23, 107, 67, 0.2)",
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "16px",
              color: "#fff",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                flexShrink: 0,
              }}
            >
              <i className="bi bi-cash-coin"></i>
            </div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "4px", opacity: 0.9 }}>
                Total Penghasilan (Pesanan Selesai)
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  lineHeight: 1,
                  wordBreak: "break-word",
                }}
              >
                {formatCurrency(totalPenghasilan)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
          {[
            {
              label: "Total Order",
              count: orders.length,
              icon: "bi-receipt",
              iconBg: "#EAF6EF",
              iconColor: "#176B43",
            },
            {
              label: "Menunggu Pembayaran",
              count: orders.filter((o) => o.status_order === "menunggu_pembayaran").length,
              icon: "bi-wallet2",
              iconBg: "#FEF9C3",
              iconColor: "#CA8A04",
            },
            {
              label: "Menunggu Konfirmasi",
              count: orders.filter((o) => o.status_order === "menunggu_konfirmasi").length,
              icon: "bi-hourglass-split",
              iconBg: "#EEF2FF",
              iconColor: "#6366F1",
            },
            {
              label: "Diproses",
              count: orders.filter((o) => o.status_order === "diproses").length,
              icon: "bi-gear-fill",
              iconBg: "#FFFBEB",
              iconColor: "#F59E0B",
            },
            {
              label: "Dikirim",
              count: orders.filter((o) => o.status_order === "dikirim").length,
              icon: "bi-truck",
              iconBg: "#E0F2FE",
              iconColor: "#0284C7",
            },
            {
              label: "Selesai",
              count: orders.filter((o) => o.status_order === "selesai").length,
              icon: "bi-check-circle-fill",
              iconBg: "#F0FDF4",
              iconColor: "#22C55E",
            },
            {
              label: "Dibatalkan",
              count: orders.filter((o) => o.status_order === "dibatalkan").length,
              icon: "bi-x-circle-fill",
              iconBg: "#FEF2F2",
              iconColor: "#EF4444",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: stat.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.35rem",
                  color: stat.iconColor,
                  flexShrink: 0,
                }}
              >
                <i className={`bi ${stat.icon}`}></i>
              </div>
              <div>
                <div
                  style={{
                    fontSize: stat.label === "Penghasilan" ? "1.1rem" : "1.65rem",
                    fontWeight: 800,
                    color: "#1F2937",
                    lineHeight: 1.2,
                    marginBottom: "4px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {stat.count}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6B7280", fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Action Bar: Filter & Sort */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        {/* Filter Status Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {/* Semua pill */}
          <button
            onClick={() => setFilterStatus("semua")}
            style={{
              border: filterStatus === "semua" ? "none" : "1px solid #E5E7EB",
              borderRadius: "999px",
              padding: "6px 16px",
              fontSize: "0.83rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor:
                filterStatus === "semua" ? "#176B43" : "#fff",
              color: filterStatus === "semua" ? "#fff" : "#6B7280",
              transition: "all 0.15s",
            }}
          >
            Semua
          </button>

          {STATUS_OPTIONS.map((opt) => {
            const palette = PILL_COLORS[opt.value] || {};
            const isActive = filterStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                style={{
                  border: isActive ? "none" : "1px solid #E5E7EB",
                  borderRadius: "999px",
                  padding: "6px 16px",
                  fontSize: "0.83rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: isActive
                    ? (palette.activeBg || "#176B43")
                    : (palette.bg || "#fff"),
                  color: isActive ? "#fff" : (palette.color || "#6B7280"),
                  transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "0.85rem", color: "#6B7280", fontWeight: 600 }}>Urutkan:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "0.85rem",
              outline: "none",
              backgroundColor: "#fff",
              color: "#1F2937",
              cursor: "pointer",
            }}
          >
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
            <option value="tertinggi">Harga Tertinggi</option>
            <option value="terendah">Harga Terendah</option>
          </select>
        </div>
      </div>

      {/* Tabel Order */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "48px 24px" }}>
            <Loading message="Memuat order..." />
          </div>
        ) : (
          <OrderTable
            orders={sortedOrders}
            onViewDetail={(order) => setSelectedOrder(order)}
            onUpdateStatus={handleUpdateStatus}
            loading={false}
          />
        )}
      </div>

      {/* Modal Detail Order */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default function PenjualOrderPage() {
  return (
    <ProtectedRoute requiredRole="penjual">
      <PenjualOrderContent />
    </ProtectedRoute>
  );
}
