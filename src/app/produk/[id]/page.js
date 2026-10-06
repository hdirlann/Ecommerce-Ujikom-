"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Loading from "../../../components/Loading";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { GetProductById } from "../../../application/products/GetProductById";
import { formatCurrency } from "../../../utils/formatCurrency";

/**
 * Halaman Detail Produk
 * Menampilkan informasi lengkap produk dan tombol tambah ke keranjang
 */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Ambil detail produk berdasarkan ID dari URL
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await GetProductById(params.id);
        if (!data) {
          setError("Produk tidak ditemukan");
          return;
        }
        setProduct(data);
      } catch (err) {
        setError("Gagal memuat produk. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const isAvailable = product?.stok > 0 && product?.status_produk === "tersedia";

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleIncreaseQty = () => {
    if (quantity < (product?.stok || 1)) setQuantity((q) => q + 1);
  };

  // Tambah produk ke keranjang
  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Beli sekarang: tambah ke keranjang lalu redirect ke checkout
  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    addToCart(product, quantity);
    router.push("/keranjang");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <Loading message="Memuat detail produk..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 16px",
            backgroundColor: "#F8FAF6",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#EAF6EF",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <i className="bi bi-exclamation-circle" style={{ color: "#176B43", fontSize: "2.5rem" }}></i>
          </div>
          <h4 style={{ color: "#1F2937", fontWeight: 700, marginBottom: "8px" }}>
            {error || "Produk tidak ditemukan"}
          </h4>
          <p style={{ color: "#6B7280", marginBottom: "24px", fontSize: "0.9rem" }}>
            Produk yang Anda cari mungkin sudah tidak tersedia.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#176B43",
              color: "#FFFFFF",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ backgroundColor: "#FFFFFF", minHeight: "calc(100vh - 120px)" }}>
        {/* Breadcrumb Bar */}
        <div style={{ backgroundColor: "#F8FAF6", borderBottom: "1px solid #E5E7EB" }}>
          <div className="container" style={{ padding: "12px 16px" }}>
            <nav aria-label="breadcrumb">
              <ol
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  fontSize: "0.85rem",
                }}
              >
                <li>
                  <Link
                    href="/"
                    style={{ color: "#176B43", textDecoration: "none", fontWeight: 500 }}
                  >
                    Beranda
                  </Link>
                </li>
                <li style={{ color: "#9CA3AF" }}>
                  <i className="bi bi-chevron-right" style={{ fontSize: "0.7rem" }}></i>
                </li>
                <li>
                  <Link
                    href="/#produk"
                    style={{ color: "#176B43", textDecoration: "none", fontWeight: 500 }}
                  >
                    Produk
                  </Link>
                </li>
                <li style={{ color: "#9CA3AF" }}>
                  <i className="bi bi-chevron-right" style={{ fontSize: "0.7rem" }}></i>
                </li>
                <li
                  style={{
                    color: "#6B7280",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.nama_produk}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container" style={{ padding: "40px 16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* LEFT: Gambar Produk */}
            <div>
              <div
                style={{
                  backgroundColor: "#F8FAF6",
                  borderRadius: "20px",
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {(() => {
                  const images = typeof product.getImages === 'function' 
                    ? product.getImages() 
                    : (product.gambar_produk ? product.gambar_produk.split(',').map(u=>u.trim()).filter(Boolean) : []);
                  
                  if (images.length > 0) {
                    return (
                      <>
                        <img
                          src={images[activeImageIndex]}
                          alt={`${product.nama_produk} - ${activeImageIndex + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/400x400/EAF6EF/176B43?text=${encodeURIComponent(product.nama_produk)}`;
                          }}
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                              style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              }}
                            >
                              <i className="bi bi-chevron-left" style={{ color: "#176B43", fontWeight: "bold" }}></i>
                            </button>
                            <button
                              onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              }}
                            >
                              <i className="bi bi-chevron-right" style={{ color: "#176B43", fontWeight: "bold" }}></i>
                            </button>
                            <div style={{
                              position: "absolute",
                              bottom: "10px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              display: "flex",
                              gap: "5px",
                            }}>
                              {images.map((_, idx) => (
                                <div key={idx} style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: idx === activeImageIndex ? "#176B43" : "rgba(255, 255, 255, 0.7)",
                                  border: idx === activeImageIndex ? "none" : "1px solid #176B43",
                                }} />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  } else {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "12px",
                          color: "#9CA3AF",
                        }}
                      >
                        <i className="bi bi-image" style={{ fontSize: "4rem" }}></i>
                        <span style={{ fontSize: "0.85rem" }}>Tidak ada gambar</span>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            {/* RIGHT: Info Produk */}
            <div>
              {/* Kategori Badge */}
              <div style={{ marginBottom: "14px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    backgroundColor: "#EAF6EF",
                    color: "#176B43",
                    padding: "5px 12px",
                    borderRadius: "99px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  <i className="bi bi-tag-fill"></i>
                  {product.kategori}
                </span>
              </div>

              {/* Nama Produk */}
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#1F2937",
                  lineHeight: 1.25,
                  margin: "0 0 14px",
                }}
              >
                {product.nama_produk}
              </h1>

              {/* Harga */}
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#176B43",
                  marginBottom: "18px",
                  letterSpacing: "-0.5px",
                }}
              >
                {formatCurrency(product.harga)}
              </div>

              {/* Status & Stok */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                  padding: "12px 16px",
                  backgroundColor: "#F8FAF6",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    backgroundColor: isAvailable ? "#ECFDF5" : "#FEF2F2",
                    color: isAvailable ? "#065F46" : "#DC2626",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  <i className={`bi ${isAvailable ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
                  {isAvailable ? "Tersedia" : "Habis"}
                </span>
                <span style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                  Stok:{" "}
                  <strong style={{ color: "#1F2937" }}>{product.stok}</strong> unit
                </span>
              </div>

              {/* Deskripsi */}
              <div
                style={{
                  marginBottom: "24px",
                  padding: "20px",
                  backgroundColor: "#F8FAF6",
                  borderRadius: "16px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <h6
                  style={{
                    fontWeight: 700,
                    color: "#1F2937",
                    fontSize: "0.9rem",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i className="bi bi-file-text" style={{ color: "#176B43" }}></i>
                  Deskripsi Produk
                </h6>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {product.deskripsi || "Tidak ada deskripsi untuk produk ini."}
                </p>
              </div>

              {/* Info Penjual */}
              {product.penjual && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "24px",
                    padding: "14px 16px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "14px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      backgroundColor: "#EAF6EF",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className="bi bi-shop" style={{ color: "#176B43", fontSize: "1.1rem" }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Dijual oleh</div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#176B43",
                        fontSize: "0.9rem",
                      }}
                    >
                      {product.penjual.nama_user}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {isAvailable && (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1F2937",
                      marginBottom: "10px",
                    }}
                  >
                    Jumlah
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1.5px solid #E5E7EB",
                        borderRadius: "12px",
                        overflow: "hidden",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <button
                        onClick={handleDecreaseQty}
                        disabled={quantity <= 1}
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: quantity <= 1 ? "#F9FAFB" : "#EAF6EF",
                          color: quantity <= 1 ? "#9CA3AF" : "#176B43",
                          border: "none",
                          cursor: quantity <= 1 ? "not-allowed" : "pointer",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background-color 0.15s",
                        }}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <div
                        style={{
                          width: "48px",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#1F2937",
                          borderLeft: "1px solid #E5E7EB",
                          borderRight: "1px solid #E5E7EB",
                          height: "40px",
                          lineHeight: "40px",
                        }}
                      >
                        {quantity}
                      </div>
                      <button
                        onClick={handleIncreaseQty}
                        disabled={quantity >= product.stok}
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: quantity >= product.stok ? "#F9FAFB" : "#EAF6EF",
                          color: quantity >= product.stok ? "#9CA3AF" : "#176B43",
                          border: "none",
                          cursor: quantity >= product.stok ? "not-allowed" : "pointer",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background-color 0.15s",
                        }}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                    <span style={{ color: "#6B7280", fontSize: "0.85rem" }}>
                      Maks. <strong style={{ color: "#1F2937" }}>{product.stok}</strong> unit
                    </span>
                  </div>
                </div>
              )}

              {/* Added to Cart Feedback */}
              {addedToCart && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#ECFDF5",
                    border: "1px solid #6EE7B7",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    marginBottom: "16px",
                    color: "#065F46",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  Produk ditambahkan ke keranjang!
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {/* Tambah ke Keranjang */}
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    padding: "13px 20px",
                    backgroundColor: "transparent",
                    color: isAvailable ? "#176B43" : "#9CA3AF",
                    border: `2px solid ${isAvailable ? "#176B43" : "#E5E7EB"}`,
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.15s",
                  }}
                >
                  <i className="bi bi-cart-plus"></i>
                  Tambah ke Keranjang
                </button>

                {/* Beli Sekarang */}
                <button
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                  style={{
                    flex: 1,
                    minWidth: "140px",
                    padding: "13px 20px",
                    backgroundColor: isAvailable ? "#176B43" : "#9CA3AF",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "background-color 0.15s",
                  }}
                >
                  <i className="bi bi-bag-fill"></i>
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
