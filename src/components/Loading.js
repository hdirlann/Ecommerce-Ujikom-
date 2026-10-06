"use client";

/**
 * Komponen loading spinner
 * @param {string} message - Pesan yang ditampilkan (opsional)
 */
export default function Loading({ message = "Memuat..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border mb-3"
        role="status"
        style={{ color: "#176B43" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">{message}</p>
    </div>
  );
}

