'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { db } from '../../firebase'
import {
  collection, onSnapshot, query, orderBy,
  doc, updateDoc, deleteDoc, addDoc, getDocs, serverTimestamp
} from 'firebase/firestore'
import {
  Search, Trash2, MapPin, Phone, Package, ChevronDown,
  Loader2, Mail, Plus, X, Globe, User, 
  TrendingUp, Wallet, BarChart3, Tag, Receipt, ShoppingBag
} from 'lucide-react'

import DeleteConfirmationModal from '../../components/DeleteConfirmationModal'

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Returned', 'Cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState('website')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: doc.data().source || 'website' 
      }));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ SALES ANALYTICS ENGINE (Single Pass Calculation)
  const stats = useMemo(() => {
    const init = { sales: 0, cost: 0, shipping: 0, products: 0, count: 0 };
    const data = {
      overall: { ...init },
      website: { ...init },
      manual: { ...init }
    };

    orders.forEach(order => {
      const s = order.source === 'manual' ? 'manual' : 'website';
      const total = Number(order.financials?.total || 0);
      const cost = Number(order.financials?.cost || 0);
      const ship = Number(order.financials?.shipping || 0);
      const itemsCount = order.items?.reduce((acc, item) => acc + Number(item.quantity || 0), 0) || 0;

      data[s].sales += total;
      data[s].cost += cost;
      data[s].shipping += ship;
      data[s].products += itemsCount;
      data[s].count += 1;

      data.overall.sales += total;
      data.overall.cost += cost;
      data.overall.shipping += ship;
      data.overall.products += itemsCount;
      data.overall.count += 1;
    });

    return data;
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (error) { console.error(error) }
  }

  const filteredOrders = orders.filter(order => {
    const customerName = order.customerDetails?.fullName || "Walk-In Customer"
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
                          customerName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter
    return matchesSearch && matchesStatus && order.source === activeTab
  })

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Synchronizing Vault</p>
    </div>
  )

  return (
    <div className="space-y-12 p-6 bg-[#050505] min-h-screen text-white font-sans">
      
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          await deleteDoc(doc(db, "orders", selectedOrderId));
          setIsDeleteModalOpen(false);
        }}
      />

      {isAddModalOpen && <AddOrderModal onClose={() => setIsAddModalOpen(false)} />}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            Registry <span className="text-white/20">Control</span>
          </h1>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em] mt-3">Advanced Commerce Analytics & Logistics</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <Plus size={16} strokeWidth={3} /> Create Manual Order
        </button>
      </div>

      {/* ✅ ANALYTICS DASHBOARD - UPDATED LAYOUT */}
      <div className="space-y-10">
        
        {/* OVERALL (FULL WIDTH) */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Global Executive Summary</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard title="Total Revenue" value={stats.overall.sales} icon={<Wallet size={20}/>} color="white" />
            <AnalyticsCard title="Total Profit" value={stats.overall.sales - stats.overall.cost - stats.overall.shipping} icon={<TrendingUp size={20}/>} color="emerald-400" isProfit />
            <AnalyticsCard title="Total Purchasing" value={stats.overall.cost} icon={<Receipt size={20}/>} color="white/40" />
            <AnalyticsCard title="Total Products" value={stats.overall.products} icon={<ShoppingBag size={20}/>} color="indigo-400" noCurrency />
          </div>
        </div>

        {/* WEBSITE VS MANUAL (SIDE BY SIDE) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Website Card */}
          <div className="bg-indigo-500/[0.02] border border-indigo-500/10 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl"><Globe size={20}/></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500">Website Portal</h3>
              </div>
              <span className="text-[9px] font-bold text-indigo-500/40 uppercase tracking-widest">Digital Channel</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="Sales" value={stats.website.sales} />
              <MiniStat label="Profit" value={stats.website.sales - stats.website.cost - stats.website.shipping} highlight="indigo" />
              <MiniStat label="Order Count" value={stats.website.count} noCurrency />
              <MiniStat label="Items Sold" value={stats.website.products} noCurrency />
            </div>
          </div>

          {/* Manual Card */}
          <div className="bg-emerald-500/[0.02] border border-emerald-500/10 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl"><User size={20}/></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Manual Ledger</h3>
              </div>
              <span className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest">In-Store / Direct</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="Sales" value={stats.manual.sales} />
              <MiniStat label="Profit" value={stats.manual.sales - stats.manual.cost - stats.manual.shipping} highlight="emerald" />
              <MiniStat label="Order Count" value={stats.manual.count} noCurrency />
              <MiniStat label="Items Sold" value={stats.manual.products} noCurrency />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-full md:w-auto">
            {['website', 'manual'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 md:w-32 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Order ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold focus:outline-none focus:border-white/20 w-full md:w-64"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="All">Status: All</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                  <th className="px-8 py-6">Order ID</th>
                  <th className="px-8 py-6">Customer Status</th>
                  <th className="px-8 py-6">Settlement</th>
                  <th className="px-8 py-6">Logistics</th>
                  <th className="px-8 py-6 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map(order => (
                  <OrderRow 
                    key={order.id} 
                    order={order} 
                    expanded={expandedRow === order.id} 
                    onToggle={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
                    onStatusChange={handleStatusChange}
                    onDelete={(id) => { setSelectedOrderId(id); setIsDeleteModalOpen(true); }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Analytics Helper Components
function AnalyticsCard({ title, value, icon, color, noCurrency, isProfit }) {
  const isLoss = isProfit && value < 0;
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.06] transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-2xl text-white/50 group-hover:text-white transition-colors">{icon}</div>
        <div className="w-12 h-12 bg-white/5 rounded-full absolute -top-4 -right-4 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      <h3 className={`text-3xl font-black tracking-tighter ${isLoss ? 'text-rose-500' : `text-${color}`}`}>
        {!noCurrency && 'Rs. '}{Math.abs(value).toLocaleString()}
      </h3>
    </div>
  )
}

function MiniStat({ label, value, noCurrency, highlight }) {
  const isProfit = label === "Profit";
  const isLoss = isProfit && value < 0;
  
  const colorClass = highlight === 'indigo' ? 'text-indigo-400' : 'text-emerald-400';

  return (
    <div className="bg-black/30 border border-white/5 p-5 rounded-2xl group hover:border-white/10 transition-all">
      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-black italic ${highlight ? (isLoss ? 'text-rose-500' : colorClass) : 'text-white/90'}`}>
        {!noCurrency && 'Rs. '}{Math.abs(value).toLocaleString()}
      </p>
    </div>
  )
}

// ✅ Enhanced Row
function OrderRow({ order, expanded, onToggle, onStatusChange, onDelete }) {
  const customer = order.customerDetails || {};
  const hasDetails = customer.fullName || customer.phone;

  return (
    <>
      <tr onClick={onToggle} className={`cursor-pointer transition-all hover:bg-white/[0.04] ${expanded ? 'bg-white/[0.06]' : ''}`}>
        <td className="px-8 py-6">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${order.source === 'manual' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]'}`}></div>
            <div>
              <p className="font-mono text-[11px] font-black text-white/90 uppercase tracking-tighter">#{order.id.slice(-8)}</p>
              <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{order.date || "Just Now"}</p>
            </div>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="flex items-center gap-2">
            {!hasDetails && <User size={12} className="text-white/20" />}
            <p className={`text-[11px] font-black uppercase ${!hasDetails ? 'text-white/40 italic' : 'text-white'}`}>
              {customer.fullName || "Walk-In Customer"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-gray-500">
            <MapPin size={10} />
            <p className="text-[9px] font-bold uppercase tracking-wider">{customer.city || "Unspecified"}</p>
          </div>
        </td>
        <td className="px-8 py-6">
          <p className="text-xs font-black text-white italic">Rs. {order.financials?.total?.toLocaleString()}</p>
          <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-1">{order.paymentMethod || 'Credit'}</p>
        </td>
        <td className="px-8 py-6">
          <select 
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase outline-none focus:border-white/30"
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
          </select>
        </td>
        <td className="px-8 py-6 text-right">
          <div className="flex items-center justify-end gap-3" onClick={e => e.stopPropagation()}>
            <button onClick={() => onDelete(order.id)} className="p-2.5 rounded-xl hover:bg-rose-500/10 text-gray-600 hover:text-rose-500 transition-all">
              <Trash2 size={16} />
            </button>
            <ChevronDown size={18} className={`text-gray-700 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="bg-white/[0.01] px-8 py-10 border-b border-white/5 animate-in slide-in-from-top-2 duration-300">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Customer Protocol</h4>
                 <div className="space-y-3 bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                    <DetailItem icon={<User size={14}/>} label="Full Name" value={customer.fullName || "Walk-In Buyer"} />
                    <DetailItem icon={<Phone size={14}/>} label="Phone" value={customer.phone || "Not Available"} />
                    <DetailItem icon={<Mail size={14}/>} label="Email" value={customer.email || "Not Available"} />
                    <DetailItem icon={<MapPin size={14}/>} label="Address" value={customer.address || "No Shipping Address"} />
                 </div>
               </div>
               <div className="lg:col-span-1 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Cargo Detail</h4>
                 <div className="space-y-2">
                   {order.items?.map((item, i) => (
                     <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                       <img src={item.image} className="w-10 h-10 rounded-lg object-cover grayscale" />
                       <div className="flex-1">
                         <p className="text-[10px] font-black uppercase">{item.title}</p>
                         <p className="text-[9px] text-gray-500 font-bold">QTY: {item.quantity} × Rs. {item.price}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Financials</h4>
                 <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
                   <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                     <span>Subtotal</span>
                     <span>Rs. {order.financials?.subtotal?.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                     <span>Shipping</span>
                     <span>Rs. {order.financials?.shipping?.toLocaleString()}</span>
                   </div>
                   <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                     <span className="text-[11px] font-black uppercase italic text-white/40">Total</span>
                     <span className="text-xl font-black italic text-white">Rs. {order.financials?.total?.toLocaleString()}</span>
                   </div>
                 </div>
               </div>
             </div>
          </td>
        </tr>
      )}
    </>
  )
}

function DetailItem({ icon, label, value }) {
  const isMissing = value.includes('Not') || value.includes('No ') || value === "Walk-In Buyer";
  return (
    <div className="flex items-start gap-3">
      <div className="text-white/20 mt-0.5">{icon}</div>
      <div>
        <p className="text-[8px] font-black text-white/20 uppercase">{label}</p>
        <p className={`text-xs font-bold ${isMissing ? 'text-white/30 italic' : 'text-white/80'}`}>{value}</p>
      </div>
    </div>
  )
}

// ✅ MODAL: Manual Order (Optional Customer Fields)
function AddOrderModal({ onClose }) {
  const [products, setProducts] = useState([])
  const [saving, setSaving] = useState(false)
  const [customer, setCustomer] = useState({ fullName: '', phone: '', email: '', address: '', city: '' })
  const [financials, setFinancials] = useState({ total: 0, cost: 0, shipping: 250 })
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    getDocs(collection(db, "products")).then(snap => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleSave = async () => {
    if (selectedItems.length === 0) return alert("Select at least one product");
    setSaving(true);
    try {
      await addDoc(collection(db, "orders"), {
        customerDetails: customer,
        items: selectedItems,
        financials: {
          ...financials,
          subtotal: selectedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
        },
        paymentMethod: "Manual COD",
        status: "Processing",
        source: "manual",
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-GB')
      });
      onClose();
    } catch (e) { alert(e.message) } finally { setSaving(false) }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
        <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Manual <span className="text-indigo-500">Dispatch</span></h3>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full"><X size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 scrollbar-hide">
            <div className="space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Customer (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <ModalInput placeholder="Full Name" onChange={v => setCustomer({...customer, fullName: v})} />
                  <ModalInput placeholder="Phone" onChange={v => setCustomer({...customer, phone: v})} />
                  <div className="col-span-2"><ModalInput placeholder="Email" onChange={v => setCustomer({...customer, email: v})} /></div>
                  <div className="col-span-2">
                    <textarea 
                      placeholder="ADDRESS..." 
                      onChange={e => setCustomer({...customer, address: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-bold uppercase min-h-[80px] outline-none"
                    />
                  </div>
                  <ModalInput placeholder="City" onChange={v => setCustomer({...customer, city: v})} />
                </div>
              </section>
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Settlement</h4>
                <div className="grid grid-cols-2 gap-4">
                  <ModalInput placeholder="Sale Price" type="number" onChange={v => setFinancials({...financials, total: Number(v)})} />
                  <ModalInput placeholder="Stock Cost" type="number" onChange={v => setFinancials({...financials, cost: Number(v)})} />
                </div>
              </section>
            </div>
            <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Inventory</h4>
                <div className="bg-white/5 rounded-2xl p-4 h-[300px] overflow-y-auto space-y-2 border border-white/5">
                   {products.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => {
                        const exists = selectedItems.find(i => i.id === p.id);
                        if(exists) setSelectedItems(selectedItems.filter(i => i.id !== p.id))
                        else setSelectedItems([...selectedItems, { id: p.id, title: p.title, image: p.images?.[0], price: p.price, quantity: 1 }])
                      }}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${selectedItems.find(i => i.id === p.id) ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-black/40 border-white/5'}`}
                    >
                      <img src={p.images?.[0]} className="w-8 h-8 rounded-lg object-cover" />
                      <p className="text-[10px] font-black uppercase flex-1">{p.title}</p>
                      <p className="text-[9px] font-bold italic">Rs. {p.price}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Basket ({selectedItems.length})</h4>
                   {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] font-black uppercase">{item.title}</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedItems(selectedItems.map(i => i.id === item.id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">-</button>
                        <span className="text-[10px] font-black">{item.quantity}</span>
                        <button onClick={() => setSelectedItems(selectedItems.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
          <div className="p-8 border-t border-white/5 flex justify-end">
            <button disabled={saving} onClick={handleSave} className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-500 hover:text-white transition-all">
              {saving ? 'Processing...' : 'Authorize Transaction'}
            </button>
          </div>
       </div>
    </div>
  )
}

function ModalInput({ placeholder, type="text", onChange, defaultValue }) {
  return (
    <input 
      type={type} defaultValue={defaultValue}
      placeholder={placeholder.toUpperCase()} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-[10px] font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all uppercase placeholder:text-gray-700" 
    />
  )
}