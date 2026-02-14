"use client";
import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

/**
 * WhyChooseUs Section
 * Re-themed to Royal Blue & Light Gray
 */
const WhyChooseUs = () => {
  const features = [
    {
      icon: <Truck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Fast & Reliable Delivery",
      description: "Get your shoes delivered quickly and safely anywhere in Pakistan. Track your order in real-time.",
      color: "text-[#0145f2]"
    },
    {
      icon: <RotateCcw className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "48-Hour Returns",
      description: "Found a defect? Return or exchange your shoes within 48 hours, no questions asked.",
      color: "text-[#0145f2]"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Premium Quality Assurance",
      description: "All products are carefully checked to ensure top-notch quality and long-lasting comfort.",
      color: "text-[#0145f2]"
    },
    {
      icon: <CreditCard className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Secure Payments",
      description: "Pay with confidence using encrypted transactions, supporting multiple payment methods.",
      color: "text-[#0145f2]"
    }
  ];

  return (
    <section className="w-full bg-[#edf1f5] py-20 lg:pb-44">
      <div className="container mx-auto px-6 lg:px-0">

        {/* Section Header */}
        <div className="mb-16 lg:mb-24 text-center space-y-4">
          <p className="text-[#0145f2] text-xs font-black uppercase tracking-[0.4em]">Scarpa Promise</p>
          <h2 className="text-4xl md:text-6xl font-black text-[#0145f2] tracking-tighter uppercase italic">
            Why Shop With Us
          </h2>
          <div className="h-1.5 w-16 bg-[#0145f2]/10 mx-auto rounded-full" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-[32px] bg-white border border-[#0145f2]/5 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(1,69,242,0.1)] hover:-translate-y-2"
            >
              {/* Icon Container with Blue Glow */}
              <div className={`mb-8 inline-flex p-4 rounded-2xl bg-[#0145f2]/5 ${feature.color} transition-all duration-500 group-hover:bg-[#0145f2] group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30`}>
                {feature.icon}
              </div>

              <h3 className="text-[#0145f2] font-black text-xl mb-4 tracking-tight uppercase italic">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>

              {/* Decorative Corner Element */}
              <div className="absolute top-6 right-6 opacity-20 transition-opacity duration-500 group-hover:opacity-100">
                <div className="w-2 h-2 rounded-full bg-[#0145f2]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;