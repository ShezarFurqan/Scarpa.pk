"use client";
import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

/**
 * WhyChooseUs Section
 * High-end feature highlights with a clean, centered heading.
 */
const WhyChooseUs = () => {
  const features = [
    {
      icon: <Truck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Complimentary Delivery",
      description: "Enjoy global express shipping on all orders over $150. Tracked and insured.",
      color: "text-blue-400"
    },
    {
      icon: <RotateCcw className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "7-Day Trial Period",
      description: "Not the perfect fit? Return or exchange your gear within 7 days, no questions asked.",
      color: "text-purple-400"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Master Craftsmanship",
      description: "Every product is rigorously tested in extreme conditions for lifelong durability.",
      color: "text-emerald-400"
    },
    {
      icon: <CreditCard className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Encrypted Payments",
      description: "Industry-leading 256-bit encryption ensuring your data stays private and secure.",
      color: "text-orange-400"
    }
  ];

  return (
    <section className="w-full bg-[#050505] pb-12">
      <div className="container mx-auto px-6 md:px-0">
        
        {/* Added Section Header */}
        <div className="mb-16 lg:mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
            Why Choose Us
          </h2>
          <div className="h-1 w-12 bg-white/10 mx-auto rounded-full" />
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 transition-all duration-500 hover:bg-white/[0.04] hover:scale-[1.02] hover:border-white/10"
            >
              {/* Subtle Icon Glow Effect */}
              <div className={`mb-6 inline-flex p-3 rounded-2xl bg-white/5 ${feature.color} transition-colors duration-500 group-hover:bg-white/10`}>
                {feature.icon}
              </div>

              <h3 className="text-white font-bold text-lg mb-3 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                {feature.description}
              </p>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;