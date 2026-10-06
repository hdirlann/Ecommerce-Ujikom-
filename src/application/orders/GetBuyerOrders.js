import { SupabaseOrderRepository } from "../../infrastructure/repositories/SupabaseOrderRepository";

const orderRepository = new SupabaseOrderRepository();

/**
 * Use case: Ambil semua order milik pembeli yang sedang login
 * @param {string} pembeliId - UUID pembeli
 * @returns {Order[]}
 */
export async function GetBuyerOrders(pembeliId) {
  return await orderRepository.getByPembeliId(pembeliId);
}

