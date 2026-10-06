import { supabase } from "../../infrastructure/supabase/client";
import { SupabaseUserRepository } from "../../infrastructure/repositories/SupabaseUserRepository";

const userRepository = new SupabaseUserRepository();

/**
 * Use case: Register user baru
 * Menggunakan Supabase Auth untuk membuat akun, lalu trigger database akan membuat record public.users
 * @param {object} formData - { nama_user, email, password, role }
 * @returns {object} { user, error }
 */
export async function RegisterUser({ nama_user, email, password, role }) {
  // Daftar user ke Supabase Auth dengan metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nama_user,
        role,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

