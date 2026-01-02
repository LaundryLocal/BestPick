import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Pastikan root element tersedia
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL: Root element not found");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Sembunyikan loading menggunakan pengecekan aman pada objek window
    const win = window as any;
    if (typeof win.hideLoading === 'function') {
      // Beri jeda sedikit agar render awal selesai
      setTimeout(() => win.hideLoading(), 100);
    }
  } catch (err: any) {
    console.error("React Mounting Error:", err);
    if (window.onerror) {
      window.onerror(err.message || "Gagal merender aplikasi", "index.tsx", 0, 0, err);
    }
  }
}
