"use client";
import React, { useContext } from "react";
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
  quantity,
}) => {
  const { router } = useContext(ShopContext);

  return (
    <div
      onClick={() => router.push(`/product/${productId}`)}
      // Border radius mobile par 20px aur desktop par 32px rakha hai
      className="group relative w-full bg-white rounded-[20px] md:rounded-[32px] overflow-hidden border border-gray-100 hover:border-[#0145f2]/20 transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col h-full"
    >
      {/* 1. IMAGE SECTION */}
      <div className="relative w-full aspect-[1/1.1] bg-[#edf1f5] overflow-hidden">
        
        {/* Status Badge */}
        {(quantity <= 0 || status) && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
            {quantity <= 0 ? (
              <span className="bg-[#0043EE] text-white text-[8px] md:text-[10px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
                Sold Out
              </span>
            ) : (
              <span className="bg-[#0145f2] text-white text-[8px] md:text-[10px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-tighter shadow-lg shadow-blue-600/20">
                {status}
              </span>
            )}
          </div>
        )}

        {/* Brand Tag */}
        {brand && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
            <span className="bg-white/80 backdrop-blur-md text-gray-900 font-black text-[7px] md:text-[9px] px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm tracking-[0.1em] uppercase border border-white/50">
              {brand}
            </span>
          </div>
        )}

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 2. INFO SECTION */}
      {/* Mobile par padding p-3 aur desktop par p-5 */}
      <div className="p-3 md:p-5 flex flex-col flex-1 bg-white">
        {/* Title: Mobile par text-sm (14px) aur desktop par 18px */}
        <h3 className="text-sm md:text-[18px] font-[1000] text-gray-900 leading-tight uppercase tracking-tight line-clamp-1 mb-2 md:mb-3">
          {title}
        </h3>

        {/* Sizes */}
        <div className="flex gap-1 flex-wrap mb-2">
            <span className="text-[8px] md:text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-[#0145f2]/10">
              {size}
            </span>
        </div>

        {/* Price & Button Row */}
        <div className="mt-auto pt-2 md:pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            {fakePrice && (
              <span className="text-[10px] md:text-[12px] text-gray-400 line-through font-bold leading-none">
                Rs.{Number(fakePrice).toLocaleString()}
              </span>
            )}
            <span className="text-sm md:text-xl font-[1000] text-[#0145f2] leading-none mt-1">
              Rs.{Number(price).toLocaleString()}
            </span>
          </div>

          {/* Minimalist View Button - Mobile par size thoda chota kiya hai */}
          <div className="h-8 w-8 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-[#0145f2] text-white flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:bg-[#0145f2] md:group-hover:w-28 transition-all duration-500 overflow-hidden">
              <span className="hidden md:group-hover:block text-[10px] font-black uppercase tracking-widest ml-2 whitespace-nowrap">View Item</span>
              <ArrowUpRight size={16} className="md:min-w-[44px]" strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;