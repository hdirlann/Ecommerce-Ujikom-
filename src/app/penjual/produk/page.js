"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProductTable from "../../../components/ProductTable";
import ProductForm from "../../../components/ProductForm";
import { useAuth } from "../../../context/AuthContext";
import { GetProducts } from "../../../application/products/GetProducts";
import { CreateProduct } from "../../../application/products/CreateProduct";
import { UpdateProduct } from "../../../application/products/UpdateProduct";
import { DeleteProduct } from "../../../application/products/DeleteProduct";
import { SupabaseProductRepository } from "../../../infrastructure/repositories/SupabaseProductRepository";

const productRepository = new SupabaseProductRepository();

/**
 * Halaman Manajemen Produk Penjual
 * CRUD: Create, Read, Update, Delete produk
 * Hanya bisa diakses oleh role penjual
 */
function PenjualProdukContent() {
  const { user, profile } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  // State modal
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);

  // Ambil produk milik penjual yang login
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productRepository.getByPenjualId(user.id);
      setProducts(data);
    } catch (err) {
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Buka modal tambah produk
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormError(null);
    setShowModal(true);
  };

  // Buka modal edit produk
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormError(null);
    setShowModal(true);
  };

  // Konfirmasi hapus produk
  const handleDelete = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Submit form tambah/edit produk
  const handleFormSubmit = async (formData, imageFiles) => {
    setFormLoading(true);
    setFormError(null);

    try {
      if (editingProduct) {
        // Update produk yang sudah ada
        await UpdateProduct(
          editingProduct.id_produk,
          { ...formData, penjual_id: user.id },
          imageFiles
        );
        showSuccess("Produk berhasil diperbarui!");
      } else {
        // Buat produk baru
        await CreateProduct(
          { ...formData, penjual_id: user.id },
          imageFiles
        );
        showSuccess("Produk berhasil ditambahkan!");
      }

      setShowModal(false);
      await fetchProducts();
    } catch (err) {
      setFormError(`Gagal menyimpan produk: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Konfirmasi hapus produk
  const handleConfirmDelete = async () => {
    try {
      await DeleteProduct(deletingProduct.id_produk);
      setShowDeleteModal(false);
      setDeletingProduct(null);
      showSuccess("Produk berhasil dihapus!");
      await fetchProducts();
    } catch (err) {
      setError(`Gagal menghapus produk: ${err.message}`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{ padding: "32px", backgroundColor: "#F8FAF6", minHeight: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h4
            style={{
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#1F2937",
              marginBottom: "4px",
            }}
          >
            Produk Saya
          </h4>
          <p style={{ color: "#6B7280", margin: 0, fontSize: "0.925rem" }}>
            Kelola produk yang Anda jual &mdash;{" "}
            <span style={{ fontWeight: 600, color: "#176B43" }}>
              {products.length} produk
            </span>
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          style={{
            backgroundColor: "#176B43",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(23,107,67,0.25)",
            transition: "background 0.2s",
          }}
        >
          <i className="bi bi-plus-circle"></i>
          Tambah Produk
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#EAF6EF",
            border: "1px solid #A7D7C5",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "20px",
            color: "#0F5132",
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          <i className="bi bi-check-circle-fill" style={{ fontSize: "1.1rem", color: "#176B43" }}></i>
          {successMessage}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "20px",
            color: "#991B1B",
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "1.1rem", color: "#DC2626" }}></i>
          <span style={{ flex: 1 }}>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#991B1B",
              padding: "0",
              lineHeight: 1,
              fontSize: "1rem",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      {/* Tabel Produk */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {/* Modal Tambah/Edit Produk */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            padding: "16px",
          }}
          onClick={() => !formLoading && setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#EAF6EF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#176B43",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                <i className={`bi ${editingProduct ? "bi-pencil" : "bi-plus-lg"}`}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontWeight: 700, color: "#1F2937", margin: 0, fontSize: "1.05rem" }}>
                  {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                </h5>
                <p style={{ color: "#6B7280", margin: 0, fontSize: "0.8rem" }}>
                  {editingProduct
                    ? "Perbarui informasi produk Anda"
                    : "Isi detail produk baru Anda"}
                </p>
              </div>
              <button
                onClick={() => !formLoading && setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: formLoading ? "not-allowed" : "pointer",
                  color: "#6B7280",
                  fontSize: "1.2rem",
                  padding: "4px",
                  lineHeight: 1,
                  borderRadius: "6px",
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            {/* Modal Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              <ProductForm
                initialData={editingProduct}
                onSubmit={handleFormSubmit}
                loading={formLoading}
                error={formError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && deletingProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              width: "100%",
              maxWidth: "420px",
              padding: "32px",
              textAlign: "center",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "1.75rem",
                color: "#DC2626",
              }}
            >
              <i className="bi bi-trash"></i>
            </div>
            <h5 style={{ fontWeight: 700, color: "#1F2937", marginBottom: "8px" }}>
              Hapus Produk?
            </h5>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "6px" }}>
              Anda akan menghapus produk{" "}
              <strong style={{ color: "#1F2937" }}>{deletingProduct.nama_produk}</strong>.
            </p>
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#DC2626",
                fontSize: "0.82rem",
                marginBottom: "28px",
                backgroundColor: "#FEF2F2",
                padding: "6px 12px",
                borderRadius: "8px",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill"></i>
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingProduct(null);
                }}
                style={{
                  backgroundColor: "#EAF6EF",
                  color: "#176B43",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  backgroundColor: "#DC2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="bi bi-trash"></i>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PenjualProdukPage() {
  return (
    <ProtectedRoute requiredRole="penjual">
      <PenjualProdukContent />
    </ProtectedRoute>
  );
}
