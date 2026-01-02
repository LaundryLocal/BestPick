import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Give the browser a moment to paint the UI before hiding loader
    const win = window as any;
    if (typeof win.hideLoading === 'function') {
      setTimeout(() => {
        win.hideLoading();
      }, 300);
    }
  } catch (err: any) {
    console.error("Mounting Error:", err);
    // Explicitly trigger the global error handler if mounting fails
    if (window.onerror) {
      window.onerror(err.message || "React fail", "index.tsx", 0, 0, err);
    }
  }
} else {
  console.error("Root element #root not found in HTML");
}
