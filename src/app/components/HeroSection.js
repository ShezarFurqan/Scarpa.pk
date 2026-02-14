import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    // Main Container: "main div par px mat dena" wala rule follow kiya hai.
    // 'min-h-screen' ensure karega ke ye poori screen cover kare.
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Background Glow Effect (Shoe ke peeche jo blue glow hai) */}
      <div className="absolute top-1/2 right-0 lg:right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-0 pointer-events-none" />

      {/* Content Container - Isme hum layout control karenge */}
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center z-10">
        
        {/* Left Side: Text Content */}
        {/* Padding sirf inner content ke liye add ki hai taaki text edge se chipak na jaye */}
        <div className="pl-6 pr-6 lg:pl-20 flex flex-col items-start justify-center space-y-6">
          
          {/* Pill Tag */}
          <div className="bg-[#2B59C3] text-white px-5 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-md">
            Next Gen Footwears
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-800 italic leading-[1.1] tracking-tight">
            ELEVATE <br />
            <span className="text-slate-900">YOUR SOLE</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-lg lg:text-xl max-w-md leading-relaxed">
            Where Style Meets Heritage. Crafted for Comfort, Designed for Power.
          </p>

          {/* Buttons Group */}
          <div className="flex flex-wrap gap-4 pt-4">
            {/* Primary Button */}
            <button className="bg-[#2B59C3] hover:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
              Shop Now
            </button>

            {/* Secondary Button */}
            <button className="bg-transparent border-2 border-[#8ba3de] text-[#2B59C3] font-medium px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all duration-300">
              Explore Collection
            </button>
          </div>
        </div>

        {/* Right Side: Shoe Image */}
        <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center">
            {/* Shoe Image */}
            {/* Note: Apni image ka path '/shoe.png' se replace kar lena */}
            <div className="relative w-[80%] lg:w-[110%] h-auto aspect-square animate-float">
                 {/* Main Image */}
                <Image 
                    src="/images/gemini.bg.png" 
                    alt="Premium Sneaker"
                    fill
                    className="object-contain drop-shadow-2xl -rotate-[20deg] lg:-translate-x-10"
                    priority
                />
            </div>
            
            {/* Bottom Shadow (Floating effect ke liye) */}
            <div className="absolute bottom-10 lg:bottom-20 w-2/3 h-8 bg-black/20 blur-xl rounded-[100%]"></div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;