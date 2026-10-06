"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

/**
 * Komponen ProtectedRoute untuk melindungi halaman berdasarkan role
 * @param {string} requiredRole - Role yang diperlukan: 'pembeli', 'penjual', atau null (hanya butuh login)
 * @param {ReactNode} children - Konten yang dilindungi
 */
export default function ProtectedRoute({ requiredRole, children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (loading) return;

    // Belum login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Role default adalah pembeli jika profil gagal dimuat sementara
    const currentRole = profile?.role || "pembeli";

    // Sudah login tapi role tidak sesuai
    if (requiredRole && currentRole !== requiredRole) {
      setErrorMsg(`Akses Ditolak. Halaman ini butuh role: ${requiredRole}, tapi role kamu: ${currentRole}`);
      return;
    }

    setIsReady(true);
  }, [user, profile, loading, requiredRole, router]);

  // Tampilkan loading saat mengecek auth
  if (loading) {
    return <Loading message="Memeriksa akses..." />;
  }

  // Jika ada error proteksi
  if (errorMsg) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold mb-3"><i className="bi bi-shield-lock me-2"></i>Akses Ditolak</h2>
        <p className="lead">{errorMsg}</p>
        <button onClick={() => router.push("/")} className="btn btn-primary mt-3">Kembali ke Beranda</button>
      </div>
    );
  }

  if (!isReady) {
    return <Loading message="Menyiapkan halaman..." />;
  }

  return children;
}

