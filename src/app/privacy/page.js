"use client";
import React from 'react';
import { ShieldCheck, Eye, Database, Lock, UserCheck, Mail, ShieldAlert } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <section className="min-h-screen bg-[#edf1f5] text-gray-900 py-16 lg:py-28 relative overflow-hidden">
      
      {/* Background Subtle Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0145f2]/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#0145f2]/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0145f2]/60">Legal Framework</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter mb-8 leading-[0.8] text-gray-900">
            Privacy <br /> <span className="text-black/40 italic font-light">Policy</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl leading-relaxed">
            Your trust is our most valuable asset. This policy outlines our commitment to protecting your digital footprint while you experience Rock Climb.
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 1. Information We Collect */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl border border-gray-200 group-hover:border-[#0145f2]/50 transition-colors shadow-sm">
                  <Database size={20} className="text-[#0145f2]" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">01. Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed pl-14">
                <p>We collect personal information that you voluntarily provide when you:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 italic font-medium">
                    <span className="w-1.5 h-1.5 bg-[#0145f2] rounded-full" /> Create an account on our platform
                  </li>
                  <li className="flex items-center gap-3 italic font-medium">
                    <span className="w-1.5 h-1.5 bg-[#0145f2] rounded-full" /> Place an order for our premium footwear
                  </li>
                  <li className="flex items-center gap-3 italic font-medium">
                    <span className="w-1.5 h-1.5 bg-[#0145f2] rounded-full" /> Contact our concierge/customer support
                  </li>
                </ul>
                <p className="pt-2 border-l-2 border-[#0145f2]/10 pl-4 bg-white/40 rounded-r-lg">
                  This includes: <span className="text-gray-900 font-bold">Name, email, phone number, shipping address, and encrypted payment details.</span>
                </p>
              </div>
            </div>

            {/* 2. Usage */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl border border-gray-200 group-hover:border-[#0145f2]/50 transition-colors shadow-sm">
                  <Eye size={20} className="text-[#0145f2]" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">02. How We Use Data</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed pl-14">
                <p>Your information allows us to provide a seamless experience:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-[#0145f2] text-xs font-black mb-1 uppercase tracking-wider">Order Fulfillment</p>
                    <p className="text-[11px] text-gray-500 font-medium">Processing and delivering your orders across Pakistan.</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-[#0145f2] text-xs font-black mb-1 uppercase tracking-wider">Communication</p>
                    <p className="text-[11px] text-gray-500 font-medium">Sending order updates and transactional notifications.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Cookies */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl border border-gray-200 group-hover:border-emerald-500/50 transition-colors shadow-sm">
                  <ShieldCheck size={20} className="text-emerald-500" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">03. Cookies & Tracking</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-14 italic font-medium">
                We use cookies to analyze trends and enhance your browsing experience. You can manage these settings through your browser, though it may affect site functionality.
              </p>
            </div>

            {/* 4. Security */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl border border-gray-200 group-hover:border-rose-500/50 transition-colors shadow-sm">
                  <Lock size={20} className="text-rose-500" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">04. Data Sharing & Security</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-14">
                We <span className="text-[#0145f2] font-black uppercase">never</span> sell or rent your personal information. Data is only shared with trusted partners (Logistics/Payments) necessary to complete your purchase.
              </p>
            </div>

            {/* 5. Rights */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-xl border border-gray-200 group-hover:border-[#0145f2]/50 transition-colors shadow-sm">
                  <UserCheck size={20} className="text-[#0145f2]" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">05. Your Rights</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-14">
                You have the absolute right to access, update, or request the deletion of your data. Contact us for any privacy-related concerns.
              </p>
            </div>

          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-white border border-gray-200 rounded-[2.5rem] sticky top-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <ShieldAlert className="w-10 h-10 text-[#0145f2]/20 mb-6" />
              <h4 className="font-black uppercase tracking-widest text-xs mb-4 text-gray-900">Privacy Concerns?</h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
                Our legal team is available to discuss any questions regarding your data security.
              </p>
              
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#edf1f5] flex items-center justify-center group-hover:bg-[#0145f2] transition-colors">
                    <Mail size={14} className="text-[#0145f2] group-hover:text-white" />
                  </div>
                  <span className="text-xs font-black text-gray-700">rockclimb.rc@gmail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                  <span className="text-xs font-black text-gray-700 uppercase tracking-tighter">AES-256 Encryption</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Accent */}
        <div className="mt-24 py-12 border-t border-gray-200 text-center">
          <p className="text-[10px] uppercase tracking-[0.8em] text-gray-400 font-black">
            Privacy Policy © {new Date().getFullYear()} ROCK CLIMB. All rights reserved.
          </p>
        </div>

      </div>
    </section>
  );
};

export default PrivacyPolicy;