"use client";
import React from "react";
import { Play, MoveRight, Box, Wind, Zap, Activity } from "lucide-react";

/**
 * Refactored ProductHighlight
 * Aesthetic: Studio Noir / High-Performance Luxury
 * Focus: Neutral tones, sharp typography, and cinematic media.
 */
const ProductHighlight = () => {
  return (
    <section className="relative w-full bg-[#050505] py-16  overflow-hidden border-t border-white/5">
      
      {/* Cinematic Studio Backdrop - No purple, just neutral light depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/[0.02] blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Column 1: Editorial Content */}
          <div className="flex flex-col space-y-10">
            
            {/* Minimal Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className=" w-8 bg-white/20"></div>
                {/* <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
                  The Pinnacle of Performance
                </span> */}
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter">
                PRECISION <br />
                <span className="text-white/20 italic font-light">CRAFTED.</span>
              </h2>
              
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md font-light">
                Designed for those who demand absolute control. The <span className="text-white">Apex Carbon V3</span> 
                integrates aerospace-grade materials with an ergonomic silhouette for a weightless experience.
              </p>
            </div>

            {/* Tech Specs: Ultra-Clean Monochromatic Style */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4 pt-4">
              <div className="space-y-2 group">
                <div className="flex items-center gap-3 text-white transition-colors group-hover:text-blue-400">
                  <Wind size={20} strokeWidth={1.5} />
                  <span className="text-sm font-bold tracking-tight">Aero-Weave</span>
                </div>
                <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">Breathability</p>
              </div>
              
              <div className="space-y-2 group">
                <div className="flex items-center gap-3 text-white transition-colors group-hover:text-emerald-400">
                  <Zap size={20} strokeWidth={1.5} />
                  <span className="text-sm font-bold tracking-tight">Kinetic Return</span>
                </div>
                <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">+30% Energy</p>
              </div>

              <div className="space-y-2 group">
                <div className="flex items-center gap-3 text-white transition-colors group-hover:text-blue-300">
                  <Activity size={20} strokeWidth={1.5} />
                  <span className="text-sm font-bold tracking-tight">Omni-Grip</span>
                </div>
                <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium">Max Traction</p>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-6">
              <button className="relative px-10 py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.15em] rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center gap-3 group">
                Explore Series
                <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center gap-4 text-white/60 hover:text-white transition-all group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                  <Play size={14} fill="white" className="ml-1" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">The Process</span>
              </button>
            </div>
          </div>

          {/* Column 2: Cinematic Media Player */}
          <div className="relative">
            {/* Subtle Outer Rim Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-white/10 to-transparent rounded-[32px] blur-[1px]"></div>
            
            <div className="relative aspect-[4/5] bg-[#0a0a0a] rounded-[30px] overflow-hidden border border-white/5 shadow-2xl">
              
              {/* Media Content */}
              <video 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/videos/video.mp4" type="video/mp4" />
              </video>
              {/* Soft Bottom Shadow for Contrast */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              {/* Label */}
              <div className="absolute bottom-8 left-8">
                <h4 className="text-white font-bold text-xl tracking-tight">Apex Carbon V3</h4>
                <span className="text-gray-400 text-[10px] uppercase tracking-widest">Signature Series</span>
              </div>
            </div>

            {/* Accent Shadow under the card */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-black blur-3xl rounded-full opacity-60"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;