import React, { useEffect } from "react";
import { ArrowLeft, Shield, Clock, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface PrivacyPolicyProps {
  onBackToLanding: () => void;
}

export default function PrivacyPolicy({ onBackToLanding }: PrivacyPolicyProps) {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div id="privacy-policy-view" className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-white flex flex-col justify-between relative relative overflow-hidden font-sans">
      {/* Mesh Glow Background */}
      <div 
        id="bg-ambient-glow"
        className="absolute top-0 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-900 rounded-full blur-[160px] opacity-40 pointer-events-none"
      />

      {/* Mini-Navigation Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-neutral-950/80 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-all text-xs font-mono uppercase tracking-wider group cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-neutral-400" />
            <span className="font-mono text-xs text-neutral-400">LEGAL &amp; PRIVACY DEPT // S01</span>
          </div>
        </div>
      </header>

      {/* Main Column */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 relative z-10 w-full">
        {/* Main Title Header */}
        <div className="border-b border-neutral-900 pb-12 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800/80 backdrop-blur">
            <Clock size={12} className="text-neutral-450" />
            <span className="text-[10px] font-mono tracking-wider text-neutral-450 uppercase">LAST UPDATED: JUNE 3, 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-sans font-medium tracking-tight text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
            This Policy details our secure posture regarding user privacy, advanced encryption metrics, identity tokens, and stateless asset compilation.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-10 text-neutral-300 font-sans text-xs md:text-sm leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">01.</span>
              Data Collection Posture
            </h2>
            <p>
              VideoKing-AI maintains a premium architecture designed to compile user media feeds and visual blueprints with absolute structural fidelity. When referencing details, we collect information necessary to drive video rendering pipelines and user experiences:
            </p>
            <ul className="space-y-2 list-none pl-1 mt-2 text-neutral-400 font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-neutral-500 shrink-0 mt-0.5" />
                <span><strong>User Profile Inputs:</strong> Details you explicitly supply including names, linked verification fields, display pictures, and creative presets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-neutral-500 shrink-0 mt-0.5" />
                <span><strong>Creative Artifact Datasets:</strong> Input references, descriptive text scripts, images, PDFs, files, and contextual configurations supplied for rendering loops.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-neutral-500 shrink-0 mt-0.5" />
                <span><strong>Technical System Metadata:</strong> IP logs, browser configurations, platform usage data, and visual performance records gathered strictly to debug network latency.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">02.</span>
              Authentication and Account Security
            </h2>
            <p>
              Identity metrics are provisioned through Google Sign-In and secure Firebase Identity authenticators. Your security passwords are cryptographically salted and hashed. We never access, store, or transmit your individual credentials in raw text. To reinforce absolute isolation:
            </p>
            <p className="text-neutral-400">
              Session validation tokens block outside scrapers from injecting code, guarding credentials from identity theft or external leaks. You remain the sole authority over access credentials and developer tokens.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">03.</span>
              Cookie and Storage Policy
            </h2>
            <p>
              Our preview frames require standard identifiers and temporary state storage to preserve dashboard selections and prevent rendering loops. We employ SameSite/Secure context tokens where applicable:
            </p>
            <p className="text-neutral-400">
              Cookies on our site are set with <code className="text-white bg-neutral-900 px-1 py-0.5 rounded font-mono text-xs">SameSite=None; Secure;</code> to support sandboxed cross-origin iframes without leaking behavioral parameters to third-party ad networks. No targeting or marketing pixels are placed on our product interfaces.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">04.</span>
              Security and Firewalls
            </h2>
            <p>
              All video rendering processes and file buffers are computed on isolated, firewalled server containers. Client data uploaded to our dashboard endpoints is encrypted during transport using TLS 1.3, and isolated at rest with symmetric AES-256 standard encryption keys.
            </p>
            <p className="text-neutral-400">
              Ephemeral rendering folders are automatically garbage-collected every 24 hours to prevent offline caching risks and enforce zero-trust state integrity across all sessions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">05.</span>
              Creator Rights and User Sovereignty
            </h2>
            <p>
              You hold complete copyright and operational authority over all media outputs, storyboards, and scripts generated on VideoKing-AI. You retain full rights to inspect, update, erase, or download your personal account profile, billing credentials, and stored data arrays at any time via the user dashboard.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">06.</span>
              Contact Information
            </h2>
            <p>
              If you have queries regarding algorithmic data processing, security firewall details, or licensing terms, submit an inquiry to our support center:
            </p>
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300">
              <p className="font-semibold text-white">VideoKing-AI Legal &amp; Security Division</p>
              <p className="text-neutral-550">ADDRESS: One Silicon Valley Center, San Jose, CA, USA</p>
              <p className="text-neutral-450">DIRECT EMAIL: security@videoking.ai</p>
            </div>
          </section>

        </div>

        {/* Back Button */}
        <div className="mt-16 pt-8 border-t border-neutral-900 text-center">
          <button
            onClick={onBackToLanding}
            className="px-6 py-2.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition-colors text-xs font-medium rounded-xl cursor-pointer"
          >
            Acknowledge and Return to Home
          </button>
        </div>
      </main>

      {/* Slimmer Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-8 border-t border-neutral-900 text-center font-mono text-[10px] text-neutral-650 uppercase tracking-widest relative z-10">
        © 2026 VideoKing-AI. All rights reserved. SECURE SYSTEM TOKEN // S01.R01 // EPHEMERAL STATELESS ENGINE
      </footer>
    </div>
  );
}
