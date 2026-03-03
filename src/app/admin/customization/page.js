'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { 
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, 
  doc, getDocs, setDoc, getDoc 
} from 'firebase/firestore';
import { 
  Plus, Trash2, Edit3, Save, Search, CheckCircle2, 
  Tag, DollarSign, Layers, Image as ImageIcon, Video, 
  Type, Link as LinkIcon, UploadCloud, RefreshCw, Eye, 
  X, ExternalLink
} from 'lucide-react';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

const uploadToCloudinary = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const resourceType = type === 'video' ? 'video' : 'image';
  
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};

export default function CollectionsManager() {
  const [collections, setCollections] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', selectedProducts: [] });
  const [heroData, setHeroData] = useState({ badge: '', titleLine1: '', titleLine2: '', description: '', btnPrimary: '', btnSecondary: '', image: '' });
  const [storyData, setStoryData] = useState({ sectionTitle: '', sectionDescription: '', videoTitle: '', video: '', collectionLink: '' });
  const [uploading, setUploading] = useState({ hero: false, story: false });

  useEffect(() => {
    const unsubCol = onSnapshot(collection(db, 'Productcollections'), (snap) => {
      setCollections(snap.docs.map(d => ({ id: d.id, ...d.data(), selectedProducts: d.data().selectedProducts || [] })));
      setLoading(false);
    });

    const fetchProds = async () => {
      const pSnap = await getDocs(collection(db, 'products'));
      setAllProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    
    const fetchCMSData = async () => {
      const heroSnap = await getDoc(doc(db, 'heroSection', 'singleton'));
      const storySnap = await getDoc(doc(db, 'storySection', 'singleton'));
      if (heroSnap.exists()) setHeroData(heroSnap.data());
      if (storySnap.exists()) setStoryData(storySnap.data());
    };

    fetchProds();
    fetchCMSData();
    return () => unsubCol();
  }, []);

  const handleSelectProduct = (product) => {
    const exists = formData.selectedProducts.find(p => p.id === product.id);
    setFormData({
      ...formData,
      selectedProducts: exists 
        ? formData.selectedProducts.filter(p => p.id !== product.id)
        : [...formData.selectedProducts, product]
    });
  };

  const saveCollection = async () => {
    if (!formData.title) return alert("Title is required");
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'Productcollections', isEditing), formData);
        setIsEditing(null);
      } else {
        await addDoc(collection(db, 'Productcollections'), { ...formData, createdAt: new Date() });
      }
      setFormData({ title: '', description: '', selectedProducts: [] });
    } catch (e) { console.error(e); }
  };

  const handleCMSUpdate = async (type) => {
    const target = type === 'hero' ? 'heroSection' : 'storySection';
    const data = type === 'hero' ? heroData : storyData;
    setUploading(prev => ({ ...prev, [type]: true }));
    try {
      await setDoc(doc(db, target, 'singleton'), { ...data, updatedAt: new Date() });
      alert(`${type.toUpperCase()} Section Updated!`);
    } catch (e) { console.error(e); }
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  const handleFileUpload = async (e, type, target) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(prev => ({ ...prev, [target]: true }));
    const url = await uploadToCloudinary(file, type);
    if (target === 'hero') setHeroData(prev => ({ ...prev, image: url }));
    else setStoryData(prev => ({ ...prev, video: url }));
    setUploading(prev => ({ ...prev, [target]: false }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Store Customization</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage collections, visuals, and brand storytelling.</p>
        </div>
      </div>

      {/* 1. COLLECTIONS MANAGER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-5 bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              {isEditing ? <Edit3 size={18} className="text-indigo-400"/> : <Plus size={18} className="text-indigo-400"/>}
              {isEditing ? 'Edit Collection' : 'Create Collection'}
            </h2>
            {isEditing && (
              <button onClick={() => { setIsEditing(null); setFormData({title:'', description:'', selectedProducts:[]})}} 
                className="text-xs text-zinc-500 hover:text-white transition-colors">Cancel</button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Title</label>
              <input className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Winter Essentials" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Description</label>
              <textarea className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm h-24 focus:border-indigo-500 outline-none resize-none"
                placeholder="Tell the story of this collection..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Products ({formData.selectedProducts.length})</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                  <input className="bg-zinc-900 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs focus:border-indigo-500 outline-none w-40"
                    placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/5 scrollbar-hide">
                {allProducts.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase())).map(product => {
                  const isSelected = formData.selectedProducts.some(p => p.id === product.id);
                  return (
                    <div key={product.id} onClick={() => handleSelectProduct(product)}
                      className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 hover:bg-white/5'}`}>
                      <img src={product.images?.[0] || product.image} className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{product.title}</p>
                        <p className="text-[10px] text-zinc-500">Rs {product.price}</p>
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="text-indigo-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={saveCollection} className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2">
              <Save size={16}/> {isEditing ? 'Update Collection' : 'Publish Collection'}
            </button>
          </div>
        </div>

        {/* List Side */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Layers size={16}/>
            <span className="text-xs font-medium uppercase tracking-widest">Active Collections ({collections.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map(col => (
              <div key={col.id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 group hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="max-w-[70%]">
                    <h3 className="text-sm font-bold text-white truncate">{col.title}</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5 italic">{col.description}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setIsEditing(col.id); setFormData(col); }} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400"><Edit3 size={14}/></button>
                    <button onClick={async () => { if(confirm("Delete?")) await deleteDoc(doc(db, 'Productcollections', col.id)); }} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  <div className="flex -space-x-2">
                    {col.selectedProducts.slice(0, 4).map((p, i) => (
                      <div key={i} className="h-7 w-7 rounded-full border border-zinc-900 bg-zinc-800 overflow-hidden ring-2 ring-zinc-950">
                        <img className="w-full h-full object-cover" src={p.images?.[0] || p.image} alt="" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md uppercase">{col.selectedProducts.length} Items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HERO SECTION CMS */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Hero Section Configuration</h2>
            <p className="text-xs text-zinc-500">Update your landing page's main visual impact.</p>
          </div>
          <button onClick={() => handleCMSUpdate('hero')} disabled={uploading.hero} 
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white disabled:opacity-50 transition-all flex items-center gap-2">
            {uploading.hero ? <RefreshCw className="animate-spin" size={14}/> : <Save size={14}/>} Update Landing
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Floating Badge</label>
                <input className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" 
                  value={heroData.badge} onChange={e => setHeroData({...heroData, badge: e.target.value})} placeholder="e.g. SUMMER 2024" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Hero Asset</label>
                <div className="relative group bg-zinc-900 border border-dashed border-white/10 hover:border-indigo-500 rounded-xl px-4 py-3 transition-all cursor-pointer">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'image', 'hero')} />
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{uploading.hero ? "Uploading..." : "Click to Swap"}</span>
                    <UploadCloud size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" 
                  placeholder="Main Title Line" value={heroData.titleLine1} onChange={e => setHeroData({...heroData, titleLine1: e.target.value})} />
                <input className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-indigo-400 italic" 
                  placeholder="Secondary Italic" value={heroData.titleLine2} onChange={e => setHeroData({...heroData, titleLine2: e.target.value})} />
              </div>
              <textarea className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm h-24 outline-none focus:border-indigo-500 resize-none" 
                placeholder="Description text..." value={heroData.description} onChange={e => setHeroData({...heroData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300" placeholder="Primary Button Label"
                  value={heroData.btnPrimary} onChange={e => setHeroData({...heroData, btnPrimary: e.target.value})} />
                <input className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300" placeholder="Secondary Button Label"
                  value={heroData.btnSecondary} onChange={e => setHeroData({...heroData, btnSecondary: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Preview Mockup */}
          <div className="bg-zinc-950 rounded-2xl border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden group min-h-[350px]">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Live Mockup</span>
            </div>
            {heroData.image && <img src={heroData.image} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md scale-110" alt="" />}
            
            <div className="relative z-10 text-center space-y-4 max-w-sm">
              <span className="text-[9px] font-bold bg-white text-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em]">{heroData.badge || 'BADGE'}</span>
              <h1 className="text-3xl font-extrabold text-white uppercase leading-none tracking-tighter">
                {heroData.titleLine1 || 'Your Brand'} <br/>
                <span className="text-indigo-500 italic lowercase">{heroData.titleLine2 || 'Style'}</span>
              </h1>
              <p className="text-[11px] text-zinc-400 line-clamp-2">{heroData.description || 'Describe your aesthetic...'}</p>
              <div className="flex gap-3 justify-center pt-2">
                <div className="px-5 py-2 bg-indigo-600 rounded-full text-[9px] font-bold uppercase text-white shadow-lg shadow-indigo-600/20">{heroData.btnPrimary || 'Shop'}</div>
                <div className="px-5 py-2 border border-white/20 rounded-full text-[9px] font-bold uppercase text-white hover:bg-white hover:text-black transition-all">Details</div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}