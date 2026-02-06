'use client'
import React, { useState, useEffect } from 'react'
import { Search, X, Check, Loader2 } from 'lucide-react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

export default function ProductPickerModal({ isOpen, onClose, onSave, initialSelected = [] }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState(initialSelected)

  useEffect(() => {
    if (isOpen) {
      fetchProducts()
      setSelectedIds(initialSelected)
    }
  }, [isOpen, initialSelected])

  const fetchProducts = async () => {
    setLoading(true)
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    setLoading(false)
  }

  const toggleProduct = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0D0D0D] border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-[80vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold uppercase tracking-tight">Select Products</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-white/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>
          ) : (
            filtered.map(product => (
              <div 
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${
                  selectedIds.includes(product.id) ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                <img src={product.images?.[0]} className="w-12 h-12 rounded-lg object-cover bg-white/5" alt="" />
                <div className="flex-1">
                  <p className="text-sm font-bold truncate">{product.title}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">{product.brand} • Rs.{product.price}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedIds.includes(product.id) ? 'bg-white border-white text-black' : 'border-white/20'
                }`}>
                  {selectedIds.includes(product.id) && <Check size={14} strokeWidth={4} />}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-white/5 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-bold uppercase text-gray-400">Cancel</button>
          <button onClick={() => onSave(selectedIds)} className="flex-1 bg-white text-black py-3 rounded-full text-sm font-bold uppercase">
            Save Selection ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  )
}