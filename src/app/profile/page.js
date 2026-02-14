'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { ShopContext } from '../Context/ShopContext'
import { auth, db } from '../firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { 
  Package, MapPin, User, LogOut, Loader2, 
  Mail, Phone, ShoppingBag, Clock, ChevronRight, Star 
} from 'lucide-react'
import { signOut } from "firebase/auth";

export default function ProfilePage() {
    const router = useRouter();
    const { user, token, setToken, setUser } = useContext(ShopContext);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. DATA FETCHING
    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user && !token) {
                router.push('/login');
                return;
            }

            try {
                const ordersRef = collection(db, "orders");
                const q = query(
                    ordersRef,
                    where("userId", "==", user?.uid || "guest"),
                    orderBy("createdAt", "desc")
                );

                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setOrders(ordersData);
            } catch (error) {
                console.error("Firestore Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, [user, token]);

    // 2. LOGOUT LOGIC
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            router.push('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // 3. STATUS BADGE (Updated for Light Theme)
    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "text-amber-600 bg-amber-50",
            delivered: "text-emerald-600 bg-emerald-50",
            shipped: "text-sky-600 bg-sky-50",
            cancelled: "text-rose-600 bg-rose-50",
        };
        const s = status?.toLowerCase() || "pending";
        return (
            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 ${styles[s] || styles.pending}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {s}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#edf1f5]">
                <div className="relative">
                    <Loader2 className="animate-spin text-[#0145f2] opacity-20" size={48} strokeWidth={3} />
                    <Loader2 className="animate-spin text-[#0145f2] absolute top-0 left-0" size={48} strokeWidth={3} style={{ animationDuration: '3s' }} />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-[#0145f2]">Authenticating</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-36 text-gray-900 font-sans selection:bg-[#0145f2] selection:text-white pt-10">
            
            {/* TOP BAR (NON-STICKY) */}
            <div className=" ">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#edf1f5] flex items-center justify-center border border-gray-100">
                            <User size={14} className="text-[#0145f2]" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Customer / Dashboard</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-all group"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* HERO SECTION */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-[1000] uppercase italic tracking-tighter leading-none mb-4 text-gray-900">
                        Welcome Back,<br/> 
                        <span className="text-[#0145f2]">{user?.displayName?.split(' ')[0] || "Member"}</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* PROFILE INFO CARD */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] rounded-[2rem] p-8 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                                <Star size={120} fill="#0145f2" />
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0145f2] mb-8">Personal Records</p>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Identifier</span>
                                        <p className="text-sm font-black text-gray-800">{user?.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Location</span>
                                        <p className="text-sm font-black text-gray-800">{orders[0]?.customerDetails?.city || "Awaiting Data"}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Contact</span>
                                        <p className="text-sm font-black text-gray-800">{orders[0]?.customerDetails?.phone || "No Phone Registered"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 rounded-[2rem] text-center hover:border-[#0145f2]/20 transition-colors">
                                <p className="text-4xl font-black italic tracking-tighter mb-1 text-gray-900">{orders.length}</p>
                                <p className="text-[9px] text-[#0145f2] font-black uppercase tracking-widest">Total Orders</p>
                            </div>
                            <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 rounded-[2rem] text-center hover:border-emerald-500/20 transition-colors">
                                <p className="text-4xl font-black italic tracking-tighter mb-1 text-emerald-500">
                                    {orders.filter(o => o.orderStatus === 'delivered').length}
                                </p>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* ORDER HISTORY */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-gray-100">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-gray-400">
                                <Package size={16} className="text-[#0145f2]" /> Recent Shipments
                            </h3>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white border-4 border-dashed border-[#0145f2]/5 rounded-[2.5rem] py-32 text-center shadow-sm">
                                <div className="w-20 h-20 bg-[#edf1f5] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShoppingBag size={32} className="text-[#0145f2]/30" />
                                </div>
                                <p className="text-[#0145f2] text-xs font-black uppercase tracking-widest mb-8">Your history is empty</p>
                                <button 
                                    onClick={() => router.push('/')} 
                                    className="bg-[#0145f2] text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#0145f2]/20 hover:scale-105 hover:shadow-[#0145f2]/40 transition-all active:scale-95"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div 
                                        key={order.id} 
                                        className="bg-white border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)] rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:border-[#0145f2]/20 transition-all group cursor-pointer"
                                        onClick={() => router.push(`/orders?id=${order.id}`)}
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-[#edf1f5] px-3 py-1 rounded-full font-black text-[10px] text-[#0145f2] tracking-widest uppercase">
                                                        ID: {order.id.slice(-8)}
                                                    </span>
                                                    <StatusBadge status={order.orderStatus} />
                                                </div>
                                                
                                                {/* Images List */}
                                                <div className="flex -space-x-4 overflow-hidden pt-2">
                                                    {order.cartItems?.map((item, idx) => (
                                                        <div key={idx} className="w-16 h-16 rounded-2xl border-4 border-white bg-[#edf1f5] overflow-hidden relative group-hover:translate-y-[-5px] transition-transform shadow-sm" style={{ transitionDelay: `${idx * 50}ms` }}>
                                                            <img src={item.image} alt="" className="w-full h-full object-cover mix-blend-multiply hover:mix-blend-normal transition-all" />
                                                        </div>
                                                    ))}
                                                    {order.cartItems?.length > 3 && (
                                                        <div className="w-16 h-16 rounded-2xl border-4 border-white bg-[#edf1f5] flex items-center justify-center text-[10px] font-black text-[#0145f2] shadow-sm z-10">
                                                            +{order.cartItems.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col justify-between items-end text-right">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                    <p className="text-2xl font-black italic tracking-tighter text-gray-900">Rs.{order.financials?.total?.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                                                    <Clock size={12} className="text-[#0145f2]" />
                                                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "Now"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}