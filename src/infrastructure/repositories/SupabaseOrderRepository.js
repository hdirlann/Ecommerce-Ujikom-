import { supabase } from "../supabase/client";
import { Order } from "../../domain/entities/Order";

// Implementasi OrderRepository menggunakan Supabase
export class SupabaseOrderRepository {
  /**
   * Ambil semua order milik pembeli tertentu
   * @param {string} pembeliId - UUID pembeli
   * @returns {Order[]}
   */
  async getByPembeliId(pembeliId) {
    const { data, error } = await supabase
      .from("order")
      .select("*, pembeli:users(nama_user, email)")
      .eq("pembeli_id", pembeliId)
      .order("tgl_order", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((item) => new Order(item));
  }

  /**
   * Ambil semua order untuk penjual (semua order dari semua pembeli)
   * @returns {Order[]}
   */
  async getAll() {
    const { data, error } = await supabase
      .from("order")
      .select("*, pembeli:users(nama_user, email)")
      .order("tgl_order", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((item) => new Order(item));
  }

  /**
   * Ambil satu order berdasarkan ID
   * @param {number} id - id_order
   * @returns {Order|null}
   */
  async getById(id) {
    const { data, error } = await supabase
      .from("order")
      .select("*, pembeli:users(nama_user, email)")
      .eq("id_order", id)
      .single();

    if (error || !data) return null;
    return new Order(data);
  }

  /**
   * Buat order baru dari keranjang belanja
   * @param {object} orderData - Data order
   * @returns {Order}
   */
  async create(orderData) {
    const { data, error } = await supabase
      .from("order")
      .insert(orderData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new Order(data);
  }

  /**
   * Update status order
   * @param {number} id - id_order
   * @param {string} status - Status baru
   * @returns {Order}
   */
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from("order")
      .update({ status_order: status })
      .eq("id_order", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new Order(data);
  }

  /**
   * Update bukti pembayaran order dan ubah status menjadi menunggu_konfirmasi
   * @param {number} id - id_order
   * @param {string} buktiBayarPath - Path file bukti bayar di storage
   * @returns {Order}
   */
  async updateBuktiBayar(id, buktiBayarPath) {
    const { data, error } = await supabase
      .from("order")
      .update({
        bukti_bayar: buktiBayarPath,
        status_order: "menunggu_konfirmasi",
      })
      .eq("id_order", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new Order(data);
  }

  /**
   * Upload bukti pembayaran ke Supabase Storage
   * @param {File} file - File bukti bayar
   * @param {number} orderId - ID order
   * @returns {string} Path file di storage
   */
  async uploadBuktiBayar(file, orderId) {
    const fileExt = file.name.split(".").pop();
    const fileName = `bukti-bayar/${orderId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("bukti-bayar")
      .upload(fileName, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from("bukti-bayar")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}

