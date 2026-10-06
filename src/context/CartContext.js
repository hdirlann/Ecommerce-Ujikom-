"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Key untuk menyimpan cart di localStorage
const CART_STORAGE_KEY = "marketku_cart";

// Buat context untuk keranjang belanja
const CartContext = createContext(null);

/**
 * CartProvider mengelola state keranjang belanja
 * Data cart disimpan di localStorage agar tetap ada saat halaman di-refresh
 */
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Muat cart dari localStorage saat pertama kali render
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Simpan cart ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  /**
   * Tambah produk ke keranjang
   * Jika produk sudah ada, tambah quantity
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id_produk === product.id_produk
      );

      if (existingItem) {
        // Update quantity jika produk sudah ada
        return prevItems.map((item) =>
          item.id_produk === product.id_produk
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Tambah item baru ke cart
      return [
        ...prevItems,
        {
          id_produk: product.id_produk,
          nama_produk: product.nama_produk,
          harga: product.harga,
          gambar_produk: product.gambar_produk,
          stok: product.stok,
          quantity,
        },
      ];
    });
  };

  /**
   * Hapus item dari keranjang
   */
  const removeFromCart = (id_produk) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id_produk !== id_produk)
    );
  };

  /**
   * Tambah quantity item
   */
  const increaseQuantity = (id_produk) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id_produk === id_produk) {
          // Konversi stok ke angka untuk menghindari bug perbandingan string
          const limitStok = Number(item.stok) || 999;
          const newQty = Math.min(Number(item.quantity) + 1, limitStok);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  /**
   * Kurangi quantity item, hapus jika quantity menjadi 0
   */
  const decreaseQuantity = (id_produk) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id_produk === id_produk
            ? { ...item, quantity: Math.max(0, Number(item.quantity) - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /**
   * State untuk item yang dipilih (checked) di keranjang
   * Menyimpan id_produk dari item yang dicentang
   */
  const [selectedItems, setSelectedItems] = useState([]);

  /**
   * Toggle pilihan sebuah item
   */
  const toggleSelection = (id_produk) => {
    setSelectedItems((prev) =>
      prev.includes(id_produk)
        ? prev.filter((id) => id !== id_produk)
        : [...prev, id_produk]
    );
  };

  /**
   * Pilih semua atau batalkan semua pilihan
   */
  const toggleAllSelection = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // batalkan semua
    } else {
      setSelectedItems(cartItems.map((item) => item.id_produk)); // pilih semua
    }
  };

  /**
   * Hapus hanya item yang di-checkout dari keranjang
   */
  const removeSelectedFromCart = () => {
    setCartItems((prev) => prev.filter((item) => !selectedItems.includes(item.id_produk)));
    setSelectedItems([]);
  };

  /**
   * Hitung total harga HANYA untuk item yang dipilih
   */
  const getSelectedCartTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id_produk))
      .reduce((total, item) => total + item.harga * item.quantity, 0);
  };

  /**
   * Kosongkan seluruh keranjang (dipanggil setelah checkout berhasil)
   */
  const clearCart = () => {
    setCartItems([]);
    setSelectedItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  /**
   * Hitung total harga semua item di keranjang
   */
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.harga * item.quantity,
      0
    );
  };

  /**
   * Hitung total jumlah item di keranjang
   */
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    selectedItems,
    toggleSelection,
    toggleAllSelection,
    getSelectedCartTotal,
    removeSelectedFromCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isLoaded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook untuk menggunakan CartContext di komponen manapun
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
}

