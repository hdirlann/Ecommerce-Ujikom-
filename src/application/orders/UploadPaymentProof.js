import { SupabaseOrderRepository } from "../../infrastructure/repositories/SupabaseOrderRepository";
import { SupabaseProductRepository } from "../../infrastructure/repositories/SupabaseProductRepository";

const orderRepository = new SupabaseOrderRepository();
const productRepository = new SupabaseProductRepository();

/**
 * Use case: Upload bukti pembayaran ke storage
 * Setelah upload, status order diubah menjadi menunggu_konfirmasi dan stok dikurangi
 * @param {number} orderId - ID order
 * @param {File} file - File bukti bayar
 * @returns {Order} Order yang sudah diupdate
 */
export async function UploadPaymentProof(orderId, file) {
  // Validasi tipe file
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File harus berupa gambar (JPG/PNG) atau PDF");
  }

  // Validasi ukuran file (maksimal 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Ukuran file maksimal 5MB");
  }

  // Upload file ke Supabase Storage
  const publicUrl = await orderRepository.uploadBuktiBayar(file, orderId);

  // Kurangi stok produk
  const order = await orderRepository.getById(orderId);
  if (order && order.items && Array.isArray(order.items)) {
    for (const item of order.items) {
      if (item.id_produk && item.quantity) {
        try {
          const product = await productRepository.getById(item.id_produk);
          if (product) {
            const newStock = Math.max(0, product.stok - item.quantity);
            await productRepository.update(item.id_produk, { stok: newStock });
          }
        } catch (err) {
          console.error(`Gagal update stok produk ${item.id_produk}:`, err);
        }
      }
    }
  }

  // Update order dengan path bukti bayar dan ubah status
  return await orderRepository.updateBuktiBayar(orderId, publicUrl);
}
