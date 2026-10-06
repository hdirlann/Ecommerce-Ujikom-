import { SupabaseProductRepository } from "../../infrastructure/repositories/SupabaseProductRepository";

const productRepository = new SupabaseProductRepository();

/**
 * Use case: Update produk yang sudah ada
 * Otomatis memperbarui status_produk berdasarkan perubahan stok
 * @param {number} id - id_produk
 * @param {object} updateData - Data yang diupdate
 * @param {File|null} imageFile - File gambar baru opsional
 * @returns {Product}
 */
export async function UpdateProduct(id, updateData, imageFiles = []) {
  let dataToUpdate = { ...updateData };

  // Upload gambar baru jika ada
  if (imageFiles && imageFiles.length > 0) {
    const urls = [];
    for (const file of imageFiles) {
      const url = await productRepository.uploadImage(file, updateData.penjual_id);
      if (url) urls.push(url);
    }
    if (urls.length > 0) {
      dataToUpdate.gambar_produk = dataToUpdate.gambar_produk ? dataToUpdate.gambar_produk + ',' + urls.join(',') : urls.join(',');
    }
  }

  if (dataToUpdate.harga) {
    dataToUpdate.harga = parseFloat(dataToUpdate.harga);
  }

  if (dataToUpdate.stok !== undefined) {
    dataToUpdate.stok = parseInt(dataToUpdate.stok);
  }

  return await productRepository.update(id, dataToUpdate);
}

