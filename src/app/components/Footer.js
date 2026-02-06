"use client";
import {
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Phone
} from 'lucide-react';
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { usePathname } from "next/navigation";


export default function Footer() {
  const { location } = useContext(ShopContext);
  const pathname = usePathname();

  if (pathname === "/login" || pathname.includes("/admin")) return null;

  return (
    <footer className="bg-black text-white py-12 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Grid: Mobile (1 col), Tablet (2 cols), Desktop (4 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tighter">ROCK CLIMB</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium footwear for the modern Pakistani gentleman. Quality
              craftsmanship meets contemporary design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-gray-700 transition-colors">
                <Facebook size={18} className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-gray-700 transition-colors">
                <Instagram size={18} className="text-white" />
              </a>
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-gray-700 transition-colors">
                <Twitter size={18} className="text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="sm:pl-4 lg:pl-0">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-white">Shop</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Best Sellers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Sale</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Collections</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-white">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Newsletter</h3>
            <p className="text-gray-400 text-sm">Subscribe to get special offers and updates</p>
            <form className="flex w-full max-w-sm">
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#111] border border-white/5 text-white px-4 py-3 flex-grow rounded-l-xl focus:outline-none focus:border-white/20 transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-white text-black px-5 py-3 rounded-r-xl hover:bg-gray-200 transition-all active:scale-95"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-gray-500 uppercase tracking-widest">
          <p className="text-center md:text-left order-2 md:order-1">© 2024 STRIDE. All rights reserved.</p>
          <div className="flex space-x-8 order-1 md:order-2">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Help Button - Fixed for Mobile */}
      <button className="z-50 fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all active:scale-90 flex items-center justify-center border border-white/10">
        <Phone size={22} />
        <span className="sr-only">Help</span>
      </button>
    </footer>
  );
}