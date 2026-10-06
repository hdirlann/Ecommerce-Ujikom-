// Entity Order - merepresentasikan struktur data order di domain
export class Order {
  constructor({
    id_order,
    pembeli_id,
    tgl_order,
    total_harga,
    status_order,
    alamat_pengiriman,
    bukti_bayar,
    catatan,
    pembeli,
    items,
  }) {
    this.id_order = id_order;
    this.pembeli_id = pembeli_id;
    this.tgl_order = tgl_order;
    this.total_harga = total_harga;
    this.status_order = status_order;
    // Status: menunggu_pembayaran | menunggu_konfirmasi | diproses | dikirim | selesai | dibatalkan
    this.alamat_pengiriman = alamat_pengiriman;
    this.bukti_bayar = bukti_bayar;
    this.catatan = catatan;
    this.pembeli = pembeli; // joined dari public.users
    this.items = items || []; // JSONB berisi detail pesanan
  }

  isPending() {
    return this.status_order === "menunggu_pembayaran";
  }

  isCompleted() {
    return this.status_order === "selesai";
  }

  isCancelled() {
    return this.status_order === "dibatalkan";
  }
}

