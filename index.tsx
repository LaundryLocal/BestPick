import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found");
}

const renderApp = () => {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Memberikan sinyal ke index.html bahwa aplikasi sudah siap
    const win = window as any;
    if (typeof win.hideLoading === 'function') {
      // Jeda 200ms untuk memastikan cat pertama (first paint) selesai
      setTimeout(win.hideLoading, 200);
    }
  } catch (err: any) {
    console.error("Render Error:", err);
    if (window.onerror) {
      window.onerror(err.message || "Gagal inisialisasi React", "index.tsx", 0, 0, err);
    }
  }
};

// Jalankan render
renderApp();
