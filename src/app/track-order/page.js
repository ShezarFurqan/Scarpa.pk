'use client';

import React, { useState } from 'react';
import { db } from "../firebase"; 
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { 
  AlertCircle, MapPin, Calendar, CreditCard, ShoppingBag, Clock, ChevronRight, ArrowLeft 
} from 'lucide-react';

const TrackOrderPage = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ordersList, setOrdersList] = useState([]); // Multiple orders ke liye
  const [selectedOrder, setSelectedOrder] = useState(null); // Single view ke liye

  // --- 1. SMART SEARCH LOGIC ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSelectedOrder(null);
    setOrdersList([]);

    if (!search.trim()) {
      setError("Please enter Order ID, Email, or Phone.");
      return;
    }

    setLoading(true);
    const searchValue = search.trim();

    try {
      let foundOrders = [];

      // A. Pehle check karein kya yeh direct Document ID hai?
      const directDocRef = doc(db, "orders", searchValue);
      const directDocSnap = await getDoc(directDocRef);
      
      if (directDocSnap.exists()) {
        foundOrders.push({ id: directDocSnap.id, ...directDocSnap.data() });
      } else {
        // B. Agar ID nahi mili, to Email aur Phone se Query karein
        const ordersRef = collection(db, "orders");
        
        // Email check
        const qEmail = query(ordersRef, where("customerDetails.email", "==", searchValue));
        const snapEmail = await getDocs(qEmail);
        snapEmail.forEach(doc => foundOrders.push({ id: doc.id, ...doc.data() }));

        // Phone check (Sirf tab karein agar orders abhi bhi 0 hain ya phone format ho)
        if (foundOrders.length === 0) {
          const qPhone = query(ordersRef, where("customerDetails.phone", "==", searchValue));
          const snapPhone = await getDocs(qPhone);
          snapPhone.forEach(doc => foundOrders.push({ id: doc.id, ...doc.data() }));
        }
      }

      if (foundOrders.length === 0) {
        setError("No records found. Please check your details.");
      } else if (foundOrders.length === 1) {
        setSelectedOrder(foundOrders[0]);
      } else {
        // Ek se zyada orders mile (Email/Phone search case)
        setOrdersList(foundOrders);
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- HELPERS ---
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusIndex = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()) || 0;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        {!selectedOrder && (
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Track Order</h1>
            <p className="text-gray-500 text-xs tracking-[0.3em] uppercase">Find your premium footwear journey</p>
          </div>
        )}

        {/* SEARCH BAR (Hidden when viewing a specific order) */}
        {!selectedOrder && (
          <div className="max-w-xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text"
                placeholder="Order ID, Email, or Phone Number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-full py-5 px-8 text-white focus:outline-none focus:border-white/40 transition-all shadow-2xl"
              />
              <button disabled={loading} className="absolute right-2 top-2 bottom-2 bg-white text-black px-8 rounded-full font-bold uppercase text-[10px] tracking-widest hover:invert transition-all">
                {loading ? "..." : "Search"}
              </button>
            </form>
            {error && <p className="text-rose-500 text-[10px] mt-4 text-center font-bold uppercase tracking-widest">{error}</p>}
          </div>
        )}

        {/* CASE 1: MULTIPLE ORDERS LIST */}
        {ordersList.length > 1 && !selectedOrder && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6 text-center">
              We found {ordersList.length} orders for "{search}"
            </p>
            {ordersList.map((ord) => (
              <div 
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className="group bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-white/[0.08] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-mono text-sm tracking-tighter">#{ord.id.slice(0, 10)}...</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{formatDate(ord.createdAt)} • {ord.items?.length} Items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase px-3 py-1 bg-white/10 rounded-full">{ord.status}</span>
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CASE 2: SINGLE ORDER DETAIL VIEW */}
        {selectedOrder && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Back Button */}
            <button 
              onClick={() => { setSelectedOrder(null); if(ordersList.length <=1) setOrdersList([]) }}
              className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={14} /> Back to Search
            </button>

            {/* STATUS CARD */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-8 backdrop-blur-3xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Order Tracking</p>
                        <h2 className="text-3xl font-mono tracking-tighter">#{selectedOrder.id}</h2>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
                        <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                        <p className="text-white font-bold uppercase text-sm italic">{selectedOrder.status}</p>
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="relative pt-4 pb-8">
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-white/5"></div>
                    <div 
                        className="absolute top-5 left-0 h-[2px] bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        style={{ width: `${(getStatusIndex(selectedOrder.status) / 3) * 100}%` }}
                    ></div>
                    <div className="flex justify-between relative">
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => (
                            <div key={step} className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i <= getStatusIndex(selectedOrder.status) ? 'bg-emerald-500 border-emerald-500' : 'bg-black border-gray-800'}`}></div>
                                <span className={`text-[9px] font-bold uppercase tracking-tighter mt-4 ${i <= getStatusIndex(selectedOrder.status) ? 'text-white' : 'text-gray-600'}`}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-2"><ShoppingBag size={14}/> Package Contents</h3>
                        <div className="space-y-6">
                            {selectedOrder.items?.map((item, idx) => (
                                <div key={idx} className="flex gap-6 items-center border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                    <img src={item.image} className="w-20 h-20 object-cover rounded-2xl bg-white/5" alt="" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-white uppercase">{item.title}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-mono text-sm tracking-tighter">Rs.{item.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2"><MapPin size={14}/> Destination</h3>
                        <div className="text-sm text-gray-400 space-y-2">
                            <p className="text-white font-bold italic">{selectedOrder.customerDetails?.fullName}</p>
                            <p>{selectedOrder.customerDetails?.address}</p>
                            <p>{selectedOrder.customerDetails?.area}, {selectedOrder.customerDetails?.city}</p>
                            <p className="pt-4 text-xs tracking-widest">{selectedOrder.customerDetails?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6"><CreditCard size={14} className="inline mr-2"/> Summary</h3>
                        <div className="space-y-4 text-[11px] uppercase tracking-widest">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="text-white font-mono">Rs.{selectedOrder.financials?.subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-emerald-500 font-mono">Rs.{selectedOrder.financials?.shipping}</span></div>
                            <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                                <span className="text-white font-black">Total</span>
                                <span className="text-2xl font-mono font-black text-white italic">Rs.{selectedOrder.financials?.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-3xl p-6 flex items-center gap-4">
                        <Clock size={20} className="text-gray-500" />
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Ordered On</p>
                            <p className="text-sm font-bold uppercase">{formatDate(selectedOrder.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;