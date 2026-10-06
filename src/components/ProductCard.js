"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { formatCurrency } from "../utils/formatCurrency";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const isAvailable = product.stok > 0 && product.status_produk === "tersedia";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div
      className="product-card"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#F8FAF6" }}>
        {!isAvailable && (
          <div
            style={{
              position: "absolute",
              top: 10, left: 10,
              zIndex: 2,
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 100,
            }}
          >
            Habis
          </div>
        )}
        {product.gambar_produk ? (
          <img
            src={product.gambar_produk.split(',')[0]}
            alt={product.nama_produk}
            className="product-img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x300/F8FAF6/9CA3AF?text=Foto`;
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="bi bi-image" style={{ fontSize: "3rem", color: "#D1D5DB" }}></i>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {/* Category */}
        <span
          style={{
            display: "inline-block",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "#176B43",
            backgroundColor: "#EAF6EF",
            padding: "2px 8px",
            borderRadius: 100,
            marginBottom: 8,
          }}
        >
          {product.kategori}
        </span>

        {/* Name */}
        <h6
          style={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#1F2937",
            marginBottom: 8,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.nama_produk}
        </h6>

        {/* Rating (static for now) */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <i className="bi bi-star-fill" style={{ color: "#FBBF24", fontSize: "0.75rem" }}></i>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1F2937" }}>4.8</span>
          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>(12)</span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 14, flexGrow: 1 }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "#1F2937" }}>
            {formatCurrency(product.harga)}
          </span>
        </div>

        {/* Stock info */}
        <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: 14 }}>
          Stok: {product.stok} unit
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <Link
            href={`/produk/${product.id_produk}`}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              backgroundColor: "#FFFFFF",
              color: "#1F2937",
              fontWeight: 600,
              fontSize: "0.8rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              transition: "all 0.15s",
            }}
          >
            <i className="bi bi-eye"></i>
            Detail
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            style={{
              padding: "9px 14px",
              borderRadius: 10,
              border: "none",
              backgroundColor: isAvailable ? "#176B43" : "#E5E7EB",
              color: isAvailable ? "white" : "#9CA3AF",
              cursor: isAvailable ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            <i className="bi bi-bag-plus" style={{ fontSize: "0.95rem" }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
