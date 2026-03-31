"use client"
import React from 'react'
import { RotateCcw, ShieldCheck, AlertCircle, Truck, Ban, CheckCircle2, Headphones } from 'lucide-react';

const ReturnPolicy = () => {
  const highlightPoints = [
    {
      icon: <RotateCcw className="text-[#0145f2]" />,
      title: "3-Day Exchange",
      desc: "Items can be exchanged within 3 days of delivery only if there is a size issue and the product is unused with all tags attached."
    },
    {
      icon: <Ban className="text-rose-500" />,
      title: "48-Hour Return",
      desc: "Returns are allowed within 48 hours of delivery only if the shoes are damaged. Otherwise, cash refunds are not processed."
    },
    {
      icon: <Truck className="text-emerald-500" />,
      title: "Reverse Pickup",
      desc: "For approved exchanges or returns due to size issues or damage, we arrange free pickup across Pakistan."
    }
  ];

  return (
    <section className="min-h-screen bg-[#edf1f5] text-gray-900 py-16 lg:py-28 relative overflow-hidden">
      
      {/* Background Decor */}

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <h1 className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter mb-6 leading-[0.8] text-gray-900">
            Returns & <br /> <span className="text-[#0145f2]/10 italic font-light">Exchanges</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl leading-relaxed">
            We value your satisfaction. Exchanges and returns are streamlined for our Pakistani customers. Please follow the guidelines below carefully.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {highlightPoints.map((item, idx) => (
            <div key={idx} className="p-8 bg-white border border-gray-200 rounded-[2rem] shadow-sm hover:shadow-md hover:border-[#0145f2]/20 transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-[#edf1f5] flex items-center justify-center mb-6 border border-gray-100">
                {item.icon}
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm mb-3 text-gray-900">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-medium italic">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Policy Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* Standard Procedure */}
            <div>
              <h2 className="text-2xl font-[1000] uppercase tracking-tighter mb-8 flex items-center gap-4 text-gray-900">
                <CheckCircle2 className="text-[#0145f2]" size={24} /> The Procedure
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-white border-l-4 border-[#0145f2] rounded-r-2xl shadow-sm">
                  <h4 className="text-[#0145f2] font-black uppercase text-xs mb-2 tracking-widest">Step 1: Contact Us</h4>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    WhatsApp us at <span className="text-gray-900 font-black">+92-311-2632505</span> within 3 days for exchanges (size issues) or 48 hours for returns (damaged items) with your Order ID and photos of the item.
                  </p>
                </div>
                <div className="p-6 bg-white border-l-4 border-gray-200 rounded-r-2xl shadow-sm">
                  <h4 className="text-gray-900 font-black uppercase text-xs mb-2 tracking-widest">Step 2: Shipping Back</h4>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    Once approved, you can ship the item back to our warehouse in Karachi. For size exchanges, customers handle shipping. For damaged items, pickup is arranged free of charge.
                  </p>
                </div>
                <div className="p-6 bg-white border-l-4 border-gray-200 rounded-r-2xl shadow-sm">
                  <h4 className="text-gray-900 font-black uppercase text-xs mb-2 tracking-widest">Step 3: Quality Check & Dispatch</h4>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    Items are inspected upon arrival. Approved exchanges (size issues) or returns (damage) will be processed promptly with a replacement or store credit.
                  </p>
                </div>
              </div>
            </div>

            {/* Non-Returnable Items */}
            <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem]">
              <h2 className="text-xl font-[1000] uppercase tracking-tighter mb-6 flex items-center gap-4 text-rose-600">
                <AlertCircle size={20} /> Non-Returnable Items
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-rose-900/70 font-bold uppercase tracking-tight">
                <li className="flex items-center gap-2 group">
                   <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Items bought on <span className="text-rose-600 font-black">Sale</span>
                </li>
                <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Innerwear or Socks
                </li>
                <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Missing tags/packaging
                </li>
                <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Opened Perfumes
                </li>
              </ul>
            </div>

          </div>

          {/* Sidebar Note */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-white border border-gray-200 rounded-[2.5rem] sticky top-8 shadow-sm">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6" />
              <h4 className="font-black uppercase tracking-widest text-xs mb-4 text-gray-900">Damaged on Arrival?</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed italic mb-6">
                "If your parcel arrives damaged, take a video immediately and send it to us. We will assist you promptly."
              </p>
              <button className="w-full py-4 bg-[#0145f2] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Report Damage
              </button>
              
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0145f2]/10 flex items-center justify-center">
                  <Headphones size={18} className="text-[#0145f2]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400">Need Help?</p>
                  <p className="text-xs font-black text-gray-900 tracking-tighter">rockclimb.rc@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-24 py-12 border-y border-gray-200 text-center">
          <p className="text-[10px] uppercase tracking-[0.8em] text-gray-400 font-black italic">
            Integrity in every thread. Satisfaction in every delivery.
          </p>
        </div>

      </div>
    </section>
  )
}

export default ReturnPolicy;