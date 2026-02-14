'use client'
import React, { useState, useMemo, useContext, useEffect } from 'react'
import { Search, ChevronDown, Loader2, X, Package, Filter } from 'lucide-react'
import ProductCard from '@/app/components/ProductCard';
import { ShopContext } from '@/app/Context/ShopContext';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function CollectionPage({ params }) {
  // Params se type aur slug dono nikaal rahe hain
  const { type, slug } = useParams();

  const [sortOpen, setSortOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(100000);
  const [dbCollection, setDbCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const { products } = useContext(ShopContext);

  const formatForMatch = (str) => str?.toLowerCase().replace(/\s+/g, '') || "";

  // 1. FETCH CUSTOM COLLECTIONS (Agar type 'custom' ho ya slug title se match karna ho)
  useEffect(() => {
    const fetchAndMatch = async () => {
      try {
        setLoading(true);
        // Hum sirf tabhi Firebase check karte hain agar type 'custom' ho ya humein specialized collection chahiye
        if (type === 'custom' || type === 'collection') {
          const querySnapshot = await getDocs(collection(db, 'Productcollections'));
          const formattedSlug = formatForMatch(slug);

          const matchedDoc = querySnapshot.docs.find(doc => {
            const title = doc.data().title;
            return formatForMatch(title) === formattedSlug;
          });

          if (matchedDoc) setDbCollection(matchedDoc.data());
        }
      } catch (e) {
        console.error("Error fetching collections:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMatch();
  }, [slug, type]);

  // 2. DYNAMIC FILTERING LOGIC
  const filteredProducts = useMemo(() => {
    let result = [];
    const formattedSlug = formatForMatch(slug);
    const formattedType = type?.toLowerCase();

    // Pehle check karein agar Firebase se custom collection mili hai
    if (dbCollection) {
      result = dbCollection.selectedProducts || [];
    }
    // Warna context ke products par dynamic filter lagayein
    else if (products) {
      result = products.filter((product) => {
        if (formattedSlug === "all" || formattedSlug === "allproducts") return true;

        switch (formattedType) {
          case 'category':
            console.log(product.sizes);
            return formatForMatch(product.category) === formattedSlug;
          case 'brand':
            return formatForMatch(product.brand) === formattedSlug;
          case 'condition':
            return formatForMatch(product.condition) === formattedSlug;
          case 'size':
            // Check agar product ke sizes array mein ye slug maujood hai            
            return product.sizes?.some(s => formatForMatch(s).replace("/", "") === formattedSlug);
          default:
            // Fallback: category ya brand dono mein check karlo
            return formatForMatch(product.category) === formattedSlug || formatForMatch(product.brand) === formattedSlug;
        }
      });
    }

    // Search Query Filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Filter
    result = result.filter((p) => Number(p.price) <= priceRange);

    // Sorting
    const sortedResult = [...result];
    if (sortBy === "low") sortedResult.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "high") sortedResult.sort((a, b) => Number(b.price) - Number(a.price));

    return sortedResult;
  }, [products, dbCollection, slug, type, searchQuery, sortBy, priceRange]);

  if (loading) return (
    <div className="min-h-screen bg-[#edf1f5] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#0145f2]" size={40} strokeWidth={3} />
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#0145f2] animate-pulse">Filtering Inventory...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#edf1f5] text-gray-900 pt-32 pb-28">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* --- HEADER SECTION --- */}
        <div className="mb-16 border-b-4 border-[#0145f2]/10 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#0145f2] text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                  {type}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-[1000] uppercase tracking-tighter leading-[0.85] text-gray-900">
                {dbCollection ? dbCollection.title : slug.replace(/-/g, ' ')}
                <span className="text-[#0145f2] italic font-black">.</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-6">
                Browsing {type} results for "{slug}"
              </p>
            </div>
            <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="text-right">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Available Units</p>
                <p className="text-2xl font-[1000] text-[#0145f2] leading-none mt-1">{filteredProducts.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#edf1f5] rounded-2xl flex items-center justify-center">
                <Package className="text-[#0145f2]" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="w-full lg:w-1/3 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0145f2] transition-colors" size={20} />
            <input
              type="text"
              placeholder={`SEARCH IN ${slug.toUpperCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-transparent rounded-[2rem] py-5 pl-16 pr-8 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#0145f2] shadow-sm transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="w-full lg:w-auto flex flex-wrap gap-4 items-center">
            {/* Price Filter */}
            <div className="bg-white rounded-[2rem] px-8 py-4 shadow-sm border border-gray-50 flex flex-col gap-2 min-w-[260px]">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0145f2]">Price Ceiling</span>
                <span className="text-sm font-black text-gray-900">Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range" min="0" max="100000" step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="accent-[#0145f2] cursor-pointer h-1.5 w-full bg-[#edf1f5] rounded-lg appearance-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-6 bg-white text-gray-900 border border-gray-200 rounded-[2rem] px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:border-[#0145f2] transition-all"
              >
                Sort: {sortBy === "featured" ? "Featured" : sortBy === "low" ? "Min Price" : "Max Price"}
                <ChevronDown size={16} className={`text-[#0145f2] transition-transform ${sortOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {[
                    { label: "Featured Gear", value: "featured" },
                    { label: "Price: Low to High", value: "low" },
                    { label: "Price: High to Low", value: "high" }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                      className={`w-full text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-colors border-b border-gray-50 last:border-none ${sortBy === option.value ? 'bg-[#edf1f5] text-[#0145f2]' : 'text-gray-500 hover:bg-gray-50'}`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard
                size={product.sizes[0]}
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
          <div className="py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-[#edf1f5] rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em]">No matching gear found.</p>
            <button
              onClick={() => { setPriceRange(100000); setSearchQuery("") }}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#0145f2] hover:underline underline-offset-8"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}