import { SupabaseProductRepository } from "../../infrastructure/repositories/SupabaseProductRepository";

const productRepository = new SupabaseProductRepository();

/**
 * Use case: Ambil semua produk (dengan filter opsional)
 * @param {object} filters - { kategori, status, search }
 * @returns {Product[]}
 */
export async function GetProducts(filters = {}) {
  return await productRepository.getAll(filters);
}

