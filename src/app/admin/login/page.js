'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react'
import AdminLayout from "../layout";

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated')
    if (auth === 'true') {
      router.push('/admin/')
    }
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (data.success === true) {
      // 1. Set Auth State
      localStorage.setItem('isAdminAuthenticated', 'true')
      // 2. Redirect to Dashboard
      router.push('/admin/')
    } else {
      setError('Invalid admin credentials. Access denied.')
      setIsLoading(false)
    }
  }


  return (
    <AdminLayout>
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">

        {/* LOGO / BRANDING */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Restricted Access • Secure Login</p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-[#0D0D0D] border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold p-4 rounded-2xl animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@store.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-white/5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2026 Nexus E-Commerce System
        </p>
      </div>
    </div>
    </AdminLayout>
  )
}