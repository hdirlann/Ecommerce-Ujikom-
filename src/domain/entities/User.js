// Entity User - merepresentasikan struktur data user di domain
export class User {
  constructor({
    id_user,
    nama_user,
    email,
    role,
    tgl_daftar,
    foto_profil,
    status_user,
  }) {
    this.id_user = id_user;
    this.nama_user = nama_user;
    this.email = email;
    this.role = role; // 'pembeli' | 'penjual'
    this.tgl_daftar = tgl_daftar;
    this.foto_profil = foto_profil;
    this.status_user = status_user; // 'aktif' | 'tidak_aktif'
  }

  isPenjual() {
    return this.role === "penjual";
  }

  isPembeli() {
    return this.role === "pembeli";
  }

  isAktif() {
    return this.status_user === "aktif";
  }
}

