import { supabase } from "../supabase/client";
import { User } from "../../domain/entities/User";

// Implementasi UserRepository menggunakan Supabase
export class SupabaseUserRepository {
  /**
   * Ambil profil user berdasarkan ID dari tabel public.users
   * @param {string} id - UUID user
   * @returns {User|null}
   */
  async getById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id_user", id)
      .single();

    if (error || !data) return null;
    return new User(data);
  }

  /**
   * Ambil profil user berdasarkan email
   * @param {string} email
   * @returns {User|null}
   */
  async getByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return null;
    return new User(data);
  }

  /**
   * Update data profil user
   * @param {string} id - UUID user
   * @param {object} updateData - Data yang akan diupdate
   */
  async update(id, updateData) {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id_user", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new User(data);
  }
}

