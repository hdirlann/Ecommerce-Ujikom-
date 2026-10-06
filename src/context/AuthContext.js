"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../infrastructure/supabase/client";
import { SupabaseUserRepository } from "../infrastructure/repositories/SupabaseUserRepository";

// Inisialisasi repository
const userRepository = new SupabaseUserRepository();

// Buat context untuk autentikasi
const AuthContext = createContext(null);

/**
 * AuthProvider menyediakan state autentikasi ke seluruh aplikasi
 * Mengelola: user, session, profile (dari public.users), dan loading state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil session saat pertama kali load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Ambil profil dari public.users untuk mendapatkan role
        const userProfile = await userRepository.getById(session.user.id);
        setProfile(userProfile);
      }

      setLoading(false);
    });

    // Subscribe ke perubahan auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Ambil profil setiap kali auth state berubah
        const userProfile = await userRepository.getById(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // Cleanup subscription saat komponen di-unmount
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Register user baru menggunakan Supabase Auth
   */
  const register = async ({ nama_user, email, password, role }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nama_user, role },
        },
      });

      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login menggunakan email dan password
   * Setelah berhasil, ambil profil user dari public.users
   */
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      // Ambil profil untuk mendapatkan role
      const userProfile = await userRepository.getById(data.user.id);
      setProfile(userProfile);

      return { data: { ...data, profile: userProfile }, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout dari sesi aktif
   */
  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isPenjual: profile?.role === "penjual",
    isPembeli: profile?.role === "pembeli",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook untuk menggunakan AuthContext di komponen manapun
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}

