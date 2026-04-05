"use client"
import Image from "next/image";
import Hero from "./components/Hero";
import ProductsCollection from "./components/ProductCollection";
import WhyChooseUs from "./components/WhyChooseUs";
import CategorySection from "./components/CategorySection";
import ProductHighlights from "./components/ProductHighlights";
import HeroSection from "./components/HeroSection";
import SizeSelector from "./components/Sizes";
import TopReviewsSection from "./components/ReviewsSection";


export default function Home() {
  return (
    <div className="flex flex-col 2xl:px-12 lg:px-10 px-0.5">
      <Hero />
      <hr className="w-full max-w-7xl mx-auto h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <ProductsCollection collectionName="Best Sellers" />
      <hr className="w-full max-w-7xl mx-auto mb-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
        <TopReviewsSection/>
      <hr className="w-full max-w-7xl mx-auto my-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <SizeSelector />
      <hr className="w-full max-w-7xl mx-auto my-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      <CategorySection />
      <hr className="w-full max-w-7xl mx-auto mt-16 h-px border-0 bg-gradient-to-r from-transparent via-[#0145f2]/20 to-transparent" />
      {/* <ProductHighlights /> */}
      <WhyChooseUs />
      {/* <ContactSection/> */}
    </div>
  );
}

