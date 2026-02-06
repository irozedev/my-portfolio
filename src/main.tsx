import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import './styles/index.css';

// Safe DOM check for SSR compatibility
if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
