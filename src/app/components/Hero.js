"use client";
import React from 'react';
import { ArrowRight, Play, Star, Zap, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
   

    <section className="relative w-full bg-[#050505] xl:pt-16 md:pt-24 sm:pt-16 pt-2  lg:max-h-[99vh] flex items-center ">
      
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[-5%] w-[60%] lg:w-[40%] h-[40%] bg-blue-600/[0.03] lg:bg-blue-600/5 blur-[80px] lg:blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] lg:w-[30%] h-[30%] bg-purple-600/[0.03] lg:bg-purple-600/5 blur-[80px] lg:blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 md:px-2">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10 lg:gap-8">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-[55%] flex flex-col space-y-5 md:space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-block mx-auto lg:mx-0">
              <span className="px-3 py-1 lg:px-4 lg:py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-[9px] md:text-xs font-medium tracking-[0.2em] uppercase">
                Peak Performance Gear
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-black text-white leading-[1.1] lg:leading-[0.95] tracking-tighter">
              BORN TO <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600">
                CONQUER.
              </span>
            </h1>

            <p className="text-gray-400 text-sm md:text-lg lg:text-xl max-w-md md:max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Experience the fusion of rugged durability and elite design. Our latest collection is built for those who never look down.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 md:pt-4">
              <button className="w-full sm:w-auto px-8 lg:px-10 py-3.5 lg:py-4 bg-white text-black rounded-full font-bold transition-all lg:hover:bg-gray-200 lg:hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-white/5">
                Shop Now
                <ArrowRight size={18} />
              </button>
              
              <button className="w-full sm:w-auto px-8 lg:px-10 py-3.5 lg:py-4 bg-transparent text-white rounded-full font-bold border border-white/20 transition-all lg:hover:bg-white/5 flex items-center justify-center gap-2">
                <Play size={16} fill="white" />
                Watch Story
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-8 pt-6 md:pt-8 border-t border-white/5 mt-4">
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-white tracking-tight">12k+</span>
                <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Reviews</span>
              </div>
              <div className="h-8 md:h-10 w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <div className="flex text-yellow-500/80 mb-1 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Global Trust</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Shoe Area */}
          <div className="w-full lg:w-[45%] flex justify-center items-center relative group order-1 lg:order-2">
            
            {/* Grounding Stage */}
            <div className="absolute bottom-6 lg:bottom-10 w-[60%] h-[15px] bg-white/10 blur-[30px] lg:blur-[40px] rounded-[100%] transition-all duration-700 lg:group-hover:bg-white/20" />
            
            {/* Responsive Rings */}
            <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] border border-white/[0.03] rounded-full flex items-center justify-center">
                <div className="w-[80%] h-[80%] border border-white/[0.02] rounded-full" />
            </div>
            
            {/* Image Container */}
            <div className="relative z-10 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform rotate-[-6deg] lg:rotate-[-12deg] lg:group-hover:rotate-[-5deg] lg:group-hover:scale-105">
              <img 
                src="./images/shoe.png" 
                alt="High-performance Rock Climb Shoe" 
                className="w-full h-auto max-w-[240px] sm:max-w-[320px] lg:max-w-[460px] drop-shadow-[10px_20px_20px_rgba(0,0,0,0.6)] lg:drop-shadow-[20px_40px_40px_rgba(0,0,0,0.8)] select-none pointer-events-none"
              />

              {/* Badges - Simplified for better mobile visibility */}
              <div className="hidden sm:flex absolute -top-4 -right-4 lg:-top-6 lg:-right-8 animate-bounce [animation-duration:4s]">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 lg:p-3 rounded-xl lg:rounded-2xl flex items-center gap-2">
                  <div className="bg-blue-500/20 p-1 lg:p-1.5 rounded-lg text-blue-400">
                    <Zap size={14} fill="currentColor" />
                  </div>
                  <div className="whitespace-nowrap">
                    <p className="text-white text-[9px] lg:text-[10px] font-bold leading-none uppercase">Ultra Light</p>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex absolute -bottom-6 -left-4 lg:-bottom-8 lg:-left-8 animate-bounce [animation-duration:5s]">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 lg:p-3 rounded-xl lg:rounded-2xl flex items-center gap-2">
                  <div className="bg-green-500/20 p-1 lg:p-1.5 rounded-lg text-green-400">
                    <ShieldCheck size={14} fill="currentColor" />
                  </div>
                  <div className="whitespace-nowrap">
                    <p className="text-white text-[9px] lg:text-[10px] font-bold leading-none uppercase">Elite Grip</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;