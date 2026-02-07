"use client"
import React, { useState } from 'react'
import { Ruler, Info, MoveHorizontal, User, Sparkles, Shirt, Footprints } from 'lucide-react';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('footwear');

  const footwearSizes = [
    { uk: "6", eu: "40", us: "7", cm: "25.0" },
    { uk: "7", eu: "41", us: "8", cm: "26.0" },
    { uk: "8", eu: "42", us: "9", cm: "27.0" },
    { uk: "9", eu: "43", us: "10", cm: "28.0" },
    { uk: "10", eu: "44", us: "11", cm: "29.0" },
    { uk: "11", eu: "45", us: "12", cm: "30.0" },
  ];

  const apparelSizes = [
    { size: "S", uk: "36", eu: "46", chest: "36-38 in", waist: "30-32 in" },
    { size: "M", uk: "38", eu: "48", chest: "38-40 in", waist: "32-34 in" },
    { size: "L", uk: "40", eu: "50", chest: "40-42 in", waist: "34-36 in" },
    { size: "XL", uk: "42", eu: "52", chest: "42-44 in", waist: "36-38 in" },
    { size: "XXL", uk: "44", eu: "54", chest: "44-46 in", waist: "38-40 in" },
  ];

  return (
    <section className="min-h-screen bg-[#050505] text-white py-16 lg:py-28 relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/[0.03] blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-gradient-to-r from-blue-500 to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-blue-400">Master Your Fit</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.8]">
            Size <span className="text-white/5 stroke-text italic font-light">Architect</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
            Eliminate the guesswork. Our precision engineering ensures that every garment feels like it was tailored specifically for you.
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex gap-12 border-b border-white/5 mb-16 overflow-x-auto no-scrollbar">
          {[
            { id: 'footwear', label: 'Footwear', icon: <Footprints size={14}/> },
            { id: 'apparel', label: 'Apparel', icon: <Shirt size={14}/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 relative whitespace-nowrap ${
                activeTab === tab.id ? "text-white" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Table Column */}
          <div className="lg:col-span-8 group">
            <div className="relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.03]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      {activeTab === 'footwear' ? (
                        <>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">UK Standard</th>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-blue-400">EU Scale</th>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">US Men</th>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">Length (CM)</th>
                        </>
                      ) : (
                        <>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">Size</th>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-blue-400">Chest (IN)</th>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-emerald-400">Waist (IN)</th>
                          <th className="p-8 text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">EU Conv.</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(activeTab === 'footwear' ? footwearSizes : apparelSizes).map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.05] transition-all duration-300 group/row">
                        {activeTab === 'footwear' ? (
                          <>
                            <td className="p-8 font-mono text-xl font-bold group-hover/row:text-blue-400 transition-colors">{item.uk}</td>
                            <td className="p-8 font-mono text-xl text-blue-400 font-black">{item.eu}</td>
                            <td className="p-8 font-mono text-lg text-gray-500">{item.us}</td>
                            <td className="p-8 font-mono text-lg text-gray-400">{item.cm} cm</td>
                          </>
                        ) : (
                          <>
                            <td className="p-8 font-black text-2xl group-hover/row:translate-x-2 transition-transform">{item.size}</td>
                            <td className="p-8 font-mono text-lg text-blue-400">{item.chest}</td>
                            <td className="p-8 font-mono text-lg text-emerald-400">{item.waist}</td>
                            <td className="p-8 font-mono text-gray-400">{item.eu}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar / Info Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Model Ref Section */}
            <div className="p-8 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2.5rem]">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <User size={20} className="text-white" />
                </div>
                <h4 className="font-bold uppercase tracking-widest text-xs">Model Reference</h4>
              </div>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Our lead model is <span className="text-white font-bold">188cm / 6'2"</span> and is wearing a size <span className="px-2 py-0.5 bg-white text-black font-black rounded-md ml-1">LARGE</span> for an oversized aesthetic.
              </p>
            </div>

            {/* Pro Tips */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
              <Sparkles className="absolute top-4 right-4 text-white/5 group-hover:text-blue-500/20 transition-colors" />
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Ruler className="text-blue-500" size={18} />
                </div>
                <h4 className="font-bold uppercase tracking-widest text-xs">Pro Tip</h4>
              </div>
              <p className="text-gray-500 text-sm italic leading-relaxed">
                "For our heavy-weight hoodies, if you prefer a classic fit, size down. For the signature drop-shoulder look, stay true to size."
              </p>
            </div>

            {/* Measurement Guide */}
            <div className="p-8 border border-white/10 rounded-[2.5rem] bg-black">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-3">
                <Info size={14} className="text-gray-500" /> Measurement Guide
              </h4>
              <div className="space-y-8">
                <div className="flex gap-6">
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-black">01</div>
                   <div>
                      <p className="text-[10px] uppercase tracking-widest text-white mb-1">Body Length</p>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">Measure from the highest point of the shoulder down to the hem.</p>
                   </div>
                </div>
                <div className="flex gap-6">
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-black">02</div>
                   <div>
                      <p className="text-[10px] uppercase tracking-widest text-white mb-1">Chest Width</p>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">Measure across the chest 1" below the armhole, flat across.</p>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="mt-16 flex items-center justify-center gap-4 py-4 px-8 bg-white/[0.02] rounded-full w-fit mx-auto border border-white/5">
            <MoveHorizontal size={14} className="text-blue-500 animate-bounce-x" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">
              Swipe table for full conversion details
            </p>
        </div>

      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 2s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default SizeGuide