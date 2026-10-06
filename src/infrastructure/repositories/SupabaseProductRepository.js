import { supabase } from "../supabase/client";
import { Product } from "../../domain/entities/Product";

// Implementasi ProductRepository menggunakan Supabase
export class SupabaseProductRepository {
  /**
   * Ambil semua produk dengan filter opsional
   * @param {object} filters - Filter: { kategori, status, search }
   * @returns {Product[]}
   */
  async getAll(filters = {}) {
    let query = supabase
      .from("produk")
      .select("*, penjual:users(nama_user, email)")
      .order("id_produk", { ascending: false });

    if (filters.kategori) {
      query = query.eq("kategori", filters.kategori);
    }

    if (filters.status) {
      query = query.eq("status_produk", filters.status);
    }

    if (filters.search) {
      query = query.ilike("nama_produk", `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((item) => new Product(item));
  }

  /**
   * Ambil satu produk berdasarkan id_produk
   * @param {number} id - id_produk
   * @returns {Product|null}
   */
  async getById(id) {
    const { data, error } = await supabase
      .from("produk")
      .select("*, penjual:users(nama_user, email)")
      .eq("id_produk", id)
      .single();

    if (error || !data) return null;
    return new Product(data);
  }

  /**
   * Ambil produk milik penjual tertentu
   * @param {string} penjualId - UUID penjual
   * @returns {Product[]}
   */
  async getByPenjualId(penjualId) {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("penjual_id", penjualId)
      .order("id_produk", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((item) => new Product(item));
  }

  /**
   * Buat produk baru
   * @param {object} productData - Data produk
   * @returns {Product}
   */
  async create(productData) {
    // Business rule: status otomatis berdasarkan stok
    const status_produk = Product.determineStatus(productData.stok);

    const { data, error } = await supabase
      .from("produk")
      .insert({ ...productData, status_produk })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new Product(data);
  }

  /**
   * Update produk yang sudah ada
   * @param {number} id - id_produk
   * @param {object} updateData - Data yang akan diupdate
   * @returns {Product}
   */
  async update(id, updateData) {
    // Business rule: status otomatis berdasarkan stok jika stok diupdate
    if (updateData.stok !== undefined) {
      updateData.status_produk = Product.determineStatus(updateData.stok);
    }

    const { data, error } = await supabase
      .from("produk")
      .update(updateData)
      .eq("id_produk", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new Product(data);
  }

  /**
   * Hapus produk
   * @param {number} id - id_produk
   */
  async delete(id) {
    const { error } = await supabase
      .from("produk")
      .delete()
      .eq("id_produk", id);

    if (error) throw new Error(error.message);
    return true;
  }

  /**
   * Upload gambar produk ke Supabase Storage
   * @param {File} file - File gambar
   * @param {string} penjualId - UUID penjual
   * @returns {string} URL publik gambar
   */
  async uploadImage(file, penjualId) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${penjualId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("produk-images")
      .upload(fileName, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from("produk-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}

