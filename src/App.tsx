/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, saveUserProfile } from "./firebase";
import { UserProfile } from "./types";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import { Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  type ActiveScreen = "landing" | "auth" | "dashboard" | "privacy" | "terms";
  const [screen, setScreen] = useState<ActiveScreen>("landing");
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "signup">("login");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Synchronize Auth changes with Firebase authenticators on boot
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsAuthChecking(true);
      if (firebaseUser) {
        try {
          // Sync with Firestore profile database
          const profile = await saveUserProfile(firebaseUser);
          setUserProfile(profile);
          setScreen("dashboard");
        } catch (error) {
          console.error("Error setting up credentials on auth change:", error);
          // Fallback user profile in case of permissions or offline constraints
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Creative Creator",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            accountStatus: "Free Tier"
          };
          setUserProfile(fallbackProfile);
          setScreen("dashboard");
        }
      } else {
        setUserProfile(null);
        // Do not kick the user back to landing if studying privacy or terms!
        setScreen((prev) => (prev === "privacy" || prev === "terms" ? prev : "landing"));
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsAuthChecking(true);
    try {
      await signOut(auth);
      setUserProfile(null);
      setScreen("landing");
    } catch (error) {
      console.error("Sign Out failed:", error);
    } finally {
      setIsAuthChecking(false);
    }
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setScreen("dashboard");
  };

  // Rendering standard high-fidelity loader screens
  if (isAuthChecking) {
    return (
      <div 
        id="app-loader-screen" 
        className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-neutral-100 font-sans p-6 select-none"
      >
        <div className="space-y-4 text-center">
          <div id="loader-icon-box" className="w-12 h-12 rounded-2xl bg-brand-dark-gray border border-brand-border flex items-center justify-center mx-auto text-white shadow-xl relative overflow-hidden">
            <Flame className="text-white animate-pulse" size={20} />
          </div>
          <p className="text-xs font-mono tracking-widest text-neutral-500 uppercase">VideoKing-AI Security Checkpoint...</p>
          <div className="w-24 h-[2px] bg-brand-gray mx-auto rounded-full overflow-hidden">
            <motion.div 
              animate={{ left: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-neutral-200 relative w-1/2 rounded-full" 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="app-root-container" className="bg-brand-black min-h-screen">
      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <motion.div
            key="landing-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage 
              onGetStarted={() => {
                setAuthInitialMode("signup");
                setScreen("auth");
              }} 
              onLoginClick={() => {
                setAuthInitialMode("login");
                setScreen("auth");
              }} 
              onPrivacyClick={() => setScreen("privacy")}
              onTermsClick={() => setScreen("terms")}
            />
          </motion.div>
        )}

        {screen === "auth" && (
          <motion.div
            key="auth-screen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AuthPage 
              onBackToLanding={() => setScreen("landing")} 
              onAuthSuccess={handleAuthSuccess} 
              initialMode={authInitialMode}
            />
          </motion.div>
        )}

        {screen === "dashboard" && userProfile && (
          <motion.div
            key="dashboard-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard 
              userProfile={userProfile} 
              onLogout={handleLogout} 
            />
          </motion.div>
        )}

        {screen === "privacy" && (
          <motion.div
            key="privacy-screen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <PrivacyPolicy onBackToLanding={() => setScreen("landing")} />
          </motion.div>
        )}

        {screen === "terms" && (
          <motion.div
            key="terms-screen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TermsAndConditions onBackToLanding={() => setScreen("landing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
