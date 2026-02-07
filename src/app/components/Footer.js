"use client";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { usePathname } from "next/navigation";

export default function Footer() {
  const { location } = useContext(ShopContext);
  const pathname = usePathname();

  if (pathname === "/login" || pathname.includes("/admin")) return null;

  return (
    <footer className="bg-[#050505] text-white py-16 lg:py-24 relative overflow-hidden">
      {/* Top Border Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Brand Identity */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              ROCK <span className="text-white/20">CLIMB</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed font-light max-w-xs">
              Crafting excellence for the modern Pakistani pulse. Every step in a Rock Climb pair is a statement of heritage and contemporary luxury.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, link: "https://www.facebook.com/profile.php?id=61586042726467&rdid=LFOv1VjP4VQ0xjzS&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Hfc7evBNP%2F%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio" },
                { Icon: Instagram, link: "https://www.instagram.com/rc_shoes.pk/" },
              ].map((social, i) => (
                <a key={i} href={social.link} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] hover:bg-white hover:text-black transition-all duration-500">
                  <social.Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:pl-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40">Shop</h3>
            <ul className="space-y-4">
              <li><a href="/collection/newarrivals" className="text-gray-500 hover:text-white text-sm transition-all duration-300">New Arrivals</a></li>
              <li><a href="/collection/bestsellers" className="text-gray-500 hover:text-white text-sm transition-all duration-300">Best Sellers</a></li>
              <li><a href="/collection/sales" className="text-gray-500 hover:text-white text-sm transition-all duration-300">Outlet Sale</a></li>
              <li><a href="/collection/allproducts" className="text-gray-500 hover:text-white text-sm transition-all duration-300">All Collections</a></li>
            </ul>
          </div>

          {/* Column 3: Utility */}
          <div className="lg:pl-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/40">Support</h3>
            <ul className="space-y-4">
              <li><a href="/contact" className="text-gray-500 hover:text-white text-sm transition-all duration-300">Contact Us</a></li>
              <li><a href="/shippingInfo" className="text-gray-500 hover:text-white text-sm transition-all duration-300">Shipping Policy</a></li>
              <li><a href="/returnpolicy" className="text-gray-500 hover:text-white text-sm transition-all duration-300">Exchange & Returns</a></li>
              <li><a href="/sizeguide" className="text-gray-500 hover:text-white text-sm transition-all duration-300">Size Guide</a></li>
            </ul>
          </div>

          {/* Column 4: Reach Us */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Reach Us</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4 group cursor-default">
                <MapPin size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                <p className="text-sm text-gray-500 font-light group-hover:text-gray-300 transition-colors">Karachi, Pakistan</p>
              </div>
              <a href="mailto:contact@rockclimb.pk" className="flex items-center gap-4 group">
                <Mail size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                <p className="text-sm text-gray-500 font-light group-hover:text-gray-300 transition-colors">rockclimb.rc@gmail.com</p>
              </a>
              <a href="https://wa.me/923210000000" target="_blank" className="flex items-center gap-4 group">
                <MessageCircle size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                <p className="text-sm text-gray-500 font-light group-hover:text-gray-300 transition-colors italic">WhatsApp Support</p>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] order-2 md:order-1">
            © 2026 ROCK CLIMB FOOTWEAR. Engineered in Pakistan.
          </p>
          <div className="flex space-x-10 order-1 md:order-2">
            <a href="/privacy" className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}