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
    <section className="relative w-full bg-[#edf1f5] py-16 lg:py-28 overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0145f2]/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col items-center text-center">
            
            {/* Minimal Icon Indicator */}
            <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <MessageSquare className="w-6 h-6 text-[#0145f2]" />
            </div>

            {/* Header Group */}
            <h2 className="text-4xl md:text-6xl font-[1000] text-gray-900 tracking-tighter mb-6 uppercase leading-tight">
              Drop <span className="text-[#0145f2]/20 italic font-light">Us a</span> Message
            </h2>
            
            <p className="text-gray-500 text-sm md:text-lg font-medium max-w-xl leading-relaxed mb-12 uppercase tracking-tight">
              Have a question about sizing, limited drops, or your recent order? Our elite support team is ready to assist you.
            </p>

            {submitted ? (
              <div className="w-full max-w-2xl bg-white border-2 border-emerald-500/20 p-12 rounded-[3rem] animate-in fade-in zoom-in duration-500 shadow-xl shadow-emerald-100">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Message Dispatched</h3>
                <p className="text-emerald-600/60 mt-2 text-xs uppercase tracking-[0.2em] font-black">Our team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
                
                {/* Honeypot Spam Protection */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input type="text" name="hp_field" value={formData.hp_field} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="px-6 py-5 rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 focus-within:border-[#0145f2] focus-within:ring-4 focus-within:ring-[#0145f2]/5">
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm md:text-base p-0 font-bold"
                      required
                    />
                  </div>
                  <div className="px-6 py-5 rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 focus-within:border-[#0145f2] focus-within:ring-4 focus-within:ring-[#0145f2]/5">
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm md:text-base p-0 font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="px-6 py-5 rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 focus-within:border-[#0145f2] focus-within:ring-4 focus-within:ring-[#0145f2]/5">
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?" 
                    rows={5}
                    className="w-full bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm md:text-base p-0 resize-none font-bold"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-600 text-[10px] uppercase tracking-widest font-black bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <ShieldAlert size={14} /> {error}
                  </div>
                )}

                <div className="pt-4 flex justify-center">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto flex items-center justify-center gap-4 px-16 py-5 bg-[#0145f2] text-white text-xs font-black uppercase tracking-[0.25em] rounded-full transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 active:scale-95 group disabled:opacity-50"
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
            <div className="mt-16 flex flex-wrap justify-center gap-10">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                <Clock size={16} className="text-[#0145f2]" /> Fast Response
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                <ShieldCheck size={16} className="text-emerald-500" /> Secure Data
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                <Headphones size={16} className="text-purple-500" /> Trusted Support
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </section>
  )
}

export default Page