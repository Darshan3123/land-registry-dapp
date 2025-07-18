import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Use dynamic import for code splitting
const AppComponent = React.lazy(() => import('./App'));

// Import reportWebVitals only when needed
const reportWebVitals = () => import('./reportWebVitals').then(module => module.default);

// Create a loading indicator
const LoadingIndicator = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem'
  }}>
    Loading application...
  </div>
);

// Initialize the app with performance optimizations
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);
  
  // Disable StrictMode in production to avoid double-rendering
  const isProduction = process.env.NODE_ENV === 'production';
  
  const AppWithSuspense = (
    <React.Suspense fallback={<LoadingIndicator />}>
      {isProduction ? (
        <AppComponent />
      ) : (
        <React.StrictMode>
          <AppComponent />
        </React.StrictMode>
      )}
    </React.Suspense>
  );
  
  // Use requestIdleCallback for non-critical rendering if available
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      root.render(AppWithSuspense);
    });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      root.render(AppWithSuspense);
    }, 0);
  }
};

// Initialize the app
initializeApp();

// Only load web vitals in development or if specifically enabled
if (process.env.NODE_ENV !== 'production' || window.MEASURE_PERFORMANCE) {
  reportWebVitals().then(reportWebVitalsFunc => {
    reportWebVitalsFunc(console.log);
  });
}

// Add event listener for when the app becomes visible
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Prefetch IPFS module when the app becomes visible
    import('./ipfs');
  }
});

// Register service worker for offline capabilities if in production
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(error => {
      console.log('Service worker registration failed:', error);
    });
  });
}
