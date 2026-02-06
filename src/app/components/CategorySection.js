"use client";
import React, { useContext } from 'react';
import { ArrowRight } from 'lucide-react';
import { ShopContext } from '../Context/ShopContext';

/**
 * Categories Section
 * Positioned below the Hero to drive departmental traffic.
 * Uses 'group-hover' for high-end interaction and 'overflow-hidden' for clean scaling.
 */
const Categories = () => {
  const { router } = useContext(ShopContext)
  const categories = [
    {
      id: 1,
      title: "Mens",
      image: "/images/men.png", 
      count: "120+ Products",
      gridSpan: "lg:col-span-1"
    },
    {
      id: 2,
      title: "Womens",
      image: "images/women.png", // High-end boot/female climber
      count: "95+ Products",
      gridSpan: "lg:col-span-1"
    },
    {
      id: 3,
      title: "Kids",
      image: "images/kids.png", // Youth outdoor gear
      count: "40+ Products",
      gridSpan: "lg:col-span-1"
    }
  ];

  return (
    <section className="w-full bg-[#050505] pb-16">
      <div className="container mx-auto px-6 md:px-0">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
              SHOP BY <span className="text-white/40 italic">SERIES</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-light">
              Explore specialized gear tailored for every explorer. From elite performance to youth discovery.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest pb-1 border-b border-white/10 hover:border-white">
            View All Collections <ArrowRight size={14} />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              onClick={()=>{router.push(`/collection/${cat.title}`)}}
              key={cat.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#111] cursor-pointer"
            >
              {/* Image with smooth zoom */}
              <img 
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />

              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {cat.count}
                </span>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                  {cat.title}
                </h3>

                {/* CTA Button: Slides up on hover */}
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 text-black bg-white px-6 py-3 rounded-full w-fit font-bold text-xs transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    Shop Now
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

              {/* Subtle Inner Glow (Mobile focus) */}
              <div className="absolute inset-0 border border-white/5 group-hover:border-white/20 transition-colors rounded-3xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;