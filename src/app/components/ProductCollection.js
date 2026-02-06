"use client";
import React, { useContext } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard'; // Adjust path as needed
import { ShopContext } from '../Context/ShopContext';


const ProductsCollection = () => {
  // Local data array for the featured items
  const {router} = useContext(ShopContext);
  const products = [
    {
      id: 1,
      title: "Alpine Pro Climber",
      price: "$210.00",
      image: "/images/shoe.png",
      status: "New"
    },
    {
      id: 2,
      title: "Urban Stealth Runner",
      price: "$165.00",
      image: "/images/shoe.png",
      status: "Trending"
    },
    {
      id: 3,
      title: "Trail Master Elite",
      price: "$195.00",
      image: "/images/shoe.png",
      status: "Best Seller"
    },
    {
      id: 4,
      title: "Midnight Edge V2",
      price: "$180.00",
      image: "/images/shoe.png",
      status: "New"
    }
  ];

  return (
    <section className="relative w-full bg-[#050505] py-16 overflow-hidden">
      {/* Subtle Studio Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-white/[0.02] blur-[100px] rounded-full" />

      <div className="container mx-auto px-6 md:px-0 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
              THE <span className="text-white/30 italic font-light">CORE</span> COLLECTION
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium uppercase tracking-widest">
              Performance engineered for the modern climber.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} title={product.title} price={product.price} />
          ))}
        </div>

        {/* Action Button */}
        <div onClick={()=>{router.push("/collection/allproducts")}} className="mt-20 flex justify-center">
          <button className="group flex items-center gap-4 px-10 py-4 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500">
            Explore All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProductsCollection;