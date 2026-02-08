"use client";

import React, { useRef, useEffect } from "react";
import { Play, ArrowRight, Maximize2 } from "lucide-react";

/**
 * STORY / LATEST UPDATES SECTION
 * Updated: Aspect Ratio is now strictly VERTICAL (Portrait Mode).
 * Height > Width (9:14 ratio) for a high-end editorial look.
 */

const storyData = {
  sectionTitle: "LATEST DROPS",
  sectionDescription: "Witness the evolution of speed and silence.",
  videoTitle: "VELOCITY NOIR: ACT II",
  videoUrl: "/videos/video.mp4",
  collectionLink: "/collections/velocity-noir",
};

const StorySection = () => {
  const videoRef = useRef(null);

  // Handle Fullscreen Logic
  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }

      videoRef.current.muted = false;
      videoRef.current.controls = true;
      videoRef.current.currentTime = 0; 
      videoRef.current.play();
    }
  };

  useEffect(() => {
    const onFullScreenChange = () => {
      const isFullScreen = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.msFullscreenElement;

      if (!isFullScreen && videoRef.current) {
        videoRef.current.controls = false;
        videoRef.current.muted = true;
        videoRef.current.play();
      }
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);
    document.addEventListener("msfullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
      document.removeEventListener("msfullscreenchange", onFullScreenChange);
    };
  }, []);

  return (
    <section className="w-full bg-[#050505] min-h-[90vh] flex items-center py-24 border-t border-white/5 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT: Minimal Story Context */}
          <div className="flex flex-col space-y-10 animate-fade-in-up order-2 lg:order-1">
            
            {/* Section Label */}
            <div className="space-y-3">
              <h3 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-12 h-[2px] bg-indigo-500"></span>
                Story / {storyData.sectionTitle}
              </h3>
              <p className="text-white/40 text-sm font-medium tracking-wide pl-1">
                {storyData.sectionDescription}
              </p>
            </div>

            {/* Video Title */}
            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              {storyData.videoTitle.split(":").map((part, i) => (
                <span key={i} className={i === 1 ? "text-white/20 block italic" : "block"}>
                  {part}
                  {i === 0 && ":"}
                </span>
              ))}
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-6">
              <button 
                onClick={() => console.log(`Navigating to ${storyData.collectionLink}`)}
                className="group px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                View Collection
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={handleFullScreen}
                className="group px-10 py-5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-3"
              >
                <Maximize2 size={14} />
                Watch Fullscreen
              </button>
            </div>
          </div>

          {/* RIGHT: Cinematic Video Card (Portrait Mode) */}
          <div className="relative group cursor-pointer order-1 lg:order-2 flex justify-center lg:justify-end" onClick={handleFullScreen}>
            
            {/* Wrapper to constrain max width so it doesn't get too giant on huge screens */}
            <div className="w-full max-w-md relative">
              
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Video Container - STRICTLY VERTICAL (Aspect 9/14) */}
              <div className="relative w-full aspect-[8/11] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl transform group-hover:scale-[1.01] transition-transform duration-500">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                >
                  <source src={storyData.videoUrl} type="video/mp4" />
                </video>

                {/* Overlay: Play Icon */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 border border-white/20 shadow-xl">
                    <Play fill="white" size={24} className="text-white ml-1" />
                  </div>
                </div>
                
                {/* Bottom Shadow */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
              </div>

              {/* Decorative Label */}
              <div className="absolute bottom-8 right-8 pointer-events-none z-20">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-lg">
                  Now Playing
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StorySection;