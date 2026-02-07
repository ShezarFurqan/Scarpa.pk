"use client"
import React from 'react'
import { RotateCcw, ShieldCheck, AlertCircle, Truck, Ban, CheckCircle2, Headphones } from 'lucide-react';

const ReturnPolicy = () => {
  const highlightPoints = [
    {
      icon: <RotateCcw className="text-blue-400" />,
      title: "3-Day Exchange",
      desc: "Items can be exchanged within 3 days of delivery only if there is a size issue and the product is unused with all tags attached."
    },
    {
      icon: <Ban className="text-red-400" />,
      title: "48-Hour Return",
      desc: "Returns are allowed within 48 hours of delivery only if the shoes are damaged. Otherwise, cash refunds are not processed."
    },
    {
      icon: <Truck className="text-emerald-400" />,
      title: "Reverse Pickup",
      desc: "For approved exchanges or returns due to size issues or damage, we arrange free pickup across Pakistan."
    }
  ];

  return (
    <section className="min-h-screen bg-[#050505] text-white py-16 lg:py-28 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.8]">
            Returns & <br /> <span className="text-white/10 italic font-light">Exchanges</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl leading-relaxed">
            We value your satisfaction. Exchanges and returns are streamlined for our Pakistani customers. Please follow the guidelines below carefully.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {highlightPoints.map((item, idx) => (
            <div key={idx} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                {item.icon}
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-3">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-light italic">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Policy Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* Standard Procedure */}
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                <CheckCircle2 className="text-blue-500" size={24} /> The Procedure
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-white/[0.01] border-l-2 border-white/10 rounded-r-2xl">
                  <h4 className="text-white font-bold uppercase text-xs mb-2">Step 1: Contact Us</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    WhatsApp us at <span className="text-white font-mono">+92-XXX-XXXXXXX</span> within 3 days for exchanges (size issues) or 48 hours for returns (damaged items) with your Order ID and photos of the item.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.01] border-l-2 border-white/10 rounded-r-2xl">
                  <h4 className="text-white font-bold uppercase text-xs mb-2">Step 2: Shipping Back</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    Once approved, you can ship the item back to our warehouse in Karachi. For size exchanges, customers handle shipping. For damaged items, pickup is arranged free of charge.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.01] border-l-2 border-white/10 rounded-r-2xl">
                  <h4 className="text-white font-bold uppercase text-xs mb-2">Step 3: Quality Check & Dispatch</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    Items are inspected upon arrival. Approved exchanges (size issues) or returns (damage) will be processed promptly with a replacement or store credit.
                  </p>
                </div>
              </div>
            </div>

            {/* Non-Returnable Items */}
            <div className="p-8 bg-red-500/[0.02] border border-red-500/10 rounded-[2.5rem]">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-4 text-red-400">
                <AlertCircle size={20} /> Non-Returnable Items
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 font-light">
                <li className="flex items-center gap-2">• Items bought on <span className="text-red-400 font-bold uppercase">Sale</span> or Clearance.</li>
                <li className="flex items-center gap-2">• Innerwear or Socks (for hygiene reasons).</li>
                <li className="flex items-center gap-2">• Items with missing tags or damaged packaging.</li>
                <li className="flex items-center gap-2">• Perfumes (if seal is broken).</li>
              </ul>
            </div>

          </div>

          {/* Sidebar Note */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] sticky top-8">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
              <h4 className="font-bold uppercase tracking-widest text-xs mb-4">Damaged on Arrival?</h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed italic mb-6">
                "If your parcel arrives damaged, take a video immediately and send it to us. We will assist you promptly."
              </p>
              <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-gray-200 transition-colors">
                Report Damage
              </button>
              
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Headphones size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Need Help?</p>
                  <p className="text-xs font-bold text-white tracking-tighter">Support@yourbrand.pk</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-24 py-12 border-y border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.8em] text-gray-600 font-light italic">
            Integrity in every thread. Satisfaction in every delivery.
          </p>
        </div>

      </div>
    </section>
  )
}

export default ReturnPolicy;
