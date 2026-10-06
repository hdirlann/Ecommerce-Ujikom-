import { SupabaseProductRepository } from "../../infrastructure/repositories/SupabaseProductRepository";

const productRepository = new SupabaseProductRepository();

/**
 * Use case: Ambil satu produk berdasarkan ID
 * @param {number} id - id_produk
 * @returns {Product|null}
 */
export async function GetProductById(id) {
  return await productRepository.getById(id);
}

