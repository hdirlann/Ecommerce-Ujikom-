"use client";

import { useState, useEffect } from "react";

// Kategori produk yang tersedia
const CATEGORIES = [
  "Elektronik",
  "Pakaian",
  "Makanan & Minuman",
  "Kesehatan",
  "Olahraga",
  "Rumah Tangga",
  "Buku & Stationery",
  "Otomotif",
  "Lainnya",
];

/**
 * Form untuk tambah/edit produk penjual
 * @param {object} initialData - Data produk untuk mode edit (opsional)
 * @param {function} onSubmit - Callback saat form disubmit
 * @param {boolean} loading - State loading
 * @param {string} error - Pesan error
 */
export default function ProductForm({ initialData, onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    nama_produk: "",
    deskripsi: "",
    harga: "",
    stok: "",
    kategori: "",
    gambar_produk: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // Isi form dengan data awal jika mode edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_produk: initialData.nama_produk || "",
        deskripsi: initialData.deskripsi || "",
        harga: initialData.harga || "",
        stok: initialData.stok || "",
        kategori: initialData.kategori || "",
        gambar_produk: initialData.gambar_produk || "",
      });
      if (initialData.gambar_produk) {
        setExistingImages(initialData.gambar_produk.split(',').filter(u => u.trim() !== ''));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error validasi saat user mengetik
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errors = {};
    if (!formData.nama_produk.trim()) errors.nama_produk = "Nama produk wajib diisi";
    if (!formData.harga || isNaN(formData.harga) || parseFloat(formData.harga) <= 0) {
      errors.harga = "Harga harus berupa angka positif";
    }
    if (!formData.stok || isNaN(formData.stok) || parseInt(formData.stok) < 0) {
      errors.stok = "Stok harus berupa angka non-negatif";
    }
    if (!formData.kategori) errors.kategori = "Kategori wajib dipilih";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const allGambar = existingImages.join(',');
    onSubmit({ ...formData, gambar_produk: allGambar }, imageFiles);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-3">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {/* Nama Produk */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Nama Produk <span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${validationErrors.nama_produk ? "is-invalid" : ""}`}
          name="nama_produk"
          value={formData.nama_produk}
          onChange={handleChange}
          placeholder="Masukkan nama produk"
          maxLength={150}
        />
        {validationErrors.nama_produk && (
          <div className="invalid-feedback">{validationErrors.nama_produk}</div>
        )}
      </div>

      {/* Deskripsi */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Deskripsi</label>
        <textarea
          className="form-control"
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          rows={3}
          placeholder="Deskripsikan produk kamu"
        />
      </div>

      {/* Harga & Stok */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Harga (Rp) <span className="text-danger">*</span></label>
          <input
            type="number"
            className={`form-control ${validationErrors.harga ? "is-invalid" : ""}`}
            name="harga"
            value={formData.harga}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
          {validationErrors.harga && (
            <div className="invalid-feedback">{validationErrors.harga}</div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Stok <span className="text-danger">*</span></label>
          <input
            type="number"
            className={`form-control ${validationErrors.stok ? "is-invalid" : ""}`}
            name="stok"
            value={formData.stok}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
          {validationErrors.stok && (
            <div className="invalid-feedback">{validationErrors.stok}</div>
          )}
        </div>
      </div>

      {/* Kategori */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Kategori <span className="text-danger">*</span></label>
        <select
          className={`form-select ${validationErrors.kategori ? "is-invalid" : ""}`}
          name="kategori"
          value={formData.kategori}
          onChange={handleChange}
        >
          <option value="">-- Pilih Kategori --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {validationErrors.kategori && (
          <div className="invalid-feedback">{validationErrors.kategori}</div>
        )}
      </div>

      {/* Upload Gambar */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Gambar Produk</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div className="form-text">Format: JPG, PNG, WEBP. Maks. 5MB</div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          {/* Previews for existing images */}
          {existingImages.map((url, index) => (
            <div key={`existing-${index}`} style={{ position: "relative" }}>
              <img
                src={url}
                alt={`Existing ${index}`}
                style={{ height: "100px", width: "100px", objectFit: "cover", borderRadius: "8px" }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{ position: "absolute", top: "-5px", right: "-5px", borderRadius: "50%", width: "24px", height: "24px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => removeExistingImage(index)}
              >
                &times;
              </button>
            </div>
          ))}

          {/* Previews for new images */}
          {imagePreviews.map((preview, index) => (
            <div key={`new-${index}`} style={{ position: "relative" }}>
              <img
                src={preview}
                alt={`New ${index}`}
                style={{ height: "100px", width: "100px", objectFit: "cover", borderRadius: "8px" }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{ position: "absolute", top: "-5px", right: "-5px", borderRadius: "50%", width: "24px", height: "24px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                onClick={() => removeNewImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* URL gambar manual jika tidak ada gambar sama sekali */}
        {existingImages.length === 0 && imageFiles.length === 0 && (
          <div className="mt-3">
            <input
              type="url"
              className="form-control form-control-sm"
              name="gambar_produk"
              value={formData.gambar_produk}
              onChange={handleChange}
              placeholder="Atau masukkan URL gambar"
            />
          </div>
        )}
      </div>

      {/* Tombol submit */}
      <div className="d-flex gap-2 justify-content-end">
        <button
          type="submit"
          className="btn text-white px-4"
          style={{ backgroundColor: "#176B43" }}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Menyimpan...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              {initialData ? "Simpan Perubahan" : "Tambah Produk"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

