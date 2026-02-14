"use client";

import React, { useRef, useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";

const storyData = [
  { id: 1, url: "/videos/video.mp4", title: "Velocity" },
  { id: 2, url: "/videos/video.mp4", title: "Apex" },
  { id: 3, url: "/videos/video.mp4", title: "Glide" },
  { id: 4, url: "/videos/video.mp4", title: "Summit" },
];

const VideoCard = ({ src, title }) => {
  const videoRef = useRef(null);

  // Audio Safety: Fullscreen exit par mute kar do
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (videoRef.current) videoRef.current.muted = true;
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Performance Logic: Scroll hone par hi play karein
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            // Video screen par hai toh play karo
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => { /* Auto-play catch */ });
            }
          } else {
            // Screen se bahar hai toh foran pause aur mute
            videoRef.current.pause();
            videoRef.current.muted = true;
          }
        }
      },
      { threshold: 0.3 } // 30% video dikhte hi start ho jaye
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      video.muted = false;
    }
  };

  return (
    <div 
      className="relative w-[78vw] sm:w-[300px] md:w-[320px] lg:w-[280px] xl:w-[320px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-gray-900 border-[6px] border-white shadow-2xl group transition-all duration-700 hover:scale-[1.02] snap-center shrink-0"
    >
      <video
        ref={videoRef}
        src={src} 
        className="w-full h-full object-cover transition-all duration-1000"
        loop
        muted
        playsInline
        preload="auto" // Foran load ho jaye taake user ko wait na karna pare
      />
      
      {/* Clean Black Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="absolute bottom-10 left-8 right-8 flex justify-between items-end transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <div className="space-y-1 text-left">
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">Drop 2026</p>
          <h3 className="text-white text-2xl font-black uppercase italic tracking-tighter leading-none">{title}</h3>
        </div>
        
        <button 
          onClick={toggleFullScreen}
          className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl text-white border border-white/20 hover:bg-white hover:text-black transition-all shadow-xl"
        >
          <Maximize2 size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

const VideoStoryWall = () => {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <section className="w-full bg-[#edf1f5] py-24 overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <div className="text-center space-y-4">
           <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gray-300" />
              <p className="text-[#0145f2] text-xs font-black uppercase tracking-[0.5em]">The Archive</p>
              <div className="h-px w-12 bg-gray-300" />
           </div>
           <h2 className="text-5xl md:text-8xl font-black text-[#0145f2] tracking-tighter uppercase italic">
             Our <span className="text-gray-300 not-italic">Stories</span>
           </h2>
        </div>
      </div>

      {/* Horizontal Scroll with Side-Peek */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex lg:justify-center items-center gap-6 overflow-x-auto px-10 md:px-12 pb-16 no-scrollbar snap-x snap-mandatory lg:snap-none"
      >
        {storyData.map((story) => (
          <VideoCard key={story.id} src={story.url} title={story.title} />
        ))}
      </div>

      {/* Modern Progress Bar - Mobile Pe User Guidance */}
      <div className="flex justify-center -mt-8 lg:hidden">
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0145f2] transition-all duration-300"
            style={{ width: `${Math.max(10, scrollProgress)}%` }}
          />
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default VideoStoryWall;