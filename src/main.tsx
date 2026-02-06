import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import { ErrorBoundary } from './app/components/error-boundary.tsx';
import './styles/index.css';

console.log('🚀 [ROZE.LIVE v2.1.7] main.tsx LOADED');
console.log('📍 Environment:', import.meta.env.MODE);
console.log('🌐 Base URL:', import.meta.env.BASE_URL);

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ ROOT ELEMENT NOT FOUND!');
  throw new Error('Failed to find the root element');
}

console.log('✅ Root element found:', rootElement);
console.log('🎨 Starting React render...');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('✅ React.render() called successfully!');