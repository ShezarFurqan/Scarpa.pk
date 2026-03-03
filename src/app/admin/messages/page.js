'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase'; 
import { 
  collection, query, orderBy, onSnapshot, 
  doc, updateDoc, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { 
  Search, Send,
  CheckCheck, Image as ImageIcon, ArrowLeft, Filter, ShoppingCart
} from 'lucide-react';

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  // 1. FETCH ALL CONVERSATIONS
  useEffect(() => {
    const q = query(collection(db, "conversations"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(convos);
      setLoading(false);

      // Refresh selectedChat data if it exists in the new list
      if (selectedChat) {
        const updated = convos.find(c => c.id === selectedChat.id);
        if (updated) setSelectedChat(updated);
      }
    });
    return () => unsubscribe();
  }, [selectedChat?.id]);

  // 2. FETCH MESSAGES & AUTO-READ
  useEffect(() => {
    if (!selectedChat?.id) return;

    if (selectedChat.unreadAdmin > 0) {
      updateDoc(doc(db, "conversations", selectedChat.id), { unreadAdmin: 0 });
    }

    const q = query(collection(db, "conversations", selectedChat.id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [selectedChat?.id]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const text = replyText;
    setReplyText('');

    try {
      await addDoc(collection(db, "conversations", selectedChat.id, "messages"), {
        sender: "admin",
        text,
        createdAt: serverTimestamp(),
        seen: false
      });

      await updateDoc(doc(db, "conversations", selectedChat.id), {
        lastMessage: text,
        unreadUser: (selectedChat.unreadUser || 0) + 1,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Firebase Error:", error);
    }
  };

  // SAFE TIME FORMATTER
  const formatTime = (ts) => {
    if (!ts || !ts.toDate) return ""; // Handle null or pending timestamps
    return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConvos = conversations.filter(c => 
    c.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans border-t border-white/5">
      
      {/* SIDEBAR */}
      <aside className={`
        flex-col border-r border-white/5 w-full md:w-[350px] lg:w-[400px] bg-[#0A0A0A]
        ${selectedChat ? 'hidden md:flex' : 'flex'}
      `}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white tracking-tight">Inbox</h1>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500"><Filter size={18}/></button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
          ) : filteredConvos.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`group flex gap-4 p-4 mx-2 rounded-2xl cursor-pointer transition-all mb-1 ${
                selectedChat?.id === chat.id ? "bg-indigo-600/10 border border-indigo-500/20" : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={chat.productImage || "/placeholder.jpg"} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5" alt="Product" />
                {chat.unreadAdmin > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0A0A0A]">
                    {chat.unreadAdmin}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-semibold truncate text-zinc-200">{chat.guestName || "Guest"}</h3>
                  <span className="text-[10px] text-zinc-600 whitespace-nowrap">{formatTime(chat.updatedAt)}</span>
                </div>
                <p className="text-[11px] text-indigo-400/80 truncate mt-0.5">{chat.productName}</p>
                <p className="text-xs truncate mt-1 text-zinc-500">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT WINDOW */}
      <main className={`flex-1 flex-col relative ${selectedChat ? 'flex fixed inset-0 z-50 md:static' : 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur-xl z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 text-zinc-400 hover:text-white"><ArrowLeft size={20} /></button>
                <img src={selectedChat.productImage} className="w-10 h-10 rounded-lg object-cover" alt="Selected" />
                <div>
                  <h2 className="font-bold text-white text-sm leading-none">{selectedChat.guestName}</h2>
                  <span className="text-[10px] text-zinc-500 mt-1 block">Inquiry: {selectedChat.productName}</span>
                </div>
              </div>

            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#050505]">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={msg.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex flex-col max-w-[80%] md:max-w-[65%] ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-[13px] shadow-sm ${
                        isAdmin ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-zinc-600 mt-1 flex items-center gap-1 uppercase tracking-tighter">
                        {formatTime(msg.createdAt)}
                        {isAdmin && <CheckCheck size={12} className="text-indigo-500" />}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <footer className="p-4 bg-[#0A0A0A] border-t border-white/5">
              <form onSubmit={handleSendReply} className="max-w-4xl mx-auto flex items-end gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-indigo-500/50 transition-all">
                <button type="button" className="p-2.5 text-zinc-500 hover:text-white"><ImageIcon size={20} /></button>
                <textarea
                  rows="1"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply here..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 text-white resize-none"
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(e); } }}
                />
                <button 
                  type="submit" 
                  disabled={!replyText.trim()}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-30 transition-all"
                >
                  <Send size={20} />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#050505] p-12 text-center">
             <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart size={32} className="text-indigo-500 opacity-50" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">No Chat Selected</h2>
             <p className="text-zinc-500 text-sm max-w-xs">Select a customer inquiry to view the conversation and start replying.</p>
          </div>
        )}
      </main>
    </div>
  );
}