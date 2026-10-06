"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CreateOrder } from "../../application/orders/CreateOrder";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import Link from "next/link";

const ONGKOS_KIRIM = 15000;

/**
 * Halaman Checkout
 * Membuat order baru dari isi keranjang belanja
 */
function CheckoutContent() {
  const { cartItems, selectedItems, getSelectedCartTotal, removeSelectedFromCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();

  // Hanya item yang dicentang yang akan di-checkout
  const checkoutItems = cartItems.filter((item) => selectedItems.includes(item.id_produk));

  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alamatError, setAlamatError] = useState("");

  const subtotal = getSelectedCartTotal();
  const total = subtotal + ONGKOS_KIRIM;
  const today = new Date().toISOString();

  // Validasi dan submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: cart tidak boleh kosong
    if (checkoutItems.length === 0) {
      setError("Tidak ada produk yang dipilih untuk checkout.");
      return;
    }

    // Validasi: alamat wajib diisi
    if (!alamat.trim()) {
      setAlamatError("Alamat pengiriman wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Buat order baru di Supabase melalui use case
      await CreateOrder({
        pembeli_id: user.id,
        total_harga: total,
        alamat_pengiriman: alamat.trim(),
        catatan: catatan.trim(),
        cartItems: checkoutItems, // hanya kirim yang terpilih
      });

      // Kosongkan item yang terpilih dari keranjang
      removeSelectedFromCart();

      // Redirect ke halaman order
      router.push("/order");
    } catch (err) {
      setError(`Gagal membuat pesanan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Redirect jika tidak ada item yang terpilih
  if (checkoutItems.length === 0) {
    return (
      <>
        <Navbar />
        <main
          style={{
            backgroundColor: "#F8FAF6",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              border: "1px solid #E5E7EB",
              padding: "3rem 2.5rem",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#EAF6EF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <i className="bi bi-cart-x" style={{ fontSize: "2.2rem", color: "#176B43" }} />
            </div>
            <h5 style={{ fontWeight: 600, color: "#1F2937", marginBottom: "0.5rem" }}>
              Keranjang belanja kosong
            </h5>
            <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>
              Tambahkan produk ke keranjang terlebih dahulu
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#176B43",
                color: "#FFFFFF",
                padding: "10px 24px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Mulai Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </>
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
                <i className="bi bi-bag-check" style={{ fontSize: "1.25rem", color: "#176B43" }} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: "2px", color: "#1F2937", fontSize: "1.4rem" }}>
                  Checkout
                </h4>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "0.875rem" }}>
                  Konfirmasi pesanan Anda
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

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-lg-7">

                {/* Info Pembeli Card */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    marginBottom: "1.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid #F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="bi bi-person-circle" style={{ color: "#176B43" }} />
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>Informasi Pembeli</span>
                  </div>
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", rowGap: "10px", fontSize: "0.9rem" }}>
                      <span style={{ color: "#6B7280" }}>Nama</span>
                      <span style={{ fontWeight: 600, color: "#1F2937" }}>{profile?.nama_user || "-"}</span>
                      <span style={{ color: "#6B7280" }}>Email</span>
                      <span style={{ color: "#1F2937" }}>{user?.email || "-"}</span>
                      <span style={{ color: "#6B7280" }}>Tanggal Order</span>
                      <span style={{ color: "#1F2937" }}>{formatDate(today)}</span>
                    </div>
                  </div>
                </div>

                {/* Alamat Pengiriman Card */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    marginBottom: "1.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid #F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="bi bi-geo-alt" style={{ color: "#176B43" }} />
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>
                      Alamat Pengiriman <span style={{ color: "#DC2626" }}>*</span>
                    </span>
                  </div>
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <textarea
                      rows={3}
                      placeholder="Masukkan alamat lengkap pengiriman..."
                      value={alamat}
                      onChange={(e) => {
                        setAlamat(e.target.value);
                        if (alamatError) setAlamatError("");
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: alamatError ? "1.5px solid #DC2626" : "1.5px solid #E5E7EB",
                        fontSize: "0.9rem",
                        color: "#1F2937",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        transition: "border-color 0.15s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        if (!alamatError) e.target.style.borderColor = "#176B43";
                      }}
                      onBlur={(e) => {
                        if (!alamatError) e.target.style.borderColor = "#E5E7EB";
                      }}
                    />
                    {alamatError && (
                      <p style={{ color: "#DC2626", fontSize: "0.8rem", marginTop: "6px", marginBottom: 0 }}>
                        {alamatError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Catatan Order Card */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    marginBottom: "1.25rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid #F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="bi bi-pencil-square" style={{ color: "#176B43" }} />
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>
                      Detail Informasi Order / Catatan <span style={{ color: "#6B7280", fontWeight: 400, fontSize: "0.85rem" }}>(Opsional)</span>
                    </span>
                  </div>
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Tolong packing kayu, atau warna cadangan hitam..."
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1.5px solid #E5E7EB",
                        fontSize: "0.9rem",
                        color: "#1F2937",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        transition: "border-color 0.15s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#176B43"}
                      onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                    />
                  </div>
                </div>

                {/* Produk Dipesan Card */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid #F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="bi bi-box-seam" style={{ color: "#176B43" }} />
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>
                      Produk Dipesan ({checkoutItems.length} item)
                    </span>
                  </div>
                  <div style={{ padding: "0.5rem 1.5rem" }}>
                    {checkoutItems.map((item, index) => (
                      <div
                        key={item.id_produk}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.85rem 0",
                          borderBottom: index < checkoutItems.length - 1 ? "1px solid #F3F4F6" : "none",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            backgroundColor: "#EAF6EF",
                            flexShrink: 0,
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          {item.gambar_produk ? (
                            <img
                              src={item.gambar_produk}
                              alt={item.nama_produk}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { e.target.src = `https://via.placeholder.com/50x50/EAF6EF/176B43?text=P`; }}
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
                              <i className="bi bi-image" style={{ color: "#9CA3AF", fontSize: "0.8rem" }} />
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              margin: "0 0 2px",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: "#1F2937",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.nama_produk}
                          </p>
                          <small style={{ color: "#6B7280", fontSize: "0.8rem" }}>
                            {item.quantity} × {formatCurrency(item.harga)}
                          </small>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#176B43", flexShrink: 0 }}>
                          {formatCurrency(item.harga * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Summary */}
              <div className="col-lg-5">
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

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>Subtotal</span>
                    <span style={{ color: "#1F2937", fontSize: "0.9rem" }}>{formatCurrency(subtotal)}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>Ongkos Kirim</span>
                    <span style={{ color: "#1F2937", fontSize: "0.9rem" }}>{formatCurrency(ONGKOS_KIRIM)}</span>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #E5E7EB",
                      paddingTop: "1rem",
                      marginBottom: "1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#1F2937", fontSize: "1rem" }}>Total</span>
                    <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#176B43" }}>
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* Info Pembayaran */}
                  <div
                    style={{
                      backgroundColor: "#EAF6EF",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#176B43", fontSize: "0.85rem" }}>
                      <i className="bi bi-info-circle me-1" />
                      Cara Pembayaran:
                    </p>
                    <p style={{ margin: 0, color: "#6B7280", fontSize: "0.82rem" }}>
                      Setelah order dibuat, upload bukti pembayaran di halaman &quot;Pesanan Saya&quot;.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "13px",
                      backgroundColor: loading ? "#9CA3AF" : "#176B43",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "10px",
                      transition: "background-color 0.15s",
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />
                        Membuat Pesanan...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-bag-check" />
                        Buat Pesanan
                      </>
                    )}
                  </button>

                  <Link
                    href="/keranjang"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
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
                    Kembali ke Keranjang
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute requiredRole="pembeli">
      <CheckoutContent />
    </ProtectedRoute>
  );
}
