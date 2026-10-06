"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function SellerSidebar() {
  const { logout, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const menuItems = [
    { href: "/penjual/produk", icon: "bi-box-seam", label: "Produk Saya" },
    { href: "/penjual/order", icon: "bi-receipt", label: "Order Masuk" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="d-none d-lg-flex flex-column"
        style={{
          width: 260,
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#EAF6EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bi bi-shop" style={{ color: "#176B43" }}></i>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#176B43" }}>Marketku</span>
            </div>
          </Link>
          <p style={{ color: "#6B7280", fontSize: "0.75rem", margin: "4px 0 0 0" }}>Panel Penjual</p>
        </div>

        {/* Profile */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#EAF6EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="bi bi-person-fill" style={{ color: "#176B43", fontSize: "1.1rem" }}></i>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile?.nama_user || "Penjual"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Penjual</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ padding: "12px 12px", flexGrow: 1 }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, padding: "4px 8px", marginBottom: 4 }}>Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  marginBottom: 2,
                  color: isActive ? "#176B43" : "#6B7280",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.875rem",
                  backgroundColor: isActive ? "#EAF6EF" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: "1rem", color: isActive ? "#176B43" : "#9CA3AF" }}></i>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: 16, borderTop: "1px solid #E5E7EB" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.15s",
            }}
          >
            <i className="bi bi-box-arrow-right"></i>
            Keluar
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <nav className="d-lg-none" style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "12px 16px" }}>
        <div className="d-flex align-items-center justify-content-between">
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, color: "#176B43", fontSize: "1.1rem" }}>
              <i className="bi bi-shop me-2"></i>Marketku
            </span>
          </Link>
          <button
            className="btn btn-sm border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sellerMobileNav"
            style={{ color: "#6B7280" }}
          >
            <i className="bi bi-list" style={{ fontSize: "1.4rem" }}></i>
          </button>
        </div>
        <div className="collapse" id="sellerMobileNav" style={{ paddingTop: 12 }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="d-flex align-items-center gap-2"
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                marginBottom: 4,
                color: pathname === item.href ? "#176B43" : "#6B7280",
                fontWeight: pathname === item.href ? 600 : 500,
                backgroundColor: pathname === item.href ? "#EAF6EF" : "transparent",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
              backgroundColor: "#FEE2E2", color: "#DC2626",
              fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8, marginTop: 4,
            }}
          >
            <i className="bi bi-box-arrow-right"></i>Keluar
          </button>
        </div>
      </nav>
    </>
  );
}
