'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
  Plus, Search, Package, FolderPlus, Edit3, Trash2, ChevronRight,
  ArrowLeft, Image as ImageIcon, Tag, Filter, Loader2, X, Eye, EyeOff
} from 'lucide-react'
import {
  collection, addDoc, getDocs, query, where,
  deleteDoc, doc, updateDoc
} from 'firebase/firestore'
import { db } from '../../firebase'
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal'

// --- CONSTANTS FOR DROPDOWNS ---
const CATEGORIES = ['None', 'Sneakers', 'Running Shoes', 'Casual Shoes', 'Sports Shoes', 'Premium Collection']
const BRAND = ['None', 'Nike', 'Hoka', "Asics", "Fila", "Heydude", "AllBirds", "Kalenji", "EasySpirit", "Scarpa", "Colombia", "Reebok", "OnCloud", "Altra", "UnderArmour", "Qixing", 'Puma', 'Adidas', 'New Balance', 'Brooks', 'Sketchers']
const CONDITIONS = ['Premium', 'Excellent', 'Very Good'];
const PRODUCT_STATUSES = [
  'None',
  'Trending',
  'Best Seller',
  'New Arrival',
  'Limited Edition',
  'On Sale',
  'Featured',
  'Seasonal',
  'Popular',
  'Exclusive'
]

// UK and EU Sizes Constant
const AVAILABLE_SIZES = [
  "UK 5 / EU 39", "UK 6 / EU 40", "UK 7 / EU 41", "UK 7.5 / EU 41.5",
  "UK 8 / EU 42", "UK 8.5 / EU 42.5", "UK 9 / EU 43", "UK 9.5 / EU 43.5",
  "UK 10 / EU 44", "UK 10.5 / EU 44.5", "UK 11 / EU 45"
]

// --- CLOUDINARY UPLOAD FUNCTION (UNCHANGED) ---
export const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  )

  if (!res.ok) throw new Error("Cloudinary upload failed")
  const data = await res.json()

  // 🔥 optimized URL create karo
  const optimizedUrl = data.secure_url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_800/"
  )

  return optimizedUrl
}

