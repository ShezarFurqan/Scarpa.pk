'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../../firebase' 
import { 
  collection, onSnapshot, query, orderBy, 
  doc, updateDoc, deleteDoc 
} from 'firebase/firestore'
import { 
  Search, Trash2, Download, Truck, MapPin, 
  Phone, CreditCard, Package, ChevronDown, 
  ChevronUp, Loader2, Mail, Info
} from 'lucide-react'

import DeleteConfirmationModal from '../../components/DeleteConfirmationModal' 

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Returned', 'Cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      // Aapke object mein field ka naam 'status' hai
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  }

  const openDeleteModal = (id) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedOrderId) {
      try {
        await deleteDoc(doc(db, "orders", selectedOrderId));
        setIsModalOpen(false);
      } catch (error) {
        alert("Error deleting order: " + error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const filteredOrders = orders.filter(order => {
    const customerName = order.customerDetails?.fullName || ""
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                          customerName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-sm font-medium tracking-widest uppercase">Fetching Orders...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4">
      
      <DeleteConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this order? This action cannot be undone."
      />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase ">Manage Orders</h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Store Control Panel</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all shadow-xl">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH BY ORDER ID OR CUSTOMER NAME..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-white/30 transition-all uppercase tracking-widest placeholder:text-gray-700"
          />
        </div>

        <div className="md:col-span-4 flex justify-end">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-white/30 cursor-pointer appearance-none"
          >
            <option value="All italic">Filter: All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-black border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                <th className="px-8 py-7">ID & Date</th>
                <th className="px-8 py-7">Customer Info</th>
                <th className="px-8 py-7">Total Amount</th>
                <th className="px-8 py-7">Current Status</th>
                <th className="px-8 py-7 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
                    className={`cursor-pointer transition-all hover:bg-white/[0.03] ${expandedRow === order.id ? 'bg-white/[0.04]' : ''}`}
                  >
                    <td className="px-8 py-6">
                      <p className="font-mono font-black text-white text-xs">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase">{order.date || 'Today'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-white text-xs uppercase tracking-tight">{order.customerDetails?.fullName || "Guest"}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{order.customerDetails?.city || "N/A"}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-mono font-black text-white">Rs. {order.financials?.total?.toLocaleString()}</p>
                      <p className="text-[9px] text-indigo-500 font-black uppercase tracking-tighter mt-1">{order.paymentMethod}</p>
                    </td>
                    <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`pl-3 pr-8 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter border cursor-pointer focus:outline-none ${getStatusColor(order.status)} bg-transparent`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={() => openDeleteModal(order.id)}
                          className="p-3 rounded-full hover:bg-rose-500/10 text-gray-700 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className={`transition-transform duration-300 ${expandedRow === order.id ? 'rotate-180 text-white' : 'text-gray-700'}`}>
                           <ChevronDown size={20} />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED DETAILS - Aapka requested detail view */}
                  {expandedRow === order.id && (
                    <tr>
                      <td colSpan={5} className="bg-white/[0.01] px-8 py-12 border-b border-white/5 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
                          
                          {/* 1. Customer Details */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-1 bg-white"></div>
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Shipping Info</h4>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-gray-600 mt-1 shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-gray-300 leading-relaxed uppercase">
                                    {order.customerDetails?.address}, {order.customerDetails?.area && order.customerDetails.area + ','} {order.customerDetails?.city}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gray-600 shrink-0" />
                                <p className="text-xs font-bold text-gray-300">{order.customerDetails?.phone}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Mail size={16} className="text-gray-600 shrink-0" />
                                <p className="text-xs font-bold text-gray-300 lowercase">{order.customerDetails?.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* 2. Items Ordered */}
                          <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-1 bg-white"></div>
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Order Items ({order.items?.length})</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-5 p-4 rounded-3xl bg-white/[0.03] border border-white/5 group hover:border-white/20 transition-all">
                                  <div className="relative">
                                    <img src={item.image} className="w-16 h-16 rounded-2xl object-cover bg-neutral-900" alt="" />
                                    <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-black">x{item.quantity}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-black text-white uppercase italic">{item.title}</p>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Size: {item.size} | ID: {item.id.slice(-4)}</p>
                                  </div>
                                  <p className="text-xs font-mono font-black text-white italic">Rs. {parseInt(item.price).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Financial Summary */}
                          <div className="space-y-6">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-1 bg-white"></div>
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Payment Summary</h4>
                            </div>
                            <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 space-y-4">
                              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-gray-300">Rs. {order.financials?.subtotal?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Shipping</span>
                                <span className="text-gray-300">Rs. {order.financials?.shipping?.toLocaleString()}</span>
                              </div>
                              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-[11px] font-black text-white uppercase italic">Total Paid</span>
                                <span className="text-lg font-mono font-black text-white tracking-tighter">Rs. {order.financials?.total?.toLocaleString()}</span>
                              </div>
                              {order.customerDetails?.notes && (
                                <div className="mt-4 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                                  <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Customer Note:</p>
                                  <p className="text-[10px] text-gray-400 italic">"{order.customerDetails.notes}"</p>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}