"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Globe, BarChart3, Star, Zap, ZapOff } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !fragmentsRef.current) return;

    // Mouse Parallax Effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      gsap.to(".parallax-layer-1", { x: xPos * 0.5, y: yPos * 0.5, duration: 1, ease: "power2.out" });
      gsap.to(".parallax-layer-2", { x: -xPos, y: -yPos, duration: 1.2, ease: "power2.out" });
      gsap.to(".parallax-layer-3", { x: xPos * 1.5, y: yPos * 1.5, duration: 1.5, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Scroll Animations
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
      });

      gsap.to(".floating-card", {
        y: -50,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-transparent overflow-hidden selection:bg-primary selection:text-white">
      
      {/* Cinematic Background Blurs (Subtle to let the background image shine) */}
      <div className="parallax-layer-1 absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px] opacity-50" />
      </div>

      {/* Floating Fragments - Parallax Elements */}
      <div ref={fragmentsRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Top Left Glass Card */}
        <div className="parallax-layer-2 absolute top-20 left-[10%] hidden lg:block">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glassmorphism p-6 rounded-[2rem] border border-white/20 shadow-2xl rotate-[-12deg] w-48"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4">
              <Zap className="fill-primary" size={20} />
            </div>
            <div className="h-2 w-full bg-muted rounded-full mb-2" />
            <div className="h-2 w-2/3 bg-muted rounded-full" />
          </motion.div>
        </div>

        {/* Center Right Floating Icon */}
        <div className="parallax-layer-3 absolute top-[40%] right-[15%] hidden xl:block">
          <motion.div 
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center backdrop-blur-3xl"
          >
            <Star className="text-primary animate-pulse" size={40} />
          </motion.div>
        </div>

        {/* Bottom Left Floating Image Fragment */}
        <div className="parallax-layer-2 absolute bottom-40 left-[5%] hidden lg:block">
          <motion.div 
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="glassmorphism p-4 rounded-3xl border border-white/10 shadow-2xl rotate-[15deg] w-64 h-40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-0" />
            <div className="relative z-10 space-y-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="space-y-1">
                  <div className="h-2 w-24 bg-white/30 rounded-full" />
                  <div className="h-2 w-16 bg-white/20 rounded-full" />
                </div>
              </div>
              <div className="h-12 w-full bg-white/10 rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section relative z-20 min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20">
        <div className="container max-w-6xl text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-muted/50 border border-border backdrop-blur-md mb-10"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground">The 2026 Creative Standard</span>
          </motion.div>

          <h1 className="hero-title relative text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-10">
            <span className="block italic text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50">WRITE</span>
            <span className="block text-primary relative">
              JOURNAL
              <motion.div 
                className="absolute -right-8 -top-8 text-foreground opacity-20 hidden md:block"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <ZapOff size={80} />
              </motion.div>
            </span>
            <span className="block outline-text">STORIES</span>
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg md:text-2xl text-muted-foreground mb-16 leading-relaxed font-medium"
          >
            Unleash the full potential of your narrative with a modern workspace designed for the next generation of digital storytellers.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link 
              href="/blog" 
              className="group relative h-20 px-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,17,17,0.3)]"
            >
              EXPLORE FEED
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 scale-110 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
            </Link>
            
            <Link 
              href="/signup" 
              className="group h-20 px-12 rounded-full glassmorphism border border-border/50 flex items-center justify-center text-xl font-black hover:bg-muted transition-all active:scale-95"
            >
              JOIN COMMUNITY
            </Link>
          </motion.div>
        </div>

        {/* Feature Bento Preview */}
        <div className="container max-w-7xl mt-40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            {/* Big Feature Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-7 rounded-[3rem] glassmorphism p-12 border border-border/50 shadow-2xl relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-4xl font-black tracking-tight mb-6">Immersive Writing Experience</h3>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-md">Our document-first editor removes distraction, leaving only you and your words.</p>
              </div>
              <div className="relative z-10 flex gap-4 mt-12">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-1.5 w-12 bg-primary/20 rounded-full" />)}
              </div>
            </motion.div>

            {/* Side Column */}
            <div className="md:col-span-5 grid grid-rows-2 gap-6">
              <motion.div 
                whileHover={{ y: -10 }}
                className="rounded-[3rem] glassmorphism p-10 border border-border/50 shadow-2xl flex flex-col justify-center gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Globe size={24} />
                  </div>
                  <h4 className="text-2xl font-black tracking-tight">Global Reach</h4>
                </div>
                <p className="text-muted-foreground font-medium">Instantly translate and share your stories with a worldwide audience.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="rounded-[3rem] glassmorphism p-10 border border-border/50 shadow-2xl flex flex-col justify-center gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                    <BarChart3 size={24} />
                  </div>
                  <h4 className="text-2xl font-black tracking-tight">Deep Analytics</h4>
                </div>
                <p className="text-muted-foreground font-medium">Understand your readers with precision insights and engagement metrics.</p>
              </motion.div>
            </div>
          </div>
        </div>

      </section>

      <style jsx global>{`
        .outline-text {
          -webkit-text-stroke: 1px hsl(var(--foreground));
          color: transparent;
          opacity: 0.3;
        }
        .dark .outline-text {
          -webkit-text-stroke: 1px hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
}
