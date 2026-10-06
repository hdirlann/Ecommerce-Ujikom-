-- ============================================================
-- SUPABASE SETUP SCRIPT - Marketku Marketplace
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABEL public.users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id_user UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_user VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255),
  role VARCHAR(20) CHECK (role IN ('pembeli', 'penjual')) NOT NULL DEFAULT 'pembeli',
  tgl_daftar TIMESTAMPTZ DEFAULT NOW(),
  foto_profil VARCHAR(255),
  status_user VARCHAR(20) CHECK (status_user IN ('aktif', 'tidak_aktif')) DEFAULT 'aktif'
);

-- ============================================================
-- 2. TABEL public.produk
-- ============================================================
CREATE TABLE IF NOT EXISTS public.produk (
  id_produk BIGSERIAL PRIMARY KEY,
  penjual_id UUID NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
  nama_produk VARCHAR(150) NOT NULL,
  deskripsi TEXT,
  harga NUMERIC(15, 2) NOT NULL,
  stok INTEGER NOT NULL DEFAULT 0,
  kategori VARCHAR(100),
  gambar_produk VARCHAR(255),
  status_produk VARCHAR(20) CHECK (status_produk IN ('tersedia', 'habis')) DEFAULT 'habis'
);

-- ============================================================
-- 3. TABEL public.order
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order (
  id_order BIGSERIAL PRIMARY KEY,
  pembeli_id UUID NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
  tgl_order TIMESTAMPTZ DEFAULT NOW(),
  total_harga NUMERIC(15, 2) NOT NULL,
  status_order VARCHAR(30) CHECK (
    status_order IN (
      'menunggu_pembayaran',
      'menunggu_konfirmasi',
      'diproses',
      'dikirim',
      'selesai',
      'dibatalkan'
    )
  ) DEFAULT 'menunggu_pembayaran',
  alamat_pengiriman TEXT,
  bukti_bayar VARCHAR(255)
);

-- ============================================================
-- 4. TRIGGER: Buat record public.users saat user baru register
-- Trigger ini dipanggil otomatis oleh Supabase Auth setelah signUp()
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id_user, nama_user, email, role, tgl_daftar, status_user)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama_user', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'pembeli'),
    NOW(),
    'aktif'
  );
  RETURN NEW;
END;
$$;

-- Hapus trigger lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Buat trigger baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) & PERMISSIONS
-- ============================================================

-- Grant permissions to access tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produk TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.produk_id_produk_seq TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.order_id_order_seq TO anon, authenticated;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order ENABLE ROW LEVEL SECURITY;

-- ----- public.users policies -----

-- Semua user bisa baca data user (untuk join query)
CREATE POLICY "Users can read all users"
  ON public.users FOR SELECT
  TO authenticated, anon
  USING (true);

-- User hanya bisa update profil sendiri
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_user);

-- ----- public.produk policies -----

-- Semua orang bisa membaca produk yang tersedia
CREATE POLICY "Anyone can read products"
  ON public.produk FOR SELECT
  TO authenticated, anon
  USING (true);

-- Penjual bisa insert produk baru
CREATE POLICY "Sellers can insert products"
  ON public.produk FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = penjual_id);

-- Penjual hanya bisa update produk miliknya
CREATE POLICY "Sellers can update own products"
  ON public.produk FOR UPDATE
  TO authenticated
  USING (auth.uid() = penjual_id);

-- Penjual hanya bisa hapus produk miliknya
CREATE POLICY "Sellers can delete own products"
  ON public.produk FOR DELETE
  TO authenticated
  USING (auth.uid() = penjual_id);

-- ----- public.order policies -----

-- Pembeli hanya bisa baca order miliknya, penjual bisa baca semua
CREATE POLICY "Buyers can read own orders"
  ON public.order FOR SELECT
  TO authenticated
  USING (
    auth.uid() = pembeli_id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE id_user = auth.uid()
      AND role = 'penjual'
    )
  );

-- Pembeli bisa membuat order baru
CREATE POLICY "Buyers can create orders"
  ON public.order FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = pembeli_id);

-- Pembeli bisa update order miliknya (untuk upload bukti bayar)
-- Penjual bisa update semua order (untuk ubah status)
CREATE POLICY "Update order policy"
  ON public.order FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = pembeli_id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE id_user = auth.uid()
      AND role = 'penjual'
    )
  );

-- ============================================================
-- 6. SUPABASE STORAGE BUCKETS
-- Buat bucket berikut di Supabase Dashboard > Storage:
-- - produk-images (public)
-- - bukti-bayar (public)
-- ============================================================

-- Storage policies harus dibuat di Supabase Dashboard
-- atau menggunakan SQL berikut:

INSERT INTO storage.buckets (id, name, public)
VALUES ('produk-images', 'produk-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('bukti-bayar', 'bukti-bayar', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies untuk produk-images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'produk-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'produk-images');

CREATE POLICY "Users can update own product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'produk-images');

-- Storage policies untuk bukti-bayar
CREATE POLICY "Anyone can view payment proofs"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'bukti-bayar');

CREATE POLICY "Authenticated users can upload payment proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bukti-bayar');

-- ============================================================
-- SELESAI - Setup Supabase berhasil!
-- ============================================================
