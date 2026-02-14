"use client"
import React from 'react'
import { Truck, Globe, Clock, ShieldCheck, Package, RefreshCcw } from 'lucide-react';

const ShippingPolicy = () => {
  const policies = [
    {
      icon: <Truck className="w-6 h-6 text-[#0145f2]" />,
      title: "Dispatch Time",
      description: "All orders are processed within 24–48 business hours. You will receive a tracking number once your package is dispatched."
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: "Delivery Timelines",
      description: "We currently deliver across Pakistan only. Orders typically arrive within 3–5 business days."
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-600" />,
      title: "Domestic Shipping Only",
      description: "Currently, we ship within Pakistan only. International shipping is not available at this time."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: "Secure Handling",
      description: "Every item undergoes a quality check and is packed in secure, tamper-proof packaging to ensure safe delivery."
    }
  ];

  return (
    <section className="min-h-screen bg-[#edf1f5] text-gray-900 py-20 lg:py-32 overflow-hidden relative">
 

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 mb-6 shadow-sm">
            <Package size={14} className="text-[#0145f2]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              Logistics & Delivery
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-[1000] uppercase tracking-tighter mb-8 leading-none text-gray-900">
            Shipping <br /> <span className="text-[#0145f2]/10 italic font-light">Information</span>
          </h1>

          <p className="text-gray-500 text-lg font-light leading-relaxed">
            We currently ship across Pakistan only. Orders are delivered safely within 3–5 business days via our trusted courier partners.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-[2.5rem] overflow-hidden mb-20 shadow-xl shadow-gray-200/50">
          {policies.map((item, index) => (
            <div key={index} className="bg-white p-10 lg:p-14 hover:bg-gray-50 transition-colors duration-500 group">
              <div className="mb-6 p-4 w-fit rounded-2xl bg-[#edf1f5] border border-gray-100 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-gray-900">{item.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base italic">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Shipping Rates Table */}
        <div className="max-w-4xl space-y-16">
          <div className="border-l-4 border-[#0145f2] pl-8 bg-white/40 py-6 rounded-r-3xl">
            <h2 className="text-2xl font-[1000] uppercase tracking-widest mb-6 text-gray-900">Shipping Rates</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 font-black text-[#0145f2] uppercase tracking-widest">Region</th>
                    <th className="py-4 font-black text-[#0145f2] uppercase tracking-widest">Standard</th>
                    <th className="py-4 font-black text-[#0145f2] uppercase tracking-widest">Express</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  <tr className="group">
                    <td className="py-6 font-bold text-gray-700">Pakistan (Domestic)</td>
                    <td className="py-6 font-black text-emerald-600 italic">Free</td>
                    <td className="py-6 font-bold text-gray-500">Rs. 500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#edf1f5] flex items-center justify-center shrink-0 border border-blue-100">
              <RefreshCcw className="text-[#0145f2]" />
            </div>

            <div>
              <h4 className="text-lg font-[1000] uppercase mb-2 text-gray-900">
                Wrong Address / Undeliverable Packages
              </h4>

              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Please double-check your shipping address. If a package is returned due to an incorrect address,
                re-shipping fees may apply. Contact <span className="text-[#0145f2] font-black underline">support</span> immediately if you notice an error.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-gray-200 text-center">
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.5em]">
            Pakistan Delivery Network © 2026 ROCK CLIMB
          </p>
        </div>

      </div>
    </section>
  )
}

export default ShippingPolicy;