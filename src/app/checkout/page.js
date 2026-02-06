'use client';
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { 
  Lock, 
  Truck, 
  ChevronLeft, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Wallet,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShopContext } from '../Context/ShopContext';
import { db } from '../firebase'; // Adjust path if needed
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// PAKISTANI CITIES LIST
const PK_CITIES = [
  "Abbottabad","Ahmedpur East","Aliabad","Attock","Bahawalnagar","Bahawalpur","Bannu",
  "Bhawalnagar","Burewala","Chakwal","Charsadda","Chiniot","Dera Ghazi Khan","Dera Ismail Khan",
  "Faisalabad","Ghotki","Gujranwala","Gujrat","Haripur","Hasilpur","Hyderabad","Jacobabad",
  "Jhang","Jhelum","Karachi","Kasur","Khanewal","Khushab","Kohat","Kot Adu","Lahore",
  "Larkana","Mandi Bahauddin","Malakand","Mianwali","Mardan","Mirpur Khas","Multan","Muzaffargarh",
  "Nawabshah","Nowshera","Okara","Pakpattan","Peshawar","Quetta","Rahim Yar Khan","Rawalpindi",
  "Sadiqabad","Sahiwal","Sargodha","Sheikhupura","Sialkot","Sukkur","Swabi","Tando Adam",
  "Tando Allahyar","Vehari","Wah Cantt"
];


