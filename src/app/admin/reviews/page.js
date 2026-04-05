'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { 
  collection, onSnapshot, query, orderBy, 
  doc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { 
  Star, Trash2, User, CheckCircle2, 
  AlertCircle, Search, Loader2, Award 
} from 'lucide-react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  // 1. FETCH REVIEWS (Corrected logic)
  useEffect(() => {
    const q = query(collection(db, "productReviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. TOGGLE TOP REVIEW (Fixed Collection Name: "productReviews")
  const handleToggleTopReview = async (reviewId, currentStatus) => {
    const topReviewsCount = reviews.filter(r => r.selected === true).length;

    if (!currentStatus && topReviewsCount >= 5) {
      alert("You can only select a maximum of 5 top reviews.");
      return;
    }

    try {
      // Yahan "reviews" ki jagah "productReviews" hona chahiye
      await updateDoc(doc(db, "productReviews", reviewId), {
        selected: !currentStatus
      });
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // 3. DELETE REVIEW (Fixed Collection Name: "productReviews")
  const handleDelete = async () => {
    try {
      // Yahan bhi "productReviews"
      await deleteDoc(doc(db, "productReviews", selectedReviewId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // 4. FILTER REVIEWS (Safe mapping with optional chaining)
  const filteredReviews = reviews.filter(rev => {
    const term = search.toLowerCase();
    // Agar DB mein "userName" ki jagah sirf "user" hai, toh niche "rev.user" kardein
    const nameMatch = (rev.userName || rev.user || "").toLowerCase().includes(term);
    const productMatch = (rev.productName || "").toLowerCase().includes(term);
    const commentMatch = (rev.comment || "").toLowerCase().includes(term);
    
    return nameMatch || productMatch || commentMatch;
  });

  const selectedCount = reviews.filter(r => r.selected).length;

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#050505]">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Loading Feedback</p>
    </div>
  );

  return (
    <div className="p-6 bg-[#050505] min-h-screen text-white font-sans space-y-10">
      
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            Customer <span className="text-white/20">Voices</span>
          </h1>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em] mt-3">Review Moderation & Social Proof</p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-2xl flex items-center gap-4">
            <Award className="text-indigo-500" size={24} />
            <div>
                <p className="text-[9px] font-black uppercase text-indigo-500/60 tracking-widest">Top Reviews Slot</p>
                <p className="text-xl font-black italic">{selectedCount} <span className="text-white/20">/ 5 Selected</span></p>
            </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
        <input 
          type="text" 
          placeholder="Search reviews, users or products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:border-indigo-500/50 outline-none transition-all"
        />
      </div>

      {/* REVIEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <div 
            key={review.id} 
            className={`group relative bg-white/[0.02] border transition-all duration-300 p-6 rounded-[2rem] ${
              review.selected ? 'border-indigo-500/50 bg-indigo-500/[0.03]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-sm">
                  {(review.userName || review.user)?.charAt(0) || <User size={16}/>}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">{review.userName || review.user || "Anonymous"}</h3>
                  <div className="flex gap-0.5 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        fill={i < review.rating ? "#6366f1" : "none"} 
                        className={i < review.rating ? "text-indigo-500" : "text-white/10"} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedReviewId(review.id); setIsDeleteModalOpen(true); }}
                className="p-2 text-white/10 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl mb-4 border border-white/5">
                {review.productImage && <img src={review.productImage} className="w-8 h-8 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />}
                <p className="text-[10px] font-bold text-white/50 truncate uppercase tracking-tighter">
                    {review.productName || "Product"}
                </p>
            </div>

            <p className="text-sm text-zinc-400 italic leading-relaxed mb-6 line-clamp-3">
              "{review.comment}"
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : "Recent"}
              </span>
              
              <button 
                onClick={() => handleToggleTopReview(review.id, review.selected)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  review.selected 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {review.selected ? <CheckCircle2 size={12}/> : <Award size={12}/>}
                {review.selected ? 'Featured' : 'Select Top'}
              </button>
            </div>

            {review.selected && (
                <div className="absolute -top-2 -right-2 bg-indigo-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                    Featured
                </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10">
            <AlertCircle size={40} className="text-white/10 mb-4" />
            <p className="text-white/20 font-bold uppercase tracking-widest">No matching reviews found</p>
        </div>
      )}
    </div>
  );
}