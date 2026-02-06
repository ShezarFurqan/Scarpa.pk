"use client";
import React, { useContext, useState } from 'react';
import { ShoppingBag, Heart, TrendingUp } from 'lucide-react';
import { ShopContext } from '../Context/ShopContext';

const ProductCard = ({ 
  image, 
  title,
  price ,
  fakePrice,
  status ,
  productId
}) => {
  const { router } = useContext(ShopContext)

  return (
    <div onClick={()=>{router.push(`/product/${productId}`)}} className="group relative w-full bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-white/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
      
      {/* 1. Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#141414]">
        {/* Status Badge - Ultra Clean */}
        {status && (
          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <TrendingUp size={10} className="text-blue-400" />
              <span className="text-[9px] font-bold text-white uppercase tracking-tighter">{status}</span>
            </div>
          </div>
        )}
        {/* Product Image */}
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105"
        />

      </div>

      {/* 2. Product Info */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm md:text-base font-medium text-white/90 leading-tight group-hover:text-white transition-colors">
            {title}
          </h3>
          <span className="text-sm md:text-base font-bold text-white shrink-0">
            {`Rs.${price}`}
          </span>
        </div>

        {/* 3. CTA Button - Visual Strength */}
        <button className="relative w-full overflow-hidden bg-white text-black py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.97] hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <ShoppingBag size={14} strokeWidth={2.5} />
          Add to Cart
          
          {/* Shine Animation Effect on Hover */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1s_ease-in-out]" />
        </button>
      </div>

      {/* Premium Border Glow */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-2xl pointer-events-none transition-colors duration-500" />
    </div>
  );
};

export default ProductCard;