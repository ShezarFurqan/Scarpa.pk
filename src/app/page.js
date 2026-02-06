"use client"
import Image from "next/image";
import Hero from "./components/Hero";
import ProductsCollection from "./components/ProductCollection";
import WhyChooseUs from "./components/WhyChooseUs";
import CategorySection from "./components/CategorySection";
import ProductHighlights from "./components/ProductHighlights";
import ContactSection from "./components/ContactSection";


export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <hr className="w-full max-w-7xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <ProductsCollection collectionName="New Collection" />
      <hr className="w-full max-w-7xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
       <CategorySection/>
      <hr className="w-full max-w-7xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <ProductHighlights/>
      <hr className="w-full max-w-7xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <WhyChooseUs/>
      <hr className="w-full max-w-7xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {/* <ContactSection/> */}
    </div>
  );
}

