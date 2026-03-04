"use client";
import React, { useContext } from 'react';
import { ArrowRight, MoveRight } from 'lucide-react';
import { ShopContext } from '../Context/ShopContext';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="w-full bg-[#edf1f5] py-16 lg:py-24 overflow-hidden font-sans"
    >
      <div className="container mx-auto px-5 lg:px-12 xl:px-0 max-w-7xl">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 lg:mb-16 gap-6">
          <motion.div variants={fadeInUp} className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#0145f2]" />
              <p className="text-[#0145f2] text-[10px] font-black uppercase tracking-[0.4em]">TOP BRANDS WE OFFER</p>
            </div>
            <h2 className="text-5xl lg:text-8xl font-[1000] text-gray-900 tracking-[-0.03em] uppercase leading-[0.9]">
             The Finest <span className="text-[#0145f2] italic">Names</span>
            </h2>
          </motion.div>
          
          <motion.button 
            variants={fadeInUp}
            onClick={() => router.push('shop/collections/allproducts')}
            className="group flex items-center gap-4 text-gray-900 font-black text-[10px] uppercase tracking-widest hidden md:flex"
          >
            All Collections 
            <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:bg-[#0145f2] group-hover:text-white transition-all duration-500">
              <MoveRight size={20} />
            </div>
          </motion.button>
        </div>

        {/* --- SMART GRID / CAROUSEL --- */}
        {/* Mobile: Horizontal Scroll | Desktop: 3-Col Grid */}
        <motion.div 
          variants={containerVariants}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10 overflow-x-auto md:overflow-visible pb-10 md:pb-0 no-scrollbar snap-x snap-mandatory"
        >
          {categories.map((cat) => {
            const productCount = products?.filter(item => item.brand?.toLowerCase() === cat.name).length;

            return (
              <motion.div 
                variants={fadeInUp}
                key={cat.id}
                onClick={() => router.push(`/shop/brand/${cat.name}`)}
                className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-full snap-center group relative aspect-[4/5] rounded-[32px] lg:rounded-[40px] overflow-hidden bg-white shadow-xl cursor-pointer"
              >
                <img 
                  src={cat.image} 
                  alt={cat.displayTitle}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-colors duration-500 group-hover:from-[#0145f2]/70" />
                
                <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end z-10">
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                    {productCount || "0"} Styles
                  </p>
                  <h3 className="text-4xl lg:text-5xl font-[1000] text-white tracking-tighter uppercase italic leading-none mb-6">
                    {cat.displayTitle}
                  </h3>

                  <div className="flex items-center gap-2 bg-white text-[#0145f2] px-6 py-3 rounded-xl w-fit font-black text-[9px] uppercase tracking-widest shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-4 md:group-hover:translate-y-0">
                    Explore <ArrowRight size={14} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile-only "Swipe" indicator */}
        <div className="flex md:hidden justify-center mt-2">
           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
             Swipe to explore →
           </p>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.section>
  );
};

export default Categories;