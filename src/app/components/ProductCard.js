"use client";
import React, { useContext, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";

const ProductCard = ({
  image,
  title,
  brand,
  size,
  price,
  fakePrice,
  status,
  productId,
}) => {
  const { router } = useContext(ShopContext);

  return (
    <div
      onClick={() => router.push(`/product/${productId}`)}
      className="group relative w-full bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:border-[#0145f2]/20 transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col h-full"
    >
      {/* 1. IMAGE SECTION (Full Width & Top-Aligned) */}
      <div className="relative w-full aspect-[1/1.1] bg-[#edf1f5] overflow-hidden">
        {/* Status Badge - Floating Top-Left */}
        {status && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-[#0145f2] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg shadow-blue-600/20">
              {status}
            </span>
          </div>
        )}

        {/* Brand Tag - Floating Top-Right */}
        {brand && (
          <div className="absolute top-4 right-4 z-20">
            <span className="bg-white/80 backdrop-blur-md text-gray-900 font-black text-[9px] px-3 py-1.5 rounded-full shadow-sm tracking-[0.1em] uppercase border border-white/50">
              {brand}
            </span>
          </div>
        )}

        {/* Full Width Image - No padding at top */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Hover Icon Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 2. INFO SECTION */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        {/* Title */}
        <h3 className="text-[18px] font-[1000] text-gray-900 leading-tight uppercase tracking-tight line-clamp-1 mb-3">
          {title}
        </h3>

        {/* Sizes (Professional Pills) */}
        <div className="flex gap-1.5 flex-wrap mb-2">
         
            <span
              className="text-[10px] font-bold bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg border border-[#0145f2]/10 group-hover:border-[#0145f2]/20 transition-all"
            >
              {size}
            </span>
        
        </div>

        {/* Price & Button Row */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            {fakePrice && (
              <span className="text-[12px] text-gray-400 line-through font-bold">
                Rs.{Number(fakePrice).toLocaleString()}
              </span>
            )}
            <span className="text-xl font-[1000] text-[#0145f2]">
              Rs.{Number(price).toLocaleString()}
            </span>
          </div>

          {/* Minimalist View Button */}
          <div className="h-11 w-11 rounded-2xl bg-[#0145f2] text-white flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:bg-[#0145f2] group-hover:w-28 transition-all duration-500 overflow-hidden">
             <span className="hidden group-hover:block text-[10px] font-black uppercase tracking-widest ml-2 whitespace-nowrap">View Item</span>
             <ArrowUpRight size={18} className="min-w-[44px]" strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;