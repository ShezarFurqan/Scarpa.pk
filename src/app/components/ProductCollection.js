'use client';
import React, { useState, useEffect, useContext } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard'; 
import { ShopContext } from '../Context/ShopContext';
import { db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProductsCollection = ({ collectionName }) => {
  const { router } = useContext(ShopContext);
  const [collectionData, setCollectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThisCollection = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'Productcollections'), 
          where('title', '==', collectionName)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setCollectionData(data);
          console.log(data);
          
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };

    if (collectionName) fetchThisCollection();
  }, [collectionName]);

  // Loader with New Theme Colors
  if (loading) return (
    <div className="w-full py-24 flex flex-col items-center justify-center bg-[#edf1f5] gap-4">
      <Loader2 className="animate-spin text-[#0145f2]" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0145f2]/40">Loading Collection</p>
    </div>
  );

  if (!collectionData) return null;

  const displayProducts = collectionData.selectedProducts || collectionData.products || [];

  return (
    <section className="relative w-full bg-[#edf1f5] py-20 lg:py-32 overflow-hidden">
      
      {/* Background Subtle Text (Watermark style) */}
      <div className="absolute top-10 left-10 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[120px] font-black leading-none uppercase italic text-[#0145f2]">
          {collectionData.title.split(' ')[0]}
        </h2>
      </div>

      <div className="container mx-auto px-6 lg:px-0 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
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

          {/* Quick Stats or Small Label can go here */}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <ProductCard 
                key={product.id}
                brand={product.brand} 
                fakePrice={product.fakePrice}
                size={product.sizes[0]}
                product={product} 
                quantity={Number(product.qty)}
                title={product.title} 
                price={product.price}
                productId={product.id}
                image={product.images ? product.images[0] : ''} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-[#0145f2]/10 rounded-3xl">
              <p className="text-[#0145f2]/40 font-black text-xs uppercase tracking-[0.2em]">
                // No Products Linked //
              </p>
            </div>
          )}
        </div>

        {/* Action Button - Refined for Light Theme */}
        <div className="mt-24 flex justify-center">
          <button 
            onClick={() => router.push("/collection/allproducts")}
            className="group relative flex items-center gap-6 px-12 py-5 bg-white border border-[#0145f2]/10 rounded-2xl text-[#0145f2] text-sm font-black uppercase tracking-widest hover:bg-[#0145f2] hover:text-white transition-all duration-500 shadow-xl shadow-blue-900/5 overflow-hidden"
          >
            <span className="relative z-10">Explore Full Catalog</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-2" />
            
            {/* Hover Background Animation */}
            <div className="absolute inset-0 bg-[#0145f2] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsCollection;