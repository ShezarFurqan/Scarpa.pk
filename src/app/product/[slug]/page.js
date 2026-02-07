'use client'
import React, { use, useState, useContext, useEffect } from 'react'
import {
  Star, Plus, Minus, ShoppingBag, Zap,
  CheckCircle2, ShieldCheck, Truck, MessageSquare,
  UserPlus, LogIn, Ruler
} from 'lucide-react'
import Link from 'next/link'
import { ShopContext } from '@/app/Context/ShopContext';
import { db } from '../../firebase';
import {
  collection, addDoc, query, where,
  onSnapshot, orderBy, serverTimestamp
} from 'firebase/firestore';
import RelatedProducts from '@/app/components/RelatedProducts';

export default function ProductDetailPage({ params }) {
  // 1. DYNAMIC PARAM & CONTEXT
  const resolvedParams = use(params);
  const productId = resolvedParams.slug;
  const { products, token, addToCart } = useContext(ShopContext);

  // 2. STATE MANAGEMENT
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  // 3. FETCH PRODUCT FROM CONTEXT
  useEffect(() => {
    if (products && productId) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct);
    }
  }, [products, productId]);

  // 4. REAL-TIME REVIEWS
  useEffect(() => {
    if (!productId) return;
    const reviewsRef = collection(db, "productReviews");
    const q = query(reviewsRef, where("productId", "==", productId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetchedReviews);
    });
    return () => unsubscribe();
  }, [productId]);

  // 5. HANDLERS
  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size first");
      return;
    }
    setError("");
    addToCart(product, quantity, selectedSize);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) { alert("Please login to submit review"); return; }
    if (!newReview.name || !newReview.comment) return;
    try {
      await addDoc(collection(db, "productReviews"), {
        productId: productId,
        user: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      });
      setNewReview({ name: "", rating: 5, comment: "" });
    } catch (err) { console.error("Error adding review: ", err); }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  const StarRating = ({ rating, size = 16, interactive = false }) => (
    <div className="flex gap-0.5 text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
          strokeWidth={1.5}
          className={interactive ? "cursor-pointer" : ""}
          onClick={() => interactive && setNewReview({ ...newReview, rating: i + 1 })}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <div className="container mx-auto px-6 lg:px-12 mb-32 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">

          {/* IMAGE GALLERY */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-12">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 group">
              <img
                src={product.images ? product.images[selectedImage] : '/placeholder.png'}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <StarRating rating={product.rating || 5} />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {reviews.length} Verified Reviews
                </span>
              </div>
              {/* PRICE & DISCOUNT SECTION */}
              <div className="flex items-center gap-4">
                {/* Actual Price */}
                <span className="text-3xl font-mono">${product.price}</span>

                {/* Fake Price (Original Price) */}
                {product.fakePrice && (
                  <span className="text-xl text-gray-600 line-through font-mono">
                    ${product.fakePrice}
                  </span>
                )}

                {/* Dynamic Accurate Percentage Calculation */}
                {product.fakePrice && product.price && (
                  <span className="bg-white/10 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest text-emerald-400">
                    Save {Math.round(((product.fakePrice - product.price) / product.fakePrice) * 100)}%
                  </span>
                )}
              </div>
              <p className="text-gray-400 font-light leading-relaxed">{product.description}</p>
            </div>

            <hr className="border-white/5" />

            {/* UPGRADED SIZE SELECTOR DESIGN */}
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                    <Ruler size={12} /> Select Size (UK/EU)
                  </label>
                  <p className="text-[9px] text-gray-600 uppercase font-bold">Multiple options available</p>
                </div>
                <button className="text-[10px] text-white/40 hover:text-white transition-colors underline underline-offset-4 uppercase font-bold">Size Guide</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setError(""); }}
                    className={`group relative py-4 px-2 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1
                      ${selectedSize === size
                        ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-[1.02]'
                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/[0.05]'
                      }`}
                  >
                    {selectedSize === size && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
                    )}
                    <span className={`text-[11px] font-black tracking-tight ${selectedSize === size ? 'text-black' : 'text-white'}`}>
                      {size.split('/')[0]} {/* UK Part */}
                    </span>
                    <span className={`text-[9px] font-bold opacity-60 uppercase ${selectedSize === size ? 'text-black' : 'text-gray-500'}`}>
                      {size.split('/')[1] || ''} {/* EU Part */}
                    </span>
                  </button>
                ))}
              </div>
              {error && (
                <div className="flex items-center gap-2 text-rose-500">
                  <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{error}</p>
                </div>
              )}
            </div>

            {/* QUANTITY & ACTIONS */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-white/10 rounded-full px-4 py-2 bg-white/[0.02]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="p-1 hover:text-emerald-400 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="w-12 text-center font-mono font-bold text-lg">{quantity}</span>
                  
                  {/* CHANGE: Added logic to prevent exceeding stock */}
                  <button 
                    onClick={() => setQuantity(prev => prev < product.qty ? prev + 1 : prev)} 
                    className={`p-1 transition-colors ${quantity >= product.qty ? 'text-gray-600 cursor-not-allowed' : 'hover:text-emerald-400'}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  Stock: <span className="text-white">{product.qty || 0} Units</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleAddToCart} className="flex items-center justify-center gap-3 bg-white text-black py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-gray-200 active:scale-95 shadow-xl shadow-white/5">
                  <ShoppingBag size={18} /> Add To Cart
                </button>
                <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-white/10 active:scale-95 group">
                  <Zap size={18} className="text-yellow-500 group-hover:fill-yellow-500" /> Buy Now
                </button>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="flex flex-col items-center gap-2 opacity-40 text-center">
                <Truck size={20} /><span className="text-[9px] uppercase tracking-widest font-bold">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-40 text-center">
                <ShieldCheck size={20} /><span className="text-[9px] uppercase tracking-widest font-bold">Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-40 text-center">
                <CheckCircle2 size={20} /><span className="text-[9px] uppercase tracking-widest font-bold">100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts currentProduct={product} allProducts={products}/>

        {/* REVIEWS SECTION UNCHANGED */}
        <div className="mt-32 border-t border-white/5 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-12">
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Verified Reviews</h2>
                <span className="bg-white/5 px-4 py-1 rounded-full text-xs font-mono text-gray-400">{reviews.length}</span>
              </div>
              <div className="space-y-12">
                {reviews.length > 0 ? reviews.map((r) => (
                  <div key={r.id} className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
                          {r.user?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest">{r.user}</p>
                          <StarRating rating={r.rating} size={12} />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono uppercase">{r.date}</span>
                    </div>
                    <p className="text-gray-500 font-light leading-relaxed pl-14 italic text-sm">"{r.comment}"</p>
                  </div>
                )) : (
                  <p className="text-gray-600 italic">No reviews yet.</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-8 lg:p-12 rounded-[40px] h-fit sticky top-12">
              {token ? (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <MessageSquare className="text-white/40" size={20} />
                    <h3 className="text-xl font-black uppercase tracking-tighter">Post a Review</h3>
                  </div>
                  <form onSubmit={handleAddReview} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Your Rating</label>
                      <StarRating rating={newReview.rating} size={24} interactive={true} />
                    </div>
                    <input
                      type="text"
                      placeholder="NAME"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-white/30 transition-all text-xs font-bold tracking-widest text-white"
                    />
                    <textarea
                      placeholder="SHARE YOUR THOUGHTS..."
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-white/30 transition-all text-sm font-light leading-relaxed text-white"
                    />
                    <button type="submit" className="w-full bg-white text-black py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95">
                      Submit Review
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-8 py-6">
                  <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogIn className="text-white/40" size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter">Sign in to leave a review.</h3>
                  </div>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-3 bg-white text-black py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-gray-200 active:scale-95"
                  >
                    <LogIn size={16} /> Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}