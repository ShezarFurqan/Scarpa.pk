'use client';

import React, { useContext, useEffect, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
// Updated context hook
import { useLoading } from '../Context/LoginContext';
import Head from "next/head";
import Image from "next/image";
import { ShopContext } from '../Context/ShopContext';
const MotionImage = motion(Image);

const Hero = () => {
  const [content, setContent] = useState(null);
  // Destructure updated functions from your new context
  const { startLoading, stopLoading } = useLoading();
  const { router } = useContext(ShopContext)

  const fetchHeroContent = async () => {
    // 1. Loader start with a premium message
    startLoading("Fetching latest collection...");

    try {
      const docRef = doc(db, "heroSection", "singleton");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        // Fallback content
        setContent({
          badge: "Scarpa Premium Edition",
          titleLine1: "ELEVATE",
          titleLine2: "YOUR SOLE",
          description: "Experience the ultimate fusion of Italian craftsmanship and modern comfort. Designed for the bold.",
          btnPrimary: "Shop Now",
          btnSecondary: "Watch Story",
          image: "/images/image1.png"
        });
      }
    } catch (error) {
      console.error("Firebase Error:", error);
    } finally {
      // 2. Stop loading no matter what happens (Success or Error)
      stopLoading();
    }
  };

  useEffect(() => {
    fetchHeroContent();
  }, []);

  // --- Animation Variants (Keep as is for 0% UI change) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const shoeEntry = {
    hidden: { opacity: 0, x: 100, rotate: 0 },
    visible: {
      opacity: 1,
      x: 0,
      rotate: -15,
      transition: { type: "spring", stiffness: 50, damping: 15, delay: 0.5 }
    }
  };

  // Prevent layout jump, though loader covers it
  if (!content) return <div className="min-h-screen bg-[#edf1f5]" />;

  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/diipeelyw/image/upload/f_auto,q_auto,w_800/v1771086534/wvpdnm71ls1klrwn3fqf.png"
        />
      </Head>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full h-auto lg:min-h-screen flex items-center bg-[#edf1f5] overflow-hidden pt-12 pb-8 lg:py-0"
      >
        {/* Background Decorative Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 text-[100px] sm:text-[120px] font-black text-black select-none lg:hidden leading-none tracking-tighter uppercase pointer-events-none"
        >
          SCARPA
        </motion.div>

        {/* Decorative Glow */}
        <div className="absolute lg:hidden right-[-10%] top-1/4 -translate-y-1/2 w-[250px] h-[250px] bg-[#0145f2]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center relative z-10 gap-y-2 lg:gap-y-0">

          {/* RIGHT CONTENT (Shoe) */}
          <div className="w-full flex justify-center items-center relative order-1 lg:order-2 h-[260px] sm:h-[350px] lg:h-screen">
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute bottom-[10%] lg:bottom-[25%] w-[55%] h-[15px] lg:h-[40px] bg-black/10 blur-[20px] lg:blur-[40px] rounded-[100%] animate-shadow"
              />

              <MotionImage
                variants={shoeEntry}
                initial="hidden"
                animate="visible"
                src="https://res.cloudinary.com/diipeelyw/image/upload/f_auto,q_auto,w_800/v1771086534/wvpdnm71ls1klrwn3fqf.png"
                alt="Scarpa Shoe"
                priority
                loading='eager'
                width={800}      // original width
                height={800}     // approximate height
                className="w-[75%] sm:w-[65%] lg:w-[95%] xl:w-[97%] max-w-[800px] h-auto transform select-none animate-float drop-shadow-[0_15px_25px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_40px_50px_rgba(0,0,0,0.1)] z-20"
              />
            </div>
          </div>

          {/* LEFT CONTENT */}
          <div className="w-full flex flex-col space-y-3 sm:space-y-4 lg:space-y-8 px-5 sm:px-12 lg:pl-16 xl:pl-24 lg:pr-0 order-2 lg:order-1 text-center lg:text-left z-10">

            <motion.div variants={fadeInUp} className="inline-block">
              <span className="text-[#0145f2] text-[10px] sm:text-sm font-black tracking-[0.3em] uppercase bg-[#0145f2]/5 px-3 py-1 rounded-full lg:bg-transparent lg:p-0">
                {content.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-[46px] sm:text-6xl md:text-8xl lg:text-[90px] xl:text-[110px] font-black text-[#1a1a1a] leading-[0.85] tracking-tighter italic uppercase"
            >
              {content.titleLine1} <br />
              <span className="text-[#0145f2]">{content.titleLine2}</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-500 text-sm sm:text-base lg:text-xl max-w-[280px] sm:max-w-sm mx-auto lg:mx-0 font-medium leading-snug"
            >
              {content.description}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 pt-1 lg:pt-4"
            >
              <motion.button
              onClick={()=>{router.push("/shop/collection/allproducts")}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto justify-center px-8 py-3 lg:px-10 lg:py-4 bg-[#0145f2] text-white rounded-full font-bold transition-all hover:bg-black shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm lg:text-base"
              >
                {content.btnPrimary}
                <ArrowRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                className="w-full sm:w-auto justify-center px-8 py-3 lg:px-10 lg:py-4 bg-white/50 backdrop-blur-sm lg:bg-transparent text-[#1a1a1a] rounded-full font-bold border-2 border-black/5 flex items-center gap-2 text-sm lg:text-base"
              >
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Play size={12} fill="currentColor" />
                </div>
                {content.btnSecondary}
              </motion.button>
            </motion.div>
          </div>

        </div>

        <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-12px) rotate(-13deg); }
        }
        @keyframes shadow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(0.8); opacity: 0.15; }
        }
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }
        .animate-shadow {
          animation: shadow 3.5s ease-in-out infinite;
        }
        @media (min-width: 1024px) {
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-15deg); }
            50% { transform: translateY(-30px) rotate(-12deg); }
          }
        }
      `}</style>
      </motion.section>
    </>
  );
};

export default Hero;