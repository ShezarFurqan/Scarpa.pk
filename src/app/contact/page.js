"use client"
import React, { useState } from 'react'
import { MessageSquare, ArrowRight, ShieldCheck, Clock, Headphones, Loader2, ShieldAlert } from 'lucide-react';
import { db } from '@/app/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Page = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    hp_field: '' // Honeypot for Spam
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Spam Check
    if (formData.hp_field !== '') {
      setLoading(false);
      return; 
    }

    try {
      await addDoc(collection(db, 'directcontact'), {
        name: formData.fullName,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({ fullName: '', email: '', message: '', hp_field: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error("Firebase Error:", err);
      setError("Failed to dispatch message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-[#050505] py-16 lg:py-28 overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col items-center text-center">
            
            {/* Minimal Icon Indicator */}
            <div className="mb-8 inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.02]">
              <MessageSquare className="w-5 h-5 text-white/60" />
            </div>

            {/* Header Group */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
              Drop <span className="text-white/30 italic font-light">Us a</span> Message
            </h2>
            
            <p className="text-gray-500 text-sm md:text-lg font-light max-w-xl leading-relaxed mb-12">
              Have a question about sizing, limited drops, or your recent order? Our elite support team is ready to assist you in your pursuit of excellence.
            </p>

            {submitted ? (
              <div className="w-full max-w-2xl bg-white/[0.03] border border-emerald-500/20 p-12 rounded-[2rem] animate-in fade-in zoom-in duration-500">
                <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Message Dispatched</h3>
                <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-light">Our team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
                
                {/* Honeypot Spam Protection */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input type="text" name="hp_field" value={formData.hp_field} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/[0.05]">
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 text-sm md:text-base p-0"
                      required
                    />
                  </div>
                  <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/[0.05]">
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 text-sm md:text-base p-0"
                      required
                    />
                  </div>
                </div>

                <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/[0.05]">
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?" 
                    rows={4}
                    className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 text-sm md:text-base p-0 resize-none"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-[10px] uppercase tracking-widest font-bold">
                    <ShieldAlert size={14} /> {error}
                  </div>
                )}

                <div className="pt-4 flex justify-center">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:bg-gray-200 active:scale-95 group disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40">
              <div className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest">
                <Clock size={14} className="text-blue-400" /> Fast Response
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-400" /> Secure Data
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest">
                <Headphones size={14} className="text-purple-400" /> Trusted Support
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}

export default Page