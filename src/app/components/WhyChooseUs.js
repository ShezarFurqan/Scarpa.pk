"use client";
import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * WhyChooseUs Section
 * Ultra Responsive + Scroll Animations
 */
const WhyChooseUs = () => {
  const features = [
    {
      icon: <Truck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Ships in 24hrs",
      description: "Your order is processed and dispatched within 24 hours of confirmation.",
    },
    {
      icon: <CreditCard className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "COD Available",
      description: "Pay conveniently with Cash on Delivery anywhere in Pakistan.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "100% Original",
      description: "Authentic sneakers guaranteed with strict premium quality assurance.",
    },
    {
      icon: <RotateCcw className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "7-Day Return",
      description: "Not satisfied? Return or exchange easily within 7 days, no hassle.",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Cards line se ayenge
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="w-full bg-[#edf1f5] py-24 sm:py-32 lg:pb-44 overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12 xl:px-0 max-w-7xl">

        {/* Section Header Animation */}
        <motion.div 
          variants={itemVariants}
          className="mb-16 lg:mb-24 text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
             <div className="h-[2px] w-6 bg-[#0145f2]/30" />
             <p className="text-[#0145f2] text-[10px] sm:text-xs font-black uppercase tracking-[0.5em]">
               Scarpa Promise
             </p>
             <div className="h-[2px] w-6 bg-[#0145f2]/30" />
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0145f2] tracking-tighter uppercase italic leading-none">
            Why <span className="text-gray-400 not-italic">Shop</span> With Us
          </h2>
          <div className="h-2 w-20 bg-[#0145f2]/10 mx-auto rounded-full" />
        </motion.div>

        {/* Features Grid Animation */}
        {/* Mobile: 1 Col, Tablet: 2 Col, Desktop: 4 Col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants} // Individually animating cards
              whileHover={{ scale: 1.05, y: -8 }} // Added hover pop
              className="group relative p-8 sm:p-10 rounded-[32px] bg-white border border-[#0145f2]/5 transition-all duration-500 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_70px_-20px_rgba(1,69,242,0.15)] overflow-hidden"
            >
              {/* Animated Icon Container */}
              <div className={`mb-10 inline-flex p-5 rounded-[22px] bg-[#0145f2]/5 text-[#0145f2] transition-all duration-500 group-hover:bg-[#0145f2] group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-600/30 group-hover:rotate-[10deg]`}>
                {feature.icon}
              </div>

              <h3 className="text-[#0145f2] font-black text-xl mb-4 tracking-tight uppercase italic leading-[1.2]">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>

              {/* Decorative Background Element (Subtle "01", "02" index) */}
              <div className="absolute -bottom-4 -right-2 text-[100px] font-black text-[#0145f2]/[0.02] select-none pointer-events-none group-hover:opacity-50 transition-opacity">
                0{index + 1}
              </div>

              {/* Top Accent Dot */}
              <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0145f2]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Delivery Estimate */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 lg:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white border border-[#0145f2]/10 shadow-sm">
            <Truck className="w-5 h-5 text-[#0145f2]" />
            <span className="text-gray-700 font-bold text-sm sm:text-base">
              Estimated delivery: <span className="text-[#0145f2]">3–5 days to your city</span>
            </span>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default WhyChooseUs;