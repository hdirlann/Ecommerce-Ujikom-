"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/**
 * Halaman Login
 * Menggunakan Supabase Auth untuk proses login
 * Redirect berdasarkan role: pembeli → /, penjual → /penjual/produk
 */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setError(null);
  };

  // Validasi form
  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = "Email wajib diisi";
    if (!formData.password) errors.password = "Password wajib diisi";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proses login dengan Supabase Auth
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await login({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        // Tampilkan pesan error yang ramah
        if (loginError.includes("Invalid login credentials")) {
          setError("Email atau password salah. Silakan coba lagi.");
        } else {
          setError(loginError);
        }
        return;
      }

      // Redirect berdasarkan role
      const userRole = data?.profile?.role;
      if (userRole === "penjual") {
        router.push("/penjual/produk");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "calc(100vh - 120px)",
          backgroundColor: "#F8FAF6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
          }}
        >
          {/* Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              padding: "40px 36px",
            }}
          >
            {/* Logo + Brand */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#EAF6EF",
                  borderRadius: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <i
                  className="bi bi-bag-heart-fill"
                  style={{ color: "#176B43", fontSize: "1.6rem" }}
                ></i>
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "#176B43",
                  letterSpacing: "-0.3px",
                  marginBottom: "16px",
                }}
              >
                Marketku
              </div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1F2937",
                  margin: "0 0 6px",
                  lineHeight: 1.3,
                }}
              >
                Selamat Datang Kembali
              </h1>
              <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>
                Masuk ke akun Anda
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  marginBottom: "20px",
                  color: "#DC2626",
                  fontSize: "0.875rem",
                }}
              >
                <i className="bi bi-exclamation-circle-fill"></i>
                {error}
              </div>
            )}

            {/* Form Login */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#1F2937",
                    marginBottom: "6px",
                  }}
                >
                  Email <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#176B43",
                      fontSize: "0.95rem",
                      pointerEvents: "none",
                    }}
                  >
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    autoComplete="email"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 38px",
                      border: `1.5px solid ${validationErrors.email ? "#DC2626" : "#E5E7EB"}`,
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      color: "#1F2937",
                      backgroundColor: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => { if (!validationErrors.email) e.target.style.borderColor = "#176B43"; }}
                    onBlur={(e) => { if (!validationErrors.email) e.target.style.borderColor = "#E5E7EB"; }}
                  />
                </div>
                {validationErrors.email && (
                  <p style={{ color: "#DC2626", fontSize: "0.8rem", margin: "4px 0 0" }}>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#1F2937",
                    marginBottom: "6px",
                  }}
                >
                  Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#176B43",
                      fontSize: "0.95rem",
                      pointerEvents: "none",
                    }}
                  >
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password Anda"
                    autoComplete="current-password"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 38px",
                      border: `1.5px solid ${validationErrors.password ? "#DC2626" : "#E5E7EB"}`,
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      color: "#1F2937",
                      backgroundColor: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => { if (!validationErrors.password) e.target.style.borderColor = "#176B43"; }}
                    onBlur={(e) => { if (!validationErrors.password) e.target.style.borderColor = "#E5E7EB"; }}
                  />
                </div>
                {validationErrors.password && (
                  <p style={{ color: "#DC2626", fontSize: "0.8rem", margin: "4px 0 0" }}>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: loading ? "#4CAF80" : "#176B43",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background-color 0.2s",
                  letterSpacing: "0.01em",
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Masuk...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right"></i>
                    Masuk
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "24px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
              <span style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>atau</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
            </div>

            {/* Link Register */}
            <p
              style={{
                textAlign: "center",
                color: "#6B7280",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              Belum punya akun?{" "}
              <Link
                href="/register"
                style={{
                  color: "#176B43",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
