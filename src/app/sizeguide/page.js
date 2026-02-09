"use client";
import React, { useState } from 'react';
import { Footprints, Shirt, Ruler, Info } from 'lucide-react';

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
    <section className="min-h-screen bg-black text-white py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Size Guide</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Find your perfect fit</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-8 mb-10">
          {[
            { id: 'footwear', label: 'Footwear', icon: <Footprints size={16}/> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.id ? "border-white text-white" : "border-transparent text-gray-600 hover:text-gray-400"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Table Area */}
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  {activeTab === 'footwear' ? (
                    <>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">UK</th>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">EU</th>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">US</th>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">CM</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">Size</th>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">Chest (IN)</th>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">Waist (IN)</th>
                      <th className="py-4 text-[10px] uppercase text-gray-500 font-bold">EU</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {(activeTab === 'footwear' ? footwearSizes : apparelSizes).map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    {activeTab === 'footwear' ? (
                      <>
                        <td className="py-5 font-mono text-lg">{item.uk}</td>
                        <td className="py-5 font-mono text-lg text-gray-400">{item.eu}</td>
                        <td className="py-5 font-mono text-lg text-gray-400">{item.us}</td>
                        <td className="py-5 font-mono text-lg text-gray-400">{item.cm}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-5 font-bold text-lg">{item.size}</td>
                        <td className="py-5 font-mono text-lg text-gray-400">{item.chest}</td>
                        <td className="py-5 font-mono text-lg text-gray-400">{item.waist}</td>
                        <td className="py-5 font-mono text-lg text-gray-400">{item.eu}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-8">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3 mb-4 text-white">
                <Ruler size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">How to measure</h4>
              </div>
              <ul className="space-y-4 text-xs text-gray-400 uppercase tracking-tighter leading-relaxed">
                <li><span className="text-white font-bold block mb-1">Chest:</span> Measure around the fullest part of your chest.</li>
                <li><span className="text-white font-bold block mb-1">Waist:</span> Measure around your natural waistline.</li>
                <li><span className="text-white font-bold block mb-1">Footwear:</span> If between sizes, we recommend sizing up.</li>
              </ul>
            </div>

            <div className="flex items-start gap-3 p-4 border border-white/5 rounded-lg">
              <Info size={16} className="text-gray-600 shrink-0" />
              <p className="text-[10px] text-gray-500 leading-normal uppercase">
                Measurements are provided by brands and may vary slightly by 1-2cm depending on material.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SizeGuide;