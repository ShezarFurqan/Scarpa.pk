'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { ShopContext } from '../Context/ShopContext'
import { auth, db } from '../firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { Package, MapPin, User, LogOut, Loader2, Mail, Phone, ShoppingBag, Clock } from 'lucide-react'

export default function ProfilePage() {
    const router = useRouter();
    // ShopContext se essential tools lena
    const { user, token, setToken, navigate } = useContext(ShopContext); 
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. DATA FETCHING & PROTECTION
    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user && !token) {
                router.push('/login');
                return;
            }

            console.log(user)

            try {
                const ordersRef = collection(db, "orders");
                const q = query(
                    ordersRef, 
                    where("userId", "==", user?.uid || "guest"), // Guest handle
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

    // 2. LOGOUT LOGIC (As requested)
    const handleLogout = () => {
        setToken(""); // Context clear
        localStorage.removeItem("token"); // Localstorage clear
        router.push('/login');
    };

    // 3. STATUS BADGE (eCommerce Standards)
    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
            delivered: "bg-green-500/10 text-green-500 border-green-500/20",
            shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        const s = status?.toLowerCase() || "pending";
        return (
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${styles[s] || styles.pending}`}>
                {s}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-sm text-gray-500">Syncing Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
            {/* TOP BAR */}
            <div className="border-b border-white/5 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User size={20} className="text-indigo-500" />
                        <span className="font-bold tracking-tight">Customer Dashboard</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
                    >
                        <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: USER PROFILE DETAILS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 shadow-xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-4 shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10">
                                {user?.displayName?.[0] || user?.email?.[0].toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold">{user?.displayName || "Member"}</h2>
                            <p className="text-gray-500 text-sm italic">Premium Account</p>
                        </div>

                        <div className="space-y-4 border-t border-white/5 pt-6">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-indigo-400" />
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Email Address</p>
                                    <p className="text-sm truncate">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-indigo-400" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Default City</p>
                                    <p className="text-sm">{orders[0]?.customerDetails?.city || "Not set"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-indigo-400" />
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Contact</p>
                                    <p className="text-sm">{orders[0]?.customerDetails?.phone || "No phone added"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QUICK STATS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-2xl text-center">
                            <p className="text-2xl font-black text-indigo-500">{orders.length}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Orders</p>
                        </div>
                        <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-2xl text-center">
                            <p className="text-2xl font-black text-emerald-500">
                                {orders.filter(o => o.orderStatus === 'delivered').length}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Delivered</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: ORDER HISTORY */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <ShoppingBag size={20} className="text-indigo-500" />
                            Order History
                        </h3>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-[#0c0c0c] border border-dashed border-white/10 rounded-3xl p-20 text-center">
                            <div className="mb-4 text-gray-700 flex justify-center"><ShoppingBag size={48} /></div>
                            <p className="text-gray-500 mb-6">No orders found.</p>
                            <button onClick={() => router.push('/')} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">Shop Now</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-mono text-xs font-bold text-gray-400">#{order.id.slice(-8).toUpperCase()}</span>
                                                <StatusBadge status={order.orderStatus} />
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                <Clock size={12} />
                                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "Just now"}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-600 uppercase">Total Amount</p>
                                            <p className="text-lg font-black text-white">Rs. {order.financials?.total?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Items Horizontal Scroll */}
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {order.cartItems?.map((item, idx) => (
                                            <div key={idx} className="flex-shrink-0 flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-black">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover opacity-80" />
                                                </div>
                                                <div className="pr-2">
                                                    <p className="text-[11px] font-bold text-gray-300 truncate w-24">{item.title}</p>
                                                    <p className="text-[10px] text-gray-500 italic">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Subtle Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[50px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-0"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}