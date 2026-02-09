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

    // 3. STATUS BADGE
    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "text-amber-500",
            delivered: "text-emerald-500",
            shipped: "text-sky-500",
            cancelled: "text-rose-500",
        };
        const s = status?.toLowerCase() || "pending";
        return (
            <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${styles[s] || styles.pending}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {s}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
                <div className="relative">
                    <Loader2 className="animate-spin text-white opacity-20" size={48} />
                    <Loader2 className="animate-spin text-white absolute top-0 left-0" size={48} style={{ animationDuration: '3s' }} />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Authenticating</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-36 bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
            
            {/* TOP BAR (NON-STICKY) */}
            <div className="border-b border-white/5 bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <User size={14} className="text-white" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Customer / Dashboard</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all group"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* HERO SECTION */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
                        Welcome Back,<br/> 
                        <span className="text-gray-500">{user?.displayName?.split(' ')[0] || "Member"}</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* PROFILE INFO CARD */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Star size={80} fill="white" />
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Personal Records</p>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Identifier</span>
                                        <p className="text-sm font-medium">{user?.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Location</span>
                                        <p className="text-sm font-medium">{orders[0]?.customerDetails?.city || "Awaiting Data"}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Contact</span>
                                        <p className="text-sm font-medium">{orders[0]?.customerDetails?.phone || "No Phone Registered"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] text-center hover:bg-white/5 transition-colors">
                                <p className="text-4xl font-black italic tracking-tighter mb-1">{orders.length}</p>
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Total Orders</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] text-center hover:bg-white/5 transition-colors">
                                <p className="text-4xl font-black italic tracking-tighter mb-1 text-emerald-500">
                                    {orders.filter(o => o.orderStatus === 'delivered').length}
                                </p>
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* ORDER HISTORY */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-gray-400">
                                <Package size={16} /> Recent Shipments
                            </h3>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[2.5rem] py-32 text-center">
                                <ShoppingBag size={40} className="mx-auto mb-6 text-gray-800" />
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Your history is empty</p>
                                <button 
                                    onClick={() => router.push('/')} 
                                    className="bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div 
                                        key={order.id} 
                                        className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 hover:bg-white/[0.04] transition-all group cursor-pointer"
                                        onClick={() => router.push(`/orders?id=${order.id}`)} // Agar aapne track page banaya hai
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-white/5 px-3 py-1 rounded-full font-mono text-[10px] text-gray-400">
                                                        ID: {order.id.slice(-8).toUpperCase()}
                                                    </span>
                                                    <StatusBadge status={order.orderStatus} />
                                                </div>
                                                
                                                {/* Images List */}
                                                <div className="flex -space-x-4 overflow-hidden pt-2">
                                                    {order.cartItems?.map((item, idx) => (
                                                        <div key={idx} className="w-16 h-16 rounded-2xl border-4 border-[#050505] bg-white overflow-hidden relative group-hover:translate-y-[-5px] transition-transform shadow-xl" style={{ transitionDelay: `${idx * 50}ms` }}>
                                                            <img src={item.image} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                                                        </div>
                                                    ))}
                                                    {order.cartItems?.length > 3 && (
                                                        <div className="w-16 h-16 rounded-2xl border-4 border-[#050505] bg-[#111] flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                            +{order.cartItems.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col justify-between items-end text-right">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Total</p>
                                                    <p className="text-xl font-black italic tracking-tighter">Rs.{order.financials?.total?.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                                    <Clock size={12} />
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