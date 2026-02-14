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
  AlertCircle,
  MapPin,
  User,
  Phone,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShopContext } from '../Context/ShopContext';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  const { cart, token, setCart } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', city: '', area: '', address: '', notes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  const { subtotal, shipping, total } = useMemo(() => {
    const sub = cart?.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + (price * qty);
    }, 0);
    const ship = sub > 0 ? 0 : 0;
    return { subtotal: sub, shipping: ship, total: sub + ship };
  }, [cart]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 11) {
      newErrors.phone = "Enter a valid 11-digit mobile number";
    }
    if (!formData.city) newErrors.city = "Please select a city";
    if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsSubmitting(true);
    try {
      const orderData = {
        userId: token ? token : 'guest',
        customerDetails: { ...formData },
        items: cart.map(item => ({
            id: item.id || 'unknown',
            title: item.title || 'Product',
            price: item.price,
            quantity: item.quantity,
            size: item.selectedSize || 'Standard',
            image: item.images ? item.images[0] : (item.image || ''),
            total: item.price * item.quantity
        })),
        financials: { subtotal, shipping, total },
        paymentMethod: 'cod',
        status: 'Pending',
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-PK')
      };
      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(docRef.id);
      setIsSuccess(true);
      setCart([]);
      localStorage.removeItem('cart');
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
      <div className="min-h-screen bg-[#edf1f5] text-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-28 h-28 bg-white text-[#0145f2] rounded-[2.5rem] shadow-xl shadow-[#0145f2]/10 flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 size={64} strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-[1000] uppercase tracking-tighter mb-4">Ordered!</h1>
        <p className="text-gray-500 max-w-lg font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-8">
          Thank you, <span className="text-[#0145f2]">{formData.fullName}</span>. <br/>
          Order ID: <span className="font-mono text-gray-900">#{orderId?.toUpperCase()}</span>
        </p>
        <Link href="/" className="bg-[#0145f2] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-[#0145f2]/20">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf1f5] text-gray-900 pt-32 pb-20 selection:bg-[#0145f2] selection:text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <Link href="/cart" className="inline-flex items-center gap-3 text-gray-400 hover:text-[#0145f2] transition-all mb-10 text-[10px] font-black uppercase tracking-[0.3em] group">
          <ChevronLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform"/> Review Bag
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-7 space-y-10">
            <section className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
              <h2 className="text-3xl font-[1000] uppercase tracking-tighter mb-10 flex items-center gap-4 text-gray-900">
                <span className="w-10 h-10 rounded-2xl bg-[#0145f2] text-white flex items-center justify-center text-sm font-black">1</span>
                Shipping
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0145f2] ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input name="fullName" value={formData.fullName} onChange={handleInput} placeholder="Ahmed Khan" className={`w-full bg-[#edf1f5] border-2 ${errors.fullName ? 'border-red-400' : 'border-[#edf1f5]'} rounded-2xl p-4 pl-12 text-sm font-bold focus:outline-none focus:border-[#0145f2] transition-all`} />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10}/> {errors.fullName}</p>}
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0145f2] ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input name="phone" value={formData.phone} onChange={handleInput} type="tel" maxLength={11} placeholder="03XXXXXXXXX" className={`w-full bg-[#edf1f5] border-2 ${errors.phone ? 'border-red-400' : 'border-[#edf1f5]'} rounded-2xl p-4 pl-12 text-sm font-bold focus:outline-none focus:border-[#0145f2] transition-all`} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10}/> {errors.phone}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0145f2] ml-1">City</label>
                  <select name="city" value={formData.city} onChange={handleInput} className={`w-full appearance-none bg-[#edf1f5] border-2 ${errors.city ? 'border-red-400' : 'border-[#edf1f5]'} rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#0145f2] cursor-pointer`}>
                    <option value="">Select City</option>
                    {PK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0145f2] ml-1">Email (Optional)</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="For receipt" className="w-full bg-[#edf1f5] border-2 border-[#edf1f5] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#0145f2] transition-all" />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0145f2] ml-1">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInput} rows="3" placeholder="Street, House No, Landmark" className={`w-full bg-[#edf1f5] border-2 ${errors.address ? 'border-red-400' : 'border-[#edf1f5]'} rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#0145f2] resize-none transition-all`} />
                  {errors.address && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10}/> {errors.address}</p>}
                </div>
              </div>
            </section>

            <section className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white">
              <h2 className="text-3xl font-[1000] uppercase tracking-tighter mb-8 flex items-center gap-4 text-gray-900">
                <span className="w-10 h-10 rounded-2xl bg-[#0145f2] text-white flex items-center justify-center text-sm font-black">2</span>
                Payment
              </h2>
              <div className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 bg-[#0145f2]/5 border-[#0145f2]`}>
                <div className="flex items-center gap-5">
                  <div className="w-6 h-6 rounded-full border-4 border-[#0145f2] bg-white" />
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight text-gray-900">Cash on Delivery</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Pay at your doorstep</p>
                  </div>
                </div>
                <Truck size={28} className="text-[#0145f2]" strokeWidth={2.5} />
              </div>
              <p className="text-[9px] text-center text-gray-300 font-black uppercase tracking-[0.3em] mt-6">Online payments disabled for maintenance</p>
            </section>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-white">
              <h2 className="text-2xl font-[1000] uppercase tracking-tighter mb-8 text-gray-900">Summary</h2>
              
              <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#edf1f5] flex-shrink-0 border-2 border-[#edf1f5]">
                      <img src={item.images ? item.images[0] : (item.image || '')} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-[10px] font-black uppercase tracking-tight text-gray-900 line-clamp-1">{item.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                        <p className="font-black text-xs text-[#0145f2]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t-2 border-[#edf1f5]">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-mono">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500 font-mono">Rs. {shipping.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t-2 border-[#edf1f5] flex justify-between items-end">
                  <span className="text-xs uppercase font-[1000] tracking-widest text-gray-900 leading-none">Total</span>
                  <span className="text-4xl font-[1000] text-[#0145f2] tracking-tighter italic leading-none">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#0145f2] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 mt-10 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 shadow-xl shadow-[#0145f2]/20">
                {isSubmitting ? <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : <>Complete Order <Lock size={16} strokeWidth={3}/></>}
              </button>

              <div className="flex items-center justify-center gap-2 opacity-30 text-[8px] font-black uppercase tracking-[0.3em] mt-6 text-gray-900">
                <ShieldCheck size={12} className="text-[#0145f2]" /> Secure SSL Checkout
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}