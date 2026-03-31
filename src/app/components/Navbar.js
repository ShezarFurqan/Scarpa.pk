"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { User, ShoppingBag, Search, Menu, X, ChevronRight, ArrowRight, Instagram, Facebook } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import LoginDrawer from "./login"; 

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { cart, products, currency, token } = useContext(ShopContext);
  
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef(null);

  const categories = ["Sneakers", "Running Shoes", "Casual Shoes", "Sports Shoes", "Premium Collection"];
  const brands = ["Adidas", "Nike", "Puma", "Skechers", "Brooks", "New Balance"];
  const conditions = ["Premium" ,"Excellent", "Very Good"];

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);

    setSearchResults(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (token) {
      router.push("/profile");
    } else {
      setIsLoginOpen(true);
    }
  };

  const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        
    .replace(/[^\w-]+/g, "")     
    .replace(/--+/g, "-");

  if (pathname.includes("/admin")) return null;

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsMobileSearchOpen(false);
    setIsLoginOpen(false);
    setSearchQuery("");
  }, [pathname]);

  return (
    <div className="relative mb-24 sm:mb-12">
      <nav className="w-full bg-[#0145f2] fixed top-0 left-0 z-[100] flex flex-row items-center justify-between px-6 lg:px-12 h-20 shadow-xl">
        
        {/* --- LEFT SECTION --- */}
        <div className="flex items-center gap-4 sm:flex-1">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:rotate-90 transition-transform duration-300 active:scale-90 p-2 -ml-2">
            <Menu size={30} strokeWidth={2.5} />
          </button>

          <div 
            onClick={() => router.push("/")} 
            className="cursor-pointer text-[#edf1f5] text-2xl font-[1000] tracking-tighter uppercase"
          >
            SCARPA
          </div>
        </div>

        {/* --- CENTER SEARCH --- */}
        <div className="hidden sm:block sm:flex-[2] sm:max-w-xl px-4 relative" ref={searchRef}>
          <div className="relative w-full group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors ${isSearchFocused ? 'text-[#0145f2]' : 'text-white/50'}`} size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search Brands or Categories..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-12 pr-4 text-white text-sm outline-none focus:bg-[#edf1f5] focus:text-black transition-colors duration-300 placeholder:text-white/40 focus:placeholder:text-gray-400"
            />
          </div>

          <AnimatePresence>
            {isSearchFocused && searchQuery.length >= 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                style={{ willChange: "transform, opacity" }}
                className="absolute top-full mt-3 left-0 right-0 bg-white rounded-3xl shadow-2xl overflow-hidden z-[110]"
              >
                {searchResults.length > 0 ? (
                  <div className="p-3">
                    {searchResults.map((item) => (
                      <div key={item.id} onClick={() => { router.push(`/product/${slugify(item.title)}-${item.id}`); setIsSearchFocused(false); setSearchQuery(""); }} className="flex items-center gap-4 p-3 hover:bg-blue-50/50 rounded-2xl cursor-pointer transition-colors group">
                        <img src={item.images[0]} alt={item.title} className="w-12 h-12 object-cover rounded-xl bg-gray-100" />
                        <div className="flex-1">
                          <h4 className="text-[13px] font-black text-gray-900 leading-tight">{item.title}</h4>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">{item.brand}</span>
                        </div>
                        <p className="text-sm font-black text-[#0145f2]">{currency}{Number(item.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm font-bold">No results found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- RIGHT SECTION --- */}
        <div className="flex items-center gap-4 sm:gap-6 sm:flex-1 justify-end">
          <button onClick={() => setIsMobileSearchOpen(true)} className="text-white sm:hidden p-2">
            <Search size={24} />
          </button>
          
          <User onClick={handleProfileClick} className="text-white cursor-pointer hover:scale-105 transition-transform" size={24} />
          
          <div onClick={() => router.push("/cart")} className="relative text-white cursor-pointer hover:scale-105 transition-transform">
            <ShoppingBag size={24} />
            <span className="absolute -top-1.5 -right-2 bg-white text-[#0145f2] text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full">
              {cart?.length || 0}
            </span>
          </div>
        </div>
      </nav>

      <LoginDrawer isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* --- MOBILE FULL-PAGE SEARCH --- */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            style={{ willChange: "transform, opacity" }}
            className="fixed inset-0 bg-[#edf1f5] z-[250] flex flex-col"
          >
            <div className="p-6 flex items-center gap-3 bg-[#0145f2]">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Products"
                  className="w-full bg-white rounded-xl py-4 pl-12 pr-4 text-black font-bold outline-none shadow-inner"
                />
              </div>
              <button onClick={() => {setIsMobileSearchOpen(false); setSearchQuery("");}} className="p-3 text-white bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {searchQuery.length >= 3 && searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((item) => (
                    <div key={item.id} onClick={() => { router.push(`/product/${item.id}`); setIsMobileSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer">
                      <img src={item.images[0]} className="w-16 h-16 object-cover rounded-xl" alt="" />
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 leading-tight">{item.title}</h4>
                        <p className="text-xs text-[#0145f2] font-black">{currency} {Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 3 && (
                <p className="text-center text-gray-500 font-bold mt-20">No shoes found for "{searchQuery}"</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SIDEBAR --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ willChange: "opacity" }}
              className="fixed inset-0 bg-black/60 z-[190]" 
              onClick={() => setIsSidebarOpen(false)} 
            />
            
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              style={{ willChange: "transform" }}
              className="fixed top-0 left-0 w-full max-w-[420px] h-full bg-[#edf1f5] z-[200]"
            >
              <div className="p-10 h-full flex flex-col">
                <div className="flex justify-between items-center mb-12">
                  <span className="text-[#0145f2] text-2xl font-[1000] tracking-tighter uppercase">SCARPA</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full text-black hover:rotate-90 transition-transform duration-300"><X size={20} /></button>
                </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <nav className="space-y-2">
                <Link href="/shop/collections/allproducts" onClick={() => setIsSidebarOpen(false)} className="text-4xl font-[1000] text-gray-900 flex items-center justify-between hover:text-[#0145f2] transition-all py-4 tracking-tighter uppercase">SHOP ALL <ArrowRight size={22} /></Link>
                
                <div className="py-4 border-b border-gray-200">
                  <button onClick={() => setOpenSubMenu(openSubMenu === 'cats' ? null : 'cats')} className="w-full flex justify-between items-center text-xl font-black text-gray-800 hover:text-[#0145f2] transition-colors uppercase">Categories <ChevronRight className={`transition-transform ${openSubMenu === 'cats' ? 'rotate-90' : ''}`} /></button>
                  {openSubMenu === 'cats' && (
                    <div className="grid grid-cols-1 gap-3 mt-5 ml-4">
                      {categories.map(cat => <Link key={cat} href={`/shop/category/${cat.replace(" ", "")}`} className="text-lg font-bold text-gray-500 hover:text-[#0145f2] transition-colors">{cat}</Link>)}
                    </div>
                  )}
                </div>

                    {/* Brands */}
                    <div className="py-4 border-b border-gray-200">
                      <button onClick={() => setOpenSubMenu(openSubMenu === 'brands' ? null : 'brands')} className="w-full flex justify-between items-center text-xl font-black text-gray-800 hover:text-[#0145f2] transition-colors uppercase">
                        Top Brands <ChevronRight className={`transition-transform duration-300 ${openSubMenu === 'brands' ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openSubMenu === 'brands' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ willChange: "height, opacity" }} className="overflow-hidden">
                            <div className="grid grid-cols-2 gap-2.5 mt-5 pb-2">
                              {brands.map(brand => <Link key={brand} href={`/shop/brand/${brand.toLocaleLowerCase().replace(" ", "")}`} className="bg-white py-4 rounded-2xl text-[11px] font-[900] text-center text-gray-800 border border-gray-100 hover:border-[#0145f2] transition-colors uppercase">{brand}</Link>)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Conditions */}
                    <div className="py-4 border-b border-gray-200">
                      <button onClick={() => setOpenSubMenu(openSubMenu === 'cond' ? null : 'cond')} className="w-full flex justify-between items-center text-xl font-black text-gray-800 hover:text-[#0145f2] transition-colors uppercase">
                        Conditions <ChevronRight className={`transition-transform duration-300 ${openSubMenu === 'cond' ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openSubMenu === 'cond' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ willChange: "height, opacity" }} className="overflow-hidden">
                            <div className="grid grid-cols-1 gap-3 mt-5 ml-4 pb-2">
                              {conditions.map(item => <Link key={item} href={`/shop/condition/${item.replace(" ", "")}`} className="text-base font-bold text-gray-500 hover:text-[#0145f2] transition-colors uppercase flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#0145f2] rounded-full" />{item}</Link>)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link href="/shop/collection/returns" className="text-xl font-black text-[#0145f2]/80 block mt-4 uppercase hover:text-[#0145f2] transition-colors">STORE RETURNS</Link>
                  </nav>
                </div>

                <div className="mt-auto pt-8 border-t border-gray-200">
                  <div className="flex gap-4 mb-6">
                    <Instagram size={22} className="text-gray-400 hover:text-[#0145f2] cursor-pointer transition-colors" />
                    <Facebook size={22} className="text-gray-400 hover:text-[#0145f2] cursor-pointer transition-colors" />
                  </div>
                  <p className="text-[9px] font-black text-gray-400 tracking-[0.4em] uppercase">Pakistan's Premium Authorised Sneaker Store</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}