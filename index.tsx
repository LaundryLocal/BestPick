
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Menambahkan definisi tipe global untuk window agar TypeScript mengenali hideLoading
declare global {
  interface Window {
    hideLoading?: () => void;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Panggil fungsi global untuk menyembunyikan loading screen
  if (window.hideLoading) {
    window.hideLoading();
  }
} catch (err: any) {
  console.error("Mounting Error:", err);
  if (window.onerror) {
    window.onerror(err.message, "index.tsx", 0, 0, err);
  }
}
