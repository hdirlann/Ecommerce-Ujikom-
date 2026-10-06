"use client";

import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  getOrderStatusBadge,
} from "../utils/formatCurrency";

/**
 * Modal detail order
 * @param {Order} order - Data order
 * @param {function} onClose - Callback untuk menutup modal
 */
export default function OrderDetail({ order, onClose }) {
  if (!order) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-3 shadow">
          <div
            className="modal-header"
            style={{ backgroundColor: "#176B43", color: "white" }}
          >
            <h5 className="modal-title">
              <i className="bi bi-receipt me-2"></i>
              Detail Order #{order.id_order}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* Status badge */}
            <div className="mb-4 text-center">
              <span
                className={`badge fs-6 px-4 py-2 ${getOrderStatusBadge(order.status_order)}`}
              >
                {formatOrderStatus(order.status_order)}
              </span>
            </div>

            <div className="row g-3">
              {/* Info Pembeli */}
              <div className="col-md-6">
                <div className="card border-0 rounded-3" style={{ backgroundColor: "#F8FAF6" }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3" style={{ color: "#176B43" }}>
                      <i className="bi bi-person me-2"></i>
                      Informasi Pembeli
                    </h6>
                    <p className="mb-1">
                      <strong>Nama:</strong> {order.pembeli?.nama_user || "N/A"}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {order.pembeli?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Order */}
              <div className="col-md-6">
                <div className="card border-0 rounded-3" style={{ backgroundColor: "#F8FAF6" }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3" style={{ color: "#176B43" }}>
                      <i className="bi bi-info-circle me-2"></i>
                      Informasi Order
                    </h6>
                    <p className="mb-1">
                      <strong>Tanggal:</strong> {formatDate(order.tgl_order)}
                    </p>
                    <p className="mb-1">
                      <strong>Total:</strong>{" "}
                      <span className="fw-bold" style={{ color: "#176B43" }}>
                        {formatCurrency(order.total_harga)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Rincian Produk dihilangkan sesuai permintaan */}

              {/* Alamat Pengiriman */}
              <div className="col-12">
                <div className="card border-0 rounded-3" style={{ backgroundColor: "#F8FAF6" }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-2" style={{ color: "#176B43" }}>
                      <i className="bi bi-geo-alt me-2"></i>
                      Alamat Pengiriman
                    </h6>
                    <p className="mb-0">{order.alamat_pengiriman || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Catatan Order */}
              {order.catatan && (
                <div className="col-12">
                  <div className="card border-0 rounded-3" style={{ backgroundColor: "#F8FAF6" }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-2" style={{ color: "#176B43" }}>
                        <i className="bi bi-pencil-square me-2"></i>
                        Catatan Order
                      </h6>
                      <p className="mb-0 text-muted" style={{ fontStyle: "italic" }}>
                        "{order.catatan}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bukti Pembayaran */}
              {order.bukti_bayar && (
                <div className="col-12">
                  <div className="card border-0 rounded-3" style={{ backgroundColor: "#F8FAF6" }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-2" style={{ color: "#176B43" }}>
                        <i className="bi bi-credit-card me-2"></i>
                        Bukti Pembayaran
                      </h6>
                      <a
                        href={order.bukti_bayar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                        style={{ backgroundColor: "#EAF6EF", color: "#176B43" }}
                      >
                        <i className="bi bi-eye me-1"></i>
                        Lihat Bukti Bayar
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: "#EAF6EF", color: "#176B43" }}
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

