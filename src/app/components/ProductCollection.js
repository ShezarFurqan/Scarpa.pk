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
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };

    if (collectionName) fetchThisCollection();
  }, [collectionName]);

  if (loading) return (
    <div className="w-full py-20 flex justify-center bg-[#050505]">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  if (!collectionData) return null;

  // Aapke data mein array ka naam 'selectedProducts' hai
  const displayProducts = collectionData.selectedProducts || collectionData.products || [];

  return (
    <section className="relative w-full bg-[#050505] py-16 overflow-hidden">
      <div className="container mx-auto px-6 md:px-0 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">
              {collectionData.title}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium uppercase tracking-widest italic">
              {collectionData.description}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                title={product.title} 
                price={product.price}
                productId={product.id}
                // Aapke data mein images[0] hai, ensure ProductCard ise handle kare
                image={product.images ? product.images[0] : ''} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-700 font-mono text-xs uppercase tracking-widest">
              // No Products Linked to this collection //
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => router.push("/collection/allproducts")}
            className="group flex items-center gap-4 px-10 py-4 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
          >
            Explore All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsCollection;