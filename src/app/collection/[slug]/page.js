'use client'
import React, { use, useState, useMemo, useContext, useEffect } from 'react'
import { Search, ChevronDown, Loader2 } from 'lucide-react'
import ProductCard from '@/app/components/ProductCard';
import { ShopContext } from '@/app/Context/ShopContext';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CollectionPage({ params }) {
  const { slug } = use(params);

  // 1. STATE MANAGEMENT
  const [sortOpen, setSortOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(100000);
  const [dbCollection, setDbCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const { products } = useContext(ShopContext);

  // Helper function: String ko lowercase karke saare gaps/spaces khatam kar deta hai
  const formatForMatch = (str) => str?.toLowerCase().replace(/\s+/g, '') || "";

  // 2. FETCH & MATCH COLLECTION
  useEffect(() => {
    const fetchAndMatch = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'Productcollections'));
        
        // Slug ko format karo (lowercase + no spaces)
        const formattedSlug = formatForMatch(slug);

        // Saari collections mein search karo
        const matchedDoc = querySnapshot.docs.find(doc => {
          const title = doc.data().title;
          return formatForMatch(title) === formattedSlug;
        });

        if (matchedDoc) {
          setDbCollection(matchedDoc.data());
        } else {
          setDbCollection(null);
        }
      } catch (e) {
        console.error("Error fetching collections:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMatch();
  }, [slug]);

  // 3. FILTERING & SORTING LOGIC
  const filteredProducts = useMemo(() => {
    let result = [];
    const formattedSlug = formatForMatch(slug);

    // Step A: Determine Source (Collection vs Category)
    if (dbCollection) {
      result = dbCollection.selectedProducts || [];
    } else if (products) {
      result = products.filter((product) => {
        if (formattedSlug === "allproducts") return true;
        // Category ko bhi format karke match kar rahe hain
        return formatForMatch(product.category) === formattedSlug;
      });
    }

    // Step B: Search Filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Step C: Price Filter
    result = result.filter((p) => Number(p.price) <= priceRange);

    // Step D: Sort
    const sortedResult = [...result];
    if (sortBy === "low") sortedResult.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "high") sortedResult.sort((a, b) => Number(b.price) - Number(a.price));

    return sortedResult;
  }, [products, dbCollection, slug, searchQuery, sortBy, priceRange]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-28">
      <div className="container mx-auto px-6 lg:px-0">

        {/* --- HEADER --- */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            {dbCollection ? dbCollection.title : (formatForMatch(slug) === "allproducts" ? "All Gear" : `${slug}'s Collection`)}
          </h1>
          <p className="text-gray-500 max-w-xl font-light uppercase tracking-widest text-sm italic">
            {dbCollection?.description || `Engineering the future of ${slug}.`}
          </p>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-end justify-between border-b border-white/5 pb-8">
          <div className="w-full lg:w-1/3 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div className="w-full lg:w-auto flex flex-wrap gap-6 items-center">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <span>Max Price</span>
                <span className="text-white">${priceRange}</span>
              </div>
              <input
                type="range" min="0" max="100000" step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="accent-white cursor-pointer h-1"
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-4 min-w-[180px] justify-between bg-white/[0.03] border border-white/10 rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest"
              >
                {sortBy === "featured" ? "Featured" : sortBy === "low" ? "Price: Low" : "Price: High"}
                <ChevronDown size={14} />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-2 w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden z-50">
                  {[{ label: "Featured", value: "featured" }, { label: "Price: Low to High", value: "low" }, { label: "Price: High to Low", value: "high" }].map(option => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                      className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase hover:bg-white/10 transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- GRID --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                fakePrice={product.fakePrice} 
                productId={product.id} 
                title={product.title} 
                price={product.price} 
                image={product?.images?.[0] || product.image} 
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-[3rem]">
             <p className="text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">No items found for this collection.</p>
          </div>
        )}
      </div>
    </div>
  )
}