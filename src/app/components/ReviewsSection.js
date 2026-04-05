'use client'

import React, { useRef, useEffect, useState } from 'react';
import { db } from '../firebase'; // Apna firebase path check karlein
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { Star, ArrowLeft, ArrowRight, Quote, Loader2 } from 'lucide-react';

export default function TopReviewsSection() {
  const [reviews, setReviews] = useState([]); // Database se aane waale reviews
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // 1. FETCH SELECTED REVIEWS FROM FIREBASE
  useEffect(() => {
    // Sirf wo reviews uthao jo "selected: true" hain (Max 5)
    const q = query(
      collection(db, "productReviews"), 
      where("selected", "==", true),
      limit(5)
    );

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

  // 2. AUTO-SCROLL LOGIC
  useEffect(() => {
    let interval;
    if (!isHovered && reviews.length > 0) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
          }
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isHovered, reviews]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < Math.floor(rating) ? "#eab308" : "none"}
          strokeWidth={2}
          className={i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}
        />
      ))}
    </div>
  );

  // Loading State
  if (loading) return (
    <div className="py-20 flex justify-center bg-[#edf1f5]">
      <Loader2 className="animate-spin text-[#0145f2]" size={30} />
    </div>
  );

  // Agar koi review select nahi kiya toh section hide kardein ya empty state dikhayein
  if (reviews.length === 0) return null;

  return (
    <section className="py-12 bg-[#edf1f5] overflow-hidden font-sans selection:bg-gray-200 selection:text-black">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 2xl:px-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col items-start space-y-3">
            <span className="text-[#0145f2] text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase bg-[#0145f2]/5 px-4 py-1.5 rounded-full">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a] italic leading-none">
              Verified <span className="text-[#0145f2]">Feedback</span>
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={scrollLeft} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-[#0145f2] hover:text-white transition-all shadow-sm active:scale-95">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <button onClick={scrollRight} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-[#0145f2] hover:text-white transition-all shadow-sm active:scale-95">
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Carousel Section */}
        <div 
          className="relative -mx-4 md:mx-0 px-4 md:px-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="snap-start shrink-0 w-[85vw] sm:w-[340px] md:w-[380px] bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div className="absolute top-6 right-6 text-gray-100 group-hover:text-[#0145f2]/10 transition-colors">
                  <Quote size={40} fill="currentColor" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center font-black text-white text-xs md:text-sm uppercase">
                        {(review.userName || review.user)?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-gray-900">
                          {review.userName || review.user}
                        </p>
                        <div className="mt-1">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 italic font-medium text-sm md:text-base leading-relaxed mb-6">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between z-10 relative">
                  <span className="text-[9px] md:text-[10px] text-[#0145f2] font-bold uppercase tracking-widest">
                    Verified Buyer
                  </span>
                  <span className="text-[9px] md:text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : "Recent"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}