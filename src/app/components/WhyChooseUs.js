"use client";
import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

/**
 * WhyChooseUs Section
 * High-end feature highlights tailored for a premium shoe store.
 */
const WhyChooseUs = () => {
  const features = [
    {
      icon: <Truck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Fast & Reliable Delivery",
      description: "Get your shoes delivered quickly and safely anywhere in Pakistan. Track your order in real-time.",
      color: "text-blue-400"
    },
    {
      icon: <RotateCcw className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "48-Hour Returns",
      description: "Found a defect? Return or exchange your shoes within 48 hours, no questions asked.",
      color: "text-purple-400"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Premium Quality Assurance",
      description: "All products are carefully checked to ensure top-notch quality and long-lasting comfort.",
      color: "text-emerald-400"
    },
    {
      icon: <CreditCard className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: "Secure Payments",
      description: "Pay with confidence using encrypted transactions, supporting multiple payment methods.",
      color: "text-orange-400"
    }
  ];

  return (
    <section className="w-full bg-[#050505] pb-12">
      <div className="container mx-auto px-6 md:px-0">

        {/* Section Header */}
        <div className="mb-16 lg:mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
            Why Shop With Us
          </h2>
          <div className="h-1 w-12 bg-white/10 mx-auto rounded-full" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 transition-all duration-500 hover:bg-white/[0.04] hover:scale-[1.02] hover:border-white/10"
            >
              <div className={`mb-6 inline-flex p-3 rounded-2xl bg-white/5 ${feature.color} transition-colors duration-500 group-hover:bg-white/10`}>
                {feature.icon}
              </div>

              <h3 className="text-white font-bold text-lg mb-3 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed font-light">
                {feature.description}
              </p>

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
