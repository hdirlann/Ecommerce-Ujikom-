"use client";

import { useEffect } from "react";

/**
 * Inisialisasi Bootstrap JS di client side
 * Diperlukan untuk komponen interaktif Bootstrap (modal, dropdown, dll)
 */
export default function BootstrapInit() {
  useEffect(() => {
    // Import Bootstrap JS hanya di sisi client
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);

  return null;
}

