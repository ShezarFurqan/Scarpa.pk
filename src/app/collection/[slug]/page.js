'use client'
import React, { use, useState, useMemo, useContext } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import ProductCard from '@/app/components/ProductCard';
import { ShopContext } from '@/app/Context/ShopContext';

export default function CollectionPage({ params }) {
  const { slug } = use(params);

  // 1. STATE MANAGEMENT
  const [sortOpen, setSortOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(100000);
  const { products } = useContext(ShopContext);

  // 2. FILTERING & SORTING LOGIC (Fixed using useMemo)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    // A. Filter by Slug/Category
    let result = products.filter((product) => {
      if (slug.toLowerCase() === "allproducts") return true;
      return product.category?.toLowerCase() === slug.toLowerCase();
    });

    // B. Filter by Search Title
    if (searchQuery) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // C. Filter by Price
    result = result.filter((p) => Number(p.price) <= priceRange);

    // D. Sorting (Creating a copy to avoid mutating original state)
    const sortedResult = [...result];
    if (sortBy === "low") sortedResult.sort((a, b) => a.price - b.price);
    if (sortBy === "high") sortedResult.sort((a, b) => b.price - a.price);

    return sortedResult;
  }, [products, slug, searchQuery, sortBy, priceRange]); // Sabhi dependencies yahan add hain

  // 3. VALIDATE SLUG
  const validSlugs = ["mens", "womens", "kids", "allproducts"];
  if (!validSlugs.includes(slug.toLowerCase())) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <h1 className="text-white text-2xl font-bold tracking-tight">Collection "{slug}" Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-28">
      <div className="container mx-auto px-6 lg:px-0">

        {/* --- HEADER SECTION --- */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            {slug === "allproducts" ? "All Gear" : `${slug}'s Series`}
          </h1>
          <p className="text-gray-500 max-w-xl font-light">
            Showing {filteredProducts.length} items.
          </p>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-end justify-between border-b border-white/5 pb-8">
          {/* Search */}
          <div className="w-full lg:w-1/3 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="w-full lg:w-auto flex flex-wrap gap-6 items-center">
            {/* Price Filter */}
            <div className="flex flex-col gap-2 min-w-[240px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Max Price: ${priceRange}</label>
              <input
                type="range" min="0" max="100000" step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="accent-white cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sort By</label>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-4 justify-between bg-white/[0.03] border border-white/10 rounded-full px-6 py-2.5 text-sm"
              >
                {sortBy === "featured" ? "Featured" : sortBy === "low" ? "Price: Low to High" : "Price: High to Low"}
                <ChevronDown size={18} />
              </button>

              {sortOpen && (
                <div className="absolute top-full mt-2 w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl">
                  {[{ label: "Featured", value: "featured" }, { label: "Price: Low to High", value: "low" }, { label: "Price: High to Low", value: "high" }].map(option => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                      className="w-full text-left px-5 py-3 text-sm hover:bg-white/10 transition-colors"
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
              <ProductCard key={product.id} fakePrice={product.fakePrice} productId={product.id} title={product.title} price={product.price} image={product?.images?.[0]} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  )
}