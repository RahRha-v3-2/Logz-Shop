import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './Layout';

const Marketplace = lazy(() => import('./pages/Marketplace'));
const Auction = lazy(() => import('./pages/Auction'));

// Placeholder components to allow compilability before I create the real pages
if (!window.location.pathname.includes('marker')) { 
  // Just a safeguard to prevent ReferenceErrors if I save this before the pages exist
  // But I will create them in the next step
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Marketplace />} />
            <Route path="/auction" element={<Auction />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
