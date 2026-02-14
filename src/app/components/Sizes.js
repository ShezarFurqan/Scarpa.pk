"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SizeSelector = () => {
  const router = useRouter();

  const sizes = [
    { id: "uk7eu41", label: "41" },
    { id: "uk8eu42", label: "42" },
    { id: "uk9eu43", label: "43" },
    { id: "uk9.5eu44", label: "44" },
  ];

  return (
    <section className="w-full bg-[#edf1f5] py-16 sm:pt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        
        <div className="mb-10 px-6">
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter uppercase">
            Shop by Size
          </h2>
          <p className="text-gray-500 text-xs font-medium tracking-widest uppercase mt-2">
            Find your perfect fit
          </p>
        </div>

        <div className="flex sm:justify-center gap-5 overflow-x-auto pb-10 px-8 snap-x snap-mandatory no-scrollbar">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => router.push(`/shop/size/${size.id}`)}
              className="flex-shrink-0 snap-center outline-none"
            >
              <div className="w-28 h-28 sm:w-40 sm:h-40 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border-2 border-transparent hover:border-[#0145f2] active:bg-[#0145f2] active:text-white group">
                <span className="text-xl sm:text-3xl font-black text-gray-900 group-active:text-white transition-colors">
                  {size.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-[9px] font-bold text-gray-400 tracking-[0.4em] uppercase">
          Premium Footwear Experience
        </p>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default SizeSelector;