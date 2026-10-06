import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase client menggunakan environment variable
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Buat client Supabase yang akan digunakan di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

