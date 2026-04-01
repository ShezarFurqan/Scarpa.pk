"use client";
import React, { useMemo, useContext } from 'react'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck 
} from 'lucide-react'
import Link from 'next/link'
import { ShopContext } from '../Context/ShopContext'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, router, ShippingFee } = useContext(ShopContext);

  const { subtotal, shipping, total } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const ship = ShippingFee ? Number(ShippingFee) : 200
    return { subtotal: sub, shipping: ship, total: sub + ship }
  }, [ShippingFee, cart])

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#edf1f5] text-gray-900 flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-[#0145f2]/10 flex items-center justify-center mb-8">
          <ShoppingBag className="text-[#0145f2]" size={40} />
        </div>
        <h2 className="text-4xl font-[1000] uppercase tracking-tighter mb-4 text-center">Your cart is empty</h2>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">Looks like you haven't added anything yet</p>
        <Link href="shop/collections/allproducts" className="bg-[#0145f2] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-[#0145f2]/20 hover:scale-105 transition-all active:scale-95">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#edf1f5] text-gray-900 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-12 border-b-4 border-[#0145f2]/10 pb-10">
          <div>
            <h1 className="text-5xl lg:text-7xl font-[1000] uppercase tracking-tighter leading-none">
                Your <span className="text-[#0145f2] italic font-black">Bag</span>
            </h1>
            <p className="text-[#0145f2] text-[10px] font-black uppercase tracking-[0.4em] mt-4 opacity-60">Review your selected items</p>
          </div>
          <span className="font-black text-[#0145f2] bg-white px-4 py-2 rounded-xl shadow-sm text-sm uppercase tracking-widest border border-gray-100">{cart.length} Items</span>
        </div>

        {/* PRODUCTS SECTION */}
        <div className="space-y-6 mb-12">
          {cart.map((item) => (
            <div 
              key={`${item.id}-${item.size}`} 
              className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2.5rem] bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] group transition-all hover:shadow-xl hover:shadow-[#0145f2]/5"
            >
              <div className="w-full sm:w-36 aspect-square rounded-[1.5rem] overflow-hidden bg-[#edf1f5] flex-shrink-0 border-4 border-[#edf1f5]">
                <img src={item?.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">{item.title}</h3>
                    <p className="inline-block bg-[#edf1f5] text-[#0145f2] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg mt-2">Size: {item.size}</p>
                  </div>
                  <p className="font-black text-2xl text-gray-900 tracking-tighter">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center bg-[#edf1f5] rounded-2xl p-1.5 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} 
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#0145f2] transition-colors"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-12 text-center font-black text-gray-900 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} 
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#0145f2] transition-colors"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)} 
                    className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* REFINED SUMMARY SECTION */}
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-[1000] uppercase tracking-tighter mb-10 text-center text-gray-900">Order Summary</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                <span className="uppercase tracking-[0.2em] text-[10px] font-black text-gray-400">Subtotal</span>
                <span className="text-xl font-black tracking-tight text-gray-900">Rs.{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                <span className="uppercase tracking-[0.2em] text-[10px] font-black text-gray-400">Shipping Charge</span>
                <span className={`text-xl font-black tracking-tight ${shipping === 0 ? 'text-gray-900' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'FREE' : `Rs.${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-8 flex justify-between items-end">
                <div>
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#0145f2]">Total Payable</span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Includes all taxes</p>
                </div>
                <span className="text-5xl md:text-6xl font-[1000] tracking-tighter italic text-gray-900">Rs.{total.toFixed(2)}</span>
              </div>

              <div className="pt-10 flex flex-col gap-6">
                {/* Checkout Button - Now Solid Blue */}
                <button 
                  onClick={()=>{router.push("/checkout")}} 
                  className="w-full bg-[#0145f2] text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-2xl shadow-[#0145f2]/20"
                >
                  <CreditCard size={20} strokeWidth={3} /> Proceed to Checkout
                </button>
                
                <Link href="/collection/allproducts" className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft size={14} className="inline mr-2" /> Continue Shopping
                </Link>

                <div className="flex flex-wrap justify-center gap-8 opacity-40 pt-4">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-900">
                    <Truck size={16} /> Express Delivery
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-900">
                    <ShieldCheck size={16} /> SSL Secured
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}