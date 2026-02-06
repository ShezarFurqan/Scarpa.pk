"use client";
import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, Clock, Headphones } from 'lucide-react';

/**
 * ContactSection Component
 * A luxury contact interface refactored from the Newsletter CTA.
 * Aesthetics: Studio Noir, Glassmorphism, and Editorial Typography.
 */
const ContactSection = () => {
  return (
    <section className="relative w-full bg-[#050505] py-24 lg:py-32 overflow-hidden">
      
      {/* Background Subtle Accent - Central neutral glow for focus */}
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
              Direct <span className="text-white/30 italic font-light">Concierge</span> Access
            </h2>
            
            <p className="text-gray-500 text-sm md:text-lg font-light max-w-xl leading-relaxed mb-12">
              Have a question about sizing, limited drops, or your recent order? Our elite support team is ready to assist you in your pursuit of excellence.
            </p>

            {/* Refactored Contact Form */}
            <form 
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-2xl space-y-4"
            >
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/[0.05]">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 text-sm md:text-base p-0"
                    required
                  />
                </div>
                <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/[0.05]">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 text-sm md:text-base p-0"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Message */}
              <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/[0.05]">
                <textarea 
                  placeholder="How can we help you?" 
                  rows={4}
                  className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 text-sm md:text-base p-0 resize-none"
                  required
                />
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-center">
                <button 
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:bg-gray-200 active:scale-95 group"
                >
                  Send Message
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators: Contextualized for Support */}
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

            </form>
          </div>

        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default ContactSection;