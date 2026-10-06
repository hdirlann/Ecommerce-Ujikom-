import { supabase } from "../../infrastructure/supabase/client";
import { SupabaseUserRepository } from "../../infrastructure/repositories/SupabaseUserRepository";

const userRepository = new SupabaseUserRepository();

/**
 * Use case: Login user menggunakan email dan password
 * @param {string} email
 * @param {string} password
 * @returns {object} { session, user, profile }
 */
export async function LoginUser({ email, password }) {
  // Login menggunakan Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Ambil profil user dari public.users untuk mendapatkan role
  const profile = await userRepository.getById(data.user.id);

  return {
    session: data.session,
    user: data.user,
    profile,
  };
}

