"use client";
import React from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * NewsletterCTA Component
 * A high-end subscription section designed for elite brand positioning.
 * Features: Responsive grid, glassmorphism input, and subtle ambient hover effects.
 */
const NewsletterCTA = () => {
  return (
    <section className="relative w-full bg-[#050505] pb-28 overflow-hidden">
      
      {/* Background Subtle Accent - A very faint radial glow to center the focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-0 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col items-center text-center">
            
            {/* Minimal Icon Indicator */}
            <div className="mb-8 inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/[0.02]">
              <Mail className="w-5 h-5 text-white/60" />
            </div>

            {/* Header Group */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
              Join the <span className="text-white/30 italic font-light">Elite</span> Club
            </h2>
            
            <p className="text-gray-500 text-sm md:text-lg font-light max-w-xl leading-relaxed mb-12">
              Receive early access to limited edition drops, professional climbing insights, and members-only invitations. No noise, just excellence.
            </p>

            {/* Subscription Form */}
            <form 
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-2xl"
            >
              <div className="relative group flex flex-col md:flex-row items-center gap-4 p-2 rounded-2xl md:rounded-full bg-white/[0.03] border border-white/10 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/[0.05]">
                
                <div className="flex-1 w-full flex items-center px-4">
                  <input 
                    type="email" 
                    placeholder="Enter your professional email" 
                    className="w-full bg-transparent border-none text-white placeholder:text-gray-600 focus:ring-0 text-sm md:text-base py-3 md:py-1"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl md:rounded-full transition-all duration-300 hover:bg-gray-200 active:scale-95"
                >
                  Subscribe Now
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-40">
                <div className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Weekly Updates
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Exclusive Drops
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Secure Data
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

export default NewsletterCTA;