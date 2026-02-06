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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-4 font-sans selection:bg-white selection:text-black">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="mb-12 text-center z-10">

        <h1 className="text-3xl font-bold uppercase tracking-wide">Rock Climb</h1>
        <p className="text-gray-400 text-[10px] mt-2">Secure Login Portal</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[400px] bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-md z-10">

        {/* Alert */}
        {message.text && (
          <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-semibold uppercase mb-4 border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-sm font-bold uppercase text-white mb-1">Sign in with Google</h2>
          <p className="text-[10px] text-gray-400">Use your Google account to access your dashboard.</p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-xl font-bold text-[11px] uppercase hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <img src="/images/google.png" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Footer note */}
        <p className="mt-6 text-[9px] text-gray-500 text-center">
          By logging in, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-[8px] text-gray-600 uppercase tracking-wide">
        &copy; 2026 Rock Climb. All rights reserved.
      </div>
    </div>
  );
};

export default AuthPage;
