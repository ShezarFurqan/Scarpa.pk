'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [message, setMessage] = useState("Loading...");

  // Optimized function to start loading
  const startLoading = useCallback((msg = "Loading...") => {
    setMessage(msg);
    setActiveRequests((prev) => prev + 1);
  }, []);

  // Optimized function to stop loading
  const stopLoading = useCallback(() => {
    setActiveRequests((prev) => Math.max(0, prev - 1));
  }, []);

  // Derived state: loading is true if there's at least one active request
  const isLoading = activeRequests > 0;

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      <AnimatePresence>
        {isLoading && <FullPageLoader message={message} />}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};

// --- Hook for easy use
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// --- Full page loader component (Optimized with Framer Motion)
const FullPageLoader = ({ message }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    style={{ willChange: "opacity" }}
    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
  >
    <div className="flex flex-col items-center gap-4">
      {/* Premium Loader Design */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 rounded-full absolute"></div>
        <div className="w-16 h-16 border-4 border-[#0145f2] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(1,69,242,0.5)]"></div>
      </div>
      
      <motion.p 
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-white font-black text-xs tracking-[0.3em] uppercase drop-shadow-md"
      >
        {message}
      </motion.p>
    </div>
  </motion.div>
);