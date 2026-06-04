import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, Upload, Image as ImageIcon, Video as VideoIcon, 
  FileText, User, LogOut, Loader2, Trash2, Play, Pause, 
  TrendingUp, Sliders, Download, X, Clock, Compass, Volume2, 
  Layout, CheckCircle, Copy, Info, Shield, Server, Globe2, UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserProfile, AttachedFile, Message, GenerationMode, 
  VideoScene, VideoGenerationData, ImageGenerationData, 
  GenerationSettings 
} from "../types";

interface DashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

export default function Dashboard({ userProfile, onLogout }: DashboardProps) {
  // Navigation active tab switching (Generate, Images, Profile, Settings)
  type ActiveTab = "generate" | "images" | "profile" | "settings";
  const [activeTab, setActiveTab] = useState<ActiveTab>("generate");

  // Conversational state
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [mode, setMode] = useState<GenerationMode>("video");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Production Target Output state
  const [activeVideoOutput, setActiveVideoOutput] = useState<VideoGenerationData | null>(null);
  const [activeImageOutput, setActiveImageOutput] = useState<{data: ImageGenerationData, imageBase64?: string | null} | null>(null);

  // Studio Settings State
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: "16:9",
    videoResolution: "1080p",
    narratorVoice: "Zephyr"
  });

  // Simulated Media Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0); // 0 to 100 within a scene
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cooldown rate limiting
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number>(0);
  const rateLimitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clipboard copy feedback triggers
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll conversational feed
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Rate Limiting Cooldown effect
  useEffect(() => {
    if (rateLimitCooldown > 0) {
      rateLimitTimerRef.current = setTimeout(() => {
        setRateLimitCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (rateLimitTimerRef.current) clearTimeout(rateLimitTimerRef.current);
    };
  }, [rateLimitCooldown]);

  // Dismount Simulation Timers Cleanup
  useEffect(() => {
    return () => {
      stopVideoSimulation();
    };
  }, []);

  // Storyboard play simulators logic
  const startVideoSimulation = (videoData: VideoGenerationData) => {
    stopVideoSimulation();
    setIsPlaying(true);
    setActiveSceneIndex(0);
    setSceneProgress(0);

    const scenes = videoData.scenes;
    if (scenes.length === 0) return;

    let currentSceneIdx = 0;
    let elapsedMs = 0;

    const triggerSceneTransition = (idx: number) => {
      if (idx >= scenes.length) {
        setIsPlaying(false);
        setActiveSceneIndex(0);
        setSceneProgress(0);
        return;
      }

      currentSceneIdx = idx;
      setActiveSceneIndex(idx);
      setSceneProgress(0);
      elapsedMs = 0;

      const durationMs = scenes[idx].duration * 1000;

      playTimerRef.current = setTimeout(() => {
        triggerSceneTransition(idx + 1);
      }, durationMs);
    };

    triggerSceneTransition(0);

    progressTimerRef.current = setInterval(() => {
      elapsedMs += 100;
      const totalDur = scenes[currentSceneIdx]?.duration * 1000 || 4000;
      const percentage = Math.min((elapsedMs / totalDur) * 100, 100);
      setSceneProgress(percentage);
    }, 100);
  };

  const stopVideoSimulation = () => {
    setIsPlaying(false);
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  const handleToggleSimulation = () => {
    if (isPlaying) {
      stopVideoSimulation();
    } else if (activeVideoOutput) {
      startVideoSimulation(activeVideoOutput);
    }
  };

  const handleResetTimeline = () => {
    if (activeVideoOutput) {
      startVideoSimulation(activeVideoOutput);
    }
  };

  // Drag-and-drop actions
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processAttachedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processAttachedFile(files[0]);
    }
  };

  const processAttachedFile = (file: File) => {
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      alert("Attachment exceeds limit. Please upload a file smaller than 10MB.");
      return;
    }

    const typeLower = file.type.toLowerCase();
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf", "text/plain"];
    if (!allowed.some(p => typeLower.includes(p) || typeLower === p)) {
      alert("Unsupported file format. Please upload JPEG, PNG, WEBP, or PDF files.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Dispatch prompt submission API
  const handleSendMessage = async (e?: React.FormEvent, customPresetPrompt?: string, forcedMode?: GenerationMode) => {
    if (e) e.preventDefault();
    
    const promptToSend = customPresetPrompt || userInput;
    if (!promptToSend.trim()) return;

    if (rateLimitCooldown > 0) {
      alert(`Access Throttled. Please wait ${rateLimitCooldown}s for automated flow regulations.`);
      return;
    }

    const promptPayload = promptToSend;
    const currentMode = forcedMode || mode;
    const currentAttached = attachedFile;

    // Reset writing buffers
    setUserInput("");
    setAttachedFile(null);
    setIsGenerating(true);

    const userMsgId = Math.random().toString(36).substring(7);
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: promptPayload,
      mode: currentMode,
      attachedFile: currentAttached ? {
        name: currentAttached.name,
        type: currentAttached.type,
        size: currentAttached.size
      } : undefined
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptPayload,
          mode: currentMode,
          aspectRatio: settings.aspectRatio,
          file: currentAttached ? {
            name: currentAttached.name,
            type: currentAttached.type,
            size: currentAttached.size,
            data: currentAttached.data
          } : undefined
        })
      });

      const serverResult = await response.json();

      if (!response.ok || serverResult.error) {
        throw new Error(serverResult.error || "Generation query crashed on the server.");
      }

      const aiMsgId = Math.random().toString(36).substring(7);
      const aiMsg: Message = {
        id: aiMsgId,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: currentMode === "video" 
          ? `🎬 Storyboard model initialized for "${serverResult.data.title}" successfully.`
          : `🎨 Refined cinematic rendering parameters for "${promptPayload.substring(0, 30)}..." generated below.`,
        mode: currentMode,
        videoResult: currentMode === "video" ? serverResult.data : undefined,
        imageResult: currentMode === "image" ? serverResult.data : undefined,
        imageBase64: serverResult.imageBase64 || undefined,
        warning: serverResult.warning || undefined
      };

      setMessages(prev => [...prev, aiMsg]);

      // Direct focus on the active preview monitors automatically
      if (currentMode === "video" && serverResult.data) {
        setActiveVideoOutput(serverResult.data);
        startVideoSimulation(serverResult.data);
      } else if (currentMode === "image" && serverResult.data) {
        setActiveImageOutput({
          data: serverResult.data,
          imageBase64: serverResult.imageBase64
        });
      }

      setRateLimitCooldown(10);

    } catch (err: any) {
      console.error(err);
      const errId = Math.random().toString(36).substring(7);
      setMessages(prev => [...prev, {
        id: errId,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `⚠️ Platform notice: ${err.message || "An issue occurred communicating with the server."}`
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const starterPrompts = [
    {
      title: "TikTok Growth Hook",
      prompt: "3 extreme conversion hacks for tech developers looking to capture viral retainment",
      mode: "video" as GenerationMode
    },
    {
      title: "Studio Product Commercial",
      prompt: "A cinematic 15s commercial matching a luxury biodegradable water flask on black granite",
      mode: "video" as GenerationMode
    },
    {
      title: "Cyberpunk Synths Haven",
      prompt: "Futuristic hardware synthesizer console workspace, matte concrete desk, neon glowing indicator boards",
      mode: "image" as GenerationMode
    }
  ];

  return (
    <div 
      id="studio-layout"
      className="h-screen bg-brand-black text-neutral-100 flex flex-col overflow-hidden font-sans select-none shadow"
    >
      
      {/* ----------------------------------------------------- */}
      {/* 1. TOP PREMIUM PLINTH NAVIGATION                      */}
      {/* ----------------------------------------------------- */}
      <nav 
        id="dashboard-header" 
        className="h-16 border-b border-brand-border bg-brand-black/50 backdrop-blur-xl px-8 flex items-center justify-between shrink-0 select-none z-20"
      >
        {/* Left Brand */}
        <div className="flex items-center gap-4 select-none">
          <div className="w-8 h-8 bg-white text-black font-bold rounded-xl flex items-center justify-center font-mono text-sm shadow-xl shadow-white/5">
            VK
          </div>
          <span className="font-sans font-semibold text-white text-base tracking-tight select-none">
            VideoKing-AI
          </span>
        </div>

        {/* Center Nav tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-neutral-900/40 border border-white/[0.05]">
          {[
            { id: "generate", label: "Studio" },
            { id: "images", label: "Assets" },
            { id: "profile", label: "Identity" },
            { id: "settings", label: "Config" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-6 py-2 rounded-xl text-sm font-medium tracking-tight transition-all relative cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-white text-black shadow-2xl"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Logout */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
            <UserCheck size={11} className="text-neutral-500" />
            <span>Developer Sandbox</span>
          </span>
          <button
            onClick={onLogout}
            className="p-2 px-3 hover:bg-neutral-900 hover:text-red-400 text-neutral-400 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* ----------------------------------------------------- */}
      {/* 2. DYNAMIC WORKSPACE PANEL CONTENT VIEWPORT           */}
      {/* ----------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Absolute Drag Upload Mesh */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              id="drag-drop-curtain"
              className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-8 border-2 border-dashed border-neutral-800 m-4 rounded-2xl"
            >
              <div className="text-center space-y-3 pointer-events-none">
                <Upload size={24} className="mx-auto text-white animate-bounce" />
                <p className="text-sm font-semibold text-white">Drop to Upload</p>
                <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">IMAGERY, TEXTS, OR PDFs UP TO 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* ================================================= */}
          {/* A. GENERATE COCKPIT VIEWPORT                     */}
          {/* ================================================= */}
          {activeTab === "generate" && (
            <motion.div 
              key="tab-generate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col md:flex-row h-full overflow-hidden"
            >
              
              {/* Left Column: Command & Input Workspace */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4 md:p-8 border-r border-brand-border bg-brand-black relative">
                
                {/* Visual Ambient Node */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-dark-gray rounded-full blur-[120px] opacity-25 pointer-events-none" />

                {/* Main Centered prompt block */}
                <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center space-y-8 py-8 relative z-10 text-left">
                  
                  {/* Top Header info */}
                  {messages.length === 0 && (
                    <div className="text-center space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-white">
                        <Sparkles size={16} className="text-neutral-200" />
                      </div>
                      <h3 className="text-lg font-medium text-white">Studio Blueprint</h3>
                      <p className="text-xs text-neutral-550 max-w-xs mx-auto leading-normal">
                        Initialize multi-frame storyboards. Attach briefs or describe your vision.
                      </p>
                    </div>
                  )}

                  {/* Centered Premium Prompt compose card */}
                  <div className="bg-neutral-900/30 border border-white/[0.05] p-3 rounded-2xl shadow-3xl backdrop-blur-2xl space-y-3 ring-1 ring-white/[0.05]">
                    
                    {/* Attachment mini preview */}
                    <AnimatePresence>
                      {attachedFile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="p-3 rounded-2xl bg-black/40 border border-white/[0.05] flex items-center justify-between gap-4 text-left"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                              {attachedFile.type.startsWith("image/") ? <ImageIcon size={16} /> : <FileText size={16} />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-white font-medium truncate max-w-sm">{attachedFile.name}</p>
                              <p className="text-[10px] text-neutral-500 uppercase font-mono tracking-tight">{formatSize(attachedFile.size)} • {attachedFile.type.split('/')[1]}</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveAttachment}
                            className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Text Field */}
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Write your prompt to generate a viral video..."
                      className="w-full bg-transparent outline-none border-none text-base leading-relaxed text-white placeholder:text-neutral-600 p-4 h-24 resize-none font-sans"
                    />

                    {/* Inputs parameters and triggers panel */}
                    <div className="border-t border-white/[0.05] pt-3 px-1 pb-1 flex flex-wrap items-center justify-between gap-4">
                      
                      {/* Left actions: Attach file and segmented toggler */}
                      <div className="flex items-center gap-3">
                        
                        <input 
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          type="file" 
                          className="hidden" 
                          accept="image/*,application/pdf,text/plain"
                        />
                        <button
                          type="button"
                          onClick={handleTriggerUploadClick}
                          className="p-2 rounded-xl bg-neutral-950/50 border border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer font-mono text-[10px]"
                        >
                          <Upload size={11} />
                          <span>Attach File</span>
                        </button>

                        {/* Mode selectors */}
                        <div id="draft-ratio-trigger" className="flex items-center p-0.5 rounded-xl border border-neutral-850 bg-neutral-950/50">
                          <button
                            onClick={() => setMode("video")}
                            className={`px-3 py-1 text-[10px] rounded-lg font-mono tracking-tight cursor-pointer transition-all ${
                              mode === "video" ? "bg-white text-black font-semibold shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                            }`}
                          >
                            Video
                          </button>
                          <button
                            onClick={() => setMode("image")}
                            className={`px-3 py-1 text-[10px] rounded-lg font-mono tracking-tight cursor-pointer transition-all ${
                              mode === "image" ? "bg-white text-black font-semibold shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                            }`}
                          >
                            Image
                          </button>
                        </div>

                      </div>

                      {/* Right actions: dispatch */}
                      <div className="flex items-center gap-3 font-semibold">
                        {isGenerating ? (
                          <span className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500">
                            <Loader2 size={11} className="animate-spin text-white" />
                            <span>Compiling Pipeline...</span>
                          </span>
                        ) : rateLimitCooldown > 0 ? (
                          <span className="font-mono text-[9px] text-amber-500 flex items-center gap-1">
                            <Clock size={11} className="animate-spin" />
                            <span>Cooldyls {rateLimitCooldown}s</span>
                          </span>
                        ) : null}

                        <button
                          onClick={() => handleSendMessage()}
                          disabled={!userInput.trim() || isGenerating}
                          className="px-6 py-2.5 rounded-2xl bg-white text-black font-bold hover:bg-neutral-100 disabled:opacity-30 transition-all flex items-center gap-2 cursor-pointer text-sm shadow-xl shadow-white/5 active:scale-95"
                        >
                          <span>Generate</span>
                          <Send size={14} className="text-black" />
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* Starter Quick ideas */}
                  {messages.length === 0 && (
                    <div className="space-y-3 pt-4 select-none">
                      <p className="text-[9px] font-mono tracking-widest text-neutral-450 uppercase uppercase">Pristine Showcase Presets</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {starterPrompts.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(undefined, p.prompt, p.mode)}
                            className="bg-neutral-950/20 border border-neutral-900 p-3.5 rounded-xl text-left hover:border-neutral-805 transition-all cursor-pointer group flex flex-col justify-between h-[100px]"
                          >
                            <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                              <span className="truncate">{p.title}</span>
                              {p.mode === "video" ? <VideoIcon size={10} className="text-neutral-600 group-hover:text-neutral-400" /> : <ImageIcon size={10} className="text-neutral-600 group-hover:text-neutral-400" />}
                            </div>
                            <p className="text-[10px] text-neutral-550 leading-snug line-clamp-2 mt-2">
                              {p.prompt}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active conversational feed if has logs */}
                  {messages.length > 0 && (
                    <div className="space-y-6 pt-4 border-t border-neutral-900">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                        <span>SESSION LOGS</span>
                        <button
                          onClick={() => setMessages([])}
                          className="hover:text-white flex items-center gap-1 cursor-pointer font-sans"
                        >
                          <Trash2 size={10} /> Clear List
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                        {messages.map((m) => (
                          <div 
                            key={m.id}
                            className={`p-3.5 rounded-xl text-xs leading-relaxed text-left ${
                              m.sender === "user" 
                                ? "bg-neutral-900/40 border border-neutral-900 text-neutral-250 ml-12" 
                                : "bg-neutral-950/50 border border-neutral-905 text-neutral-350 mr-12"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500 mb-1.5">
                              <span>{m.sender === "user" ? "@me" : "VideoKing-AI"}</span>
                              <span>•</span>
                              <span>{m.timestamp}</span>
                            </div>
                            <p className="select-text">{m.text}</p>
                            
                            {m.warning && (
                              <p className="text-[9.5px] font-mono text-amber-500 mt-2 bg-amber-500/5 p-1.5 px-2 border border-amber-500/10 rounded">
                                {m.warning}
                              </p>
                            )}

                            {/* Manual review triggers */}
                            {m.sender === "ai" && (m.videoResult || m.imageResult) && (
                              <div className="mt-3.5 pt-3 border-t border-neutral-900/60 flex gap-2">
                                <button
                                  onClick={() => {
                                    if (m.videoResult) {
                                      setActiveVideoOutput(m.videoResult);
                                      startVideoSimulation(m.videoResult);
                                    } else if (m.imageResult) {
                                      setActiveImageOutput({
                                        data: m.imageResult,
                                        imageBase64: m.imageBase64
                                      });
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded bg-white text-black font-semibold text-[10px] tracking-tight hover:bg-neutral-100 flex items-center gap-1 cursor-pointer shadow"
                                >
                                  Load on Production Monitor
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer system variables */}
                <footer className="pt-8 border-t border-neutral-900/20 max-w-2xl mx-auto w-full flex items-center justify-between font-mono text-[9px] text-neutral-600 relative z-10 select-none text-left">
                  <span>ACTIVE RECEPTOR // WORKSPACE S01</span>
                  <span>AES-256 CODES ACTIVE</span>
                </footer>

              </div>

              {/* Right Column: Visual Output Monitor (Apple Pro layout) */}
              <div id="designer-preview-rail" className="w-full md:w-[520px] bg-brand-near-black p-6 md:p-8 flex flex-col justify-between overflow-y-auto shrink-0 select-none text-left border-l border-brand-border shadow-sm">
                
                {/* Visual Monitor Header */}
                <div className="flex items-center justify-between border-b border-brand-border pb-4 h-12 select-none shrink-0">
                  <span className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>Production Monitor</span>
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                  </div>
                </div>

                {/* Simulated Panel content */}
                <div className="flex-1 py-4">
                  
                  {!activeVideoOutput && !activeImageOutput ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 min-h-[350px]">
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                        <Layout size={16} />
                      </div>
                      <p className="text-xs text-neutral-250 font-semibold select-none leading-none">NO ACTIVE SEQUENCE</p>
                      <p className="text-[10px] text-neutral-500 font-mono tracking-wider max-w-[200px] leading-relaxed mx-auto uppercase">
                        Generate specs from presets or input descriptions to initialize real-time simulation live here.
                      </p>
                    </div>
                  ) : activeVideoOutput ? (
                    
                    /* Simulated viral video timeline playbacks */
                    <div className="space-y-6 animate-fadeIn text-left">
                      
                      {/* Viewport phone mockup */}
                      <div className="relative aspect-[9/16] max-w-[240px] mx-auto bg-black rounded-2xl border-[8px] border-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_30px_60px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
                        
                        <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-950 to-black p-5 flex flex-col justify-between relative">
                          
                          {/* Scene bar indicators */}
                          <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-neutral-400 bg-black/40 p-2 rounded-xl backdrop-blur-md border border-white/[0.05]">
                            <span>Scene {activeSceneIndex + 1}/{activeVideoOutput.scenes.length}</span>
                            <span className="text-emerald-400 font-bold tracking-tight">{activeVideoOutput.viralScore}% CTR</span>
                          </div>

                          {/* Dial element */}
                          <div className="relative flex-grow flex flex-col items-center justify-center gap-3">
                            <div className="w-14 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center relative shadow-2xl">
                              {isPlaying ? (
                                <div className="flex items-end gap-0.5 h-3">
                                  <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[1px] bg-emerald-400" />
                                  <motion.span animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[1px] bg-emerald-400" />
                                  <motion.span animate={{ height: [5, 10, 5] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-[1px] bg-emerald-400" />
                                </div>
                              ) : (
                                <Play size={10} className="text-white fill-white ml-0.5" />
                              )}

                              <svg className="absolute inset-0 rotate-[-90deg] w-full h-full">
                                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-neutral-950" />
                                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1" fill="transparent" strokeDasharray={138.2} strokeDashoffset={138.2 - (138.2 * sceneProgress) / 100} className="text-emerald-400 transition-all duration-100" />
                              </svg>
                            </div>
                          </div>

                          {/* Captions Overlay card */}
                          <div className="relative z-10 space-y-2 bg-black/85 p-2 rounded-xl border border-neutral-900/80">
                            <p className="text-[10px] font-bold text-yellow-300 text-center uppercase tracking-tight">
                              {activeVideoOutput.scenes[activeSceneIndex]?.captionOverlay}
                            </p>
                            <p className="text-[9.5px] text-neutral-400 leading-snug text-center font-mono select-none">
                              {activeVideoOutput.scenes[activeSceneIndex]?.narration}
                            </p>
                          </div>

                        </div>

                      </div>

                      {/* Controls and Stats */}
                      <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs select-none">
                        <div className="flex-1">
                          <p className="text-white font-semibold line-clamp-1">{activeVideoOutput.title}</p>
                          <p className="text-[9.5px] text-neutral-500 font-mono mt-0.5">{activeVideoOutput.videoLengthSec}s Duration // {activeVideoOutput.scenes.length} Scenes</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleToggleSimulation}
                            className={`p-2 rounded-lg cursor-pointer ${isPlaying ? "bg-amber-500/10 text-amber-400" : "bg-white text-black font-semibold"}`}
                          >
                            {isPlaying ? <Pause size={12} /> : <Play size={12} className="fill-black" />}
                          </button>
                          <button
                            onClick={handleResetTimeline}
                            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-450 hover:text-white cursor-pointer hover:bg-neutral-800"
                          >
                            <Clock size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Storyboard list mapping */}
                      <div className="space-y-3 text-left">
                        <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase uppercase">Active storyboard timeline grids</p>
                        <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                          {activeVideoOutput.scenes.map((sc, scIdx) => (
                            <div
                              key={sc.sceneNumber}
                              onClick={() => {
                                stopVideoSimulation();
                                setActiveSceneIndex(scIdx);
                                setSceneProgress(0);
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                activeSceneIndex === scIdx ? "bg-neutral-900/60 border-neutral-700" : "bg-neutral-950 border-neutral-905"
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 select-none mb-1">
                                <span className={activeSceneIndex === scIdx ? "text-emerald-400 font-bold" : ""}>SCENE #{sc.sceneNumber}</span>
                                <span>{sc.duration}s</span>
                              </div>
                              <p className="text-[10.5px] text-neutral-200 font-mono">"{sc.narration}"</p>
                              <p className="text-[9.5px] text-neutral-500 italic mt-1 font-sans">Blueprint: {sc.visualSpecification}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  ) : (
                    
                    /* Simulated refined Image elements specs */
                    <div className="space-y-6 animate-fadeIn text-left">
                      
                      {/* Big generated image frame box */}
                      <div className="relative aspect-square bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden shadow-3xl flex flex-col justify-between p-4 relative group">
                        
                        {activeImageOutput.imageBase64 ? (
                          <img
                            src={activeImageOutput.imageBase64}
                            alt={activeImageOutput.data.expandedPrompt}
                            className="absolute inset-0 w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div 
                            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/60 to-black flex items-center justify-center p-6 text-center"
                            style={{ 
                              background: `radial-gradient(ellipse at top left, ${activeImageOutput.data.colorPalette[0] || "#1a1a1a"}40, #0a0a0a), linear-gradient(135deg, ${activeImageOutput.data.colorPalette[1] || "#0f0f0f"}20, ${activeImageOutput.data.colorPalette[2] || "#050505"}10)` 
                            }}
                          >
                            <div className="space-y-2 select-all">
                              <ImageIcon size={20} className="mx-auto text-neutral-600 animate-pulse" />
                              <p className="text-[10px] font-mono text-neutral-500 tracking-wider">AESTHETIC REFERENCE SCHEME</p>
                              <p className="text-xs text-neutral-350 italic font-mono truncate max-w-[260px] mx-auto">"{activeImageOutput.data.aestheticStyle}"</p>
                            </div>
                          </div>
                        )}

                        {/* Dimensions overlays */}
                        <div className="relative z-10 bg-black/75 backdrop-blur px-2.5 py-1 border border-neutral-850 rounded text-[9px] text-neutral-400 font-mono uppercase tracking-widest max-w-[150px] select-none">
                          8K UHD Spec // {settings.aspectRatio}
                        </div>

                        {/* Coordinates hex colors align */}
                        <div className="relative z-10 bg-black/85 p-2 rounded-xl border border-neutral-900 flex justify-between gap-1">
                          {activeImageOutput.data.colorPalette.map((col, hIdx) => (
                            <button
                              key={hIdx}
                              onClick={() => handleCopyText(col, `col-${hIdx}`)}
                              className="flex-1 text-center font-mono text-[9px] tracking-tight relative group cursor-pointer"
                            >
                              <div className="h-6.5 rounded-md border border-neutral-850 shadow" style={{ backgroundColor: col }} />
                              <span className="text-[8px] text-neutral-500 block uppercase mt-1 leading-none">
                                {copiedId === `col-${hIdx}` ? "OK" : col}
                              </span>
                            </button>
                          ))}
                        </div>

                      </div>

                      {/* Extended Specs descriptions card */}
                      <div className="bg-neutral-900/35 border border-neutral-900 p-4 rounded-xl space-y-4 text-xs font-sans">
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase uppercase font-mono leading-none">Refined Prompt spec</p>
                          <p className="text-white text-[11px] leading-relaxed font-mono bg-black/35 p-2.5 rounded-lg border border-neutral-905 select-all">
                            {activeImageOutput.data.expandedPrompt}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-[11px] font-mono">
                          <div className="space-y-1">
                            <span className="text-neutral-550 block uppercase text-[8.5px] tracking-wider leading-none">Lighting Setup</span>
                            <span className="text-neutral-300 italic">{activeImageOutput.data.lightingSpec}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-neutral-550 block uppercase text-[8.5px] tracking-wider leading-none font-mono">Cinematography</span>
                            <span className="text-neutral-300">{activeImageOutput.data.cinematographyNotes}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  )}

                </div>

              </div>
              
            </motion.div>
          )}

          {/* ================================================= */}
          {/* B. HISTORICAL GALLERY VIEWPORT                    */}
          {/* ================================================= */}
          {activeTab === "images" && (
            <motion.div 
              key="tab-images"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-6 md:p-12 text-left bg-brand-black relative"
            >
              
              <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-brand-dark-gray rounded-full blur-[130px] opacity-25 pointer-events-none" />

              <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <div className="space-y-1 border-b border-neutral-900 pb-4">
                  <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase block">PLATFORM OUTPUT RECORDERS</span>
                  <h2 className="text-2xl font-sans text-white tracking-tight">Session Art Spec Cabinet</h2>
                  <p className="text-xs text-neutral-500 leading-normal max-w-sm font-sans">
                    All video scripts, camera vectors, and coordinate color palettes drafted during this interactive session are backed up in real time down below.
                  </p>
                </div>

                {/* Filter and render list cards */}
                {messages.filter(m => m.sender === "ai" && (m.videoResult || m.imageResult)).length === 0 ? (
                  <div className="h-[250px] border border-neutral-900 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3 select-none">
                    <div className="p-2 px-2.5 rounded-xl border border-neutral-850 text-neutral-600 bg-neutral-950 flex items-center justify-center">
                      <Layout size={18} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-200">No Historical Records Compiled</p>
                    <p className="text-[10px] text-neutral-505 font-mono max-w-xs mx-auto leading-normal uppercase">
                      Switch context back to generate commands and prompt specs to visualize cards inside this system.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {messages.filter(m => m.sender === "ai" && (m.videoResult || m.imageResult)).map((m) => (
                      <div 
                        key={m.id}
                        className="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl overflow-hidden shadow transition-all p-5 space-y-4 h-fit flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                            <span>{m.mode === "video" ? "🎬 VIDEO SPEC" : "🎨 IMAGE CORE"}</span>
                            <span>{m.timestamp}</span>
                          </div>

                          <h3 className="text-sm font-semibold text-white truncate">
                            {m.videoResult ? m.videoResult.title : `Expansion details: ${m.imageResult?.aestheticStyle}`}
                          </h3>

                          <p className="text-[11px] text-neutral-450 line-clamp-3 font-mono leading-relaxed bg-black/40 p-2.5 rounded border border-neutral-905">
                            {m.videoResult 
                              ? `Strategy: ${m.videoResult.strategyDescription}` 
                              : `Prompt Refined: ${m.imageResult?.expandedPrompt}`}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-900 flex justify-between items-center text-xs">
                          {m.videoResult && (
                            <span className="font-mono text-[9px] text-neutral-505 uppercase">
                              {m.videoResult.scenes.length} Scenes // viral score: {m.videoResult.viralScore}%
                            </span>
                          )}
                          {m.imageResult && (
                            <span className="font-mono text-[9px] text-neutral-550 uppercase">
                              Colors: {m.imageResult.colorPalette.join(", ")}
                            </span>
                          )}

                          <button
                            onClick={() => {
                              if (m.videoResult) {
                                setActiveVideoOutput(m.videoResult);
                                startVideoSimulation(m.videoResult);
                              } else if (m.imageResult) {
                                setActiveImageOutput({
                                  data: m.imageResult,
                                  imageBase64: m.imageBase64
                                });
                              }
                              setActiveTab("generate");
                            }}
                            className="px-2 py-1 text-[10.5px] font-sans font-semibold text-neutral-305 hover:text-white transition-colors cursor-pointer"
                          >
                            Mount in workspace &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </motion.div>
          )}

          {/* ================================================= */}
          {/* C. PROFILE DETAIL CONTAINER VIEWPORT               */}
          {/* ================================================= */}
          {activeTab === "profile" && (
            <motion.div 
              key="tab-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-6 md:p-12 text-left bg-brand-black relative flex flex-col justify-center"
            >
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-dark-gray rounded-full blur-[140px] opacity-25 pointer-events-none" />

              <div className="max-w-xl mx-auto space-y-8 relative z-10 w-full text-left">
                
                <div className="space-y-1.5 border-b border-neutral-900 pb-4 select-none">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block font-mono">SECURE USER IDENTITY PORT</span>
                  <h2 className="text-2xl font-sans text-white tracking-tight leading-tight select-none">Account Configuration</h2>
                </div>

                {/* Profile detail cards (Apple style) */}
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl shadow p-6 md:p-8 space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-900 text-center sm:text-left select-none">
                    {userProfile.photoURL ? (
                      <img 
                        src={userProfile.photoURL} 
                        alt={userProfile.name} 
                        className="w-16 h-16 rounded-full border border-neutral-800 object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 font-bold text-lg select-none">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-white leading-none">{userProfile.name}</h3>
                      <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest leading-none">{userProfile.accountStatus || "PRO DEVELOPER"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-left">
                    
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono tracking-wider text-neutral-505 uppercase">Authorized Email</label>
                      <p className="text-white font-medium text-xs break-all select-all font-mono leading-relaxed">{userProfile.email || "No email available"}</p>
                    </div>

                    <div className="space-y-1 font-mono">
                      <label className="text-[9.5px] font-mono tracking-wider text-neutral-505 uppercase">Internal User UID</label>
                      <p className="text-neutral-400 font-medium text-xs truncate max-w-[200px]" title={userProfile.uid}>{userProfile.uid}</p>
                    </div>

                    <div className="space-y-1 select-none">
                      <label className="text-[9.5px] font-mono tracking-wider text-neutral-505 uppercase font-mono">Identity Provider</label>
                      <p className="text-neutral-400 font-medium text-xs">
                        {userProfile.uid.startsWith("google") ? "Google Cloud Redirect Auth" : "Secure Password Login"}
                      </p>
                    </div>

                    <div className="space-y-1 select-none">
                      <label className="text-[9.5px] font-mono tracking-wider text-neutral-505 uppercase">Account Created Date</label>
                      <p className="text-neutral-450 font-medium text-xs font-mono">
                        {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "June 3, 2026"}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Additional options */}
                <div className="p-4 rounded-xl bg-neutral-905/30 border border-neutral-900 text-xs text-neutral-500 leading-relaxed font-sans relative flex gap-2.5 py-4">
                  <Shield size={14} className="text-neutral-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-neutral-550 text-left leading-normal font-sans">
                    This account is managed within isolated secure sandbox containers. Encrypted variables and ephemeral caches are garbage-collected automatically upon active session sign-outs.
                  </p>
                </div>

              </div>

            </motion.div>
          )}

          {/* ================================================= */}
          {/* D. MODERN SETTINGS INTERFACE VIEWPORT             */}
          {/* ================================================= */}
          {activeTab === "settings" && (
            <motion.div 
              key="tab-settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-6 md:p-12 text-left bg-brand-black relative flex flex-col justify-center"
            >
              
              <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-dark-gray rounded-full blur-[130px] opacity-25 pointer-events-none" />

              <div className="max-w-xl mx-auto space-y-8 relative z-10 w-full text-left">
                
                <div className="space-y-1.5 border-b border-neutral-900 pb-4 select-none">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">PLATFORM PREFERENCES</span>
                  <h2 className="text-2xl font-sans text-white tracking-tight select-none">Studio Configuration Drawer</h2>
                </div>

                {/* Settings list form */}
                <div className="bg-neutral-950 border border-neutral-900 rounded-2xl shadow p-6 md:p-8 space-y-6">
                  
                  {/* Select Voice */}
                  <div className="space-y-2 text-left">
                    <label className="block text-[10px] font-mono tracking-widest text-neutral-450 uppercase uppercase leading-none font-mono">Narrator Voice Presets</label>
                    <p className="text-[10px] text-neutral-505 font-mono leading-none">Sets voice models for direct timeline script briefings</p>
                    <div className="grid grid-cols-4 gap-2.5 pt-1 font-semibold select-none">
                      {["Zephyr", "Serena", "Aero", "Solstice"].map(v => (
                        <button
                          key={v}
                          onClick={() => setSettings(p => ({ ...p, narratorVoice: v }))}
                          className={`py-2 px-1 text-center rounded-lg border text-xs tracking-tight transition-all cursor-pointer ${
                            settings.narratorVoice === v 
                              ? "bg-white text-black border-white font-semibold" 
                              : "bg-neutral-900 border-neutral-850 hover:bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Resolution */}
                  <div className="space-y-2 text-left">
                    <label className="block text-[10px] font-mono tracking-widest text-neutral-450 uppercase uppercase leading-none">Target Render Codes</label>
                    <p className="text-[10.5px] text-neutral-505 leading-none font-mono">Target visual pixel scale for drafts and rendering grids</p>
                    <div className="grid grid-cols-3 gap-2.5 pt-1 select-none font-semibold">
                      {["720p Mobile", "1080p FHD Spec", "4K Ultra HD"].map(res => (
                        <button
                          key={res}
                          onClick={() => setSettings(p => ({ ...p, videoResolution: res }))}
                          className={`py-2 text-center rounded-lg border text-xs tracking-tight transition-all cursor-pointer ${
                            settings.videoResolution === res 
                              ? "bg-white text-black border-white font-semibold" 
                              : "bg-neutral-900 border-neutral-850 hover:bg-neutral-800 text-neutral-350"
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect toggle */}
                  <div className="space-y-2 text-left select-none">
                    <label className="block text-[10px] font-mono tracking-widest text-neutral-405 uppercase leads-none font-mono">Camera Frame ratios</label>
                    <div className="flex items-center gap-2 pt-1 bg-neutral-900/40 p-1 border border-neutral-900 rounded-xl max-w-xs font-semibold">
                      {(["16:9", "9:16", "1:1"] as const).map(ratio => (
                        <button
                          key={ratio}
                          onClick={() => setSettings(p => ({ ...p, aspectRatio: ratio }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-mono tracking-tight cursor-pointer transition-all ${
                            settings.aspectRatio === ratio
                              ? "bg-white text-black font-semibold shadow-inner"
                              : "text-neutral-500 hover:text-neutral-305"
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Infrastructure checklist banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left select-none pointer-events-none">
                  
                  <div className="space-y-1 block max-w-xs leading-normal">
                    <div className="flex items-center gap-1 text-[10px] font-mono tracking-wide text-neutral-400">
                      <CheckCircle size={12} className="text-neutral-500" />
                      <span>SECURE PIPELINE</span>
                    </div>
                    <p className="text-[10px] text-neutral-550 leading-relaxed">AES-256 local keystore and envelope encryptions active.</p>
                  </div>

                  <div className="space-y-1 block max-w-xs leading-normal">
                    <div className="flex items-center gap-1 text-[10px] font-mono tracking-wide text-neutral-400">
                      <CheckCircle size={12} className="text-neutral-500" />
                      <span>EPHEMERAL BUFFERS</span>
                    </div>
                    <p className="text-[10px] text-neutral-555 leading-relaxed font-mono">Render sessions wipe completely upon active Sign Outs.</p>
                  </div>

                  <div className="space-y-1 block max-w-xs leading-normal font-mono">
                    <div className="flex items-center gap-1 text-[10px] font-mono tracking-wide text-neutral-400">
                      <CheckCircle size={12} className="text-neutral-500" />
                      <span>COHERENT CODES</span>
                    </div>
                    <p className="text-[10px] text-neutral-550 leading-relaxed font-mono">Distributed container routing handles server rendering loads.</p>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
}
