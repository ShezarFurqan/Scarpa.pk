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

const ProductChat = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const scrollRef = useRef(null);

  // 1. Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. FIXED: Auto-Check for existing conversation on Load/Refresh
  useEffect(() => {
    const checkExisting = async () => {
      // Refresh ke baad localStorage ya Auth se ID check karein
      const uId = currentUser?.uid || null;
      const gId = typeof window !== 'undefined' ? localStorage.getItem('guestId') : null;
      
      if (!uId && !gId) return;

      try {
        const convRef = collection(db, "conversations");
        let q;
        
        if (uId) {
          q = query(convRef, where("productId", "==", product.id), where("userId", "==", uId));
        } else {
          // Guest ke liye hum guestId meta-data dhoondenge (ya guestEmail agar aapne store kiya hai)
          // Recommended: query by productId and guestId
          q = query(convRef, where("productId", "==", product.id), where("userId", "==", null));
        }

        const snap = await getDocs(q);
        if (!snap.empty) {
          // Agar humein mil jaye conversation, to ID set kar dein taake onSnapshot chal jaye
          setConversationId(snap.docs[0].id);
        }
      } catch (err) {
        console.error("Auto-fetch error:", err);
      }
    };

    checkExisting();
  }, [currentUser, product.id]); // Jaise hi user load ho ya product badle

  // 3. Real-time Message Listener (Same as before, works because of fix above)
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

  // 4. Initialize or Create (Called on click or modal success)
  const initializeConversation = async (guestData = null) => {
    if (conversationId) return; // Already exists

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
      <button 
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl z-40 border border-white/10"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={product.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inquiry</h4>
                <p className="text-sm font-bold text-white truncate w-40">{product.title}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                  m.sender === 'user' ? 'bg-white text-black' : 'bg-white/5 text-gray-300'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-black border-t border-white/5 flex gap-2">
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none"
            />
            <button type="submit" className="bg-white text-black p-2 rounded-xl"><Send size={18} /></button>
          </form>
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