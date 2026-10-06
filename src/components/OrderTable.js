"use client";

import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  getOrderStatusBadge,
} from "../utils/formatCurrency";

/**
 * Tabel order untuk halaman manajemen order penjual
 * @param {Order[]} orders - Daftar order
 * @param {function} onViewDetail - Callback untuk melihat detail
 * @param {function} onUpdateStatus - Callback untuk update status
 * @param {boolean} loading - State loading
 */
export default function OrderTable({ orders, onViewDetail, onUpdateStatus, loading }) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" style={{ color: "#176B43" }}></div>
        <p className="text-muted mt-2">Memuat order...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-receipt text-muted" style={{ fontSize: "3rem" }}></i>
        <p className="text-muted mt-2">Belum ada order masuk.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead style={{ backgroundColor: "#EAF6EF" }}>
          <tr>
            <th>No Order</th>
            <th>Pembeli</th>
            <th>Tanggal</th>
            <th>Total</th>
            <th>Status</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id_order}>
              {/* No Order */}
              <td>
                <span className="fw-semibold">#{order.id_order}</span>
              </td>

              {/* Pembeli */}
              <td>
                <p className="mb-0 fw-semibold">
                  {order.pembeli?.nama_user || "N/A"}
                </p>
                <small className="text-muted">{order.pembeli?.email}</small>
              </td>

              {/* Tanggal */}
              <td className="text-nowrap">
                <small>{formatDate(order.tgl_order)}</small>
              </td>

              {/* Total */}
              <td className="fw-semibold" style={{ color: "#176B43" }}>
                {formatCurrency(order.total_harga)}
              </td>

              {/* Status */}
              <td>
                <span className={`badge ${getOrderStatusBadge(order.status_order)}`}>
                  {formatOrderStatus(order.status_order)}
                </span>
              </td>

              {/* Aksi */}
              <td>
                <div className="d-flex gap-1 flex-wrap justify-content-center">
                  {/* Detail */}
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#EAF6EF", color: "#176B43" }}
                    onClick={() => onViewDetail(order)}
                    title="Lihat detail"
                  >
                    <i className="bi bi-eye"></i>
                  </button>

                  {/* Terima (dari menunggu_konfirmasi → diproses) */}
                  {order.status_order === "menunggu_konfirmasi" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onUpdateStatus(order.id_order, "diproses")}
                      title="Terima order"
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Terima
                    </button>
                  )}

                  {/* Tolak (dibatalkan) */}
                  {["menunggu_pembayaran", "menunggu_konfirmasi"].includes(
                    order.status_order
                  ) && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onUpdateStatus(order.id_order, "dibatalkan")}
                      title="Tolak order"
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Tolak
                    </button>
                  )}

                  {/* Kirim (diproses → dikirim) */}
                  {order.status_order === "diproses" && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onUpdateStatus(order.id_order, "dikirim")}
                      title="Ubah status ke dikirim"
                    >
                      <i className="bi bi-truck me-1"></i>
                      Kirim
                    </button>
                  )}

                  {/* Selesai (dikirim → selesai) */}
                  {order.status_order === "dikirim" && (
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#176B43", color: "white" }}
                      onClick={() => onUpdateStatus(order.id_order, "selesai")}
                      title="Tandai selesai"
                    >
                      <i className="bi bi-check2-all me-1"></i>
                      Selesai
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

