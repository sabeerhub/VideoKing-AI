import React from "react";
import { User, Mail, Shield, Key, X, Calendar, Activity } from "lucide-react";
import { UserProfile } from "../types";
import { auth } from "../firebase";

interface ProfileViewProps {
  userProfile: UserProfile;
  onClose: () => void;
}

export default function ProfileView({ userProfile, onClose }: ProfileViewProps) {
  // Extract provider info from active authentication object
  const currentUser = auth.currentUser;
  const providerId = currentUser?.providerData?.[0]?.providerId || "password";
  const loginMethodName = providerId === "google.com" ? "Google Federated Sign-In" : "Email & Password Secret Verification";

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div id="profile-overlay-backdrop" className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn">
      <div 
        id="profile-display-card"
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden relative"
      >
        {/* Header header info */}
        <div id="profile-card-header" className="p-6 border-b border-neutral-850/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-neutral-450" />
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">Creator Profile</span>
          </div>
          <button
            id="btn-close-profile"
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg text-neutral-500 hover:text-white bg-neutral-950/40 hover:bg-neutral-850 cursor-pointer transition-colors duration-150"
          >
            <X size={14} />
          </button>
        </div>

        {/* Profile Content Body */}
        <div id="profile-content-body" className="p-6 space-y-6">
          {/* Avatar frame */}
          <div className="flex items-center gap-4 py-2 border-b border-neutral-850/40">
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.name} 
                className="w-14 h-14 rounded-full border border-neutral-750" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 font-bold text-lg select-none">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white tracking-tight">{userProfile.name}</h3>
              <p className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/10 inline-block uppercase">
                {userProfile.accountStatus}
              </p>
            </div>
          </div>

          {/* Parameters List GRID */}
          <div id="profile-parameters-list" className="space-y-4">
            
            {/* Display Name parameter */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-450">
                <User size={13} className="text-neutral-500" />
                <span className="font-mono text-[10px] tracking-wider uppercase">User handle name</span>
              </div>
              <p className="text-xs text-white pl-5 font-mono">@{userProfile.name.toLowerCase().replace(/\s+/g, "")}</p>
            </div>

            {/* Email Address parameter */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-450">
                <Mail size={13} className="text-neutral-500" />
                <span className="font-mono text-[10px] tracking-wide uppercase">Linked Email address</span>
              </div>
              <p className="text-xs text-white pl-5">{userProfile.email}</p>
            </div>

            {/* Login Provider parameter */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-450">
                <Key size={13} className="text-neutral-500" />
                <span className="font-mono text-[10px] tracking-wide uppercase">Sign-In verification provider</span>
              </div>
              <p className="text-xs text-neutral-300 pl-5 leading-normal">{loginMethodName}</p>
            </div>

            {/* Dates parameter */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-450">
                <Calendar size={13} className="text-neutral-500" />
                <span className="font-mono text-[10px] tracking-wide uppercase">Account registration date</span>
              </div>
              <p className="text-xs text-neutral-300 pl-5">{formatDate(userProfile.createdAt)}</p>
            </div>

            {/* Status indicators */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-450">
                <Activity size={13} className="text-neutral-500" />
                <span className="font-mono text-[10px] tracking-wide uppercase">Secure Firewall status</span>
              </div>
              <p className="text-xs text-emerald-400 pl-5 font-mono uppercase tracking-widest text-[10px]">● SECURED CONNECTED</p>
            </div>

          </div>
        </div>

        {/* Drawer footer details */}
        <div id="profile-card-footer" className="p-4 bg-neutral-950/80 border-t border-neutral-850/60 text-center font-mono text-[9px] tracking-widest text-neutral-600 uppercase select-none">
          VK SYSTEM CREDENTIAL TOKEN // UID: {userProfile.uid.substring(0, 16)}...
        </div>

      </div>
    </div>
  );
}
