"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { db } from '@/app/firebase'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { Search, Mail, User, Calendar, Trash2, MessageSquare, Loader2, ExternalLink } from 'lucide-react'

const AdminDirectContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name"); // "name" or "email"

  // 1. Fetch Messages Real-time
  useEffect(() => {
    const q = query(collection(db, 'directcontact'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Filter Logic
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const term = searchQuery.toLowerCase();
      if (searchType === "name") return msg.name?.toLowerCase().includes(term);
      if (searchType === "email") return msg.email?.toLowerCase().includes(term);
      return true;
    });
  }, [messages, searchQuery, searchType]);

  // 3. Delete Message
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, 'directcontact', id));
    }
  };

  // 4. Date Formatter
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-white/20" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Concierge <span className="text-white/20">Inbox</span></h1>
            <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">Manage direct customer inquiries</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-2 rounded-2xl">
            <div className="flex flex-col px-4 border-r border-white/10">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total</span>
              <span className="text-xl font-black">{messages.length}</span>
            </div>
            <div className="flex flex-col px-4">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Unread</span>
              <span className="text-xl font-black text-blue-500">{filteredMessages.length}</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text"
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-white/30 transition-all"
            />
          </div>
          
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white/30 cursor-pointer"
          >
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
          </select>
        </div>

        {/* Messages Table/Grid */}
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div 
                key={msg.id}
                className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* User Profile Info */}
                  <div className="flex items-start gap-4 lg:w-1/4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                      <User size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white uppercase tracking-tight truncate">{msg.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                        <Mail size={12} />
                        <span className="truncate">{msg.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="lg:w-2/4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={14} className="text-blue-500" />
                      <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Inquiry</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "{msg.message}"
                    </p>
                  </div>

                  {/* Actions & Meta */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/4">
                    <div className="flex flex-col items-end text-right">
                      <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                        <Calendar size={12} />
                        {formatDate(msg.createdAt)}
                      </div>
                      <a 
                        href={`mailto:${msg.email}`}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-tighter flex items-center gap-1 transition-colors"
                      >
                        Reply Now <ExternalLink size={10} />
                      </a>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="py-40 text-center border border-dashed border-white/5 rounded-[3rem]">
              <p className="text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">No inquiries found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-20 opacity-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] font-light">End of Sector</p>
      </div>
    </div>
  )
}

export default AdminDirectContact