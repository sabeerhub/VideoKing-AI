import React, { useEffect } from "react";
import { ArrowLeft, Scale, Clock, FileText, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface TermsAndConditionsProps {
  onBackToLanding: () => void;
}

export default function TermsAndConditions({ onBackToLanding }: TermsAndConditionsProps) {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div id="terms-conditions-view" className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Mesh Glow Background */}
      <div 
        id="bg-ambient-glow"
        className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-900 rounded-full blur-[160px] opacity-40 pointer-events-none"
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
            <Scale size={14} className="text-neutral-400" />
            <span className="font-mono text-xs text-neutral-400">LEGAL &amp; COMPLIANCE // S01</span>
          </div>
        </div>
      </header>

      {/* Main Content Column */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 relative z-10 w-full">
        {/* Main Title Header */}
        <div className="border-b border-neutral-900 pb-12 mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800/80 backdrop-blur">
            <Clock size={12} className="text-neutral-450" />
            <span className="text-[10px] font-mono tracking-wider text-neutral-450 uppercase">LAST REVISED: JUNE 3, 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-sans font-medium tracking-tight text-white leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
            Please read these terms carefully. By accessing VideoKing-AI interfaces, you enter a binding creative agreement governed by strict utilization constraints.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-10 text-neutral-350 font-sans text-xs md:text-sm leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">01.</span>
              Acceptance of Agreement
            </h2>
            <p>
              By standardizing profile registrations, subscribing to plans, or invoking script compilation endpoints on the VideoKing-AI domain, you fully acknowledge, understand, and agree to be bound by the directives outlined in these Terms.
            </p>
            <p className="text-neutral-400">
              We reserve immediate authority to modify, restrict, deprecate, or patch core rendering parameters, site features, or tier options at any time. Changes take immediate effect when published on this compliance domain.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">02.</span>
              User Responsibilities &amp; Abuse Prevention
            </h2>
            <p>
              To protect server computing resources and ensure consistent rendering throughput for all registered creators, you are strictly forbidden from committing any of the following behavior:
            </p>
            <ul className="space-y-2.5 pl-1 text-neutral-400">
              <li className="flex items-start gap-2.5">
                <ShieldAlert size={14} className="text-red-500 shrink-0 mt-0.5" />
                <span><strong>API Exploitation:</strong> Forging direct script integrations to bypass visual rate-limits or scraping server output assets with synthetic macro code.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldAlert size={14} className="text-red-500 shrink-0 mt-0.5" />
                <span><strong>Credential Leaking:</strong> Sharing access profile tokens, Google credentials, or security configurations with unauthorized third parties.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldAlert size={14} className="text-red-500 shrink-0 mt-0.5" />
                <span><strong>Nefarious Prompt Injections:</strong> Utilizing raw scripts or attachments to trick models into compiling illegal, copyrighted, deceptive, or harmful visual prompts.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">03.</span>
              Intellectual Property &amp; Licensing
            </h2>
            <p>
              Unless otherwise documented, all codebases, UI assets, software features, graphics, animations, custom loaders, look-and-feel concepts, and design interfaces on VideoKing-AI remain the exclusive IP of VideoKing-AI.
            </p>
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-300">
              <p className="font-semibold text-white mb-1 uppercase tracking-tight text-xs font-mono">YOUR OUTPUT LICENSE:</p>
              <p className="text-neutral-405 leading-relaxed">
                VideoKing-AI grants you an immediate, worldwide, royalty-free, perpetual license to publish, display, monetize, modify, and distribute any visual storyboards, scripted scenes, and custom aesthetic configurations generated through your dashboard. You hold full ownership of output creations.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">04.</span>
              Content Controls &amp; Enforcement
            </h2>
            <p>
              VideoKing-AI values creative freedom but enforces zero-tolerance measures for illegal activities. We reserve the right (but have no obligation) to automate scanning of processed prompts and attached references to identify malicious inputs.
            </p>
            <p className="text-neutral-400">
              If an input trigger represents a violation of compliance laws, the prompt will fail, and we may suspend or permanently terminate corresponding profile records without prior warning.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">05.</span>
              Limitation of System Liability
            </h2>
            <p className="uppercase tracking-wider font-mono text-[10px] text-neutral-400">AS-IS WARRANTY CLAUSE:</p>
            <p className="italic text-neutral-400">
              VideoKing-AI is a state-of-the-art visual drafting workspace provided on an "AS-IS" and "AS-AVAILABLE" basis. Under no circumstances shall VideoKing-AI, its parent company, or licensing vendors be liable for direct, incidental, or consequential damages resulting from platform downtime, failed scene renders, model hallucinations, or the loss of stored visual blueprints.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">06.</span>
              Termination of Services
            </h2>
            <p>
              We maintain authority to discontinue account access, deactivate specific developer plans, and delete related session variables at our single discretion, without cause or advance notification, if user utilization metrics represent system hazard or fraudulent execution styles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-600 font-mono text-xs">07.</span>
              Inquiries and Legal Notices
            </h2>
            <p>
              Please submit any questions or legal dispute notices linked with service utilization parameters using our secure contact point:
            </p>
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300">
              <p className="font-semibold text-white">VideoKing-AI Legal &amp; Compliance Dept</p>
              <p className="text-neutral-550">ADDRESS: One Silicon Valley Center, San Jose, CA, USA</p>
              <p className="text-neutral-450">DIRECT EMAIL: support@videoking.ai</p>
            </div>
          </section>

        </div>

        {/* Back Button */}
        <div className="mt-16 pt-8 border-t border-neutral-900 text-center">
          <button
            onClick={onBackToLanding}
            className="px-6 py-2.5 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition-colors text-xs font-medium rounded-xl cursor-pointer"
          >
            Accept Terms and Return to Home
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
