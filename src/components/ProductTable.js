"use client";

import { formatCurrency } from "../utils/formatCurrency";
import { formatOrderStatus, getOrderStatusBadge } from "../utils/formatCurrency";

/**
 * Tabel produk untuk halaman manajemen produk penjual
 * @param {Product[]} products - Daftar produk
 * @param {function} onEdit - Callback saat tombol edit diklik
 * @param {function} onDelete - Callback saat tombol hapus diklik
 * @param {boolean} loading - State loading
 */
export default function ProductTable({ products, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" style={{ color: "#176B43" }}></div>
        <p className="text-muted mt-2">Memuat produk...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-box-seam text-muted" style={{ fontSize: "3rem" }}></i>
        <p className="text-muted mt-2">Belum ada produk. Tambahkan produk pertama Anda!</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead style={{ backgroundColor: "#EAF6EF" }}>
          <tr>
            <th className="text-nowrap">Gambar</th>
            <th>Nama Produk</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Status</th>
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id_produk}>
              {/* Gambar */}
              <td>
                {product.gambar_produk ? (
                  <img
                    src={product.gambar_produk.split(',')[0]}
                    alt={product.nama_produk}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/60x60/EAF6EF/176B43?text=P`;
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#EAF6EF",
                      borderRadius: "8px",
                    }}
                  >
                    <i className="bi bi-image text-muted"></i>
                  </div>
                )}
              </td>

              {/* Nama */}
              <td>
                <p className="mb-0 fw-semibold">{product.nama_produk}</p>
                <small className="text-muted">
                  {product.deskripsi?.substring(0, 50)}
                  {product.deskripsi?.length > 50 ? "..." : ""}
                </small>
              </td>

              {/* Kategori */}
              <td>
                <span
                  className="badge"
                  style={{ backgroundColor: "#EAF6EF", color: "#176B43" }}
                >
                  {product.kategori}
                </span>
              </td>

              {/* Harga */}
              <td className="fw-semibold" style={{ color: "#176B43" }}>
                {formatCurrency(product.harga)}
              </td>

              {/* Stok */}
              <td>
                <span className={product.stok === 0 ? "text-danger fw-bold" : ""}>
                  {product.stok}
                </span>
              </td>

              {/* Status */}
              <td>
                <span
                  className={`badge ${
                    product.status_produk === "tersedia"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {product.status_produk === "tersedia" ? "Tersedia" : "Habis"}
                </span>
              </td>

              {/* Aksi */}
              <td className="text-center">
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#EAF6EF", color: "#176B43" }}
                    onClick={() => onEdit(product)}
                    title="Edit produk"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(product)}
                    title="Hapus produk"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

