"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SizeSelector = () => {
  const router = useRouter();

  // Added UK sizes for a more detailed, premium feel
  // Fixed the label for uk6eu40 to '40'
  const sizes = [
    { id: "uk5eu39", label: "39", uk: "UK 5" },
    { id: "uk6eu40", label: "40", uk: "UK 6" },
    { id: "uk7eu41", label: "41", uk: "UK 7" },
    { id: "uk8eu42", label: "42", uk: "UK 8" },
    { id: "uk9eu43", label: "43", uk: "UK 9" },
    { id: "uk10eu44", label: "44", uk: "UK 10" },
  ];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
  };

  const popIn = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 12 } 
    },
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full bg-[#edf1f5] lg:py-12 overflow-hidden relative"
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0145f2]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="mb-14 px-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-6 bg-[#0145f2]" />
            <p className="text-[#0145f2] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
              Perfect Fit
            </p>
            <div className="h-[2px] w-6 bg-[#0145f2]" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] tracking-tighter uppercase italic">
            Shop by Size
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-3 max-w-md mx-auto">
            Discover our most popular sizes. Expertly crafted for ultimate comfort and bold style.
          </p>
        </motion.div>

        {/* Sizes Grid: 2 cols mobile, 3 cols tablet, 6 cols desktop */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 max-w-lg md:max-w-3xl lg:max-w-6xl mx-auto px-6 pb-12"
        >
          {sizes.map((size) => (
            <motion.button
              variants={popIn}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              key={size.id}
              onClick={() => router.push(`/shop/size/${size.id}`)}
              className="group relative flex flex-col items-center justify-center w-full aspect-square bg-white rounded-3xl sm:rounded-full shadow-lg hover:shadow-2xl hover:shadow-[#0145f2]/20 transition-shadow duration-300 border-2 border-transparent hover:border-[#0145f2] overflow-hidden"
            >
              {/* Background fill animation on hover */}
              <div className="absolute inset-0 bg-[#0145f2] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
              
              <div className="relative z-10 flex flex-col items-center justify-center space-y-1 sm:space-y-2">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-blue-100 transition-colors tracking-widest uppercase">
                  EU Size
                </span>
                <span className="text-4xl sm:text-5xl lg:text-5xl font-black text-[#1a1a1a] group-hover:text-white transition-colors leading-none tracking-tighter">
                  {size.label}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#0145f2] group-hover:text-blue-200 transition-colors tracking-wide bg-[#0145f2]/10 group-hover:bg-transparent px-2 py-0.5 rounded-full">
                  {size.uk}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Footer Text */}
        <motion.p 
          variants={fadeInUp}
          className="text-[10px] sm:text-xs font-black text-[#1a1a1a]/20 tracking-[0.4em] uppercase mt-4"
        >
          Premium Footwear Experience
        </motion.p>
      </div>
    </motion.section>
  );
};

export default SizeSelector;