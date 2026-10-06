// Entity Product - merepresentasikan struktur data produk di domain
export class Product {
  constructor({
    id_produk,
    penjual_id,
    nama_produk,
    deskripsi,
    harga,
    stok,
    kategori,
    gambar_produk,
    status_produk,
  }) {
    this.id_produk = id_produk;
    this.penjual_id = penjual_id;
    this.nama_produk = nama_produk;
    this.deskripsi = deskripsi;
    this.harga = harga;
    this.stok = stok;
    this.kategori = kategori;
    this.gambar_produk = gambar_produk;
    this.status_produk = status_produk; // 'tersedia' | 'habis'
  }

  // Business rule: status produk ditentukan oleh stok
  isAvailable() {
    return this.stok > 0 && this.status_produk === "tersedia";
  }

  // Mengambil daftar gambar (mendukung multiple gambar)
  getImages() {
    if (!this.gambar_produk) return [];
    return this.gambar_produk.split(",").map(img => img.trim()).filter(img => img);
  }

  // Tentukan status berdasarkan stok
  static determineStatus(stok) {
    return stok > 0 ? "tersedia" : "habis";
  }
}

