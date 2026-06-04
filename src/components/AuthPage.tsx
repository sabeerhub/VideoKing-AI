import React, { useState } from "react";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider, saveUserProfile } from "../firebase";
import { 
  Mail, Lock, Sparkles, AlertCircle, ArrowLeft, Loader2, Info, 
  User, Check, Shield, X, Video, Sliders, Volume2, Globe2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

interface AuthPageProps {
  onBackToLanding: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  initialMode?: "login" | "signup";
}

export default function AuthPage({ onBackToLanding, onAuthSuccess, initialMode = "login" }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === "signup");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  
  // Consent checkboxes
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  // States for feedback
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfigTips, setShowConfigTips] = useState<boolean>(true);
  
  // Forgot Password flow
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  // In-app legal overlay modal triggers (guards context!)
  const [activeLegalModal, setActiveLegalModal] = useState<"none" | "privacy" | "terms">("none");

  // Google Sign-In Action
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await saveUserProfile(result.user);
      onAuthSuccess(profile);
    } catch (error: any) {
      console.error("Google Auth error:", error);
      if (error.code === "auth/popup-blocked") {
        setErrorMessage("Popup blocked by browser. Please allow popups or use email sign-in.");
      } else {
        setErrorMessage(error.message || "Failed to authenticate with Google.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Credential form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (isSignUp) {
      if (!displayName) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match. Please verify.");
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage("You must accept the Privacy Policy and Terms & Conditions to proceed.");
        return;
      }
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters for security.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        const profile = await saveUserProfile({ ...result.user, displayName });
        onAuthSuccess(profile);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const profile = await saveUserProfile(result.user);
        onAuthSuccess(profile);
      }
    } catch (error: any) {
      console.error("Auth process error:", error.code, error.message);
      if (error.code === "auth/operation-not-allowed") {
        setErrorMessage("Email/Password credentials are disabled. Please enable them in your Firebase Authentication backend.");
      } else if (
        error.code === "auth/user-not-found" || 
        error.code === "auth/wrong-password" || 
        error.code === "auth/invalid-credential"
      ) {
        setErrorMessage("Incorrect email or password. Please verify your credentials or sign in with Google.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already registered. Please login instead.");
      } else {
        setErrorMessage(error.message || "Authentication checkpoint failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setErrorMessage("Please enter your email to request a reset link.");
      return;
    }
    setResetLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setInfoMessage(`A password reset link was sent to ${resetEmail}. Check your inbox.`);
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error("Reset password error:", error);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("No registered account found with this email address.");
      } else {
        setErrorMessage(error.message || "Failed to dispatch recovery instructions.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div 
      id="split-auth-root"
      className="min-h-screen bg-brand-black text-neutral-100 selection:bg-neutral-800 selection:text-white flex items-center justify-center p-6 relative overflow-hidden font-sans shadow-sm"
    >
      
      {/* ----------------------------------------------------------------- */}
      {/* LEFT SIDE: DESIGNED BY STRIPE/APPLE-LEVEL PRODUCT SHOWCASE        */}
      {/* ----------------------------------------------------------------- */}
      <div className="hidden lg:flex lg:col-span-5 bg-brand-near-black border-r border-brand-border flex-col justify-between p-12 relative overflow-hidden text-left">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#090909_1px,transparent_1px),linear-gradient(to_bottom,#090909_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-30" />
        <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-brand-dark-gray/40 rounded-full blur-[130px] opacity-35" />
        <div className="absolute -bottom-24 -right-20 w-[400px] h-[400px] bg-brand-dark-gray/35 rounded-full blur-[120px] opacity-30" />

        {/* Top brand */}
        <div className="flex items-center gap-3 relative z-10 select-none">
          <div className="w-6.5 h-6.5 bg-white text-black font-semibold rounded-md flex items-center justify-center font-mono text-xs">
            VK
          </div>
          <span className="font-sans font-medium tracking-tight text-white text-sm">
            VideoKing-AI
          </span>
        </div>

        {/* Center illustration & storyboard mock */}
        <div className="space-y-8 relative z-10 max-w-sm">
          <div className="space-y-4">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-450 font-mono text-[9px] tracking-widest uppercase">
              STUDIO EDITION
            </span>
            <h2 className="text-3xl font-sans tracking-tight text-white font-normal leading-[1.1]">
              The absolute creative cockpit.
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
              Formulate precise storyboard grids, expand prompt-to-context instructions, and direct cinematic camera movements straight from an integrated glass workspace dashboard.
            </p>
          </div>

          {/* Graphical illustration component mapping */}
          <div className="p-5.5 rounded-2xl bg-neutral-900/20 border border-neutral-900/80 space-y-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-[10px] font-mono select-none">
              <span className="text-emerald-400 font-semibold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Simulation Active</span>
              </span>
              <span className="text-neutral-500 font-mono">CODE: VK-CORE</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-900 text-xs">
                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Scene Description</p>
                <p className="text-neutral-300 italic font-mono leading-relaxed truncate">
                  "Macro dolly sweep across concrete wood workspace styled in warm lighting..."
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-[9px]">
                <div className="bg-neutral-950/40 p-2 rounded-lg border border-neutral-900 text-center">
                  <span className="text-neutral-600 block uppercase mb-0.5">Scale</span>
                  <span className="text-neutral-300">16:9 Aspect</span>
                </div>
                <div className="bg-neutral-950/40 p-2 rounded-lg border border-neutral-900 text-center">
                  <span className="text-neutral-600 block uppercase mb-0.5">Duration</span>
                  <span className="text-neutral-300">15 Seconds</span>
                </div>
                <div className="bg-neutral-950/40 p-2 rounded-lg border border-neutral-900 text-center">
                  <span className="text-neutral-600 block uppercase mb-0.5">FPS</span>
                  <span className="text-neutral-300">60 Specs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="relative z-10 text-[10px] font-mono text-neutral-600">
          SYSTEM PARAMETERS ISOLATED // TLS 1.3 ARMORED
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* RIGHT SIDE: AUTH FORM WINDOW                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 lg:col-span-7 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
        
        {/* Floating background blur nodes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-neutral-900/40 rounded-full blur-[110px] pointer-events-none lg:hidden" />

        {/* Header toolbar */}
        <header className="flex justify-between items-center select-none shrink-0 z-10">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-neutral-450 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all duration-200 group cursor-pointer"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
          
          <span className="hidden sm:inline-block font-mono text-[10px] text-neutral-600 tracking-wider">
            SECURE ACCESS CORE // AUTH
          </span>
        </header>

        {/* Central main form container */}
        <main className="flex-1 flex flex-col justify-center items-center py-12 z-10 select-none w-full max-w-[400px] mx-auto space-y-8">
          
          {/* Headline title text block */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-3 select-none"
          >
            <h2 className="text-3xl md:text-4xl font-sans tracking-tight text-white font-medium leading-tight">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-sm text-neutral-500 leading-normal max-w-[320px] mx-auto font-sans">
              {isSignUp 
                ? "Join the next generation of creative production."
                : "Enter your credentials to access your workspace."}
            </p>
          </motion.div>

          {/* Form alert states feedback */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="w-full p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-350 text-xs leading-relaxed flex items-start gap-2.5 text-left"
              >
                <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] font-normal leading-normal">{errorMessage}</span>
              </motion.div>
            )}

            {infoMessage && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-250 text-xs leading-relaxed flex items-start gap-2.5 text-left font-mono"
              >
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] font-normal leading-normal">{infoMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive tabs */}
          <div className="w-full relative bg-neutral-900/50 border border-white/[0.05] p-1 rounded-2xl flex select-none overflow-hidden">
            <motion.div
              layoutId="auth-tab"
              className={`absolute top-1 bottom-1 w-[48%] rounded-xl bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isSignUp ? "left-[50.5%]" : "left-1"
              }`}
            />
            <button
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage("");
                setInfoMessage("");
              }}
              className={`relative z-10 flex-1 py-2.5 text-center text-sm font-medium cursor-pointer transition-colors duration-300 ${
                !isSignUp ? "text-black" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage("");
                setInfoMessage("");
              }}
              className={`relative z-10 flex-1 py-2.5 text-center text-sm font-medium cursor-pointer transition-colors duration-300 ${
                isSignUp ? "text-black" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Social Sign-in Trigger Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-11 px-4 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-sans font-semibold text-xs tracking-tight flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-[0.99] transition-all disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin text-neutral-950" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>{isSignUp ? "Continue with Google" : "Continue with Google"}</span>
          </button>

          {/* Standard Form separator layout info */}
          <div className="w-full relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-900"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
              Or email credentials
            </span>
            <div className="flex-grow border-t border-neutral-900"></div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleFormSubmit} className="w-full text-left space-y-4">
            
            {/* Display Name: Sign up only */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    disabled={isLoading}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Richard Hendricks"
                    className="w-full text-xs h-10 pl-10 pr-4 rounded-xl bg-neutral-900 border border-neutral-850/60 text-white placeholder:text-neutral-700 outline-none focus:border-neutral-700 transition-all font-sans"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-400">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full text-sm h-12 pl-12 pr-4 rounded-2xl bg-neutral-900/50 border border-white/[0.05] text-white placeholder:text-neutral-600 outline-none focus:border-white/20 focus:bg-neutral-900 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-neutral-400">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setResetEmail(email);
                    }}
                    className="text-xs font-medium text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm h-12 pl-12 pr-4 rounded-2xl bg-neutral-900/50 border border-white/[0.05] text-white placeholder:text-neutral-600 outline-none focus:border-white/20 focus:bg-neutral-900 transition-all font-sans"
                />
              </div>
            </div>

            {/* Repeat Password: Sign up only */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    disabled={isLoading}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs h-10 pl-10 pr-4 rounded-xl bg-neutral-900 border border-neutral-850/60 text-white placeholder:text-neutral-700 outline-none focus:border-neutral-700 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Checkboxes parameters */}
            <div className="pt-1.5 select-none text-left">
              {!isSignUp ? (
                <label className="flex items-center gap-2.5 group cursor-pointer select-none">
                  <div className="relative select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="peer sr-only select-none"
                    />
                    <div className="w-4 h-4 rounded bg-neutral-900 border border-neutral-800 peer-checked:bg-white peer-checked:border-white transition-all flex items-center justify-center">
                      <Check size={11} className="text-neutral-950 stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-500 group-hover:text-neutral-300 transition-colors">
                    Maintain workspace login session
                  </span>
                </label>
              ) : (
                <div className="space-y-1">
                  <label className="flex items-start gap-2.5 group cursor-pointer select-none">
                    <div className="relative shrink-0 mt-0.5 select-none">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={() => setAgreedToTerms(!agreedToTerms)}
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 rounded bg-neutral-900 border border-neutral-800 peer-checked:bg-white peer-checked:border-white transition-all flex items-center justify-center">
                        <Check size={11} className="text-neutral-950 stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-[11px] text-neutral-500 leading-normal group-hover:text-neutral-300 transition-colors select-none">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveLegalModal("privacy");
                        }}
                        className="text-neutral-300 hover:text-white underline font-semibold cursor-pointer"
                      >
                        Privacy Policy
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveLegalModal("terms");
                        }}
                        className="text-neutral-300 hover:text-white underline font-semibold cursor-pointer"
                      >
                        Terms &amp; Conditions
                      </button>
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={isLoading || (isSignUp && !agreedToTerms)}
              className="w-full h-12 bg-white text-black hover:bg-neutral-100 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:opacity-45 transition-all rounded-2xl font-semibold text-sm tracking-tight flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-white/5 active:scale-[0.98] mt-4"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-black" />
              ) : isSignUp ? (
                <Sparkles size={16} className="shrink-0 text-black fill-black" />
              ) : null}
              <span>{isSignUp ? "Create account" : "Access Workspace"}</span>
            </button>

          </form>

        </main>

        {/* Footer info and warning config cards (only when shown) */}
        <footer className="shrink-0 space-y-4">
          {showConfigTips && (
            <div className="w-full max-w-[400px] mx-auto bg-neutral-950/40 p-4 border border-neutral-900 rounded-xl relative text-left">
              <div className="flex items-start gap-2.5 text-xs text-neutral-500 leading-relaxed font-sans">
                <Info size={14} className="text-neutral-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-mono text-[9px] tracking-widest text-neutral-450 uppercase uppercase">Control Panel Auth Guideline</p>
                  <p className="text-[11px] text-neutral-550">
                    Google OAuth functions instantly. To login with credentials, make sure "Email/Password" is toggled active inside your Firebase console account dashboard.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigTips(false)}
                className="absolute top-3.5 right-3.5 text-neutral-600 hover:text-neutral-400 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <p className="font-mono text-[9px] text-neutral-700">
            © 2026 VideoKing-AI. Fully isolated SaaS security nodes.
          </p>
        </footer>

      </div>

      {/* --- PASSWORD RESTORE MODAL --- */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-left select-all"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-neutral-850 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowForgotPassword(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
                type="button"
              >
                <X size={16} />
              </button>

              <div className="space-y-1 text-left">
                <h3 className="text-lg font-sans font-medium text-white tracking-tight flex items-center gap-2">
                  <span>Restore Password</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Enter your email address down below, and we will send a password reset link to your email inbox instantly.
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full text-xs h-10 pl-10 pr-4 rounded-xl bg-neutral-900 border border-neutral-850/60 text-white placeholder:text-neutral-700 outline-none focus:border-neutral-700 transition-all text-left"
                  />
                </div>

                <div className="flex gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 border border-neutral-850 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-neutral-450 hover:text-white text-xs transition-colors cursor-pointer font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 bg-white text-black hover:bg-neutral-100 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    {resetLoading && <Loader2 size={12} className="animate-spin" />}
                    <span>Send Password Reset</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- IN-APP LEGAL MODALS (PREVENTS LOSS OF INPUT DETAILS) --- */}
      <AnimatePresence>
        {activeLegalModal === "privacy" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed inset-0 z-[100] bg-neutral-950 overflow-y-auto"
          >
            <PrivacyPolicy onBackToLanding={() => setActiveLegalModal("none")} />
          </motion.div>
        )}

        {activeLegalModal === "terms" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed inset-0 z-[100] bg-neutral-950 overflow-y-auto"
          >
            <TermsAndConditions onBackToLanding={() => setActiveLegalModal("none")} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
