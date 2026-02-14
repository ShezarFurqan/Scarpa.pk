'use client';

import React, { useState } from 'react';
import { X, User, Mail, MessageSquare, ShieldCheck } from 'lucide-react';

const GuestModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestId', guestId);
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#0145f2]/10 backdrop-blur-md z-[60] flex items-center justify-center p-6">
      <div className="bg-[#edf1f5] border border-white w-full max-w-md rounded-[3rem] p-8 md:p-10 relative shadow-[0_30px_100px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-400 hover:text-[#0145f2] transition-colors p-2 hover:bg-white rounded-full"
        >
          <X size={20} />
        </button>

        {/* Icon & Title */}
        <div className="mb-8">
            <div className="w-14 h-14 bg-[#0145f2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0145f2]/20 mb-6">
                <MessageSquare size={28} />
            </div>
            <h2 className="text-3xl font-[900] uppercase tracking-tighter text-gray-900 leading-none">
                Get in Touch
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0145f2] mt-2 opacity-70">
                Identify yourself to start chat
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0145f2] transition-colors" size={18} />
            <input 
              required
              placeholder="YOUR FULL NAME"
              className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#0145f2]/5 focus:border-[#0145f2] transition-all placeholder:text-gray-300 placeholder:font-black"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0145f2] transition-colors" size={18} />
            <input 
              required
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#0145f2]/5 focus:border-[#0145f2] transition-all placeholder:text-gray-300 placeholder:font-black"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0145f2] text-white font-[900] uppercase text-[11px] tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-[#0145f2]/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all mt-6"
          >
            Start Conversation
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
            <ShieldCheck size={14} className="text-gray-900" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">End-to-end Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default GuestModal;