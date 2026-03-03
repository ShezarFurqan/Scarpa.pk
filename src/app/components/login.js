"use client";
import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, Loader2, ArrowRight, X } from 'lucide-react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { ShopContext } from '../Context/ShopContext';

const LoginDrawer = ({ isOpen, onClose }) => {
  const { setToken, setUser } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('token', result.user.uid);
      setToken(result.user.uid);
      setUser(result.user);
      setMessage({ type: 'success', text: 'Welcome to Scarpa' });
      setTimeout(() => { onClose(); setLoading(false); }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Login Failed' });
      setLoading(false);
    }
  };

  // 1. High-Performance Easing (Bade displays ke liye best)
  const premiumEasing = [0.32, 0.72, 0, 1]; 

  const panelVariants = {
    hidden: { x: "100%", transition: { duration: 0.5, ease: premiumEasing } },
    visible: { x: 0, transition: { duration: 0.6, ease: premiumEasing } },
    exit: { x: "100%", transition: { duration: 0.4, ease: premiumEasing } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const content = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
          {/* Backdrop: Removed Blur for 60FPS on Large Screens */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/50" // Simple overlay is much faster
            style={{ willChange: "opacity" }}
          />

          {/* Side Panel */}
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // transform-gpu and will-change are critical for large displays
            className="relative w-full max-w-[420px] h-full bg-[#edf1f5] shadow-2xl flex flex-col transform-gpu"
            style={{ willChange: "transform" }}
          >
            {/* Header Content */}
            <div className="pt-16 px-8 sm:px-12 flex flex-col items-center">
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-8 p-2 rounded-full hover:bg-white text-gray-400 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-14 h-14 bg-[#0145f2] rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h1 className="text-3xl font-[1000] italic text-gray-900 uppercase tracking-tighter">SCARPA</h1>
                <p className="text-[#0145f2] text-[9px] font-black uppercase tracking-[0.3em] mt-3 opacity-60">Authorized Access Only</p>
            </div>

            {/* Login Section */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12">
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
                {message.text && (
                   <div className={`p-4 rounded-xl flex items-center gap-3 text-[10px] font-bold uppercase mb-6 ${
                    message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <AlertCircle size={14} /> {message.text}
                  </div>
                )}

                <h2 className="text-lg font-black uppercase text-gray-900 mb-1">Welcome back</h2>
                <p className="text-[11px] font-medium text-gray-400 mb-8 leading-relaxed">Sign in with your Google account to manage orders and track shipments.</p>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="group flex items-center justify-between w-full p-1 pl-5 bg-[#edf1f5] hover:bg-[#0145f2] rounded-xl transition-all duration-300 h-14"
                >
                  <div className="flex items-center gap-3">
                    {!loading && <img src="/images/google.png" alt="" className="w-4 h-4 group-hover:invert transition-all" />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-white">
                      {loading ? "Verifying..." : "Google Login"}
                    </span>
                  </div>
                  <div className="w-12 h-full bg-white rounded-lg flex items-center justify-center text-[#0145f2] group-hover:bg-[#0145f2] group-hover:text-white transition-all shadow-sm">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-10 text-center">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.5em] opacity-30">
                &copy; SCARPA STUDIO 2026
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};

export default LoginDrawer;