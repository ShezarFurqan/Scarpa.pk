'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useLoading } from '../Context/LoginContext';

const Hero = () => {
  const [content, setContent] = useState(null);
  const { setLoading } = useLoading();
  

  const fetchHeroContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "heroSection", "singleton");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        setContent({
          badge: "Scarpa Premium Edition",
          titleLine1: "ELEVATE",
          titleLine2: "YOUR SOLE",
          description: "Experience the ultimate fusion of Italian craftsmanship and modern comfort. Designed for the bold.",
          btnPrimary: "Shop Now",
          btnSecondary: "Watch Story",
          image: "/images/image1.png"
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchHeroContent(); }, []);

  if (!content) return null;

  return (
    <section className="relative w-full min-h-screen flex items-center bg-[#edf1f5] overflow-hidden py-12 lg:py-0">
      
      {/* Subtle Background Glow - Responsive sizes */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#0145f2]/5 blur-[80px] lg:blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center relative z-10 gap-y-10 lg:gap-y-0">

        {/* LEFT CONTENT: Responsive spacing and alignment */}
        <div className="w-full flex flex-col space-y-5 sm:space-y-6 md:space-y-8 px-6 sm:px-12 md:px-24 lg:pl-16 xl:pl-24 lg:pr-0 order-2 lg:order-1">
          <div className="inline-block">
            <span className="text-[#0145f2] text-xs sm:text-sm font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase">
              {content.badge}
            </span>
          </div>

          {/* Responsive Typography for Headings */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[90px] xl:text-[110px] font-black text-[#1a1a1a] leading-[0.9] tracking-tighter italic uppercase break-words">
            {content.titleLine1} <br />
            <span className="text-[#0145f2]">{content.titleLine2}</span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg md:text-xl max-w-full sm:max-w-md font-medium leading-relaxed">
            {content.description}
          </p>

          {/* Buttons: Stacked on small mobiles, inline on larger screens */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
            <button className="justify-center px-8 sm:px-10 py-3 sm:py-4 bg-[#0145f2] text-white rounded-full font-bold transition-all hover:bg-black hover:shadow-xl active:scale-95 flex items-center gap-3 text-sm sm:text-base">
              {content.btnPrimary}
              <ArrowRight size={20} />
            </button>

            <button className="justify-center px-8 sm:px-10 py-3 sm:py-4 bg-transparent text-[#1a1a1a] rounded-full font-bold border-2 border-black/5 transition-all hover:bg-black/5 flex items-center gap-2 text-sm sm:text-base">
              {content.btnSecondary}
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT: Responsive Shoe Container and Scaling */}
        <div className="w-full flex justify-center items-center relative order-1 lg:order-2 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:h-screen mt-8 lg:mt-0">
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Responsive Shadow */}
            <div className="absolute bottom-[10%] sm:bottom-[15%] lg:bottom-[25%] w-[70%] sm:w-[60%] h-[20px] sm:h-[40px] bg-black/10 blur-[30px] sm:blur-[40px] rounded-[100%] animate-shadow" />

            {/* The Shoe - Properly scaled for all devices */}
            <img
              src={content.image}
              alt="Scarpa Shoe"
              className="w-[85%] sm:w-[70%] md:w-[60%] lg:w-[95%] xl:w-[97%] max-w-[800px] h-auto transform rotate-[-15deg] lg:translate-x-12 select-none animate-float drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)] sm:drop-shadow-[0_40px_50px_rgba(0,0,0,0.1)] z-20"
            />
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-15px) rotate(-13deg); }
        }
        @keyframes shadow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(0.8); opacity: 0.2; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-shadow {
          animation: shadow 4s ease-in-out infinite;
        }

        /* Adjust animation slightly for larger screens for stronger effect */
        @media (min-width: 1024px) {
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-15deg); }
            50% { transform: translateY(-25px) rotate(-12deg); }
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;