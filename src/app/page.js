"use client"
import Image from "next/image";
import Hero from "./components/Hero";
import ProductsCollection from "./components/ProductCollection";
import WhyChooseUs from "./components/WhyChooseUs";
import CategorySection from "./components/CategorySection";
import ProductHighlights from "./components/ProductHighlights";
import HeroSection from "./components/HeroSection";
import SizeSelector from "./components/Sizes";


export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <hr className="w-full max-w-7xl mx-auto h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <ProductsCollection collectionName="Best Sellers" />
      <hr className="w-full max-w-7xl mx-auto mb-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <SizeSelector />
      <hr className="w-full max-w-7xl mx-auto my-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <CategorySection />
      <hr className="w-full max-w-7xl mx-auto mt-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <ProductHighlights />
      <hr className="w-full max-w-7xl mx-auto my-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <WhyChooseUs />
      {/* <ContactSection/> */}
    </div>
  );
}

