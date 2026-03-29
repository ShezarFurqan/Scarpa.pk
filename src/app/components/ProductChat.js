'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, query, where, getDocs, addDoc, 
  serverTimestamp, doc, updateDoc, onSnapshot, orderBy, limit 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Send, MessageCircle, X, User } from 'lucide-react';
import GuestModal from './GuestModel';

const ProductChat = ({ product, open, setOpen, isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkExisting = async () => {
      const uId = currentUser?.uid || null;
      const gId = typeof window !== 'undefined' ? localStorage.getItem('guestId') : null;
      
      if (!uId && !gId) return;

      try {
        const convRef = collection(db, "conversations");
        let q;
        if (uId) {
          q = query(convRef, where("productId", "==", product.id), where("userId", "==", uId));
        } else {
          q = query(convRef, where("productId", "==", product.id), where("userId", "==", null));
        }

        const snap = await getDocs(q);
        if (!snap.empty) {
          setConversationId(snap.docs[0].id);
        }
      } catch (err) {
        console.error("Auto-fetch error:", err);
      }
    };

    checkExisting();
  }, [currentUser, product.id]);

  useEffect(() => {
    if (!conversationId) return;

    const msgRef = collection(db, "conversations", conversationId, "messages");
    const q = query(msgRef, orderBy("createdAt", "asc"), limit(50));

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const initializeConversation = async (guestData = null) => {
    if (conversationId) return;

    try {
      const uId = currentUser?.uid || null;
      const email = currentUser?.email || guestData?.email || null;
      const gName = currentUser?.displayName || guestData?.name || "Guest";

      const convRef = collection(db, "conversations");
      
      const newConv = await addDoc(convRef, {
        productId: product.id,
        productName: product.title,
        productImage: product.images[0],
        userId: uId,
        guestName: gName,
        guestEmail: email,
        lastMessage: "",
        unreadAdmin: 0,
        unreadUser: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setConversationId(newConv.id);
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };

  const handleOpenChat = () => {
    const gId = localStorage.getItem('guestId');
    if (!currentUser && !gId) {
      setShowGuestModal(true);
    } else {
      setIsOpen(true);
      if (!conversationId) initializeConversation();
    }
  };

  useEffect(()=>{
    if(open) {
      handleOpenChat()
    }
  },[open])

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId) return;

    const text = inputText;
    setInputText('');

    try {
      const msgRef = collection(db, "conversations", conversationId, "messages");
      await addDoc(msgRef, {
        sender: "user",
        text: text,
        createdAt: serverTimestamp(),
        seen: false
      });

      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: text,
        unreadAdmin: 1,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  return (
    <>
      {/* Floating Button Theme Change */}
      <button 
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 bg-[#0145f2] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(1,69,242,0.3)] z-40 hover:scale-110 transition-transform active:scale-95 "
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[92vw] md:w-[380px] h-[520px] bg-[#edf1f5] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header - Vibrant Blue Background */}
          <div className="p-5 bg-[#0145f2] flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={product.images[0]} className="w-11 h-11 rounded-xl object-cover border-2 border-white/20 shadow-sm" alt="" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-[#0145f2] rounded-full shadow-sm"></div>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Inquiry Support</h4>
                <p className="text-sm font-black text-white truncate w-44 leading-tight">{product.title}</p>
              </div>
            </div>
            <button onClick={() =>{ setOpen(false); setIsOpen(false)}} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area - Light Gray/Blueish Background */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#edf1f5]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3.5 px-4 rounded-[1.25rem] text-[13px] font-medium shadow-sm leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-[#0145f2] text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input Area - White & Clean */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask us anything..."
                className="flex-1 bg-[#edf1f5] border-none rounded-2xl px-5 py-3 text-xs text-gray-800 font-bold outline-none focus:ring-2 focus:ring-[#0145f2]/10 transition-all placeholder:text-gray-400"
              />
              <button 
                type="submit" 
                className="bg-[#0145f2] text-white p-3 rounded-2xl shadow-lg shadow-[#0145f2]/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-[9px] text-center mt-3 text-gray-400 font-black uppercase tracking-widest opacity-50">Typical response time: 5 mins</p>
          </div>
        </div>
      )}

      {showGuestModal && (
        <GuestModal 
          onClose={() => setShowGuestModal(false)} 
          onSuccess={(data) => {
            setShowGuestModal(false);
            setIsOpen(true);
            initializeConversation(data);
          }}
        />
      )}
    </>
  );
};

export default ProductChat;