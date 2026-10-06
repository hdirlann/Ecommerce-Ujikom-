import { SupabaseOrderRepository } from "../../infrastructure/repositories/SupabaseOrderRepository";

const orderRepository = new SupabaseOrderRepository();

// Status order yang valid
const VALID_STATUSES = [
  "menunggu_pembayaran",
  "menunggu_konfirmasi",
  "diproses",
  "dikirim",
  "selesai",
  "dibatalkan",
];

/**
 * Use case: Update status order (digunakan oleh penjual)
 * @param {number} orderId - ID order
 * @param {string} newStatus - Status baru
 * @returns {Order}
 */
export async function UpdateOrderStatus(orderId, newStatus) {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error(`Status tidak valid: ${newStatus}`);
  }

  return await orderRepository.updateStatus(orderId, newStatus);
}
