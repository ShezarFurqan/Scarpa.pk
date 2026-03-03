"use client";
import React, { useContext, useEffect, useState } from "react";
import { ShieldCheck, AlertCircle, Loader2, ArrowRight, X } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { ShopContext } from "../Context/ShopContext";

const LoginDrawer = ({ isOpen, onClose }) => {
  const { setToken, setUser, token } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Prevent open if logged in
  useEffect(() => {
    if (token && isOpen) onClose();
  }, [token, isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem("token", user.uid);
      setToken(user.uid);
      setUser(user);

      onClose();
    } catch (error) {
      setMessage({ type: "error", text: "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-white shadow-xl
        transform transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition"
        >
          <X size={22} />
        </button>

        {/* Content */}
        <div className="h-full flex flex-col justify-center px-8">

          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-[#0145f2] rounded-2xl flex items-center justify-center text-white mx-auto mb-5">
              <ShieldCheck size={26} />
            </div>

            <h1 className="text-2xl font-black tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to continue your Scarpa journey.
            </p>
          </div>

          {message.text && (
            <div className="mb-6 text-sm text-red-500 flex items-center gap-2">
              <AlertCircle size={16} />
              {message.text}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-between w-full bg-gray-100 hover:bg-[#0145f2] hover:text-white transition-all duration-300 rounded-xl px-5 h-14"
          >
            <span className="font-semibold text-sm">
              {loading ? "Authenticating..." : "Continue with Google"}
            </span>

            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default LoginDrawer;