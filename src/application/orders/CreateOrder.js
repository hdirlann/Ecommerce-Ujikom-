import { SupabaseOrderRepository } from "../../infrastructure/repositories/SupabaseOrderRepository";

const orderRepository = new SupabaseOrderRepository();

/**
 * Use case: Buat order baru dari checkout
 * @param {object} orderData - { pembeli_id, total_harga, alamat_pengiriman, catatan, cartItems }
 * @returns {Order}
 */
export async function CreateOrder({ pembeli_id, total_harga, alamat_pengiriman, catatan, cartItems = [] }) {
  // Simpan data order beserta item keranjang (items)
  return await orderRepository.create({
    pembeli_id,
    tgl_order: new Date().toISOString(),
    total_harga,
    status_order: "menunggu_pembayaran", // Status awal
    alamat_pengiriman,
    catatan,
    bukti_bayar: null,
    items: cartItems, // Menyimpan detail barang yang dibeli
  });
}

