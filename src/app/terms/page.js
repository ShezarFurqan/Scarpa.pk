"use client";
import React from 'react';
import { Scale, ShoppingBag, CreditCard, AlertTriangle, Truck, Gavel, FileText, CheckCircle2 } from 'lucide-react';

const TermsOfService = () => {
  return (
    <section className="min-h-screen bg-[#050505] text-white py-16 lg:py-28 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.01] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">User Agreement</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.85]">
            Terms of <br /> <span className="text-white/10 italic font-light">Service</span>
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
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/30 transition-colors">
                  <FileText size={18} className="text-gray-300" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">01. General Conditions</h2>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed pl-12 border-l border-white/5">
                We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.
              </p>
            </div>

            {/* 2. Products & Accuracy */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-blue-500/30 transition-colors">
                  <ShoppingBag size={18} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">02. Products & Accuracy</h2>
              </div>
              <div className="pl-12 space-y-4 text-gray-400 font-light text-sm leading-relaxed border-l border-white/5">
                <p>
                  We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                </p>
                <p className="italic text-gray-500">
                  Note: All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of us.
                </p>
              </div>
            </div>

            {/* 3. Billing & Account */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-green-500/30 transition-colors">
                  <CreditCard size={18} className="text-green-400" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">03. Billing & Modifications</h2>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed pl-12 border-l border-white/5">
                We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
              </p>
            </div>

            {/* 4. Shipping & Liability */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-yellow-500/30 transition-colors">
                  <Truck size={18} className="text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">04. Delivery & Risk</h2>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed pl-12 border-l border-white/5">
                Delivery times are estimates and start from the date of shipping, rather than the date of order. We are not responsible for delays caused by customs departments or local courier services (TCS/Leopard/CallCourier) once the parcel has left our warehouse.
              </p>
            </div>

            {/* 5. Limitation of Liability */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-red-500/30 transition-colors">
                  <AlertTriangle size={18} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">05. Limitation of Liability</h2>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed pl-12 border-l border-white/5">
                In no case shall Rock Climb, our directors, officers, employees, affiliates, agents, contractors, or interns be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, or consequential damages of any kind.
              </p>
            </div>

            {/* 6. Governing Law */}
            <div className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-purple-500/30 transition-colors">
                  <Scale size={18} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight">06. Governing Law</h2>
              </div>
              <p className="text-gray-400 font-light text-sm leading-relaxed pl-12 border-l border-white/5">
                These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of <span className="text-white font-bold">Pakistan</span>.
              </p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              
              {/* Summary Card */}
              <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2rem]">
                <Gavel className="w-8 h-8 text-white/40 mb-6" />
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Key Takeaways</h3>
                <ul className="space-y-4 mt-6">
                  <li className="flex items-start gap-3 text-xs text-gray-400 font-light">
                    <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>Prices are in PKR and subject to change.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-gray-400 font-light">
                    <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>Colors on screen may vary slightly from actual product.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-gray-400 font-light">
                    <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>We reserve the right to cancel suspicious orders.</span>
                  </li>
                </ul>
              </div>

              {/* Contact Note */}
              <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Questions?</p>
                <p className="text-sm font-light text-gray-300">
                  If you have queries regarding the Terms of Service, please contact us at <span className="text-white underline decoration-white/20 underline-offset-4">legal@rockclimb.pk</span>
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Accent */}
        <div className="mt-24 py-12 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.8em] text-gray-600 font-light italic">
            Terms of Service © {new Date().getFullYear()} ROCK CLIMB
          </p>
        </div>

      </div>
    </section>
  )
}

export default TermsOfService