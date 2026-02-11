'use client';

import React, { useState } from 'react';
import { X, User, Mail, MessageSquare } from 'lucide-react';

const GuestModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestId', guestId);
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Connect with Us</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Please provide details to start chat</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              required
              placeholder="Full Name"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              required
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-5 rounded-2xl hover:invert transition-all mt-4"
          >
            Start Conversation
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestModal;