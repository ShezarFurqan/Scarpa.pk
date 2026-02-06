'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react'

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
]

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // --- LOGIC: HIDE UI ON LOGIN PAGE ---
  const isLoginPage = pathname === '/admin/login'

  // If it's the login page, just render the content without Sidebar/Navbar
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
        {children}
      </div>
    )
  }


  // Otherwise, render the full Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-[#0A0A0A] border-r border-white/5 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-8 border-b border-white/5">
          <h1 className="text-xl font-black tracking-tighter uppercase">
            NEXUS <span className="text-white/20">ADMIN</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Main Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          {/* Added handleLogout logic here if needed */}
          <button
            onClick={() => {
              localStorage.removeItem('isAdminAuthenticated');
              window.location.href = '/admin/login';
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="lg:ml-64 min-h-screen flex flex-col">

        {/* TOP NAVBAR */}
        <header className="h-16 sticky top-0 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 z-30 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/5 focus-within:border-white/20 transition-colors">
              <Search size={14} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-xs text-white placeholder:text-gray-600 w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">Admin User</p>
                <p className="text-[10px] text-gray-500">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20"></div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}