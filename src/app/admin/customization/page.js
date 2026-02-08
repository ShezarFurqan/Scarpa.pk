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
  Type, Link as LinkIcon, UploadCloud, RefreshCw, Eye
} from 'lucide-react';

// --- CLOUDINARY CONFIG ---
const CLOUDINARY_UPLOAD_PRESET = 'your_unsigned_preset'; // Replace with your preset
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'; // Replace with your cloud name

/**
 * HELPER: Upload to Cloudinary
 * Handles both images and videos
 */
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
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

export default function CollectionsManager() {
  // Existing States
  const [collections, setCollections] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedProducts: []
  });

  // --- NEW CMS STATES ---
  const [heroData, setHeroData] = useState({
    badge: '',
    titleLine1: '',
    titleLine2: '',
    description: '',
    btnPrimary: '',
    btnSecondary: '',
    image: ''
  });
  const [storyData, setStoryData] = useState({
    sectionTitle: '',
    sectionDescription: '',
    videoTitle: '',
    video: '',
    collectionLink: ''
  });
  const [uploading, setUploading] = useState({ hero: false, story: false });

  useEffect(() => {
    // Existing Collection Snapshot
    const unsubCol = onSnapshot(collection(db, 'Productcollections'), (snap) => {
      setCollections(snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        selectedProducts: d.data().selectedProducts || [] 
      })));
      setLoading(false);
    });

    // Fetch Products
    const fetchProds = async () => {
      const pSnap = await getDocs(collection(collection(db, 'products')));
      setAllProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    
    // Fetch Singleton CMS Docs
    const fetchCMSData = async () => {
      const heroRef = doc(db, 'heroSection', 'singleton');
      const storyRef = doc(db, 'storySection', 'singleton');
      
      const heroSnap = await getDoc(heroRef);
      const storySnap = await getDoc(storyRef);

      if (heroSnap.exists()) setHeroData(heroSnap.data());
      if (storySnap.exists()) setStoryData(storySnap.data());
    };

    fetchProds();
    fetchCMSData();

    return () => unsubCol();
  }, []);

  // --- EXISTING LOGIC ---
  const filteredProducts = allProducts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (product) => {
    const exists = formData.selectedProducts.find(p => p.id === product.id);
    if (exists) {
      setFormData({ ...formData, selectedProducts: formData.selectedProducts.filter(p => p.id !== product.id) });
    } else {
      setFormData({ ...formData, selectedProducts: [...formData.selectedProducts, product] });
    }
  };

  const saveCollection = async () => {
    if (!formData.title) return alert("Please add a title");
    if (isEditing) {
      await updateDoc(doc(db, 'Productcollections', isEditing), formData);
      setIsEditing(null);
    } else {
      await addDoc(collection(db, 'Productcollections'), { ...formData, createdAt: new Date() });
    }
    setFormData({ title: '', description: '', selectedProducts: [] });
  };

  const deleteCollection = async (id) => {
    if(confirm("Delete this collection?")) await deleteDoc(doc(db, 'Productcollections', id));
  };

  // --- NEW CMS LOGIC ---

  const handleHeroSave = async () => {
    setUploading({ ...uploading, hero: true });
    try {
      await setDoc(doc(db, 'heroSection', 'singleton'), {
        ...heroData,
        updatedAt: new Date()
      });
      alert("Hero Section Updated!");
    } catch (e) { console.error(e); }
    setUploading({ ...uploading, hero: false });
  };

  const handleStorySave = async () => {
    setUploading({ ...uploading, story: true });
    try {
      await setDoc(doc(db, 'storySection', 'singleton'), {
        ...storyData,
        updatedAt: new Date()
      });
      alert("Story Section Updated!");
    } catch (e) { console.error(e); }
    setUploading({ ...uploading, story: false });
  };

  const handleFileUpload = async (e, type, target) => {
    const file = e.target.files[0];
    if (!file) return;

    if (target === 'hero') setUploading({ ...uploading, hero: true });
    else setUploading({ ...uploading, story: true });

    const url = await uploadToCloudinary(file, type);
    
    if (target === 'hero') {
      setHeroData({ ...heroData, image: url });
      setUploading({ ...uploading, hero: false });
    } else {
      setStoryData({ ...storyData, video: url });
      setUploading({ ...uploading, story: false });
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-gray-300 p-8 space-y-12">
      
      {/* 1. EXISTING COLLECTIONS MANAGER */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/5 space-y-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] sticky top-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2 italic uppercase">
                {isEditing ? <Edit3 className="text-indigo-500" size={20}/> : <Plus className="text-indigo-500" size={20}/>} 
                {isEditing ? 'Update_Collection' : 'New_Collection'}
              </h2>
              {isEditing && (
                <button onClick={() => {
                  setIsEditing(null);
                  setFormData({ title: '', description: '', selectedProducts: [] });
                }} className="text-[10px] bg-white/5 px-3 py-1 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all">CANCEL</button>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-2 tracking-widest">Collection Info</label>
                <input 
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                  placeholder="Collection Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <textarea 
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none h-20 resize-none text-white"
                  placeholder="Description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-gray-600 ml-2 tracking-widest">Select Products ({formData.selectedProducts.length})</label>
                  <div className="relative w-1/2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={12} />
                    <input 
                      type="text"
                      placeholder="Search..."
                      className="w-full bg-white/5 border border-white/5 rounded-full py-1.5 pl-8 pr-4 text-[10px] focus:border-indigo-500 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto p-3 bg-black rounded-[2rem] border border-white/5 custom-scrollbar">
                  {filteredProducts.map(product => {
                    const isSelected = formData.selectedProducts.some(p => p.id === product.id);
                    return (
                      <div 
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className={`flex items-center gap-3 p-2 rounded-2xl border transition-all cursor-pointer group ${isSelected ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/20'}`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/5">
                          <img src={product.images?.[0] || product.image} className="w-full h-full object-cover" />
                          {isSelected && <div className="absolute inset-0 bg-indigo-500/40 flex items-center justify-center"><CheckCircle2 size={16} className="text-white"/></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">{product.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] text-gray-500 flex items-center gap-0.5"><DollarSign size={8}/> {product.price}</span>
                            <span className="text-[9px] text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-bold uppercase tracking-tighter"><Tag size={8}/> {product.category}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button 
                onClick={saveCollection}
                className="w-full bg-white text-black font-black py-5 rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
              >
                <Save size={14} className="inline mr-2" /> Push To Database
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6">
           <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-2"><Layers size={14}/> Active_Collections [{collections.length}]</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[85vh] pr-4 custom-scrollbar">
              {collections.map(col => (
                <div key={col.id} className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-7 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tighter uppercase">{col.title}</h4>
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-1 italic">{col.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setIsEditing(col.id); setFormData(col); }} className="p-2.5 bg-white/5 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"><Edit3 size={14}/></button>
                      <button onClick={() => deleteCollection(col.id)} className="p-2.5 bg-white/5 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-5 border-y border-white/[0.03] my-4 relative z-10">
                     <div className="flex -space-x-3 overflow-hidden">
                        {(col.selectedProducts || []).slice(0, 5).map((p, i) => (
                          <div key={i} className="h-9 w-9 rounded-xl ring-4 ring-[#0A0A0A] overflow-hidden border border-white/10">
                            <img className="w-full h-full object-cover" src={p.images?.[0] || p.image} alt="" />
                          </div>
                        ))}
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">{col.selectedProducts?.length || 0} Assets</span>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <hr className="border-white/5" />

      {/* 2. HERO SECTION CMS */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 shadow-3xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Hero_Section_CMS</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1">Single source of truth for the landing hero</p>
          </div>
          <button 
            disabled={uploading.hero}
            onClick={handleHeroSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {uploading.hero ? <RefreshCw className="animate-spin" size={14}/> : <Save size={14}/>}
            Save Hero Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-indigo-400 ml-2 tracking-widest flex items-center gap-1"><Tag size={10}/> Badge</label>
                <input 
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white"
                  value={heroData.badge}
                  onChange={(e) => setHeroData({...heroData, badge: e.target.value})}
                  placeholder="New Season 2024"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-indigo-400 ml-2 tracking-widest flex items-center gap-1"><ImageIcon size={10}/> Hero Asset</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, 'image', 'hero')}
                  />
                  <div className="bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-gray-500 flex items-center justify-between group-hover:border-indigo-500 transition-all">
                    <span>{uploading.hero ? "Uploading..." : "Click to Upload"}</span>
                    <UploadCloud size={16}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-indigo-400 ml-2 tracking-widest flex items-center gap-1"><Type size={10}/> Title Line 1</label>
                <input 
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white"
                  value={heroData.titleLine1}
                  onChange={(e) => setHeroData({...heroData, titleLine1: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-indigo-400 ml-2 tracking-widest flex items-center gap-1"><Type size={10}/> Title Line 2</label>
                <input 
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none text-white"
                  value={heroData.titleLine2}
                  onChange={(e) => setHeroData({...heroData, titleLine2: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-indigo-400 ml-2 tracking-widest flex items-center gap-1"><Type size={10}/> Description</label>
              <textarea 
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none h-24 resize-none text-white"
                value={heroData.description}
                onChange={(e) => setHeroData({...heroData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input 
                className="bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white"
                placeholder="Primary Button Label"
                value={heroData.btnPrimary}
                onChange={(e) => setHeroData({...heroData, btnPrimary: e.target.value})}
              />
              <input 
                className="bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-white"
                placeholder="Secondary Button Label"
                value={heroData.btnSecondary}
                onChange={(e) => setHeroData({...heroData, btnSecondary: e.target.value})}
              />
            </div>
          </div>

          {/* Preview Area */}
          <div className="bg-black rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-widest">
              <Eye size={12}/> Live_Preview
            </div>
            {heroData.image && <img src={heroData.image} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" alt="" />}
            
            <div className="relative z-10 max-w-sm space-y-4">
              <span className="text-[10px] font-black bg-white text-black px-3 py-1 rounded-full uppercase tracking-widest">{heroData.badge || 'Badge'}</span>
              <h1 className="text-4xl font-black text-white uppercase leading-none">
                {heroData.titleLine1 || 'Headline'} <br/>
                <span className="text-indigo-500 italic">{heroData.titleLine2 || 'Subheader'}</span>
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">{heroData.description || 'Description goes here...'}</p>
              <div className="flex gap-4 justify-center pt-4">
                <div className="px-6 py-2 bg-indigo-500 text-white rounded-full text-[9px] font-black uppercase">{heroData.btnPrimary || 'Action'}</div>
                <div className="px-6 py-2 border border-white/20 text-white rounded-full text-[9px] font-black uppercase">{heroData.btnSecondary || 'Action'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STORY / VIDEO CMS */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 shadow-3xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Story_Section_CMS</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1">Configure the cinematic video spotlight</p>
          </div>
          <button 
            disabled={uploading.story}
            onClick={handleStorySave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {uploading.story ? <RefreshCw className="animate-spin" size={14}/> : <Save size={14}/>}
            Save Story Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-emerald-400 ml-2 tracking-widest flex items-center gap-1"><Type size={10}/> Section Title</label>
              <input 
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 outline-none text-white"
                value={storyData.sectionTitle}
                onChange={(e) => setStoryData({...storyData, sectionTitle: e.target.value})}
                placeholder="The Brand Story"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-emerald-400 ml-2 tracking-widest flex items-center gap-1"><Type size={10}/> Section Description</label>
              <textarea 
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 outline-none h-20 resize-none text-white"
                value={storyData.sectionDescription}
                onChange={(e) => setStoryData({...storyData, sectionDescription: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-emerald-400 ml-2 tracking-widest flex items-center gap-1"><Type size={10}/> Video Overlay Title</label>
                <input 
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 outline-none text-white"
                  value={storyData.videoTitle}
                  onChange={(e) => setStoryData({...storyData, videoTitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-emerald-400 ml-2 tracking-widest flex items-center gap-1"><Video size={10}/> Cinematic Video</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="video/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, 'video', 'story')}
                  />
                  <div className="bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm text-gray-500 flex items-center justify-between group-hover:border-emerald-500 transition-all">
                    <span>{uploading.story ? "Processing..." : "Upload .mp4"}</span>
                    <UploadCloud size={16}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-emerald-400 ml-2 tracking-widest flex items-center gap-1"><LinkIcon size={10}/> Collection Route</label>
              <input 
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500 outline-none text-white"
                value={storyData.collectionLink}
                onChange={(e) => setStoryData({...storyData, collectionLink: e.target.value})}
                placeholder="/collections/winter-24"
              />
            </div>
          </div>

          {/* Video Preview Area */}
          <div className="bg-black rounded-[2.5rem] border border-white/5 p-4 flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-4 ml-4 mt-2">
              <Eye size={12}/> Video_Broadcast_Preview
            </div>
            
            <div className="relative flex-1 rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 aspect-video lg:aspect-auto">
              {storyData.video ? (
                <video 
                  src={storyData.video} 
                  controls 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-700">
                  <Video size={48} className="mb-2 opacity-20"/>
                  <span className="text-[10px] font-black uppercase tracking-widest">No Media Asset</span>
                </div>
              )}
              
              <div className="absolute bottom-6 left-6 pointer-events-none">
                <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">{storyData.videoTitle || 'TITLE'}</h4>
                <div className="w-12 h-1 bg-emerald-500 mt-1"></div>
              </div>
            </div>

            <div className="mt-4 p-4 flex justify-between items-center border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">{storyData.sectionTitle || 'Headline'}</span>
                <span className="text-[8px] text-gray-600 truncate max-w-[200px]">{storyData.sectionDescription || 'Descr...'}</span>
              </div>
              <div className="bg-white/5 px-4 py-1.5 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                Route: {storyData.collectionLink || 'none'}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}