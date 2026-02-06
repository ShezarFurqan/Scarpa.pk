'use client'
import React from 'react'
import { useAdminAuth } from './hook/useAdminAuth'
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react'

// DUMMY STATS DATA
const STATS = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up', icon: DollarSign },
  { label: 'Active Orders', value: '+573', change: '+180', trend: 'up', icon: ShoppingBag },
  { label: 'Total Users', value: '2,345', change: '+19%', trend: 'up', icon: Users },
  { label: 'Low Stock Items', value: '12', change: '-4%', trend: 'down', icon: Package },
]

// DUMMY ORDERS DATA
const RECENT_ORDERS = [
  { id: '#ORD-7754', user: 'Alex Morgan', product: 'Apex Carbon V3', amount: '$249.00', status: 'Completed', date: 'Just now' },
  { id: '#ORD-7753', user: 'Sarah Smith', product: 'Summit Pro Cloud', amount: '$120.00', status: 'Processing', date: '5 min ago' },
  { id: '#ORD-7752', user: 'James Doe', product: 'Urban Runner X', amount: '$85.00', status: 'Pending', date: '15 min ago' },
  { id: '#ORD-7751', user: 'Emily White', product: 'Trekker Backpack', amount: '$140.00', status: 'Cancelled', date: '2 hrs ago' },
  { id: '#ORD-7750', user: 'Michael Brown', product: 'Pro Yoga Mat', amount: '$45.00', status: 'Completed', date: '4 hrs ago' },
]

export default function DashboardPage() {
  const isAuthorized = useAdminAuth()
  
  // Helper for Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    )
  }
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview of your store's performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors border border-white/5">
            Download Report
          </button>
          <button className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors">
            Add Product
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                <stat.icon size={20} />
              </span>
              <span className={`text-xs font-bold flex items-center gap-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <button className="text-xs text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-mono text-white/70">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{order.user}</td>
                  <td className="px-6 py-4 text-gray-400">{order.product}</td>
                  <td className="px-6 py-4 font-mono">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}