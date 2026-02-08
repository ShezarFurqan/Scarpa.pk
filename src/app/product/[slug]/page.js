'use client'
import React, { use, useState, useContext, useEffect, useRef } from 'react'
import {
  Star, Plus, Minus, ShoppingBag, Zap,
  CheckCircle2, ShieldCheck, Truck, MessageSquare,
  LogIn, Ruler, Info
} from 'lucide-react'
import Link from 'next/link'
import { ShopContext } from '@/app/Context/ShopContext';
import { db } from '../../firebase';
import {
  collection, addDoc, query, where,
  onSnapshot, serverTimestamp
} from 'firebase/firestore';
import RelatedProducts from '@/app/components/RelatedProducts';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.slug;
  const { products, token, addToCart } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  const imgRef = useRef(null);
  const [zoom, setZoom] = useState({ x: 50, y: 50, show: false });

  const handleMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoom({ x, y, show: true });
  };


  useEffect(() => {
    if (products && productId) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct);
    }
  }, [products, productId]);

  useEffect(() => {
    if (!productId) return;
    const q = query(collection(db, "productReviews"), where("productId", "==", productId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [productId]);

  // HANDLE ZOOM MOVE
  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans">
      <div className="container mx-auto px-6 lg:px-12 mb-32 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">

          {/* IMAGE GALLERY */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-12">

            {/* MAIN IMAGE */}
            <div
              ref={imgRef}
              onMouseMove={handleMove}
              onMouseLeave={() => setZoom({ ...zoom, show: false })}
              className="relative aspect-square rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 cursor-crosshair"
            >

              <img
                src={product.images ? product.images[selectedImage] : '/placeholder.png'}
                alt={product.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${zoom.show ? 'opacity-0' : 'opacity-100'
                  }`}
              />

              {/* ZOOM LAYER */}
              {zoom.show && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${product.images[selectedImage]})`,
                    backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                    backgroundSize: '220%',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              )}

            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border transition-all bg-white/[0.03]
        ${selectedImage === idx
                      ? 'border-white scale-105'
                      : 'border-white/10 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- PRODUCT INFO & ELITE DESCRIPTION --- */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <StarRating rating={product.rating || 5} />
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  {reviews.length} Verified Reviews
                </span>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-4xl font-mono tracking-tighter">${product.price}</span>
                {product.fakePrice && (
                  <span className="text-2xl text-gray-600 line-through font-mono tracking-tighter">
                    ${product.fakePrice}
                  </span>
                )}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                  <Ruler size={14} /> Size Selection
                </label>
                <button className="text-[10px] text-white/40 hover:text-white transition-colors underline underline-offset-4 uppercase font-bold">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setError(""); }}
                    className={`py-4 rounded-2xl border-2 transition-all font-black text-xs ${selectedSize === size ? 'bg-white border-white text-black' : 'bg-transparent border-white/10 text-white hover:border-white/40'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>}
            </div>

            {/* ACTIONS */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-3xl p-2 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors"><Minus size={16} /></button>
                <span className="font-mono font-bold text-lg w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(prev => prev < product.qty ? prev + 1 : prev)} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors"><Plus size={16} /></button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={handleAddToCart} className="bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all flex items-center justify-center gap-3">
                  <ShoppingBag size={18} /> Add To Bag
                </button>
                <button className="bg-white/5 border border-white/10 text-white py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <Zap size={18} className="text-yellow-500" fill="currentColor" /> Quick Buy
                </button>
              </div>
            </div>

            {/* --- ELITE DESCRIPTION ADJUSTMENT --- */}
            <div className="pt-10 border-t border-white/10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-white/20" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Product Story</h3>
              </div>

              <div className="space-y-4">
                <p className="text-xl text-gray-300 font-light leading-snug tracking-tight italic">
                  "{product.description}"
                </p>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 opacity-30 pt-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck size={18} /><span className="text-[8px] uppercase tracking-widest font-black">Express</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck size={18} /><span className="text-[8px] uppercase tracking-widest font-black">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <CheckCircle2 size={18} /><span className="text-[8px] uppercase tracking-widest font-black">Certified</span>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts currentProduct={product} allProducts={products} />

        {/* REVIEWS SECTION */}
        <div className="mt-32 border-t border-white/5 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-12">
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Reviews</h2>
                <span className="bg-white/5 px-4 py-1 rounded-full text-xs font-mono text-gray-400">{reviews.length}</span>
              </div>
              <div className="space-y-12">
                {reviews.length > 0 ? reviews.map((r) => (
                  <div key={r.id} className="space-y-4 border-b border-white/5 pb-8 last:border-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs uppercase">
                          {r.user?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest">{r.user}</p>
                          <StarRating rating={r.rating} size={10} />
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

            <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-8 lg:p-12 rounded-[40px] h-fit">
              {token ? (
                <>
                  <div className="flex items-center gap-3 mb-8 text-white/40">
                    <MessageSquare size={20} />
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Share Experience</h3>
                  </div>
                  <form onSubmit={handleAddReview} className="space-y-6">
                    <StarRating rating={newReview.rating} size={24} interactive={true} />
                    <input
                      type="text"
                      placeholder="YOUR NAME"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold tracking-widest text-white outline-none focus:border-white/30"
                    />
                    <textarea
                      placeholder="THOUGHTS ON THE PRODUCT..."
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-light text-white outline-none focus:border-white/30"
                    />
                    <button type="submit" className="w-full bg-white text-black py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:invert transition-all">
                      Submit
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Login to review</h3>
                  <Link href="/login" className="inline-flex items-center justify-center gap-3 bg-white text-black py-4 px-12 rounded-full font-bold uppercase tracking-widest text-xs transition-all">
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