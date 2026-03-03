'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAdminAuth } from './hook/useAdminAuth';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Loader2,
  Download
} from 'lucide-react';

export default function DashboardPage() {
  const isAuthorized = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) return;

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const totalRevenue = ordersData.reduce((acc, curr) => acc + (curr.financials?.total || 0), 0);
      const activeOrders = ordersData.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
      const totalCustomers = new Set(ordersData.map(o => o.customerDetails?.email)).size;
      const lowStockCount = 0; // Fetch from products collection ideally

      setStats([
        { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, change: '+12.5%', trend: 'up', icon: DollarSign },
        { label: 'Active Orders', value: activeOrders.toString(), change: 'Live', trend: 'up', icon: ShoppingBag },
        { label: 'Total Customers', value: totalCustomers.toString(), change: '+5%', trend: 'up', icon: Users },
        { label: 'Low Stock Items', value: lowStockCount.toString(), change: '0', trend: 'neutral', icon: Package },
      ]);

      setOrders(ordersData.slice(0, 10)); 
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthorized]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  if (!isAuthorized) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-zinc-400 text-sm mt-1">Overview of your store's performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] hover:bg-zinc-900 text-zinc-300 text-sm font-medium rounded-lg transition-colors border border-white/10">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <span className="p-2.5 rounded-lg bg-zinc-900 text-zinc-400">
                <stat.icon size={20} />
              </span>
              <span className={`text-xs font-medium flex items-center gap-1 px-2 py-0.5 rounded-md
                ${stat.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 
                  stat.trend === 'down' ? 'text-rose-400 bg-rose-400/10' : 
                  'text-zinc-400 bg-zinc-800'}`}>
                {stat.trend === 'up' && <ArrowUpRight size={14}/>}
                {stat.trend === 'down' && <ArrowDownRight size={14}/>}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Orders</h3>
            <p className="text-sm text-zinc-400 mt-0.5">Latest transactions across your store.</p>
          </div>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-200">{order.customerDetails?.fullName || 'Guest User'}</span>
                      <span className="text-xs text-zinc-500">{order.customerDetails?.email || 'No email provided'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-zinc-800 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center text-xs text-zinc-500">
                        {order.items?.[0]?.image ? (
                          <img src={order.items[0].image} className="w-full h-full object-cover" alt="" />
                        ) : 'Img'}
                      </div>
                      <span className="truncate max-w-[150px] text-zinc-300">
                        {order.items?.[0]?.title || 'Unknown Item'} {order.items?.length > 1 && <span className="text-zinc-500 text-xs ml-1">(+{order.items.length - 1})</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-zinc-200">
                    Rs {order.financials?.total?.toLocaleString() || 0}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-12 text-center text-zinc-500 text-sm">
              No orders found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}