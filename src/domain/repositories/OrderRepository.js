// Repository contract untuk Order - mendefinisikan interface yang harus diimplementasi
export class OrderRepository {
  async getByPembeliId(pembeliId) {
    throw new Error("Not implemented");
  }

  async getAll() {
    throw new Error("Not implemented");
  }

  async getById(id) {
    throw new Error("Not implemented");
  }

  async create(data) {
    throw new Error("Not implemented");
  }

  async updateStatus(id, status) {
    throw new Error("Not implemented");
  }

  async updateBuktiBayar(id, buktiBayarPath) {
    throw new Error("Not implemented");
  }
}

