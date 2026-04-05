"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  SquarePen,
  MessageCircleMore,
  Star
} from 'lucide-react'

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'DirectContact', href: '/admin/directcontacts', icon: Users },
  { name: 'Customization', href: '/admin/customization', icon: SquarePen },
  { name: 'Direct Messages', href: '/admin/messages', icon: MessageCircleMore },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
]

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black flex">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/5 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* LOGO AREA */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
          <h1 className="text-xl font-black tracking-tighter uppercase">
            SCARPA <span className="text-white/20">ADMIN</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Main Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after click
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <item.icon size={18} className={isActive ? 'text-black' : 'text-gray-400'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* LOGOUT AREA */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <button
            onClick={() => {
              localStorage.removeItem('isAdminAuthenticated');
              window.location.href = '/admin/login';
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">

        {/* TOP NAVBAR */}
        <header className="h-16 sticky top-0 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <Menu size={24} />
            </button>


          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-tight">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <img src='/images/nike.png' className="w-8 h-8 rounded-full"/>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}