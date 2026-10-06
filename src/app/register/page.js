"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/**
 * Halaman Register - Pendaftaran akun pembeli dan penjual
 * Menggunakan Supabase Auth untuk proses registrasi
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama_user: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validasi form sebelum submit
  const validate = () => {
    const errors = {};

    if (!formData.nama_user.trim()) {
      errors.nama_user = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password tidak cocok";
    }

    if (!formData.role) {
      errors.role = "Role wajib dipilih";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proses registrasi user baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: regError } = await register({
        nama_user: formData.nama_user,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (regError) {
        setError(regError);
        return;
      }

      // Registrasi berhasil
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: "100%",
    padding: "11px 14px 11px 38px",
    border: `1.5px solid ${validationErrors[fieldName] ? "#DC2626" : "#E5E7EB"}`,
    borderRadius: "10px",
    fontSize: "0.9rem",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  });

  const iconStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#176B43",
    fontSize: "0.95rem",
    pointerEvents: "none",
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
        <div style={{ width: "100%", maxWidth: "480px" }}>
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
                Buat Akun Baru
              </h1>
              <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>
                Bergabung dengan Marketku sekarang
              </p>
            </div>

            {/* Success Alert */}
            {success && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#ECFDF5",
                  border: "1px solid #6EE7B7",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  marginBottom: "20px",
                  color: "#065F46",
                  fontSize: "0.875rem",
                }}
              >
                <i className="bi bi-check-circle-fill"></i>
                Pendaftaran berhasil! Mengalihkan ke halaman login...
              </div>
            )}

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

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Nama Lengkap */}
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
                  Nama Lengkap <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={iconStyle}><i className="bi bi-person"></i></span>
                  <input
                    type="text"
                    name="nama_user"
                    value={formData.nama_user}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    disabled={loading}
                    style={inputStyle("nama_user")}
                    onFocus={(e) => { if (!validationErrors.nama_user) e.target.style.borderColor = "#176B43"; }}
                    onBlur={(e) => { if (!validationErrors.nama_user) e.target.style.borderColor = "#E5E7EB"; }}
                  />
                </div>
                {validationErrors.nama_user && (
                  <p style={{ color: "#DC2626", fontSize: "0.8rem", margin: "4px 0 0" }}>
                    {validationErrors.nama_user}
                  </p>
                )}
              </div>

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
                  <span style={iconStyle}><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    disabled={loading}
                    style={inputStyle("email")}
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
                  Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={iconStyle}><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    disabled={loading}
                    style={inputStyle("password")}
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

              {/* Konfirmasi Password */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#1F2937",
                    marginBottom: "6px",
                  }}
                >
                  Konfirmasi Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={iconStyle}><i className="bi bi-lock-fill"></i></span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ulangi password"
                    disabled={loading}
                    style={inputStyle("confirmPassword")}
                    onFocus={(e) => { if (!validationErrors.confirmPassword) e.target.style.borderColor = "#176B43"; }}
                    onBlur={(e) => { if (!validationErrors.confirmPassword) e.target.style.borderColor = "#E5E7EB"; }}
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p style={{ color: "#DC2626", fontSize: "0.8rem", margin: "4px 0 0" }}>
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Role Selector */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#1F2937",
                    marginBottom: "10px",
                  }}
                >
                  Daftar Sebagai <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {/* Pembeli */}
                  <label
                    htmlFor="rolePembeli"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 14px",
                      border: `2px solid ${formData.role === "pembeli" ? "#176B43" : "#E5E7EB"}`,
                      borderRadius: "12px",
                      backgroundColor: formData.role === "pembeli" ? "#EAF6EF" : "#FFFFFF",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="rolePembeli"
                      value="pembeli"
                      checked={formData.role === "pembeli"}
                      onChange={handleChange}
                      disabled={loading}
                      style={{ display: "none" }}
                    />
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        backgroundColor: formData.role === "pembeli" ? "#176B43" : "#F3F4F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className="bi bi-person-fill"
                        style={{
                          color: formData.role === "pembeli" ? "#FFFFFF" : "#6B7280",
                          fontSize: "1rem",
                        }}
                      ></i>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: formData.role === "pembeli" ? "#176B43" : "#1F2937",
                        }}
                      >
                        Pembeli
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Belanja produk</div>
                    </div>
                  </label>

                  {/* Penjual */}
                  <label
                    htmlFor="rolePenjual"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 14px",
                      border: `2px solid ${formData.role === "penjual" ? "#176B43" : "#E5E7EB"}`,
                      borderRadius: "12px",
                      backgroundColor: formData.role === "penjual" ? "#EAF6EF" : "#FFFFFF",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      className="btn-check"
                      name="role"
                      id="rolePenjual"
                      value="penjual"
                      checked={formData.role === "penjual"}
                      onChange={handleChange}
                      disabled={loading}
                      style={{ display: "none" }}
                    />
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        backgroundColor: formData.role === "penjual" ? "#176B43" : "#F3F4F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className="bi bi-shop"
                        style={{
                          color: formData.role === "penjual" ? "#FFFFFF" : "#6B7280",
                          fontSize: "1rem",
                        }}
                      ></i>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: formData.role === "penjual" ? "#176B43" : "#1F2937",
                        }}
                      >
                        Penjual
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Jual produk</div>
                    </div>
                  </label>
                </div>
                {validationErrors.role && (
                  <p style={{ color: "#DC2626", fontSize: "0.8rem", margin: "6px 0 0" }}>
                    {validationErrors.role}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: loading || success ? "#4CAF80" : "#176B43",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: loading || success ? "not-allowed" : "pointer",
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
                    Mendaftar...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check"></i>
                    Daftar Sekarang
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

            {/* Link Login */}
            <p
              style={{
                textAlign: "center",
                color: "#6B7280",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              Sudah punya akun?{" "}
              <Link
                href="/login"
                style={{
                  color: "#176B43",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
