'use client'
import React, { useState, useEffect, useContext } from 'react'
import { 
  Plus, Trash2, Edit3, MoveUp, MoveDown, 
  Save, LayoutGrid, X, PackagePlus, Eye, EyeOff, Loader2 
} from 'lucide-react'
import { db } from '../../firebase'
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore'
import ProductPickerModal from '../../components/ProductPickerModal'
import { ShopContext } from '@/app/Context/ShopContext'

export default function LandingPageBuilder() {
  const { updateLandingPage } = useContext(ShopContext) // Context function
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [activeEditIdx, setActiveEditIdx] = useState(null)

  // --- LOCAL STATE ---
  const [config, setConfig] = useState({
    visibility: {
      hero: true,
      featured: true,
      collections: true,
      newsletter: true
    },
    collections: []
  })

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'homepage', 'config'), (snap) => {
      if (snap.exists()) setConfig(snap.data())
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const handleGlobalSave = async () => {
    setSaving(true)
    try {
      await updateLandingPage(config) // Saving to Firestore via Context
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  const addCollection = () => {
    const newCol = {
      id: Date.now().toString(),
      title: 'New Collection',
      description: '',
      grid: 4,
      products: [],
      isActive: true
    }
    setConfig({ ...config, collections: [...config.collections, newCol] })
  }

  const updateCol = (idx, data) => {
    const updated = [...config.collections]
    updated[idx] = { ...updated[idx], ...data }
    setConfig({ ...config, collections: updated })
  }

  const removeCol = (idx) => {
    setConfig({ ...config, collections: config.collections.filter((_, i) => i !== idx) })
  }

  const moveCol = (idx, dir) => {
    const newCols = [...config.collections]
    const target = idx + dir
    if (target < 0 || target >= newCols.length) return
    [newCols[idx], newCols[target]] = [newCols[target], newCols[idx]]
    setConfig({ ...config, collections: newCols })
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Landing Page CMS</h2>
          <p className="text-gray-500 text-sm">Control your store's homepage layout and products.</p>
        </div>
        <button 
          onClick={handleGlobalSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-xs uppercase hover:bg-gray-200 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Publish Changes
        </button>
      </div>

      {/* SECTION VISIBILITY */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold uppercase tracking-widest text-white/40">Section Visibility</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(config.visibility).map(key => (
            <button
              key={key}
              onClick={() => setConfig({
                ...config, 
                visibility: { ...config.visibility, [key]: !config.visibility[key] }
              })}
              className={`p-6 rounded-[24px] border transition-all text-left space-y-3 ${
                config.visibility[key] ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-40'
              }`}
            >
              {config.visibility[key] ? <Eye size={20} /> : <EyeOff size={20} />}
              <p className="font-bold uppercase text-[10px] tracking-widest">{key}</p>
            </button>
          ))}
        </div>
      </section>

      {/* COLLECTIONS BUILDER */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white/40">Custom Collections</h3>
          <button onClick={addCollection} className="flex items-center gap-2 text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full">
            <Plus size={14} /> Add Collection
          </button>
        </div>

        <div className="space-y-4">
          {config.collections.map((col, idx) => (
            <div key={col.id} className="p-8 bg-[#0A0A0A] border border-white/5 rounded-[32px] space-y-6 group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveCol(idx, -1)} className="hover:text-white text-gray-600"><MoveUp size={16} /></button>
                    <button onClick={() => moveCol(idx, 1)} className="hover:text-white text-gray-600"><MoveDown size={16} /></button>
                  </div>
                  <input 
                    value={col.title} 
                    onChange={e => updateCol(idx, { title: e.target.value })}
                    className="bg-transparent text-2xl font-black uppercase tracking-tighter outline-none focus:text-indigo-400"
                    placeholder="Collection Title"
                  />
                </div>
                <button onClick={() => removeCol(idx)} className="p-2 text-gray-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Grid Layout</label>
                  <select 
                    value={col.grid} 
                    onChange={e => updateCol(idx, { grid: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Products ({col.products.length})</label>
                  <button 
                    onClick={() => { setActiveEditIdx(idx); setIsPickerOpen(true); }}
                    className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 text-sm hover:border-white/30"
                  >
                    <span className="text-gray-400">Select products for this grid...</span>
                    <PackagePlus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductPickerModal 
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        initialSelected={activeEditIdx !== null ? config.collections[activeEditIdx].products : []}
        onSave={(ids) => {
          updateCol(activeEditIdx, { products: ids })
          setIsPickerOpen(false)
        }}
      />
    </div>
  )
}