'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase'; // Apne path ke hisab se adjust karein
import { 
  collection, query, orderBy, onSnapshot, 
  doc, updateDoc, addDoc, serverTimestamp, limit 
} from 'firebase/firestore';
import { 
  Search, Send, MoreVertical, Phone, 
  Clock, CheckCheck, User, Image as ImageIcon 
} from 'lucide-react';

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // 1. FETCH ALL CONVERSATIONS (Sidebar)
  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc") // Latest chat upar
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. FETCH MESSAGES FOR SELECTED CHAT
  useEffect(() => {
    if (!selectedChat) return;

    // Mark as read by Admin immediately
    if (selectedChat.unreadAdmin > 0) {
      updateDoc(doc(db, "conversations", selectedChat.id), {
        unreadAdmin: 0
      });
    }

    const msgRef = collection(db, "conversations", selectedChat.id, "messages");
    const q = query(msgRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      // Auto scroll to bottom
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [selectedChat?.id]);

  // 3. SEND REPLY (Admin to User)
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const text = replyText;
    setReplyText('');

    try {
      // A. Add Message
      await addDoc(collection(db, "conversations", selectedChat.id, "messages"), {
        sender: "admin",
        text: text,
        createdAt: serverTimestamp(),
        seen: false
      });

      // B. Update Conversation Meta
      await updateDoc(doc(db, "conversations", selectedChat.id), {
        lastMessage: text,
        unreadUser: (selectedChat.unreadUser || 0) + 1, // User ke liye unread count badhao
        updatedAt: serverTimestamp()
      });

    } catch (error) {
      console.error("Reply Error:", error);
    }
  };

  // Helper: Format Time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* ================= LEFT SIDEBAR (Chat List) ================= */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-r border-white/10 flex flex-col bg-[#0A0A0A]">
        
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <h1 className="font-bold text-lg tracking-wide">Inbox</h1>
          <div className="bg-white/5 p-2 rounded-full">
            <Search size={18} className="text-gray-400" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {loading ? (
            <div className="p-6 text-center text-gray-500 text-sm">Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">No inquiries yet.</div>
          ) : (
            conversations.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex gap-4 ${
                  selectedChat?.id === chat.id ? "bg-white/10" : ""
                }`}
              >
                {/* Avatar / Product Image */}
                <div className="relative">
                  <img 
                    src={chat.productImage || "/placeholder.jpg"} 
                    alt="Product" 
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                  {chat.unreadAdmin > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                      {chat.unreadAdmin}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm truncate text-white">
                      {chat.guestName || "Guest User"}
                    </h3>
                    <span className="text-[10px] text-gray-500">
                      {formatTime(chat.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mb-1">
                    <span className="text-indigo-400 font-medium">[{chat.productName}]</span> {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= RIGHT MAIN AREA (Chat Window) ================= */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-[#050505]">
          
          {/* Header */}
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0A0A0A]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden">
                <img src={selectedChat.productImage} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-sm">{selectedChat.guestName}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Inquiry for: <span className="text-white">{selectedChat.productName}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-gray-400">
              <button className="hover:text-white"><Phone size={20}/></button>
              <button className="hover:text-white"><MoreVertical size={20}/></button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#050505]">
            
            {/* Context Banner */}
            <div className="flex justify-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold bg-white/5 px-3 py-1 rounded-full">
                Conversation Started: {selectedChat.createdAt?.toDate().toDateString()}
              </span>
            </div>

            {messages.map((msg, index) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  {/* Avatar if user */}
                  {!isAdmin && (
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-2 border border-white/10">
                      <User size={14} className="text-gray-400" />
                    </div>
                  )}

                  <div className={`max-w-[70%] space-y-1 ${isAdmin ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                    <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isAdmin 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-[#1a1a1a] text-gray-200 border border-white/5 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                      {formatTime(msg.createdAt)}
                      {isAdmin && <CheckCheck size={12} className="text-indigo-400" />}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#0A0A0A] border-t border-white/10">
            <form onSubmit={handleSendReply} className="flex items-end gap-3 max-w-4xl mx-auto">
              <button type="button" className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                <ImageIcon size={20} />
              </button>
              
              <div className="flex-1 bg-white/5 rounded-xl border border-white/10 focus-within:border-indigo-500/50 transition-colors flex items-center">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-white px-4 py-3 placeholder:text-gray-600"
                />
              </div>

              <button 
                type="submit" 
                disabled={!replyText.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Send size={20} />
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] text-gray-500">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <Search size={32} className="text-gray-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Select a Conversation</h2>
          <p className="text-sm max-w-md text-center">
            Choose an inquiry from the sidebar to view details and reply to customers.
          </p>
        </div>
      )}
    </div>
  );
}