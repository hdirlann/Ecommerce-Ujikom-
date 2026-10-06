import { SupabaseProductRepository } from "../../infrastructure/repositories/SupabaseProductRepository";

const productRepository = new SupabaseProductRepository();

/**
 * Use case: Hapus produk berdasarkan ID
 * @param {number} id - id_produk
 * @returns {boolean}
 */
export async function DeleteProduct(id) {
  return await productRepository.delete(id);
}

