import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMsg = "Elemen #root tidak ditemukan di HTML.";
  console.error(errorMsg);
  if ((window as any).onerror) {
    (window as any).onerror(errorMsg, "index.tsx", 0);
  }
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Memberi tahu browser bahwa inisialisasi berhasil
    setTimeout(() => {
      const win = window as any;
      if (typeof win.hideLoading === 'function') {
        win.hideLoading();
      }
    }, 500);
    
  } catch (err: any) {
    console.error("Mounting Error:", err);
    if ((window as any).onerror) {
      (window as any).onerror(err.message || "Gagal memuat React", "index.tsx", 0);
    }
  }
}
