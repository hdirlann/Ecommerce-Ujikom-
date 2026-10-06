# Marketku - Marketplace Sederhana

Aplikasi marketplace sederhana untuk **Uji Kompetensi (Ujikom) Junior Web Programmer**

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Supabase

Edit file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database Supabase

Buka **Supabase Dashboard → SQL Editor**, jalankan file `supabase-setup.sql`:

```bash
# Salin dan paste isi supabase-setup.sql ke SQL Editor Supabase
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Build Production

```bash
npm run build
```

---

## 📁 Struktur Folder

```
ujikom/
├── src/
│   ├── app/                    # Next.js App Router (Routing & Halaman)
│   │   ├── page.js             # Landing Page (/)
│   │   ├── layout.js           # Root Layout
│   │   ├── globals.css         # Global Styles
│   │   ├── login/page.js       # Halaman Login (/login)
│   │   ├── register/page.js    # Halaman Register (/register)
│   │   ├── produk/[id]/page.js # Detail Produk (/produk/:id)
│   │   ├── keranjang/page.js   # Keranjang (/keranjang)
│   │   ├── checkout/page.js    # Checkout (/checkout)
│   │   ├── order/page.js       # Order Pembeli (/order)
│   │   └── penjual/
│   │       ├── layout.js       # Seller Layout (Sidebar)
│   │       ├── produk/page.js  # Manajemen Produk (/penjual/produk)
│   │       └── order/page.js   # Manajemen Order (/penjual/order)
│   │
│   ├── components/             # Komponen UI Reusable
│   │   ├── Navbar.js           # Navbar utama
│   │   ├── Footer.js           # Footer
│   │   ├── ProductCard.js      # Kartu produk
│   │   ├── ProductForm.js      # Form tambah/edit produk
│   │   ├── ProductTable.js     # Tabel produk penjual
│   │   ├── OrderTable.js       # Tabel order penjual
│   │   ├── OrderDetail.js      # Modal detail order
│   │   ├── SellerSidebar.js    # Sidebar penjual
│   │   ├── ProtectedRoute.js   # Proteksi route berdasarkan role
│   │   ├── Loading.js          # Spinner loading
│   │   └── BootstrapInit.js    # Inisialisasi Bootstrap JS
│   │
│   ├── domain/                 # Domain Layer (Entities & Contracts)
│   │   ├── entities/
│   │   │   ├── User.js         # Entity User
│   │   │   ├── Product.js      # Entity Product
│   │   │   └── Order.js        # Entity Order
│   │   └── repositories/
│   │       ├── UserRepository.js
│   │       ├── ProductRepository.js
│   │       └── OrderRepository.js
│   │
│   ├── application/            # Use Cases
│   │   ├── auth/
│   │   │   ├── RegisterUser.js
│   │   │   ├── LoginUser.js
│   │   │   └── LogoutUser.js
│   │   ├── products/
│   │   │   ├── GetProducts.js
│   │   │   ├── GetProductById.js
│   │   │   ├── CreateProduct.js
│   │   │   ├── UpdateProduct.js
│   │   │   └── DeleteProduct.js
│   │   └── orders/
│   │       ├── CreateOrder.js
│   │       ├── GetBuyerOrders.js
│   │       ├── GetSellerOrders.js
│   │       ├── UploadPaymentProof.js
│   │       └── UpdateOrderStatus.js
│   │
│   ├── infrastructure/         # Implementasi Repository
│   │   ├── supabase/
│   │   │   └── client.js       # Supabase client
│   │   └── repositories/
│   │       ├── SupabaseUserRepository.js
│   │       ├── SupabaseProductRepository.js
│   │       └── SupabaseOrderRepository.js
│   │
│   ├── context/                # React Context (Global State)
│   │   ├── AuthContext.js      # Auth state (user, session, profile)
│   │   └── CartContext.js      # Cart state (localStorage)
│   │
│   └── utils/
│       └── formatCurrency.js   # Helper: format mata uang, tanggal, status
│
├── public/                     # Static assets
├── supabase-setup.sql          # Script setup database Supabase
├── .env.local                  # Environment variables
├── next.config.mjs             # Next.js config
├── jsconfig.json               # JS path aliases
└── package.json
```

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| Next.js 16 | Framework utama + App Router |
| React | UI library |
| Bootstrap 5 | Styling & responsif |
| Bootstrap Icons | Ikon |
| @supabase/supabase-js | Client Supabase |
| React Context | State global |
| localStorage | Persistensi keranjang |

---

## 🗄️ Database

### Tabel: `public.users`
| Kolom | Tipe |
|-------|------|
| id_user | UUID (FK auth.users) |
| nama_user | VARCHAR(100) |
| email | VARCHAR(100) |
| role | VARCHAR (pembeli/penjual) |
| tgl_daftar | TIMESTAMPTZ |
| foto_profil | VARCHAR |
| status_user | VARCHAR (aktif/tidak_aktif) |

### Tabel: `public.produk`
| Kolom | Tipe |
|-------|------|
| id_produk | BIGSERIAL (PK) |
| penjual_id | UUID (FK users) |
| nama_produk | VARCHAR(150) |
| deskripsi | TEXT |
| harga | NUMERIC(15,2) |
| stok | INTEGER |
| kategori | VARCHAR(100) |
| gambar_produk | VARCHAR(255) |
| status_produk | VARCHAR (tersedia/habis) |

### Tabel: `public.order`
| Kolom | Tipe |
|-------|------|
| id_order | BIGSERIAL (PK) |
| pembeli_id | UUID (FK users) |
| tgl_order | TIMESTAMPTZ |
| total_harga | NUMERIC(15,2) |
| status_order | VARCHAR |
| alamat_pengiriman | TEXT |
| bukti_bayar | VARCHAR(255) |

---

## 🔒 Authentication Flow

1. **Register**: `supabase.auth.signUp()` → trigger otomatis buat record `public.users`
2. **Login**: `supabase.auth.signInWithPassword()` → ambil profile → redirect sesuai role
3. **Session**: `onAuthStateChange()` di `AuthContext` memantau perubahan auth
4. **Logout**: `supabase.auth.signOut()` → clear state → redirect ke `/`

---

## 🛒 Cart Flow

1. Data cart disimpan di **localStorage** key: `marketku_cart`
2. `CartContext` menyediakan: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`, `getCartTotal`
3. Cart di-load ulang saat refresh dari localStorage
4. Cart dikosongkan otomatis setelah checkout berhasil

