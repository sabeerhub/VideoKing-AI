import React, { useState, useEffect } from "react";
import { 
  Sparkles, ArrowRight, Video, Shield, Cpu, UploadCloud, 
  Zap, Users, Play, Pause, Clock, Volume2, Layout, Check, 
  Eye, Sliders, Layers, Server, Globe2, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

export default function LandingPage({ 
  onGetStarted, 
  onLoginClick, 
  onPrivacyClick, 
  onTermsClick 
}: LandingPageProps) {
  // Navigation scrolling state for elegant blur effect
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"video" | "image" | "upload">("video");
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);

  // Monitor scroll for header background blur adjustment
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Demo storyboard simulation
  useEffect(() => {
    let playTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (isPlayingDemo) {
      progressTimer = setInterval(() => {
        setSceneProgress((prev) => {
          if (prev >= 100) {
            setActiveSceneIndex((currentIdx) => (currentIdx + 1) % 3);
            return 0;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setSceneProgress(0);
    }

    return () => {
      clearInterval(progressTimer);
    };
  }, [isPlayingDemo]);

  const mockScenes = [
    {
      title: "Opening Scene",
      camera: "Slow dramatic dolly in, macro focus",
      narration: "In a world demanding speed, high-fidelity creative clarity rises above the noise.",
      overlay: "FIDELITY IN FOCUS"
    },
    {
      title: "Synthesizer Detail",
      camera: "Pan left with soft bokeh light beams",
      narration: "A continuous flow of intelligence compiling abstract thoughts into visual states.",
      overlay: "INTELLIGENT PIPELINE"
    },
    {
      title: "Final Cinematic Card",
      camera: "Reveal crane shot, cinematic morning sun",
      narration: "Welcome to VideoKing-AI. The absolute studio framework for modern creators.",
      overlay: "VIDEOKING SYSTEM CODE"
    }
  ];

  return (
    <div 
      id="landing-root" 
      className="h-screen bg-brand-black text-neutral-100 selection:bg-neutral-800 selection:text-white font-sans overflow-hidden antialiased flex flex-col"
    >
      {/* Absolute Ambient Grid & Glows - Luxury Vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-brand-dark-gray rounded-full blur-[160px] opacity-25 pointer-events-none z-0" />

      {/* --- PREMIUM FIXED NAVBAR --- */}
      <nav 
        id="navbar-sticky"
        className="relative z-50 bg-transparent py-8"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-mono font-bold text-xs text-black">
              <Video size={16} className="stroke-[2.5]" />
            </div>
            <span className="font-sans font-semibold tracking-tight text-white text-lg">
              VideoKing-AI
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-8">
            <button
              onClick={onLoginClick}
              className="text-neutral-400 hover:text-white text-sm font-semibold tracking-tight transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 text-sm bg-white text-black font-semibold tracking-tight hover:bg-neutral-100 transition-all rounded-xl shadow-lg active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>

        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center z-10 px-6">
        
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          {/* Large Cinematic Typography */}
          <h1 className="text-7xl sm:text-9xl md:text-[140px] font-sans font-medium tracking-tighter text-white leading-[0.8] select-none text-balance max-w-6xl">
            VideoKing-AI
          </h1>

          {/* CTA Button Group */}
          <div className="flex items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black text-base font-semibold tracking-tight hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xl shadow-white/10 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </motion.div>

      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="relative z-10 py-12 px-6 border-t border-brand-border/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
          <p>© 2026 VideoKing-AI. All rights reserved.</p>
          <div className="flex gap-8">
            <button onClick={onPrivacyClick} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <button onClick={onTermsClick} className="hover:text-white transition-colors cursor-pointer">Terms</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
