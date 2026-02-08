'use client';
import { createContext, useContext, useState } from 'react';

// --- Context
const LoadingContext = createContext();

// --- Provider
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <FullPageLoader />}
    </LoadingContext.Provider>
  );
};

// --- Hook for easy use
export const useLoading = () => useContext(LoadingContext);

// --- Full page loader component
const FullPageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white font-bold text-sm tracking-widest uppercase">Loading...</p>
    </div>
  </div>
);
