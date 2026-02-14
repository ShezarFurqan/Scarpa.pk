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
    <section className="relative w-full min-h-screen flex items-center bg-[#edf1f5] overflow-hidden">
      
      {/* Subtle Background Glow - Only to make the shoe pop */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0145f2]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center relative z-10">

        {/* LEFT CONTENT: Focus on clean spacing */}
        <div className="w-full flex flex-col space-y-6 md:space-y-8 pl-8 md:pl-24 pr-8 lg:pr-0 order-2 lg:order-1">
          <div className="inline-block">
            <span className="text-[#0145f2] text-xs font-black tracking-[0.3em] uppercase">
              {content.badge}
            </span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-black text-[#1a1a1a] leading-[0.9] tracking-tighter italic uppercase">
            {content.titleLine1} <br />
            <span className="text-[#0145f2]">{content.titleLine2}</span>
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-md font-medium leading-relaxed">
            {content.description}
          </p>

          <div className="flex flex-row items-center gap-6 pt-4">
            <button className="px-10 py-4 bg-[#0145f2] text-white rounded-full font-bold transition-all hover:bg-black hover:shadow-xl active:scale-95 flex items-center gap-3">
              {content.btnPrimary}
              <ArrowRight size={20} />
            </button>

            <button className="px-10 py-4 bg-transparent text-[#1a1a1a] rounded-full font-bold border-2 border-black/5 transition-all hover:bg-black/5 flex items-center gap-2">
              {content.btnSecondary}
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT: Precise Shoe Scaling & Position */}
        <div className="w-full flex justify-center items-center relative order-1 lg:order-2 h-[450px] lg:h-screen">
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Simple Shadow */}
            <div className="absolute bottom-[20%] lg:bottom-[25%] w-[60%] h-[40px] bg-black/10 blur-[40px] rounded-[100%] animate-shadow" />

            {/* The Shoe - Scaled up for 'Premium' feel */}
            <img
              src={content.image} 
              alt="Scarpa Shoe"
              className="w-[90%] md:w-[100%] lg:w-[97%] max-w-[800px] h-auto transform rotate-[-15deg] lg:translate-x-12 select-none animate-float drop-shadow-[0_40px_50px_rgba(0,0,0,0.1)] z-20"
            />
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-25px) rotate(-12deg); }
        }
        @keyframes shadow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(0.8); opacity: 0.2; }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-shadow {
          animation: shadow 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;