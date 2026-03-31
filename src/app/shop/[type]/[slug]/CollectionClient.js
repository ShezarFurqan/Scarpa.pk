'use client'
import React, { useState, useMemo, useContext, useEffect } from 'react'
import { Search, ChevronDown, Loader2, Package, Filter, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import ProductCard from '@/app/components/ProductCard';
import { ShopContext } from '@/app/Context/ShopContext';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function CollectionClient({ type, slug }) {
  const [sortOpen, setSortOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(100000);
  const [dbCollection, setDbCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const { products } = useContext(ShopContext);

  const formatForMatch = (str) => str?.toLowerCase().replace(/\s+/g, '') || "";

  // 1. Dynamic Title Formatting (SEO optimized capitalization)
  const formattedTitle = (dbCollection ? dbCollection.title : slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  // 2. FETCH CUSTOM COLLECTIONS FROM FIREBASE
  useEffect(() => {
    const fetchAndMatch = async () => {
      try {
        setLoading(true);
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

  // 3. FILTERING & SORTING LOGIC
  const filteredProducts = useMemo(() => {
    let result = [];
    const formattedSlug = formatForMatch(slug);
    const formattedType = type?.toLowerCase();

    if (dbCollection && products) {
      result = products.filter(p => dbCollection.selectedProducts?.includes(p.id));
    } else if (products) {
      result = products.filter((product) => {
        if (formattedSlug === "all" || formattedSlug === "allproducts") return true;

        switch (formattedType) {
          case 'category':
            return formatForMatch(product.category) === formattedSlug;
          case 'brand':
            return formatForMatch(product.brand) === formattedSlug;
          case 'condition':
            return formatForMatch(product.condition) === formattedSlug;
          case 'size':
            return product.sizes?.some(s => formatForMatch(s).replace("/", "") === formattedSlug);
          default:
            return formatForMatch(product.category) === formattedSlug || formatForMatch(product.brand) === formattedSlug;
        }
      });
    }

    if (searchQuery) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = result.filter((p) => Number(p.price) <= priceRange);

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

        {/* --- HEADER SECTION (SEO OPTIMIZED) --- */}
        <div className="mb-16 border-b-4 border-[#0145f2]/10 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <span className="px-3 py-1 bg-[#0145f2] text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                {type}
              </span>

              <h1 className="text-5xl md:text-8xl font-[1000] uppercase tracking-tighter leading-[0.85] text-gray-900">
                {formattedTitle}<span className="text-[#0145f2]">.</span>
              </h1>

              {/* SEO Content: Intro Section */}
              <div className="mt-6 space-y-4 max-w-2xl">
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {type?.toLowerCase().includes('categor') ? (
                    <>Explore our exclusive <strong className="text-gray-900">{formattedTitle}</strong> range at Scarpa.pk. Find the perfect pair tailored to your lifestyle, whether you're looking for professional performance gear or high-end street style in Pakistan.</>
                  ) : type?.toLowerCase().includes('brand') ? (
                    <>Shop authentic <strong className="text-gray-900">{formattedTitle}</strong> footwear at Scarpa.pk. Experience premium quality, signature designs, and the unmatched comfort of your favorite global brand delivered right to your doorstep.</>
                  ) : type?.toLowerCase().includes('condition') ? (
                    <>Browse our <strong className="text-gray-900">{formattedTitle}</strong> footwear selection at Scarpa.pk. We transparently grade every pair, ensuring you get exactly what you expect with uncompromised authenticity and supreme value.</>
                  ) : type?.toLowerCase().includes('return') ? (
                    <>Discover incredible value with our <strong className="text-gray-900">{formattedTitle}</strong> inventory at Scarpa.pk. These are 100% authentic, thoroughly quality-checked pairs offering premium footwear at unbeatable discounted prices.</>
                  ) : (
                    <>Discover the latest <strong className="text-gray-900">{formattedTitle}</strong> trends at Scarpa.pk. From professional performance gear to high-end street style, our curated selection brings you the best of global footwear brands directly to your doorstep in Pakistan.</>
                  )}
                </p>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-[#0145f2]">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} /> 100% Original Brands</span>
                  <span className="flex items-center gap-1"><Truck size={12} /> Fast Nationwide Delivery</span>
                </div>
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

          <div className="w-full lg:auto flex flex-wrap gap-4 items-center">
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

        {/* --- PRODUCT GRID --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-[#edf1f5] rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em]">No matching gear found.</p>
          </div>
        )}

        {/* --- TRUST SIGNALS (CONTENT BOOST 2) --- */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-16">
          <div className="bg-white/50 p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-[#0145f2]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xs font-[1000] uppercase tracking-widest text-gray-900 mb-3">Why Scarpa.pk?</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium max-w-[200px]">
              We offer 100% authentic premium footwear. Every pair is quality-checked before dispatch.
            </p>
          </div>
          <div className="bg-white/50 p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-[#0145f2]">
              <Truck size={24} />
            </div>
            <h3 className="text-xs font-[1000] uppercase tracking-widest text-gray-900 mb-3">Safe Delivery</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium max-w-[200px]">
              Fast shipping across Karachi, Lahore, Islamabad & all over Pakistan with secure packaging.
            </p>
          </div>
          <div className="bg-white/50 p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-[#0145f2]">
              <RotateCcw size={24} />
            </div>
            <h3 className="text-xs font-[1000] uppercase tracking-widest text-gray-900 mb-3">Easy Returns</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium max-w-[200px]">
              Size issue? Our easy return policy ensures you get the perfect fit every single time.
            </p>
          </div>
        </div>

        {/* --- INTERNAL LINKING (SEO BOOST 3) --- */}
        <div className="mt-24 pt-16 border-t-[3px] border-[#0145f2]/5">
          <h2 className="text-2xl font-[900] uppercase tracking-tighter text-gray-900 mb-8">Explore More Collections</h2>
          <div className="flex gap-4 flex-wrap">
            {['Nike', 'Adidas', 'New Balance', 'Puma'].map((brand) => (
              <Link
                key={brand}
                href={`/shop/brand/${brand.toLowerCase().replace(' ', '')}`}
                className="bg-white px-6 py-3 rounded-full border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#0145f2] hover:border-[#0145f2] transition-colors shadow-sm"
              >
                {brand} Shoes
              </Link>
            ))}
            {['Running', 'Casual', 'Sports'].map((cat) => (
              <Link
                key={cat}
                href={`/shop/category/${cat.toLowerCase()}shoes`}
                className="bg-white px-6 py-3 rounded-full border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#0145f2] hover:border-[#0145f2] transition-colors shadow-sm"
              >
                {cat} Footwear
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}