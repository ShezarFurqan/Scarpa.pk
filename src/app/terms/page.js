"use client";
import React from 'react';
import { Scale, ShoppingBag, CreditCard, AlertTriangle, Truck, Gavel, FileText, CheckCircle2 } from 'lucide-react';

const TermsOfService = () => {
  return (
    <section className="min-h-screen bg-[#edf1f5] text-gray-900 py-16 lg:py-28 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0145f2]/[0.02] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#0145f2]/30" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0145f2]/60">User Agreement</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-[1000] uppercase tracking-tighter mb-6 leading-[0.85] text-gray-900">
            Terms of <br /> <span className="text-black/40 italic font-light">Service</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl leading-relaxed">
            Please read these terms carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.
          </p>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. Overview */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-[#0145f2]/30 transition-colors shadow-sm">
                  <FileText size={18} className="text-[#0145f2]" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">01. General Conditions</h2>
              </div>
              <p className="text-gray-600 font-medium text-sm leading-relaxed pl-12 border-l-2 border-[#0145f2]/10">
                We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.
              </p>
            </div>

            {/* 2. Products & Accuracy */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-[#0145f2]/30 transition-colors shadow-sm">
                  <ShoppingBag size={18} className="text-[#0145f2]" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">02. Products & Accuracy</h2>
              </div>
              <div className="pl-12 space-y-4 text-gray-600 font-medium text-sm leading-relaxed border-l-2 border-[#0145f2]/10">
                <p>
                  We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                </p>
                <p className="italic text-[#0145f2]/70 bg-[#0145f2]/5 p-3 rounded-lg border-l-2 border-[#0145f2]">
                  Note: All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of us.
                </p>
              </div>
            </div>

            {/* 3. Billing & Account */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-emerald-500/30 transition-colors shadow-sm">
                  <CreditCard size={18} className="text-emerald-500" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">03. Billing & Modifications</h2>
              </div>
              <p className="text-gray-600 font-medium text-sm leading-relaxed pl-12 border-l-2 border-emerald-100">
                We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
              </p>
            </div>

            {/* 4. Shipping & Liability */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-amber-500/30 transition-colors shadow-sm">
                  <Truck size={18} className="text-amber-500" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">04. Delivery & Risk</h2>
              </div>
              <p className="text-gray-600 font-medium text-sm leading-relaxed pl-12 border-l-2 border-amber-100">
                Delivery times are estimates and start from the date of shipping, rather than the date of order. We are not responsible for delays caused by customs departments or local courier services (TCS/Leopard/CallCourier) once the parcel has left our warehouse.
              </p>
            </div>

            {/* 5. Limitation of Liability */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-rose-500/30 transition-colors shadow-sm">
                  <AlertTriangle size={18} className="text-rose-500" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">05. Limitation of Liability</h2>
              </div>
              <p className="text-gray-600 font-medium text-sm leading-relaxed pl-12 border-l-2 border-rose-100">
                In no case shall Scarpa, our directors, officers, employees, affiliates, agents, contractors, or interns be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, or consequential damages of any kind.
              </p>
            </div>

            {/* 6. Governing Law */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white rounded-lg border border-gray-200 group-hover:border-purple-500/30 transition-colors shadow-sm">
                  <Scale size={18} className="text-purple-500" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">06. Governing Law</h2>
              </div>
              <p className="text-gray-600 font-medium text-sm leading-relaxed pl-12 border-l-2 border-purple-100">
                These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of <span className="text-[#0145f2] font-black">Pakistan</span>.
              </p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              
              {/* Summary Card */}
              <div className="p-8 bg-white border border-gray-200 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                <Gavel className="w-8 h-8 text-[#0145f2]/20 mb-6" />
                <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-gray-900">Key Takeaways</h3>
                <ul className="space-y-4 mt-6">
                  <li className="flex items-start gap-3 text-xs text-gray-500 font-bold">
                    <CheckCircle2 size={14} className="text-[#0145f2] mt-0.5 shrink-0" />
                    <span>Prices are in PKR and subject to change.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-gray-500 font-bold">
                    <CheckCircle2 size={14} className="text-[#0145f2] mt-0.5 shrink-0" />
                    <span>Colors on screen may vary slightly from actual product.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-gray-500 font-bold">
                    <CheckCircle2 size={14} className="text-[#0145f2] mt-0.5 shrink-0" />
                    <span>We reserve the right to cancel suspicious orders.</span>
                  </li>
                </ul>
              </div>

              {/* Contact Note */}
              <div className="p-6 rounded-2xl border border-[#0145f2]/10 bg-white shadow-sm">
                <p className="text-xs text-[#0145f2] font-black uppercase tracking-widest mb-2">Questions?</p>
                <p className="text-sm font-medium text-gray-600">
                  If you have queries regarding the Terms of Service, please contact us at <span className="text-[#0145f2] font-black underline decoration-[#0145f2]/20 underline-offset-4 cursor-pointer">rockclimb.rc@gmail.com</span>
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Accent */}
        <div className="mt-24 py-12 border-t border-gray-200 text-center">
          <p className="text-[10px] uppercase tracking-[0.8em] text-gray-400 font-black italic">
            Terms of Service © {new Date().getFullYear()} Scarpa
          </p>
        </div>

      </div>
    </section>
  )
}

export default TermsOfService; 