"use client";
import React, { useContext, useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { ShopContext } from '../Context/ShopContext';

const AuthPage = () => {
  const { setToken, setUser, router, token } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showAlert = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('token', user.uid);
      setToken(user.uid);
      setUser(user);
      showAlert('success', 'Login successful. Redirecting...');
      setTimeout(() => router.push('/'), 1200);
    } catch (error) {
      showAlert('error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) router.push('/');
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#edf1f5] text-gray-900 flex flex-col justify-center items-center px-4 font-sans selection:bg-[#0145f2] selection:text-white">

      {/* Aesthetic Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#0145f2]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#0145f2]/10 rounded-full blur-[100px]" />
      </div>

      {/* Logo/Header Area */}
      <div className="mb-10 text-center z-10">
        <div className="w-16 h-16 bg-[#0145f2] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-[#0145f2]/20 mx-auto mb-6">
            <ShieldCheck size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-[1000] uppercase tracking-tighter italic text-gray-900 leading-none">
            SCARPA
        </h1>
        <p className="text-[#0145f2] text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-60">
            Secure Access Portal
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 z-10">

        {/* Alert Messages */}
        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-wider mb-6 border animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-600'
              : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {message.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-xs font-medium text-gray-400 leading-relaxed">
            Sign in to manage your orders, track deliveries, and sync your wishlist across devices.
          </p>
        </div>

        {/* Google Login Button - Re-styled for New Theme */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="group flex items-center justify-between w-full p-1 pl-6 bg-[#edf1f5] hover:bg-[#0145f2] rounded-2xl transition-all duration-300 disabled:opacity-50 h-16 shadow-inner border border-gray-100"
        >
          <div className="flex items-center gap-4">
            {!loading && <img src="/images/google.png" alt="" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all" />}
            <span className="text-[11px] font-[900] uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors">
              {loading ? "Authenticating..." : "Google Account"}
            </span>
          </div>
          
          <div className="w-14 h-full bg-white rounded-xl flex items-center justify-center text-[#0145f2] group-hover:bg-[#0145f2] group-hover:text-white transition-all shadow-sm">
            {loading ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <ArrowRight size={20} />
            )}
          </div>
        </button>

        {/* Security Note */}
        <div className="mt-8 flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">SSL Secure Connection</span>
        </div>

        {/* Footer Links */}
        <p className="mt-8 text-[9px] font-bold text-gray-300 text-center uppercase tracking-widest">
          Agreement: <span className="text-gray-400 hover:text-[#0145f2] cursor-pointer underline underline-offset-4">Terms</span> & <span className="text-gray-400 hover:text-[#0145f2] cursor-pointer underline underline-offset-4">Privacy</span>
        </p>
      </div>

      {/* Copyright Footer */}
      <div className="mt-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] opacity-40">
        &copy; 2026 Scarpa
      </div>
    </div>
  );
};

export default AuthPage;