import { supabase } from "../../infrastructure/supabase/client";

/**
 * Use case: Logout user dari sesi aktif
 */
export async function LogoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

