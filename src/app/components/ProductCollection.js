'use client';
import React, { useState, useEffect, useContext } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; 
import ProductCard from './ProductCard';
import { ShopContext } from '../Context/ShopContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';

const ProductsCollection = ({ collectionName }) => {
  const { router } = useContext(ShopContext);
  const [collectionData, setCollectionData] = useState(null);
  const [displayProducts, setDisplayProducts] = useState([]); // Products ka actual data yahan store hoga
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      try {
        setLoading(true);
        
        // 1. Pehle Collection fetch karo title ke base par
        const q = query(
          collection(db, 'Productcollections'),
          where('title', '==', collectionName)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const colData = querySnapshot.docs[0].data();
          setCollectionData(colData);

          const productIds = colData.selectedProducts || [];

          // 2. Agar IDs hain, toh unka updated data fetch karo
          if (productIds.length > 0) {
            // Firebase "in" query max 30 items support karti hai, jo collection ke liye kaafi hai
            const pQuery = query(
              collection(db, 'products'),
              where(documentId(), 'in', productIds)
            );
            const pSnapshot = await getDocs(pQuery);
            const fetchedProducts = pSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            // IDs ka order maintain karne ke liye (optional but good)
            const sortedProducts = productIds
              .map(id => fetchedProducts.find(p => p.id === id))
              .filter(p => p !== undefined).slice(0, 4);

            setDisplayProducts(sortedProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching collection or products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (collectionName) fetchCollectionAndProducts();
  }, [collectionName]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
    },
  };

  if (loading) return (
    <div className="w-full py-24 flex flex-col items-center justify-center bg-[#edf1f5] gap-4">
      <Loader2 className="animate-spin text-[#0145f2]" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0145f2]/40">Loading Collection</p>
    </div>
  );

  if (!collectionData) return null;

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="relative w-full bg-[#edf1f5] py-20 lg:py-32 overflow-hidden"
    >
      {/* Background Subtle Text Animation */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 0.03, x: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute top-10 left-10 select-none pointer-events-none"
      >
        <h2 className="text-[120px] font-black leading-none uppercase italic text-[#0145f2]">
          {collectionData.title.split(' ')[0]}
        </h2>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-0 relative z-10">

        {/* Section Header */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-[#0145f2]" />
              <p className="text-[#0145f2] text-xs font-black uppercase tracking-[0.3em]">
                Exclusive Drop
              </p>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#0145f2] tracking-tighter uppercase italic">
              {collectionData.title}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-lg leading-relaxed">
              {collectionData.description}
            </p>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-x-6 sm:gap-y-12"
        >
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <motion.div 
                variants={fadeInUp} 
                className='pb-2'  
                key={product.id}
              >
                <ProductCard
                  brand={product.brand}
                  fakePrice={product.fakePrice}
                  size={product.sizes ? product.sizes[0] : ''}
                  product={product}
                  quantity={Number(product.qty)}
                  title={product.title}
                  price={product.price}
                  productId={product.id}
                  image={product.images ? product.images[0] : ''}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-[#0145f2]/10 rounded-3xl">
              <p className="text-[#0145f2]/40 font-black text-xs uppercase tracking-[0.2em]">
                // No Products Linked //
              </p>
            </div>
          )}
        </motion.div>

        {/* Action Button */}
        <motion.div 
          variants={fadeInUp}
          className="mt-24 flex justify-center"
        >
          <button
            onClick={() => router.push(`/shop/collection/${collectionName.replace(/\s+/g, "").toLowerCase()}`)}
            className="group relative flex items-center gap-6 px-12 py-5 bg-white border border-[#0145f2]/10 rounded-2xl text-[#0145f2] text-sm font-black uppercase tracking-widest hover:bg-[#0145f2] hover:text-white transition-all duration-500 shadow-xl shadow-blue-900/5 overflow-hidden"
          >
            <span className="relative z-10">Explore Full Collection</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-2" />
            <div className="absolute inset-0 bg-[#0145f2] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductsCollection;