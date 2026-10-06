import { SupabaseProductRepository } from "../../infrastructure/repositories/SupabaseProductRepository";

const productRepository = new SupabaseProductRepository();

/**
 * Use case: Buat produk baru
 * Otomatis menentukan status_produk berdasarkan stok
 * @param {object} productData - Data produk lengkap
 * @param {File|null} imageFile - File gambar opsional
 * @returns {Product}
 */
export async function CreateProduct(productData, imageFiles = []) {
  let gambar_produk = productData.gambar_produk || null;

  // Upload gambar jika ada
  if (imageFiles && imageFiles.length > 0) {
    const urls = [];
    for (const file of imageFiles) {
      const url = await productRepository.uploadImage(file, productData.penjual_id);
      if (url) urls.push(url);
    }
    if (urls.length > 0) {
      gambar_produk = gambar_produk ? gambar_produk + ',' + urls.join(',') : urls.join(',');
    }
  }

  return await productRepository.create({
    ...productData,
    gambar_produk,
    harga: parseFloat(productData.harga),
    stok: parseInt(productData.stok),
  });
}

