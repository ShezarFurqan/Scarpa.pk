"use client";

import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  Package,
  Truck,
  CheckCircle2,
  Search,
  ArrowRight,
  Loader2,
  ChevronLeft,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
} from "lucide-react";

const TrackOrder = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState("");

  const [searchId, setSearchId] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const statusSteps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

  // Fetch logged-in user order history
  useEffect(() => {
    if (user?.uid) fetchUserHistory();
  }, [user]);

  const fetchUserHistory = async () => {
    setHistoryLoading(true);
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || null,
      }));
      setUserOrders(orders);
    } catch (err) {
      console.error("History Error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTrackSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setActiveOrder(null);

    try {
      const idToSearch = searchId.trim();
      let foundData = null;

      const docRef = doc(db, "orders", idToSearch);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        foundData = { id: docSnap.id, ...docSnap.data() };
      } else {
        const q = query(collection(db, "orders"), where("id", "==", idToSearch));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          foundData = { id: qSnap.docs[0].id, ...qSnap.docs[0].data() };
        }
      }

      if (!foundData) {
        setError("Order not found. Please check your ID.");
      } else {
        const inputContact = contactInfo.trim().toLowerCase();
        const dbEmail = foundData.customerDetails?.email?.toLowerCase() || "";
        const dbPhone = foundData.customerDetails?.phone || "";

        if (!contactInfo || dbEmail === inputContact || dbPhone.includes(inputContact)) {
          setActiveOrder(foundData);
        } else {
          setError("Order ID found, but contact info does not match.");
        }
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) =>
    statusSteps.indexOf(status) !== -1 ? statusSteps.indexOf(status) : 0;

  const StatusTimeline = ({ currentStatus }) => (
    <div className="relative flex justify-between w-full py-8">
      {statusSteps.map((step, idx) => {
        const isCompleted = idx <= getStatusIndex(currentStatus);
        const isActive = idx === getStatusIndex(currentStatus);
        return (
          <div key={step} className="flex flex-col items-center flex-1 z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700
              ${isCompleted ? "bg-white border-white text-black" : "bg-black border-white/10 text-white/20"}`}
            >
              {isCompleted ? <CheckCircle2 size={18} /> : <Clock size={18} />}
            </div>
            <span
              className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center ${
                isActive ? "text-white" : "text-white/20"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-0" />
      <div
        className="absolute top-1/2 left-0 h-[1px] bg-white transition-all duration-1000 -z-0"
        style={{
          width: `${(getStatusIndex(activeOrder?.orderStatus) / (statusSteps.length - 1)) * 100}%`,
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-6xl mx-auto py-12">
        {!activeOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Search Form */}
            <div className="space-y-8">
              <h1 className="text-5xl font-black tracking-tighter uppercase">
                Track <span className="text-white/20 italic">Order</span>
              </h1>
              <form
                onSubmit={handleTrackSearch}
                className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-4"
              >
                <input
                  placeholder="Order ID (e.g. MigWHZ...)"
                  className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-white"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  required
                />
                <input
                  placeholder="Email or Phone"
                  className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-white"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
                {error && <p className="text-red-500 text-xs italic">{error}</p>}
                <button className="w-full bg-white text-black font-black p-4 rounded-xl flex justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : "Track Now"}
                </button>
              </form>
            </div>

            {/* History List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest">
                Recent Orders
              </h3>
              {historyLoading ? (
                <Loader2 className="animate-spin" />
              ) : userOrders.length === 0 ? (
                <p className="text-white/40 text-sm">No recent orders found.</p>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setActiveOrder(order)}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-white hover:text-black transition-all"
                  >
                    <div>
                      <p className="font-bold uppercase text-sm">{order.id.substring(0, 10)}...</p>
                      <p className="text-[10px] opacity-50">
                        {order.createdAt
                          ? order.createdAt.toLocaleDateString()
                          : order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.financials?.total}</p>
                      <p className="text-[10px] uppercase font-black">{order.orderStatus}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Detailed View */
          <div className="space-y-8 animate-in fade-in duration-500">
            <button
              onClick={() => setActiveOrder(null)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-all"
            >
              <ChevronLeft size={20} />{" "}
              <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </button>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase">
                  {activeOrder.id}
                </h2>
                <div className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {activeOrder.orderStatus}
                </div>
              </div>
              <StatusTimeline currentStatus={activeOrder.orderStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/20 mb-6">
                  Items
                </h4>
                <div className="space-y-6">
                  {activeOrder.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-[10px] text-white/40 uppercase">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">${item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Subtotal</span>
                    <span>${activeOrder.financials?.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Shipping</span>
                    <span>${activeOrder.financials?.shipping}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black pt-4">
                    <span>Total</span>
                    <span>${activeOrder.financials?.total}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/20 mb-4">
                    Delivery
                  </h4>
                  <div className="text-sm space-y-4">
                    <p className="font-medium text-white/80">
                      <MapPin size={14} className="inline mr-2 opacity-50" />{" "}
                      {activeOrder.customerDetails?.address},{" "}
                      {activeOrder.customerDetails?.city}
                    </p>
                    <p className="text-xs uppercase tracking-widest font-bold">
                      <CreditCard size={14} className="inline mr-2 opacity-50" />{" "}
                      {activeOrder.paymentMethod}
                    </p>
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

export default TrackOrder;
