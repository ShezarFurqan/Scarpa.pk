'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { 
  Plus, Trash2, Edit3, Save, Search, X, CheckCircle2, 
  LayoutGrid, Sliders, Info, Tag, DollarSign , Layers
} from 'lucide-react';

export default function CollectionsManager() {
  const [collections, setCollections] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gridSettings: { columns: 4, gap: '20px' },
    selectedProducts: []
  });

  useEffect(() => {
    const unsubCol = onSnapshot(collection(db, 'Productcollections'), (snap) => {
      setCollections(snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        products: d.data().products || [] // Safety fallback
      })));
      setLoading(false);
    });

    const fetchProds = async () => {
      const pSnap = await getDocs(collection(db, 'products'));
      setAllProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchProds();

    return () => unsubCol();
  }, []);

  // Filtered products based on search
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
    setFormData({ title: '', description: '', gridSettings: { columns: 4, gap: '20px' }, selectedProducts: [] });
  };

  const deleteCollection = async (id) => {
    if(confirm("Delete this collection?")) await deleteDoc(doc(db, 'Productcollections', id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 bg-[#050505] min-h-screen text-gray-300">
      
      {/* LEFT: MANAGEMENT FORM */}
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
                setFormData({ title: '', description: '', gridSettings: { columns: 4, gap: '20px' }, selectedProducts: [] });
              }} className="text-[10px] bg-white/5 px-3 py-1 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all">CANCEL</button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-600 ml-2 tracking-widest">Collection Info</label>
              <input 
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all"
                placeholder="Collection Title (e.g. Winter Essentials)"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none h-20 resize-none"
                placeholder="Description of this group..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                <label className="text-[9px] font-black uppercase text-indigo-500 mb-2 block tracking-tighter flex items-center gap-1"><LayoutGrid size={10}/> Grid Columns</label>
                <select 
                  className="w-full bg-transparent text-xs font-bold outline-none cursor-pointer"
                  value={formData.gridSettings.columns}
                  onChange={(e) => setFormData({...formData, gridSettings: {...formData.gridSettings, columns: Number(e.target.value)}})}
                >
                  {[2,3,4,5,6].map(n => <option key={n} value={n} className="bg-black">{n} Columns Layout</option>)}
                </select>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                <label className="text-[9px] font-black uppercase text-indigo-500 mb-2 block tracking-tighter flex items-center gap-1"><Sliders size={10}/> Spacing (Gap)</label>
                <input 
                  className="w-full bg-transparent text-xs font-bold outline-none"
                  value={formData.gridSettings.gap}
                  onChange={(e) => setFormData({...formData, gridSettings: {...formData.gridSettings, gap: e.target.value}})}
                />
              </div>
            </div>

            {/* PRODUCT SELECTOR WITH SEARCH */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-2 tracking-widest">Select Products ({formData.selectedProducts.length})</label>
                <div className="relative w-1/2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={12} />
                  <input 
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-white/5 border border-white/5 rounded-full py-1.5 pl-8 pr-4 text-[10px] focus:border-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto p-3 bg-black rounded-[2rem] border border-white/5 custom-scrollbar">
                {filteredProducts.map(product => {
                  const isSelected = formData.selectedProducts.some(p => p.id === product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`flex items-center gap-3 p-2 rounded-2xl border transition-all cursor-pointer group ${isSelected ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img src={product.images?.[0] || product.image} className="w-full h-full object-cover" />
                        {isSelected && <div className="absolute inset-0 bg-indigo-500/40 flex items-center justify-center"><CheckCircle2 size={16} className="text-white"/></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">{product.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] text-gray-500 flex items-center gap-0.5"><DollarSign size={8}/> {product.price}</span>
                          <span className="text-[9px] text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-bold uppercase"><Tag size={8}/> {product.category || 'General'}</span>
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

      {/* RIGHT: LIST */}
      <div className="flex-1 space-y-6">
         <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-2"><Layers size={14}/> Active_Collections [{collections.length}]</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[85vh] pr-4 custom-scrollbar">
            {collections.map(col => (
              <div key={col.id} className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-7 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tighter uppercase">{col.title}</h4>
                    <p className="text-[11px] text-gray-600 mt-1 line-clamp-1 italic">{col.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setIsEditing(col.id); setFormData(col); }} className="p-2.5 bg-white/5 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"><Edit3 size={14}/></button>
                    <button onClick={() => deleteCollection(col.id)} className="p-2.5 bg-white/5 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-5 border-y border-white/[0.03] my-4 relative z-10">
                   <div className="flex -space-x-3 overflow-hidden">
                      {(col.products || []).slice(0, 5).map((p, i) => (
                        <div key={i} className="h-9 w-9 rounded-xl ring-4 ring-[#0A0A0A] overflow-hidden border border-white/10">
                          <img className="w-full h-full object-cover" src={p.images?.[0] || p.image} alt="" />
                        </div>
                      ))}
                      {(col.products?.length > 5) && (
                        <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white ring-4 ring-[#0A0A0A]">
                          +{col.products.length - 5}
                        </div>
                      )}
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{col.products?.length || 0} Assets</span>
                     <span className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter">Linked to store</span>
                   </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-black text-gray-500 uppercase tracking-widest relative z-10">
                   <div className="flex gap-4">
                     <span className="flex items-center gap-1 text-indigo-400/70"><LayoutGrid size={12}/> {col.gridSettings?.columns || 4} Cols</span>
                     <span className="flex items-center gap-1 text-indigo-400/70"><Sliders size={12}/> {col.gridSettings?.gap || '20px'} Gap</span>
                   </div>
                   <span className="text-gray-800 font-mono">ID: {col.id.slice(0,6)}</span>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}