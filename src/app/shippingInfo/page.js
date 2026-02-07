"use client"
import React from 'react'
import { Truck, Globe, Clock, ShieldCheck, Package, RefreshCcw } from 'lucide-react';

const ShippingPolicy = () => {
  const policies = [
    {
      icon: <Truck className="w-6 h-6 text-blue-400" />,
      title: "Dispatch Time",
      description: "All orders are processed within 24–48 business hours. You will receive a tracking number once your package is dispatched."
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: "Delivery Timelines",
      description: "We currently deliver across Pakistan only. Orders typically arrive within 3–5 business days."
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-400" />,
      title: "Domestic Shipping Only",
      description: "Currently, we ship within Pakistan only. International shipping is not available at this time."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      title: "Secure Handling",
      description: "Every item undergoes a quality check and is packed in secure, tamper-proof packaging to ensure safe delivery."
    }
  ];

  return (
    <section className="min-h-screen bg-[#050505] text-white py-20 lg:py-32 overflow-hidden relative">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <Package size={14} className="text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Logistics & Delivery
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
            Shipping <br /> <span className="text-white/20">Information</span>
          </h1>

          <p className="text-gray-500 text-lg font-light leading-relaxed">
            We currently ship across Pakistan only. Orders are delivered safely within 3–5 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden mb-20">
          {policies.map((item, index) => (
            <div key={index} className="bg-[#080808] p-10 lg:p-14 hover:bg-[#0A0A0A] transition-colors duration-500">
              <div className="mb-6 p-4 w-fit rounded-2xl bg-white/[0.03] border border-white/10">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-4">{item.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base italic">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl space-y-16">
          <div className="border-l-2 border-white/10 pl-8">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Shipping Rates</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 font-bold text-white uppercase tracking-widest">Region</th>
                    <th className="py-4 font-bold text-white uppercase tracking-widest">Standard</th>
                    <th className="py-4 font-bold text-white uppercase tracking-widest">Express</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-6">Pakistan (Domestic)</td>
                    <td className="py-6">Free</td>
                    <td className="py-6">Rs. 500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <RefreshCcw className="text-blue-500" />
            </div>

            <div>
              <h4 className="text-lg font-bold uppercase mb-2">
                Wrong Address / Undeliverable Packages
              </h4>

              <p className="text-gray-500 text-sm font-light">
                Please double-check your shipping address. If a package is returned due to an incorrect address,
                re-shipping fees may apply. Contact support immediately if you notice an error.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.5em]">
            Pakistan Delivery Network © 2026
          </p>
        </div>

      </div>
    </section>
  )
}

export default ShippingPolicy
