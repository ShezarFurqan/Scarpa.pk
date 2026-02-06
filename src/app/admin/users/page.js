'use client'
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Shield,
  User,
  Loader2
} from 'lucide-react'
// Firebase Imports
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase' // Apna firebase config path check karlein

export default function UsersPage() {
  // --- STATE ---
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  // --- FETCH USERS FROM FIREBASE ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, 'users'))
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setUsers(usersList)
      } catch (error) {
        console.error("Error fetching users: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(user => {
    const name = user.name || user.displayName || ''
    const email = user.email || ''
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'All' || user.status === filterStatus

    return matchesSearch && matchesFilter
  })

  // --- HELPER: INITIALS ---
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Users</h2>
          <p className="text-gray-500 text-sm mt-1">Manage customer accounts and access.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors border border-white/5">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* --- CONTROLS BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-[#0A0A0A] border border-white/10 rounded-xl py-3 pl-10 pr-8 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- USERS TABLE --- */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" size={32} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {!loading && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white border border-white/5">
                          {getInitials(user.name || user.displayName)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{user.name || user.displayName || 'Unnamed User'}</p>
                          <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         {user.role === 'VIP' ? <Shield size={14} className="text-purple-500" /> : <User size={14} className="text-gray-500" />}
                         <span>{user.role || 'Customer'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border 
                        ${user.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                        {user.status || 'Active'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono">{user.orders || 0}</td>
                    <td className="px-6 py-4 text-gray-400">{user.lastLogin || 'N/A'}</td>

                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <p className="mb-1">No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Total Users: <span className="font-bold text-white">{filteredUsers.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 disabled:opacity-50 transition-colors" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}