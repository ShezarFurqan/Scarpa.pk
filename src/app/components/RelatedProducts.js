'use client'
import React, { useMemo } from 'react';
import ProductCard from './ProductCard'; // Apna path check karlein

/**
 * Advanced Recommendation Engine logic
 */
export const getRelatedProducts = (currentProduct, allProducts) => {
  if (!currentProduct || !allProducts) return [];

  const MAX_RESULTS = 4;
  const WEIGHTS = {
    CATEGORY: 50,
    BRAND: 30,
    PRICE_MAX: 20,
  };

  const related = allProducts
    .filter((p) => p.id !== currentProduct.id) // Rule: Apne aap ko mat dikhao
    .map((product) => {
      let score = 0;

      // 1. Category Match
      if (product.category === currentProduct.category) {
        score += WEIGHTS.CATEGORY;
      }

      // 2. Brand Match
      if (product.brand === currentProduct.brand) {
        score += WEIGHTS.BRAND;
      }

      // 3. Price Similarity (20% Range)
      const currentPrice = Number(currentProduct.price);
      const targetPrice = Number(product.price);
      const priceDiff = Math.abs(currentPrice - targetPrice);
      const allowedDiff = currentPrice * 0.2;

      if (priceDiff <= allowedDiff) {
        const priceScore = Math.max(0, WEIGHTS.PRICE_MAX * (1 - priceDiff / allowedDiff));
        score += priceScore;
      }

      return { ...product, relevanceScore: score };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Sirf relevant products rakho (score > 0)
  const filteredResults = related.filter(p => p.relevanceScore > 0);
  return filteredResults.slice(0, MAX_RESULTS);
};

const RelatedProducts = ({ currentProduct, allProducts }) => {
  // Memoize taake har render par calculation na ho
  const recommendations = useMemo(() =>
    getRelatedProducts(currentProduct, allProducts),
    [currentProduct, allProducts]
  );

  if (recommendations.length === 0) return null;

  return (
    <section className="pt-24 border-t border-gray-200 mt-12 bg-transparent">
      <div className="container mx-auto ">

        {/* Header Section: Modern & Clean */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-[#0145f2] font-black text-[10px] uppercase tracking-[0.4em] ml-1">
              AI PERSONALIZED
            </span>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-[950] uppercase tracking-tighter text-gray-900 leading-none">
              You Might <span className="text-gray-300">Also Like</span>
            </h3>
          </div>

          {/* Decorative count or link */}
          <div className="hidden md:flex items-center gap-4 pb-2">
            <div className="h-px w-20 bg-gray-200" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {recommendations.length} Recommendations
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-10">
          {recommendations.map((product) => (
            <div key={product.id} className="group transition-transform duration-500 hover:-translate-y-2">
              <ProductCard
                product={product}
                className="bg-white rounded-[2.5rem] shadow-sm border border-white hover:shadow-[0_30px_60px_-15px_rgba(1,69,242,0.1)] transition-all duration-500"
              />
            </div>
          ))}
        </div>

        {/* Optional: Subtle Bottom Accent */}
        <div className="mt-20 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;