export default function CheckoutPage() {
  const router = useRouter();
  
  // --- CONTEXT DATA ---
  const { cart, token, setCart } = useContext(ShopContext);

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    fullName: '', 
    phone: '', 
    email: '', 
    city: '', 
    area: '', 
    address: '', 
    notes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  // --- REAL-TIME CALCULATIONS ---
  const { subtotal, shipping, total } = useMemo(() => {
    // Calculate subtotal dynamically from cart items
    const sub = cart?.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + (price * qty);
    }, 0);

    const ship = sub > 0 ? 250 : 0; // Standard shipping, 0 if cart empty
    return { subtotal: sub, shipping: ship, total: sub + ship };
  }, [cart]);

  // --- REDIRECT IF CART EMPTY ---
  useEffect(() => {
    if (!isSuccess && cart.length === 0) {
      // Optional: Redirect to shop if cart is empty and not in success state
      // router.push('/collection'); 
    }
  }, [cart, isSuccess, router]);

  // --- HANDLERS ---
  const handleInput = (e) => {
    const { name, value } = e.target;
    
    // Specific integer-only check for phone
    if (name === 'phone' && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    
    // PK Phone Validation (11 digits, usually starts with 03)
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 11) {
      newErrors.phone = "Enter a valid 11-digit mobile number (e.g. 03001234567)";
    }

    if (!formData.city) newErrors.city = "Please select a city";
    if (!formData.address.trim()) newErrors.address = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to error if validation fails
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare Order Data
      const orderData = {
        userId: token ? token : 'guest', // Store user ID if logged in
        customerDetails: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            city: formData.city,
            area: formData.area,
            address: formData.address,
            notes: formData.notes
        },
        items: cart.map(item => ({
            id: item.id || 'unknown',
            title: item.title || 'Product',
            price: item.price,
            quantity: item.quantity,
            size: item.selectedSize || 'Standard', // Assuming size is in item
            image: item.images ? item.images[0] : (item.image || ''),
            total: item.price * item.quantity
        })),
        financials: {
            subtotal,
            shipping,
            total
        },
        paymentMethod: 'cod', // Hardcoded as it's the only active one
        status: 'Pending',
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-PK')
      };

      // 2. Send to Firestore
      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(docRef.id);

      // 3. Success Actions
      setIsSuccess(true);
      setCart(); // Clear Context
      localStorage.removeItem('cart'); // Double safety clearing local storage
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS VIEW ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={56} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Order Confirmed!</h1>
        <p className="text-gray-400 max-w-lg font-light leading-relaxed mb-8 text-sm md:text-base">
          Thank you, <span className="text-white font-bold">{formData.fullName}</span>. Your order has been successfully placed. <br/>
          Order ID: <span className="font-mono text-emerald-400">#{orderId?.slice(0, 8).toUpperCase()}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/10">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // --- EMPTY CART VIEW ---
  if (cart.length === 0 && !isSuccess) {
    return (
       <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
          <AlertCircle size={48} className="text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Your Cart is Empty</h2>
          <Link href="/" className="text-sm underline underline-offset-4 text-gray-400 hover:text-white transition-colors">
            Go back to shopping
          </Link>
       </div>
    );
  }

  return (
    <div className="min-h-screen mb-28 bg-[#050505] text-white pt-24 pb-12 selection:bg-white selection:text-black">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Breadcrumb */}
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-[0.2em] group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Bag
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT COLUMN: SHIPPING DETAILS --- */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Delivery Section */}
            <section className="animate-in slide-in-from-left-4 duration-500">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">1</span>
                Delivery Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name *</label>
                  <input 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInput} 
                    placeholder="e.g. Ahmed Khan" 
                    className={`w-full bg-white/[0.03] border ${errors.fullName ? 'border-rose-500' : 'border-white/10'} rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700`} 
                  />
                  {errors.fullName && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1"><AlertCircle size={10}/> {errors.fullName}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Mobile Number (11 Digits) *</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInput} 
                    type="tel"
                    maxLength={11}
                    placeholder="03XXXXXXXXX" 
                    className={`w-full bg-white/[0.03] border ${errors.phone ? 'border-rose-500' : 'border-white/10'} rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700`} 
                  />
                  {errors.phone && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1"><AlertCircle size={10}/> {errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">City *</label>
                  <div className="relative">
                    <select 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInput} 
                      className={`w-full appearance-none bg-[#0D0D0D] border ${errors.city ? 'border-rose-500' : 'border-white/10'} rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all cursor-pointer`}
                    >
                      <option value="">Select City</option>
                      {PK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  {errors.city && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1"><AlertCircle size={10}/> {errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email (Optional)</label>
                  <input 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInput} 
                    placeholder="For order receipt" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700" 
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Complete Address *</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInput} 
                    rows="3" 
                    placeholder="House number, Street, Near landmark..." 
                    className={`w-full bg-white/[0.03] border ${errors.address ? 'border-rose-500' : 'border-white/10'} rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700 resize-none`} 
                  />
                  {errors.address && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1"><AlertCircle size={10}/> {errors.address}</p>}
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="animate-in slide-in-from-left-4 duration-500 delay-100">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {/* COD - Active */}
                <label className={`group flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-white/5 border-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/10'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-white' : 'border-gray-600'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-tight">Cash on Delivery</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Pay comfortably at your doorstep</p>
                    </div>
                  </div>
                  <Truck size={24} className="text-white" />
                </label>

                {/* JazzCash / EasyPaisa - Disabled */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 grayscale pointer-events-none select-none relative">
                  
                  {/* Overlay for Coming Soon */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {/* <span className="bg-black/80 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/20 rounded-full">Temporarily Unavailable</span> */}
                  </div>

                  <label className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border border-gray-700"></div>
                      <p className="font-bold text-sm uppercase tracking-tight text-gray-500">JazzCash</p>
                    </div>
                    <Smartphone size={20} className="text-gray-700" />
                  </label>
                  <label className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border border-gray-700"></div>
                      <p className="font-bold text-sm uppercase tracking-tight text-gray-500">EasyPaisa</p>
                    </div>
                    <Wallet size={20} className="text-gray-700" />
                  </label>
                </div>
                
                <p className="text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest mt-2">
                    Online payments are currently under maintenance.
                </p>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-6 lg:p-8 space-y-8 backdrop-blur-xl">
                <h2 className="text-xl font-black uppercase tracking-tight">Order Summary</h2>
                
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item, index) => {
                        const itemPrice = Number(item.price);
                        const itemQty = Number(item.quantity);
                        const itemTotal = itemPrice * itemQty;
                        
                        return (
                            <div key={`${item.id}-${index}`} className="flex gap-4 group">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/5">
                                    <img 
                                        src={item.images ? item.images[0] : (item.image || '/placeholder.png')} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-xs font-bold uppercase tracking-tight line-clamp-1 text-white">{item.title}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            {item.selectedSize ? `Size: ${item.selectedSize} | ` : ''} Qty: {itemQty}
                                        </p>
                                        <p className="font-mono text-xs text-gray-300">Rs. {itemTotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5 font-medium">
                    <div className="flex justify-between text-gray-400 text-xs uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-white font-mono">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs uppercase tracking-widest">
                        <span>Shipping</span>
                        <span className="text-emerald-400 font-mono">{shipping === 0 ? "FREE" : `Rs. ${shipping.toLocaleString()}`}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                        <span className="text-sm uppercase font-black tracking-widest">Total Payable</span>
                        <span className="text-3xl font-mono font-black text-white tracking-tighter">Rs. {total.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                    {isSubmitting ? (
                        <>Processing <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div></>
                    ) : (
                        <>Complete Order <Lock size={14}/></>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 opacity-30 text-[9px] font-bold uppercase tracking-[0.2em]">
                    <CreditCard size={12} /> SSL Encrypted Transaction
                </div>
                </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}