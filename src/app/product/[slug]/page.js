'use client'
import React, { use, useState, useContext, useEffect, useRef } from 'react'
import {
  Star, Plus, Minus, ShoppingBag, Zap,
  CheckCircle2, ShieldCheck, Truck, MessageSquare,
  LogIn, Ruler, Info, ChevronRight, Phone, User, ThumbsUp, HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { ShopContext } from '@/app/Context/ShopContext';
import { db } from '../../firebase';
import {
  collection, addDoc, query, where,
  onSnapshot, serverTimestamp
} from 'firebase/firestore';
import LoginDrawer from "../../components/login";
import RelatedProducts from '@/app/components/RelatedProducts';
import ProductChat from '@/app/components/ProductChat';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.slug;
  const { cart, products, token, addToCart, router, currency, } = useContext(ShopContext);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
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
      if (foundProduct?.sizes?.length === 1) {
        setSelectedSize(foundProduct.sizes[0]);
      }
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size first");
      return;
    }
    setError("");
    addToCart(product, quantity, selectedSize);
  };

  const handleBuyItNow = () => {
    if (!selectedSize) {
      setError("Please select a size first");
      return;
    }
    setError("");
    addToCart(product, quantity, selectedSize);
    router.push('/checkout'); // Direct checkout page par bhejne ke liye
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  const StarRating = ({ rating, size = 16, interactive = false }) => (
    <div className="flex gap-1 text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
          strokeWidth={1.5}
          className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
          onClick={() => interactive && setNewReview({ ...newReview, rating: i + 1 })}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-gray-200 selection:text-black overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6 py-6 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* --- LEFT: IMAGE GALLERY --- */}
          <div className="lg:col-span-7 flex flex-col items-center lg:sticky lg:top-24 w-full">
            <div className="w-full max-w-full sm:max-w-[95%] lg:max-w-[85%] mx-auto mb-4 md:mb-6">
              <div className="bg-white p-2 md:p-4 rounded-[2.5rem] shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                <div
                  ref={imgRef}
                  onMouseMove={handleMove}
                  onMouseLeave={() => setZoom({ ...zoom, show: false })}
                  className="relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-crosshair bg-[#f8f8f8]"
                >
                  <img
                    src={product.images ? product.images[selectedImage] : '/placeholder.png'}
                    alt={product.title}
                    className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-300 ${zoom.show ? 'opacity-0' : 'opacity-100'}`}
                  />
                  {zoom.show && (
                    <div
                      className="absolute inset-0 pointer-events-none bg-white hidden md:block"
                      style={{
                        backgroundImage: `url(${product.images[selectedImage]})`,
                        backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <LoginDrawer
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
            />

            <div className="flex justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2 w-full px-1 md:px-2">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 
                    ${selectedImage === idx
                      ? 'border-gray-900 scale-95 opacity-100 shadow-md'
                      : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8 pt-2 md:pt-4 w-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                  {product.category == "none" || ""}
                </span>
                {product.bestseller && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-amber-100 flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Bestseller
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-[800] leading-2 tracking-tighter text-gray-900 leading-[0.95] break-words">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 pt-2">
                <span className="text-2xl md:text-3xl font-black text-gray-900">
                  {Number(product.price).toLocaleString()}
                </span>
                {product.fakePrice && (
                  <span className="text-lg text-gray-700 line-through font-bold">
                    {Number(product.fakePrice).toLocaleString()}
                  </span>
                )}
              </div>

              <h1 className=' items-center font-bold' >Condition: {product.condition}</h1>


              <div className="flex items-center gap-2">
                <StarRating rating={product.rating || 5} size={14} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {reviews.length} Feedbacks
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-gray-900">Select Size</span>
                <button onClick={() => router.push("/sizeguide")} className="text-[10px] font-bold text-gray-400 underline underline-offset-4 hover:text-black">
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setError(""); }}
                    className={`
                      py-3 md:py-4 rounded-xl text-sm font-black transition-all duration-200 border-2
                      ${selectedSize === size
                        ? 'bg-black text-white border-black shadow-lg scale-95'
                        : 'bg-white text-black border-gray-100 hover:border-black'}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {error && (
                <div className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-bounce">
                  <Info size={12} /> {error}
                </div>
              )}
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="space-y-3 pt-2 w-full">
              <div className="flex flex-row gap-2 sm:gap-3 w-full">
                {/* Quantity */}
                <div className="flex items-center bg-white rounded-2xl border border-gray-100 w-[100px] sm:w-32 flex-shrink-0 justify-between p-1 shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                    <Minus size={14} />
                  </button>
                  <span className="font-black text-xs sm:text-sm text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(prev => prev < product.qty ? prev + 1 : prev)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-black h-[48px] sm:h-14 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 active:scale-95"
              >
                  <ShoppingBag size={16} className="flex-shrink-0" /> 
                  <span className="whitespace-nowrap">Add To Bag</span>

              </button>

              {/* Buy It Now */}
              <button
                onClick={handleBuyItNow}
                className="w-full bg-black text-white h-[48px] sm:h-14 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 active:scale-95"
              >
                <Zap size={16} fill="currentColor" className="flex-shrink-0" /> Buy It Now
              </button>

              {/* Ask Anything Option */}
              <button
                onClick={() => setOpen(true)}
                className="w-full py-2 sm:py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors group"
              >
                <HelpCircle size={16} className="group-hover:rotate-12 transition-transform" />
                Have a question? <span className="underline underline-offset-2">Ask Anything</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 py-6 border-t border-gray-100">
              {[{ i: Truck, t: "Fast Ship" }, { i: ShieldCheck, t: "Secure" }, { i: CheckCircle2, t: "Original" }].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 text-center">
                  <item.i size={18} className="text-gray-900" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">{item.t}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 border-b border-black pb-1 inline-block">Description</h3>
              <p className="text-sm text-center text-gray-500 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20 md:mt-32 w-full">
          <RelatedProducts currentProduct={product} allProducts={products} />
        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="mt-24 border-t border-gray-100 pt-12 md:pt-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 md:mb-8">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 italic break-words">
                  Feedback
                </h2>
                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">{reviews.length} Verified Reviews</span>
              </div>

              <div className="space-y-6">
                {reviews.length > 0 ? reviews.map((r) => (
                  <div key={r.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-50 shadow-sm w-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-bold text-white text-xs uppercase flex-shrink-0">
                          {r.user?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 break-words">{r.user}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(r.rating)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-black" />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest flex-shrink-0">{r.date}</span>
                    </div>
                    <p className="text-gray-600 leading-tight italic font-medium text-base md:text-lg break-words">"{r.comment}"</p>
                  </div>
                )) : (
                  <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-200 w-full">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No feedback yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-50 sticky top-24">
                {token ? (
                  <div className="space-y-6">
                    <div className="mb-4">
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900 leading-none">Drop a Review</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Verified Purchase Only</p>
                    </div>

                    <form onSubmit={handleAddReview} className="space-y-5 w-full">
                      <div className="flex justify-center bg-gray-50 py-6 rounded-2xl border border-gray-100">
                        <StarRating rating={newReview.rating} size={28} interactive={true} />
                      </div>

                      <input
                        type="text"
                        placeholder="YOUR NAME"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black/5 transition-all"
                      />

                      <textarea
                        placeholder="WHAT DID YOU THINK?"
                        rows={4}
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-xs font-bold outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                      />

                      <button type="submit" className="w-full bg-black text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-black/10">
                        Submit Feedback
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Login to Review</h3>
                    <button onClick={() => {
                      if (token) {
                        router.push("/profile");
                      } else {
                        setIsLoginOpen(true);
                      }
                    }} className="inline-flex items-center justify-center bg-black text-white py-4 px-8 rounded-full font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">
                      Login <ChevronRight size={14} className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductChat product={product} open={open} setOpen={setOpen} />
    </div>
  )
}