/**
 * Format angka menjadi format mata uang Rupiah (IDR)
 * @param {number} amount - Jumlah yang akan diformat
 * @returns {string} String mata uang yang sudah diformat
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal menjadi format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} String tanggal yang sudah diformat
 */
export function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format status order menjadi label yang lebih mudah dibaca
 * @param {string} status - Status order dari database
 * @returns {string} Label status yang mudah dibaca
 */
export function formatOrderStatus(status) {
  const statusMap = {
    menunggu_pembayaran: "Menunggu Pembayaran",
    menunggu_konfirmasi: "Menunggu Konfirmasi",
    diproses: "Diproses",
    dikirim: "Dikirim",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",
  };
  return statusMap[status] || status;
}

/**
 * Mendapatkan class Bootstrap badge berdasarkan status order
 * @param {string} status - Status order
 * @returns {string} Bootstrap badge class
 */
export function getOrderStatusBadge(status) {
  const badgeMap = {
    menunggu_pembayaran: "bg-warning text-dark",
    menunggu_konfirmasi: "bg-info text-dark",
    diproses: "bg-primary",
    dikirim: "bg-secondary",
    selesai: "bg-success",
    dibatalkan: "bg-danger",
  };
  return badgeMap[status] || "bg-secondary";
}

