import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Beri sinyal untuk menyembunyikan loading screen
  const win = window as any;
  if (typeof win.hideLoading === 'function') {
    // Jeda sedikit agar browser sempat merender frame awal
    setTimeout(() => {
      win.hideLoading();
    }, 100);
  }
} else {
  console.error("Root element not found");
}