---

## 📦 Order Flow

```
Pembeli Checkout
     ↓
CreateOrder() [Use Case]
     ↓
SupabaseOrderRepository.create() [Infrastructure]
     ↓
INSERT ke public.order (status: menunggu_pembayaran)
     ↓
Pembeli upload bukti bayar
     ↓
UploadPaymentProof() [Use Case]
     ↓
Upload ke Storage "bukti-bayar"
     ↓
UPDATE public.order (status: menunggu_konfirmasi, bukti_bayar: url)
     ↓
Penjual menerima & mengubah status
     ↓
menunggu_konfirmasi → diproses → dikirim → selesai
```

---

## 🌐 Routes

| Route | Akses | Deskripsi |
|-------|-------|-----------|
| `/` | Publik | Landing page & katalog |
| `/login` | Publik | Login |
| `/register` | Publik | Daftar akun |
| `/produk/[id]` | Publik | Detail produk |
| `/keranjang` | Pembeli | Keranjang belanja |
| `/checkout` | Pembeli | Checkout |
| `/order` | Pembeli | Riwayat pesanan + upload bukti |
| `/penjual/produk` | Penjual | CRUD produk |
| `/penjual/order` | Penjual | Kelola semua order |

---

## ✅ Checklist Ujikom

### Role & Akun
- [x] Halaman register pembeli
- [x] Halaman register penjual
- [x] Halaman login
- [x] Redirect berdasarkan role
- [x] Protected route per role

### Pembeli
- [x] Lihat katalog produk
- [x] Detail produk
- [x] Tambah ke keranjang
- [x] Update quantity di keranjang
- [x] Hapus dari keranjang
- [x] Checkout & buat order
- [x] Upload bukti pembayaran
- [x] Lihat riwayat order & status

### Penjual
- [x] Tambah produk (CREATE)
- [x] Lihat daftar produk (READ)
- [x] Edit produk (UPDATE)
- [x] Hapus produk (DELETE)
- [x] Upload gambar produk
- [x] Lihat semua order masuk
- [x] Detail order
- [x] Terima order (menunggu_konfirmasi → diproses)
- [x] Tolak order (→ dibatalkan)
- [x] Kirim order (diproses → dikirim)
- [x] Selesaikan order (dikirim → selesai)
- [x] Filter order berdasarkan status

### Clean Architecture
- [x] Domain entities (User, Product, Order)
- [x] Repository contracts
- [x] Infrastructure (Supabase repositories)
- [x] Use cases (application layer)
- [x] Tidak ada query Supabase langsung di page/component

### UI/UX
- [x] Bootstrap 5
- [x] Bootstrap Icons
- [x] Tema warna hijau (#176B43)
- [x] Responsive (mobile, tablet, desktop)
- [x] Loading state
- [x] Error handling
- [x] Success feedback
- [x] Modal untuk form & detail

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Dapatkan dari: **Supabase Dashboard → Settings → API**
