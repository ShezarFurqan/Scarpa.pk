'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Apna path check karein
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAdminAuth } from './hook/useAdminAuth';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const isAuthorized = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. REAL-TIME ORDERS & STATS CALCULATION ---
  useEffect(() => {
    if (!isAuthorized) return;

    // Query to get latest orders
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate Stats Dynamically
      const totalRevenue = ordersData.reduce((acc, curr) => acc + (curr.financials?.total || 0), 0);
      const activeOrders = ordersData.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
      const totalCustomers = new Set(ordersData.map(o => o.customerDetails?.email)).size;
      const lowStockCount = 0; // Isse aap products collection se fetch kar sakte hain

      setStats([
        { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, change: '+12.5%', trend: 'up', icon: DollarSign },
        { label: 'Active Orders', value: activeOrders.toString(), change: 'Live', trend: 'up', icon: ShoppingBag },
        { label: 'Total Customers', value: totalCustomers.toString(), change: '+5%', trend: 'up', icon: Users },
        { label: 'Low Stock Items', value: 'Check Inv', change: '0', trend: 'down', icon: Package },
      ]);

      setOrders(ordersData.slice(0, 10)); // Top 10 recent orders
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthorized]);

  // Helper for Status Badge Color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-white/5';
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-mono text-xs tracking-widest animate-pulse">FETCHING_LIVE_DATA...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Command_Center</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time store performance analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all border border-white/10">
            Export CSV
          </button>
        </div>
      </div>

      {/* STATS GRID (Real Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-8 rounded-[2rem] bg-[#0A0A0A] border border-white/5 hover:border-indigo-500/20 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <span className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <stat.icon size={22} />
              </span>
              <span className={`text-[10px] font-black flex items-center gap-1 px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS TABLE (Real Data) */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Transactions</h3>
            <p className="text-xs text-gray-600">Latest orders from all regions</p>
          </div>
          <button className="text-[10px] text-gray-500 hover:text-white transition-colors font-black uppercase tracking-widest border border-white/5 px-4 py-2 rounded-full">
            View Logistics
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                <th className="px-8 py-5">Order Reference</th>
                <th className="px-8 py-5">Customer Details</th>
                <th className="px-8 py-5">Primary Item</th>
                <th className="px-8 py-5">Net Total</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-sm text-gray-400">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-8 py-6 font-mono text-[11px] text-indigo-400">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-xs">{order.customerDetails?.fullName}</span>
                      <span className="text-[10px] text-gray-600">{order.customerDetails?.city}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                        <img src={order.items?.[0]?.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="text-[11px] truncate max-w-[120px]">
                        {order.items?.[0]?.title} {order.items?.length > 1 && `+${order.items.length - 1}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-white text-xs">
                    Rs {order.financials?.total?.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-xl transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-20 text-center text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">
              Zero_Orders_Detected
            </div>
          )}
        </div>
      </div>

    </div>
  );
}