"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { User, ShoppingBag, X } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { router, cart, token } = useContext(ShopContext);
  const pathname = usePathname();
  const [totalItems, setTotalItems] = useState(5);

  const links = [
    { name: "Home", href: "/" },
    // { name: "Shop", href: "/Shop" },
    { name: "Men", href: "/collection/mens" },
    { name: "Women", href: "/collection/womens" },
    { name: "Kids", href: "/collection/kids" }
  ];

  useEffect(()=>{
    setTotalItems(cart?.reduce((acc, item) => acc + item.quantity, 0))
  },[cart])

  const handleProfile = () => {
    if (!token) {
      router.push("/login")
    }else {
      router.push("/profile")
    }
  }


  // Close mobile menu if screen resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (pathname === "/login" || pathname.includes("/admin")) return null;

  return (
    <div className="mb-16">
      {/* Navbar */}
      <nav className="w-full bg-black border-b border-white/10 fixed top-0 left-0 z-50">
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 px-6">
          <div className="flex h-16 items-center justify-between">

            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button
                className="md:hidden flex flex-col justify-center gap-1 w-8 h-8"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </button>

              <div onClick={() => { router.push("/") }} className="cursor-pointer text-white text-xl font-bold tracking-wide">
                ROCK CLIMB
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10 text-white text-sm">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-gray-300 transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-6 text-white relative">
              <User onClick={handleProfile} className="h-5 w-5 cursor-pointer hover:opacity-80 transition" />

              <div className="relative">
                <ShoppingBag
                  onClick={() => router.push('/cart')}
                  className="h-5 w-5 cursor-pointer hover:opacity-80 transition"
                />

                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-screen Slide Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black flex flex-col justify-start items-start pt-24 pl-6 gap-6 transform transition-transform duration-300 z-40 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top Right Close Button */}
        <button
          className="absolute top-6 right-6 text-white text-3xl"
          onClick={() => setIsOpen(false)}
        >
          <X />
        </button>

        {/* Links with dividers */}
        <nav className="flex flex-col w-full gap-4">
          {links.map((link, i) => (
            <div key={link.name} className="w-full">
              <Link
                href={link.href}
                className="block text-white text-2xl py-3 hover:text-gray-300 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
              {i < links.length && <hr className="border-gray-700" />}
            </div>
          ))}
        </nav>

        {/* Icons at the bottom */}
        {/* <div className="flex gap-6 mt-auto mb-12">
          <User className="h-6 w-6 cursor-pointer hover:opacity-80 transition" />
          <ShoppingBag className="h-6 w-6 cursor-pointer hover:opacity-80 transition" />
        </div> */}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
