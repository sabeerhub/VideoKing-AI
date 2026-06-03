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
      className="min-h-screen bg-black text-neutral-100 selection:bg-neutral-800 selection:text-white font-sans overflow-x-hidden antialiased"
    >
      {/* Absolute Ambient Grid & Glows - Luxury Vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-neutral-900 rounded-full blur-[160px] opacity-25 pointer-events-none z-0" />

      {/* --- PREMIUM FIXED NAVBAR --- */}
      <nav 
        id="navbar-sticky"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "backdrop-blur-md bg-black/60 border-b border-neutral-900/60 py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-6.5 h-6.5 bg-neutral-105 rounded-md flex items-center justify-center font-mono font-bold text-xs text-black">
              <Video size={12} className="stroke-[2.5]" />
            </div>
            <span className="font-sans font-medium tracking-tight text-white text-sm">
              VideoKing-AI
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-6">
            <button
              onClick={onLoginClick}
              className="text-neutral-400 hover:text-white text-xs font-semibold tracking-tight transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4.5 py-2 text-xs bg-white text-black font-semibold tracking-tight hover:bg-neutral-100 transition-all rounded-xl shadow-lg active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>

        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-20 md:pt-56 md:pb-32 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center z-10">
        
        {/* Large Cinematic Typography */}
        <h1 className="text-5xl sm:text-7xl md:text-[105px] font-sans font-normal tracking-tight text-white leading-[0.9] select-none text-balance max-w-5xl">
          VideoKing-AI
        </h1>

        {/* CTA Button Group */}
        <div className="flex items-center justify-center gap-4 mt-14 w-full sm:w-auto">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-black text-xs font-semibold tracking-tight hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-white/5"
          >
            <span>Get Started</span>
            <ArrowRight size={13} className="stroke-[2.5]" />
          </button>
          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-semibold tracking-tight hover:bg-neutral-800 transition-all flex items-center justify-center cursor-pointer"
          >
            Sign In
          </button>
        </div>

      </section>

      {/* --- CINEMATIC PRODUCT SHOWCASE --- */}
      <section className="relative pb-24 md:pb-36 z-10 max-w-6xl mx-auto px-6">
        
        {/* Dynamic Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 bg-neutral-900/30 p-1 rounded-xl border border-neutral-900 max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveWorkflowTab("video");
              setIsPlayingDemo(false);
            }}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeWorkflowTab === "video" ? "bg-white text-black font-semibold shadow" : "text-neutral-450 hover:text-white"
            }`}
          >
            Video Generation
          </button>
          <button
            onClick={() => {
              setActiveWorkflowTab("image");
              setIsPlayingDemo(false);
            }}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeWorkflowTab === "image" ? "bg-white text-black font-semibold shadow" : "text-neutral-450 hover:text-white"
            }`}
          >
            Image Generation
          </button>
          <button
            onClick={() => {
              setActiveWorkflowTab("upload");
              setIsPlayingDemo(false);
            }}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeWorkflowTab === "upload" ? "bg-white text-black font-semibold shadow" : "text-neutral-450 hover:text-white"
            }`}
          >
            Upload Workflow
          </button>
        </div>

        {/* Master Glass Panel Showcase */}
        <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-3xl backdrop-blur-xl relative aspect-[16/10] w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/10 via-transparent to-neutral-900/10 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {activeWorkflowTab === "video" && (
              <motion.div 
                key="video-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="h-full flex flex-col justify-between gap-6 relative z-10"
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-neutral-900/60 pb-4 select-none">
                  <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Video Generation Workspace Preview</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500">VIRAL CTR FORECAST: 98%</span>
                </div>

                {/* Sub-Layout Content Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left script info */}
                  <div className="md:col-span-7 text-left space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-neutral-450 tracking-wider uppercase">Active Project Title</p>
                      <h3 className="text-xl md:text-2xl font-sans text-white font-medium select-text">
                        The Future of Automated Studio Craft
                      </h3>
                    </div>

                    <div className="space-y-3 bg-neutral-900/15 border border-neutral-900/80 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-450 font-mono tracking-wider uppercase">
                        <Volume2 size={12} className="text-neutral-500" />
                        <span>Voice Guidance: Zephyr Core</span>
                      </div>
                      <p className="text-xs text-neutral-300 font-mono select-text leading-relaxed">
                        "{mockScenes[activeSceneIndex].narration}"
                      </p>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] tracking-wide text-neutral-500">
                      <p>🎥 Camera: {mockScenes[activeSceneIndex].camera}</p>
                      <p>🎬 Current Scene: {activeSceneIndex + 1} / 3</p>
                    </div>
                  </div>

                  {/* Right interactive video screen preview */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="aspect-[9/16] w-full max-w-[190px] bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden relative shadow-2xl flex flex-col justify-between p-4 group">
                      
                      {/* Simulated preview graphics */}
                      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black select-none pointer-events-none" />
                      
                      <div className="relative flex justify-between items-center text-[8px] font-mono text-neutral-500 z-10">
                        <span>SCENE {activeSceneIndex + 1}</span>
                        <span className="text-neutral-400 font-bold">1080p</span>
                      </div>

                      {/* Concentric visual feedback Dial */}
                      <div className="relative flex-1 flex flex-col items-center justify-center gap-3 z-10 py-6">
                        <div className="w-12 h-12 rounded-full border border-neutral-850 bg-neutral-900/60 flex items-center justify-center relative">
                          {isPlayingDemo ? (
                            <div className="flex items-end gap-0.5 h-3">
                              <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[1.5px] bg-neutral-350" />
                              <motion.span animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[1.5px] bg-neutral-350" />
                              <motion.span animate={{ height: [5, 10, 5] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-[1.5px] bg-neutral-350" />
                            </div>
                          ) : (
                            <Play size={12} className="text-white fill-white ml-0.5" />
                          )}

                          <svg className="absolute inset-0 -rotate-90 w-full h-full">
                            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" fill="transparent" className="text-neutral-900" />
                            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" fill="transparent" strokeDasharray={138.2} strokeDashoffset={138.2 - (138.2 * sceneProgress) / 100} className="text-white transition-all duration-100" />
                          </svg>
                        </div>
                      </div>

                      {/* Display texts */}
                      <div className="relative z-10 bg-black/60 backdrop-blur p-2 rounded-lg border border-neutral-850/60">
                        <p className="text-[11px] font-extrabold text-neutral-150 text-center uppercase tracking-tight">
                          {mockScenes[activeSceneIndex].overlay}
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Footer simulation actions */}
                <div className="border-t border-neutral-900/60 pt-4 flex justify-between items-center select-none">
                  <span className="text-[10px] font-mono text-neutral-600">STORYBOARD PROGRESS TIMELINE // CALM ENGINE</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold text-xs tracking-tight shadow hover:bg-neutral-100 cursor-pointer"
                    >
                      {isPlayingDemo ? "Pause Simulation" : "Play Showcase Video"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeWorkflowTab === "image" && (
              <motion.div 
                key="image-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="h-full flex flex-col justify-between gap-6 relative z-10 text-left"
              >
                <div className="flex items-center justify-between border-b border-neutral-900/60 pb-4 select-none">
                  <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                    <span>Expanded Generative Canvas</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500">8K ULTRA SPEC</span>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  
                  {/* Left image details cards */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase">Refined prompt description</p>
                      <p className="text-xs text-neutral-300 font-mono leading-relaxed bg-neutral-900/10 border border-neutral-900 p-3 rounded-xl select-text">
                        "Ultra-high resolution cinematic visual of pristine concrete workstation styled in Scandinavian minimal wood, utilizing warm key side light softboxes, circular background bokeh."
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase">Lighting Schema:</span>
                        <p className="text-neutral-400">Warm Key lights softbox (6500K)</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase">Aspect constraint:</span>
                        <p className="text-neutral-400">16:9 Landscape</p>
                      </div>
                    </div>
                  </div>

                  {/* Right simulated aesthetic palette */}
                  <div className="space-y-4">
                    <p className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase">Dynamic HEX Color Coordinates Harmonizer</p>
                    <div className="grid grid-cols-5 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-905">
                      {[
                        { hex: "#080808", label: "Pure Carbon" },
                        { hex: "#1A1A1A", label: "Studio Soft" },
                        { hex: "#3B2A1E", label: "Smoked Oak" },
                        { hex: "#9E826C", label: "Suede Wool" },
                        { hex: "#F5F5F7", label: "Silver Satin" }
                      ].map((col, cIdx) => (
                        <div key={cIdx} className="space-y-1 text-center font-mono">
                          <div className="aspect-square rounded-md shadow" style={{ backgroundColor: col.hex }} />
                          <p className="text-[8px] text-white font-medium">{col.hex}</p>
                          <p className="text-[7px] text-neutral-600 scale-90 leading-none truncate uppercase">{col.label}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-neutral-500 italic">
                      Color coordinates are derived from the conceptual composition parameters automatically.
                    </p>
                  </div>

                </div>

                <div className="border-t border-neutral-900/60 pt-4 flex justify-between items-center select-none font-mono text-[10px] text-neutral-600">
                  <span>PROMPT EXPANSION LAYERS COMPLETED</span>
                  <span>COHESIVE PALETTES CREATED</span>
                </div>
              </motion.div>
            )}

            {activeWorkflowTab === "upload" && (
              <motion.div 
                key="upload-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="h-full flex flex-col justify-between gap-6 relative z-10 text-left"
              >
                <div className="flex items-center justify-between border-b border-neutral-900/60 pb-4 select-none">
                  <div className="flex items-center gap-2 font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                    <span>Complex Document Parsing</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500">SECURE STAT_SANDBOX</span>
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto space-y-6 text-center w-full">
                  
                  {/* Upload box mock */}
                  <div className="border border-dashed border-neutral-800 p-8 rounded-2xl bg-neutral-900/5 select-none space-y-3">
                    <UploadCloud size={28} className="mx-auto text-neutral-500" />
                    <div>
                      <p className="text-xs font-semibold text-white tracking-tight">Drop branding PDF or visual reference briefs</p>
                      <p className="text-[10px] text-neutral-500 font-mono uppercase mt-1">Accepts IMAGES, TEXTS, PDFs up to 10MB</p>
                    </div>
                  </div>

                  {/* Active list chips mock */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-[10px] text-neutral-300">
                      <Layout size={10} className="text-neutral-500" />
                      <span>brand_identity_guide.pdf</span>
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-[10px] text-neutral-300">
                      <Layout size={10} className="text-neutral-500" />
                      <span>workspace_concept.jpg</span>
                    </span>
                  </div>

                </div>

                <div className="border-t border-neutral-900/60 pt-4 flex justify-between items-center select-none font-mono text-[10px] text-neutral-600">
                  <span>SANDBOX DE-DESTRUCT FILE RECEPTOR ACTIVE</span>
                  <span>AES-256 ENCRYPTION KEYS ARMED</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </section>

      {/* --- PRODUCT FEATURES SECTION --- */}
      <section id="features-section" className="py-24 md:py-36 border-t border-neutral-950 bg-neutral-950/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Grid Layout of Features and whitespace */}
          <div className="max-w-xl text-left space-y-3 mb-20">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">CORE TECHNOLOGY CAPABILITIES</span>
            <h2 className="text-3xl md:text-5xl font-sans font-normal tracking-tight text-white select-none">
              Primacy in Creative Automation
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* AI Video Generation */}
            <div className="group bg-neutral-950 border border-neutral-900/80 p-8 rounded-2xl space-y-4 hover:border-neutral-850 hover:bg-neutral-900/5 transition-all duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                <Video size={16} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-white tracking-tight">AI Video Generation</h3>
                <p className="text-xs text-neutral-450 leading-relaxed font-sans">
                  Generate comprehensive multi-scene short video storyboards, fluid kamera dolly directives, and captions customized for virality.
                </p>
              </div>
            </div>

            {/* AI Image Generation */}
            <div className="group bg-neutral-950 border border-neutral-900/80 p-8 rounded-2xl space-y-4 hover:border-neutral-850 hover:bg-neutral-900/5 transition-all duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                <Sparkles size={16} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-white tracking-tight">AI Image Generation</h3>
                <p className="text-xs text-neutral-450 leading-relaxed font-sans">
                  Incorporate fast keyframe drafting cores, atmospheric light configurations, virtual lenses, and exact hex swatch models instantly.
                </p>
              </div>
            </div>

            {/* Smart File Understanding */}
            <div className="group bg-neutral-950 border border-neutral-900/80 p-8 rounded-2xl space-y-4 hover:border-neutral-850 hover:bg-neutral-900/5 transition-all duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                <UploadCloud size={16} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-white tracking-tight">Smart File Understanding</h3>
                <p className="text-xs text-neutral-450 leading-relaxed font-sans">
                  Direct raw files, guidelines datasets, branding outlines, or mock templates straight to the rendering model pipelines seamlessly.
                </p>
              </div>
            </div>

            {/* Prompt-to-Content Creation */}
            <div className="group bg-neutral-950 border border-neutral-900/80 p-8 rounded-2xl space-y-4 hover:border-neutral-850 hover:bg-neutral-900/5 transition-all duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                <Sliders size={16} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-white tracking-tight">Prompt-to-Content Creation</h3>
                <p className="text-xs text-neutral-450 leading-relaxed font-sans">
                  Transform raw conversational instructions into refined technical schemas containing strategic narration drafts, voice setups, and tags.
                </p>
              </div>
            </div>

            {/* High-Speed Rendering */}
            <div className="group bg-neutral-950 border border-neutral-900/80 p-8 rounded-2xl space-y-4 hover:border-neutral-850 hover:bg-neutral-900/5 transition-all duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                <Cpu size={16} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-white tracking-tight">High-Speed Rendering</h3>
                <p className="text-xs text-neutral-450 leading-relaxed font-sans">
                  Unleash continuous distributed processing limits across optimized high-memory cloud container grids without latency.
                </p>
              </div>
            </div>

            {/* Secure Authentication */}
            <div className="group bg-neutral-950 border border-neutral-900/80 p-8 rounded-2xl space-y-4 hover:border-neutral-850 hover:bg-neutral-900/5 transition-all duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                <Shield size={16} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-white tracking-tight">Secure Authentication</h3>
                <p className="text-xs text-neutral-450 leading-relaxed font-sans">
                  Operate inside safe authentication parameters using Google Sign-In, credential hashing, and secure legal consent checkboxes.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- TRUST SECTION --- */}
      <section className="py-24 border-t border-neutral-900 bg-neutral-950 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Header Column */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-neutral-550 uppercase">Zero-Trust Infrastructure</span>
              <h3 className="text-2xl md:text-3xl font-sans font-medium tracking-tight text-white select-none leading-snug">
                Designed for enterprise compliance
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Our architecture isolates individual credentials, file reference streams, and output compositions inside secure cloud environments under strict TLS parameters.
              </p>
            </div>

            {/* Indicators Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
              
              {/* Enterprise Security */}
              <div className="space-y-2 p-5 rounded-2xl bg-neutral-900/10 border border-neutral-900">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-neutral-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Enterprise Security</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Symmetric AES-256 data envelope encryption protocols secure content. API access tokens and user assets remain fully isolated at rest.
                </p>
              </div>

              {/* Global Infrastructure */}
              <div className="space-y-2 p-5 rounded-2xl bg-neutral-900/10 border border-neutral-900">
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-neutral-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Global Infrastructure</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  High-capacity GPU clusters with redundant hardware failover routing assure low latency and rapid rendering loops globally.
                </p>
              </div>

              {/* Privacy Focused */}
              <div className="space-y-2 p-5 rounded-2xl bg-neutral-900/10 border border-neutral-900">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-neutral-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">Privacy Focused</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  No tracking scripts or advertising trackers are enabled on VideoKing visual tools. Ephemeral storage cleans rendering buffers automatically.
                </p>
              </div>

              {/* High Availability */}
              <div className="space-y-2 p-5 rounded-2xl bg-neutral-900/10 border border-neutral-900">
                <div className="flex items-center gap-2">
                  <Globe2 size={14} className="text-neutral-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">High Availability</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  We maintain a historical platform availability index of 99.99%. Priority server queues instantly auto-scale load boundaries.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- WORLD-CLASS MULTI-COLUMN FOOTER --- */}
      <footer id="mega-footer" className="bg-black border-t border-neutral-900 pt-20 pb-12 relative z-10 text-left select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            
            {/* Branding Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-5.5 h-5.5 bg-white text-black font-semibold rounded flex items-center justify-center font-mono text-[9px]">
                  VK
                </div>
                <span className="font-sans font-medium text-xs tracking-tight text-white select-none">
                  VideoKing-AI
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs font-sans">
                A highly secure, pro creative studio for storyboard draftings and cinematic AI expansions.
              </p>
            </div>

            {/* Product Column */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono tracking-widest text-neutral-450 uppercase uppercase">Product</h4>
              <ul className="space-y-2 text-xs text-neutral-500 font-sans">
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">Features</button></li>
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">Pricing</button></li>
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">Updates</button></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono tracking-widest text-neutral-450 uppercase uppercase">Resources</h4>
              <ul className="space-y-2 text-xs text-neutral-500 font-sans font-sans">
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">Documentation</button></li>
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">Support</button></li>
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">Help Center</button></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono tracking-widest text-neutral-450 uppercase uppercase">Legal</h4>
              <ul className="space-y-2.5 text-xs text-neutral-500 font-sans">
                <li><button onClick={onPrivacyClick} className="hover:text-white transition-colors cursor-pointer text-left">Privacy Policy</button></li>
                <li><button onClick={onTermsClick} className="hover:text-white transition-colors cursor-pointer text-left">Terms &amp; Conditions</button></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono tracking-widest text-neutral-450 uppercase uppercase">Company</h4>
              <ul className="space-y-2 text-xs text-neutral-500 font-sans">
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">About</button></li>
                <li><button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer text-left">Contact</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Area */}
          <div className="pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[10px] text-neutral-600">
            <p>
              © 2026 VideoKing-AI. Full-stack cloud platform. Secure TLS 1.3 protocol.
            </p>
            <div className="flex gap-4">
              <span>ACTIVE REGULATOR // S01</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
