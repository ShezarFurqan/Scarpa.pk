"use client";
import React, { useState } from 'react';
import { Footprints, Ruler, Info } from 'lucide-react';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('footwear');

  const footwearSizes = [
    { uk: "6", eu: "39", us: "7", cm: "25.0" },
    { uk: "7", eu: "41", us: "8", cm: "26.0" },
    { uk: "8", eu: "42", us: "9", cm: "27.0" },
    { uk: "9", eu: "43", us: "10", cm: "28.0" },
    { uk: "10", eu: "44.5", us: "11", cm: "29.0" },
    { uk: "11", eu: "46", us: "12", cm: "30.0" },
  ];

  return (
    <section className="min-h-screen bg-[#edf1f5] text-gray-900 py-20 pb-40 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-6xl font-[1000] uppercase tracking-tighter mb-2 text-gray-900">
            Size <span className="text-[#0145f2]">Guide</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">Find your perfect fit</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-8 mb-10">
          {[
            { id: 'footwear', label: 'Footwear', icon: <Footprints size={16}/> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.id 
                  ? "border-[#0145f2] text-[#0145f2]" 
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Table Area */}
          <div className="lg:col-span-2 overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-5 px-6 text-[10px] uppercase text-gray-400 font-black tracking-widest">UK Size</th>
                    <th className="py-5 px-6 text-[10px] uppercase text-gray-400 font-black tracking-widest">EU Size</th>
                    <th className="py-5 px-6 text-[10px] uppercase text-gray-400 font-black tracking-widest">US Size</th>
                    <th className="py-5 px-6 text-[10px] uppercase text-gray-400 font-black tracking-widest">CM (Foot)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {footwearSizes.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#0145f2]/[0.02] transition-colors group">
                      <td className="py-6 px-6 font-black text-xl text-gray-900">{item.uk}</td>
                      <td className="py-6 px-6 font-bold text-lg text-gray-500 group-hover:text-[#0145f2]">{item.eu}</td>
                      <td className="py-6 px-6 font-bold text-lg text-gray-500 group-hover:text-[#0145f2]">{item.us}</td>
                      <td className="py-6 px-6 font-bold text-lg text-gray-400">{item.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="p-8 bg-white rounded-[2rem] border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-[#0145f2]">
                <Ruler size={20} />
                <h4 className="text-xs font-black uppercase tracking-widest">Measurement Tips</h4>
              </div>
              <ul className="space-y-6">
                <li>
                  <span className="text-[#0145f2] text-[10px] font-black uppercase block mb-1">Step 1</span>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">Place your foot on a blank sheet of paper and mark the heel and the longest toe.</p>
                </li>
                <li>
                  <span className="text-[#0145f2] text-[10px] font-black uppercase block mb-1">Step 2</span>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">Measure the distance between these two marks in centimeters (CM).</p>
                </li>
                <li>
                  <span className="text-[#0145f2] text-[10px] font-black uppercase block mb-1">Pro Tip</span>
                  <p className="text-xs text-gray-900 font-black leading-relaxed italic">If you are between sizes, we strongly recommend sizing up for the best comfort.</p>
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <Info size={18} className="text-[#0145f2] shrink-0" />
              <p className="text-[10px] text-[#0145f2]/70 font-bold leading-normal uppercase tracking-tight">
                Standard international sizing. Slight variations may occur based on shoe silhouette and materials.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SizeGuide;