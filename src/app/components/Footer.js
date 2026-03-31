 "use client";
import {
  Facebook,
  Instagram,
  MapPin,
  Mail,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { motion } from 'framer-motion'; // Framer Motion import

export default function Footer() {
  const { location } = useContext(ShopContext);
  const pathname = usePathname();

  if (pathname === "/login" || pathname.includes("/admin")) return null;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <footer className="bg-[#013ddb] text-white py-16 lg:py-24 relative overflow-hidden">
      
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Brand Identity */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
                SCARPA
              </h2>
              <div className="h-1 w-12 bg-white rounded-full" />
            </div>
            
            <p className="text-white/90 text-[15px] leading-relaxed font-medium max-w-xs">
              Crafting excellence for the modern Pakistani pulse. Every step in a Scarpa pair is a statement of heritage and contemporary luxury.
            </p>

            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, link: "https://www.facebook.com/profile.php?id=61586042726467" },
                { Icon: Instagram, link: "https://www.instagram.com/scarpa.pk_/" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 hover:bg-white hover:text-[#0145f2] transition-all duration-300 group shadow-lg"
                >
                  <social.Icon size={20} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Navigation */}
          <motion.div variants={itemVariants} className="lg:pl-10">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-white/50">Shop</h3>
            <ul className="space-y-4">
                <li>
                  <Link href={`/shop/collections/newarrivals`} 
                    className="text-white/85 hover:text-white text-[15px] font-semibold transition-all duration-300 flex items-center gap-2 group underline-offset-4 hover:underline">
                    New Arrivals
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
                <li>
                  <Link href={`/shop/collections/bestsellers`} 
                    className="text-white/85 hover:text-white text-[15px] font-semibold transition-all duration-300 flex items-center gap-2 group underline-offset-4 hover:underline">
                    Best Sellers
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
                <li>
                  <Link href={`/shop/collections/sales`} 
                    className="text-white/85 hover:text-white text-[15px] font-semibold transition-all duration-300 flex items-center gap-2 group underline-offset-4 hover:underline">
                    Sales
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
                <li>
                  <Link href={`shop/collections/allproducts`} 
                    className="text-white/85 hover:text-white text-[15px] font-semibold transition-all duration-300 flex items-center gap-2 group underline-offset-4 hover:underline">
                    All Collection
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </Link>
                </li>
            </ul>
          </motion.div>

          {/* Column 3: Utility */}
          <motion.div variants={itemVariants} className="lg:pl-5">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-white/50">Support</h3>
            <ul className="space-y-4">
              {['Contact Us', 'Shipping Policy', 'Exchange & Returns', 'Size Guide'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s|&/g, '')}`} 
                    className="text-white/85 hover:text-white text-[15px] font-semibold transition-all duration-300 underline-offset-4 hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Reach Us */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/50">Reach Us</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group cursor-default">
                <div className="mt-1 p-2.5 bg-white/15 rounded-xl group-hover:bg-white/25 transition-colors shadow-inner">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/60 mb-1">Headquarters</p>
                  <p className="text-[15px] text-white font-bold">Karachi, Pakistan</p>
                </div>
              </div>

              <a href="mailto:rockclimb.rc@gmail.com" className="flex items-start gap-4 group">
                <div className="mt-1 p-2.5 bg-white/15 rounded-xl group-hover:bg-white/25 transition-colors shadow-inner">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/60 mb-1">Email Us</p>
                  <p className="text-[15px] text-white font-bold group-hover:underline underline-offset-4">rockclimb.rc@gmail.com</p>
                </div>
              </a>

              <a href="https://wa.me/923210000000" target="_blank" className="flex items-start gap-4 group">
                <div className="mt-1 p-2.5 bg-white/15 rounded-xl group-hover:bg-green-500 transition-colors shadow-inner">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/60 mb-1">Quick Help</p>
                  <p className="text-[15px] text-white font-bold italic group-hover:text-green-300 transition-colors">WhatsApp Support</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-white/20 pt-10 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <p className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] order-2 md:order-1 text-center md:text-left">
            © 2026 Scarpa FOOTWEAR. <Link href="https://shezardev.vercel.app" target="_blank" className="text-white font-black hover:underline underline-offset-4 transition-all">ENGINEERED BY SHEZARDEV</Link>
          </p>
          <div className="flex space-x-10 order-1 md:order-2">
            <Link href="/privacy" className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] hover:text-white transition-colors">Terms</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}