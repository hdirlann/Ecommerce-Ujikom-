import { SupabaseOrderRepository } from "../../infrastructure/repositories/SupabaseOrderRepository";

const orderRepository = new SupabaseOrderRepository();

/**
 * Use case: Ambil semua order untuk penjual (semua order dari semua pembeli)
 * @returns {Order[]}
 */
export async function GetSellerOrders() {
  return await orderRepository.getAll();
}

