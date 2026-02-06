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
  // Context se real data aur functions nikaale
  const { cart, removeFromCart, updateQuantity, router } = useContext(ShopContext);

  // Calculations: Ab ye direct 'cart' (context) par depend karta hai
  const { subtotal, shipping, total } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const ship = sub > 300 || sub === 0 ? 0 : 15.00
    return { subtotal: sub, shipping: ship, total: sub + ship }
  }, [cart])

  // Empty Cart State (Original Design)
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-gray-500" size={32} />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Your cart is empty</h2>
        <Link href="/collections/allproducts" className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs mt-4">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">
            Your <span className="text-white/20 italic font-light">Bag</span>
          </h1>
          <span className="font-mono text-gray-500 text-sm">{cart.length} Items</span>
        </div>

        {/* PRODUCTS SECTION */}
        <div className="space-y-6 mb-16">
          {cart.map((item) => (
            <div 
              key={`${item.id}-${item.size}`} 
              className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 group transition-all hover:border-white/10"
            >
              <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-black flex-shrink-0">
                <img src={item?.images[0]} alt={item.title} className="w-full h-full object-cover opacity-80" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Size: {item.size}</p>
                  </div>
                  <p className="font-mono font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between mt-6">
                  {/* Updated Quantity Logic */}
                  <div className="flex items-center border border-white/10 rounded-full px-3 py-1 bg-black">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} 
                      className="p-1 hover:text-emerald-400"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} 
                      className="p-1 hover:text-emerald-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {/* Updated Remove Logic */}
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)} 
                    className="flex items-center gap-2 text-gray-600 hover:text-rose-500 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 text-center">
            <Link href="/collections/allproducts" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* SUMMARY SECTION */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-center">Order Summary</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between text-gray-400">
                <span className="uppercase tracking-widest text-xs font-bold">Subtotal</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-400">
                <span className="uppercase tracking-widest text-xs font-bold">Shipping</span>
                <span className="text-white font-mono">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              {shipping > 0 && (
                <div className="bg-emerald-500/10 text-emerald-500 text-[10px] p-3 rounded-xl text-center font-bold uppercase tracking-widest">
                  Add ${(300 - subtotal).toFixed(2)} more for FREE SHIPPING
                </div>
              )}

              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <span className="text-xl uppercase font-black">Total Amount</span>
                <span className="text-4xl font-mono font-black text-white">${total.toFixed(2)}</span>
              </div>

              <div className="pt-8 flex flex-col gap-4">
                <button onClick={()=>{router.push("/checkout")}} className="w-full bg-white text-black py-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-[0.98]">
                  <CreditCard size={18} /> Proceed to Checkout
                </button>
                
                <div className="flex flex-wrap justify-center gap-6 opacity-30">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                    <Truck size={14} /> Express Delivery
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                    <ShieldCheck size={14} /> Secure Checkout
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