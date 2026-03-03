"use client";
import React, { useContext } from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import { ShopContext } from '../Context/ShopContext';

const Categories = () => {
  const { router, products } = useContext(ShopContext);

  const categories = [
    { id: 1, name: "nike", displayTitle: "Nike", image: "/images/Nike.png" },
    { id: 2, name: "puma", displayTitle: "Puma", image: "/images/puma.png" },
    { id: 3, name: "adidas", displayTitle: "Adidas", image: "/images/adidas.png" },
    { id: 4, name: "newbalance", displayTitle: "New Balance", image: "/images/newbalance.png" },
    { id: 5, name: "brooks", displayTitle: "Brooks", image: "/images/brooks.png" },
    { id: 6, name: "skechers", displayTitle: "Skechers", image: "/images/sketchers.png" },
  ];

  return (
    <section className="w-full bg-[#edf1f5] py-20 lg:py-16 overflow-hidden font-sans">
      <div className="container mx-auto px-6 lg:px-0">
        
        {/* --- LUXURY HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
              <span className="h-[3px] w-12 bg-[#0145f2] rounded-full" />
              <p className="text-[#0145f2] text-[10px] font-black uppercase tracking-[0.4em]">Elite Partnerships</p>
            </div>
            <h2 className="text-5xl md:text-8xl font-[1000] text-gray-900 tracking-[-0.05em] uppercase leading-[0.85]">
              THE <span className="text-[#0145f2] italic">BRANDS</span> <br /> 
              <span className="text-gray-300">OF SPEED</span>
            </h2>
          </div>
          
          <button 
            onClick={() => router.push('/collection')}
            className="group flex items-center gap-4 text-gray-900 font-black text-xs uppercase tracking-widest transition-all hover:text-[#0145f2]"
          >
            All Collections 
            <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-[#0145f2] group-hover:bg-[#0145f2] group-hover:text-white transition-all duration-500">
              <MoveRight size={20} />
            </div>
          </button>
        </div>

        {/* --- 3 COLUMN BRAND GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat) => {
            const productCount = products?.filter(item => item.brand?.toLowerCase() === cat.name).length;

            return (
              <div 
                key={cat.id}
                onClick={() => router.push(`/shop/brand/${cat.name}`)}
                className="group relative aspect-[4/5] rounded-[40px] overflow-hidden bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-3"
              >
                {/* Image */}
                <img 
                  src={cat.image} 
                  alt={cat.displayTitle}
                  className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
                />

                {/* REFINED OVERLAY: 50% lighter & subtle blue tint on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition-all duration-700 group-hover:from-[#0145f2]/40" />
                
                {/* Content */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end z-10">
                  <div className="space-y-1 transform transition-transform duration-500 group-hover:-translate-y-2">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em]">
                      {productCount || "Explore"} Products
                    </p>
                    <h3 className="text-5xl font-[1000] text-white tracking-tighter uppercase italic leading-none pb-4">
                      {cat.displayTitle}
                    </h3>
                  </div>

                  {/* Glassmorphism Button: More refined */}
                  <div className="pt-4 overflow-hidden">
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl w-fit font-black text-[10px] uppercase tracking-widest shadow-xl transform translate-y-[160%] group-hover:translate-y-0 transition-transform duration-500 ease-out group-hover:bg-white group-hover:text-[#0145f2]">
                      Explore
                      <ArrowRight size={16} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* Inner Protective Glass Border */}
                <div className="absolute inset-0 border-[1px] border-white/10 rounded-[40px] pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;