export default function ProductManagement() {
  // --- CORE STATE ---
  const [view, setView] = useState('collections')
  const [activeCol, setActiveCol] = useState(null)
  const [collections, setCollections] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // --- MODAL & DELETE STATE ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfig, setDeleteConfig] = useState({ id: null, type: null, message: '' })

  // --- FORM STATES ---
  const [newProduct, setNewProduct] = useState({
    title: '',
    purchasingPrice: '', // <-- Added field
    price: '',
    fakePrice: '',
    qty: '',
    category: 'None',
    status: 'None',
    condition: 'Premium',
    brand: '',
    description: '',
    images: [],
    sizes: [], // Multiple sizes array
    isActive: true
  })
  const [newCollection, setNewCollection] = useState({ name: '', icon: '📁' })

  const [imageFiles, setImageFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => { fetchCollections() }, [])

  const fetchCollections = async () => {
    const snap = await getDocs(collection(db, 'collections'))
    setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    if (activeCol) fetchProducts()
  }, [activeCol])

  const fetchProducts = async () => {
    const q = query(collection(db, 'products'), where('collectionId', '==', activeCol.id))
    const snap = await getDocs(q)
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const toggleProductActive = async (product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { isActive: !product.isActive })
      fetchProducts()
    } catch (err) { console.error(err) }
  }

  // --- DELETE LOGIC ---
  const triggerDeleteProduct = (id) => {
    setDeleteConfig({ id, type: 'product', message: 'Are you sure you want to delete this product?' })
    setIsDeleteModalOpen(true)
  }

  const triggerDeleteCollection = (id, e) => {
    e.stopPropagation()
    setDeleteConfig({ id, type: 'collection', message: 'WARNING: Deleting collection deletes all products inside.' })
    setIsDeleteModalOpen(true)
  }

  // --- TASK 1: IMAGE INDEX MANAGEMENT ---
  const setPrimaryImage = (index) => {
    setNewProduct(prev => {
      const updatedImages = [...prev.images];
      const selectedImage = updatedImages.splice(index, 1)[0];
      updatedImages.unshift(selectedImage);
      return { ...prev, images: updatedImages };
    });
  }

  const handleFinalConfirmDelete = () => {
    if (deleteConfig.type === 'product') executeDeleteProduct(deleteConfig.id)
    else if (deleteConfig.type === 'collection') executeDeleteCollection(deleteConfig.id)
    setIsDeleteModalOpen(false)
  }

  const executeDeleteProduct = async (id) => {
    setLoading(true)
    await deleteDoc(doc(db, 'products', id))
    fetchProducts()
    setLoading(false)
  }

  const executeDeleteCollection = async (id) => {
    setLoading(true)
    const q = query(collection(db, 'products'), where('collectionId', '==', id))
    const productSnap = await getDocs(q)
    for (const pDoc of productSnap.docs) await deleteDoc(doc(db, 'products', pDoc.id))
    await deleteDoc(doc(db, 'collections', id))
    fetchCollections()
    if (activeCol?.id === id) setView('collections')
    setLoading(false)
  }

  // --- IMAGE HELPERS ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (newProduct.images.length + imageFiles.length + files.length > 10) return
    setImageFiles(prev => [...prev, ...files])
    setPreviewUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))])
  }

  // --- SIZE SELECTION HANDLER ---
  const toggleSize = (size) => {
    setNewProduct(prev => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
  }

  // --- TASK 2 & 3: CLEAN SUBMIT LOGIC ---
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const uploadPromises = imageFiles.map(file => uploadToCloudinary(file))
      const newlyUploadedUrls = await Promise.all(uploadPromises)
      const finalImages = [...newProduct.images, ...newlyUploadedUrls]

      // Create base object with system fields
      const rawProduct = {
        ...newProduct,
        images: finalImages,
        isActive: newProduct.isActive ?? true,
        updatedAt: Date.now()
      }

      // Cleanup: Remove empty strings, convert empty numbers to null, prevent undefined
      const productToSave = Object.fromEntries(
        Object.entries(rawProduct).filter(([_, v]) => {
          return v !== "" && v !== undefined && (Array.isArray(v) ? v.length >= 0 : true)
        }).map(([k, v]) => {
          // Convert numeric strings to actual numbers or null if empty
          if (['price', 'purchasingPrice', 'qty', 'fakePrice'].includes(k)) {
            return [k, v === "" ? null : Number(v)];
          }
          return [k, v];
        })
      )

      if (isEditMode) {
        await updateDoc(doc(db, 'products', selectedProductId), productToSave)
      } else {
        await addDoc(collection(db, 'products'), {
          ...productToSave,
          collectionId: activeCol.id,
          createdAt: Date.now()
        })
      }
      fetchProducts()
      closeProductModal()
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  // --- UI HELPERS ---
  const closeProductModal = () => {
    setIsProductModalOpen(false); setIsEditMode(false); setSelectedProductId(null)
    // FIX: condition: 'Premium' add kar diya aur category: 'None' kar diya
    setNewProduct({
      title: '',
      purchasingPrice: '',
      price: '',
      fakePrice: '',
      qty: '',
      category: 'None', // 'Mens' list me nahi tha isliye 'None' kiya
      status: 'None',
      condition: 'Premium', // Ye miss ho gaya tha!
      brand: '',
      description: '',
      images: [],
      sizes: [],
      isActive: true
    })
    setImageFiles([]); setPreviewUrls([])
  }

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (url) => {
    setNewProduct(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }))
  }

  const openEditModal = (product) => {
    setIsEditMode(true); setSelectedProductId(product.id)
    setNewProduct({
      ...product,
      images: product.images || [],
      sizes: product.sizes || [],
      isActive: product.isActive ?? true,
      category: product.category || 'Mens',
      status: product.status || 'None',
      condition: product.condition || 'Premium',
      brand: product.brand || ''
    })
    setIsProductModalOpen(true)
  }

  const handleAddCollection = async (e) => {
    e.preventDefault(); setLoading(true)
    await addDoc(collection(db, 'collections'), { ...newCollection, createdAt: Date.now() })
    fetchCollections(); setIsCollectionModalOpen(false); setNewCollection({ name: '', icon: '📁' })
    setLoading(false)
  }

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {view === 'products' && (
              <button onClick={() => setView('collections')} className="p-1 hover:bg-white/10 rounded-full text-gray-400">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">
              {view === 'collections' ? 'Collections' : activeCol?.name}
            </h2>
          </div>
          <p className="text-gray-500 text-sm">{view === 'collections' ? 'Manage departments.' : `Managing ${activeCol?.name}`}</p>
        </div>
        <div className='flex gap-4 '>
          {view === 'products' && 
            <div className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200">
              <Package size={16} />
              {filteredProducts?.length} Products
            </div>
          }
          <button
            onClick={() => view === 'collections' ? setIsCollectionModalOpen(true) : setIsProductModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (view === 'collections' ? <FolderPlus size={16} /> : <Plus size={16} />)}
            {view === 'collections' ? 'New Collection' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* COLLECTIONS GRID */}
      {view === 'collections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(col => (
            <div key={col.id} onClick={() => { setActiveCol(col); setView('products') }} className="group cursor-pointer p-8 rounded-[32px] bg-[#0A0A0A] border border-white/5 hover:border-white/20 relative">
              <div className="flex justify-between items-start">
                <div className="text-4xl mb-4">{col.icon}</div>
                <button onClick={(e) => triggerDeleteCollection(col.id, e)} className="p-2 text-gray-600 hover:text-rose-500 z-10"><Trash2 size={18} /></button>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{col.name}</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Store Department</p>
              <ChevronRight className="absolute right-8 bottom-8 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS GRID */}
      {view === 'products' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className={`bg-[#0A0A0A] border border-white/5 rounded-[24px] overflow-hidden group hover:border-white/10 ${!product.isActive ? 'opacity-60' : ''}`}>
                <div className="aspect-square relative overflow-hidden bg-black">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/400'} className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all ${!product.isActive ? 'grayscale' : ''}`} alt="" />
                  {!product.isActive && <div className="absolute top-4 left-4 z-10"><span className="bg-rose-500/90 backdrop-blur-sm text-[8px] font-black text-white px-2 py-1 rounded-md uppercase">Hidden</span></div>}

                  {product.status && product.status !== 'None' && (
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="bg-white/90 text-black text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        {product.status}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); toggleProductActive(product) }} className={`p-2 backdrop-blur-md rounded-full ${product.isActive ? 'bg-black/60 text-white hover:bg-white hover:text-black' : 'bg-rose-500 text-white'}`}>
                      {product.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(product) }} className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black"><Edit3 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); triggerDeleteProduct(product.id) }} className="p-2 bg-black/60 backdrop-blur-md rounded-full text-rose-500 hover:bg-rose-500 hover:text-white"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.brand}</p>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{product.category}</p>
                  </div>
                  <h4 className="font-bold text-white truncate">{product.title}</h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-mono font-bold text-white">Rs.{product.price}</span>
                    {product.fakePrice && <span className="text-xs font-mono text-gray-600 line-through">Rs.{product.fakePrice}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleFinalConfirmDelete} message={deleteConfig.message} />

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/80 backdrop-blur-sm" onClick={closeProductModal}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl h-full bg-[#0D0D0D] border-l border-white/10 rounded-[40px] overflow-y-auto p-8 md:p-12 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">{isEditMode ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={closeProductModal} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-6 pb-20">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div><p className="text-sm font-bold text-white uppercase">Active Status</p></div>
                <button type="button" onClick={() => setNewProduct({ ...newProduct, isActive: !newProduct.isActive })} className={`w-12 h-6 rounded-full transition-all relative ${newProduct.isActive ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newProduct.isActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* IMAGES */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Images</label>
                <div className="grid grid-cols-3 gap-3">
                  {newProduct.images.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setPrimaryImage(i)} // Add this trigger
                      className={`aspect-square rounded-xl overflow-hidden relative group border cursor-pointer ${i === 0 ? 'border-indigo-500 border-2' : 'border-white/10'}`}
                    >
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 p-1 bg-rose-500 rounded-full text-white opacity-0 group-hover:opacity-100"><X size={12} /></button>
                    </div>
                  ))}
                  {previewUrls.map((url, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden relative group border border-indigo-500/50">
                      <img src={url} className="w-full h-full object-cover opacity-60" alt="" />
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 p-1 bg-rose-500 rounded-full text-white"><X size={12} /></button>
                    </div>
                  ))}
                  {(newProduct.images.length + imageFiles.length) < 10 && (
                    <div onClick={() => fileInputRef.current.click()} className="aspect-square border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-white/20 cursor-pointer">
                      <ImageIcon size={20} /><span className="text-[8px] font-bold uppercase">Add</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <input value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" placeholder="Product Title" />

              {/* SIZES MULTI-SELECT SECTION */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Available Sizes (UK / EU)</label>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`py-3 px-2 rounded-xl border text-[10px] font-bold transition-all ${newProduct.sizes?.includes(size)
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- NEW DROPDOWNS SECTION --- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0D0D0D]">{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Status / Tag</label>
                  <select
                    value={newProduct.status || 'None'}
                    onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                  >
                    {PRODUCT_STATUSES.map(s => <option key={s} value={s} className="bg-[#0D0D0D]">{s}</option>)}
                  </select>
                </div>
              </div>

              {/* PURCHASING PRICE FIELD */}
              <input type="number" value={newProduct.purchasingPrice} onChange={(e) => setNewProduct({ ...newProduct, purchasingPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" placeholder="Purchasing Price (Cost)" />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none" placeholder="Selling Price" />
                <input type="number" value={newProduct.fakePrice} onChange={(e) => setNewProduct({ ...newProduct, fakePrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none" placeholder="Fake Price" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4"> {/* Spacing badha di hai taaki input clear dikhe */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Brand</label>
                    <select
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                    >
                      <option value="" className="bg-[#0D0D0D]">Select Brand</option>
                      {BRAND.map(c => (
                        <option key={c} value={c} className="bg-[#0D0D0D]">{c}</option>
                      ))}
                      <option value="Other" className="bg-[#0D0D0D]"> + Add Other Brand</option>
                    </select>
                  </div>

                  {/* Agar 'Other' select hua hai, toh ye naya input field dikhega */}
                  {newProduct.brand === "Other" && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Custom Brand Name</label>
                      <input
                        type="text"
                        placeholder="Enter your brand name"
                        onChange={(e) => setNewProduct({ ...newProduct, customBrand: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Condition</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                  >
                    {CONDITIONS.map(c => <option key={c} value={c} className="bg-[#0D0D0D]">{c}</option>)}
                  </select>
                </div>
                <input type="number" value={newProduct.qty} onChange={(e) => setNewProduct({ ...newProduct, qty: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none" placeholder="Qty" />
              </div>

              <textarea rows="4" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none" placeholder="Description" />

              <button disabled={loading} className="w-full bg-white text-black py-5 rounded-full font-bold uppercase text-xs flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? 'Update Product' : 'Publish Product')} <Tag size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COLLECTION MODAL */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsCollectionModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-[40px] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase text-white">Create Collection</h3>
              <button onClick={() => setIsCollectionModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCollection} className="space-y-5">
              <input required value={newCollection.name} onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none" placeholder="Name" />
              <input required value={newCollection.icon} onChange={(e) => setNewCollection({ ...newCollection, icon: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none" placeholder="Icon (Emoji)" />
              <button disabled={loading} className="w-full bg-white text-black py-4 rounded-full font-bold uppercase text-xs">
                {loading ? <Loader2 className="animate-spin inline mr-2" /> : 'Create Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}