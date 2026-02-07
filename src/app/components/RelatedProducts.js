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
    <section className="pt-20 border-t mt-16 border-white/5 bg-[#050505]">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12">
          <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em] mb-2">
            AI Personalized
          </span>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            You Might <span className="text-white/30">Also Like</span>
          </h3>
        </div>

        {/* Grid using your ProductCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendations.map((product) => (
            <ProductCard 
              key={product.id}
              productId={product.id}
              title={product.title}
              price={product.price}
              fakePrice={product.fakePrice}
              image={product.images?.[0] || product.image}
            //   status={product.status || (product.relevanceScore > 70 ? "Top Pick" : null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;