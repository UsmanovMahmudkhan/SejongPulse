import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
      {/* Glass Pod Container */}
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Branding Area */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 glass-glow rounded-[2.5rem] crimson-aura relative overflow-hidden group">
            {/* Internal Crimson Glow */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span
              className="material-symbols-outlined text-5xl text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              sensors
            </span>
          </div>
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-background mb-4">
            Sejong <span className="text-primary-container">Pulse</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium max-w-[280px] mx-auto leading-relaxed">
            The ethereal heart of Sejong University&apos;s digital ecosystem.
          </p>
        </div>

        {/* Interaction Card */}
        <div className="w-full glass-glow p-8 rounded-[2rem] shadow-[0_20_40px_rgba(26,28,29,0.04)] border border-white/20">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <span className="font-label text-xs uppercase tracking-[0.15em] text-outline font-bold">
                University Gateway
              </span>
            </div>

            {/* CTA Button */}
            <Link
              href="/pulse"
              className="w-full liquid-gradient text-white flex items-center justify-center gap-3 py-5 px-6 rounded-full font-headline font-bold text-lg crimson-aura active:scale-95 transition-all duration-300"
            >
              <span>Mock Sign In (@sju.ac.kr)</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>

            {/* Secondary Info */}
            <div className="flex flex-col items-center space-y-4 pt-4">
              <p className="text-sm text-on-surface-variant font-medium text-center">
                No password required. A secure magic link will be sent to your
                academic inbox. (Mock Mode)
              </p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="text-[10px] font-label uppercase tracking-widest text-secondary font-bold">
                  Secured by Academic ID
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quote/Status */}
        <div className="mt-12 text-center opacity-40">
          <p className="text-xs font-label uppercase tracking-[0.2em] text-on-surface">
            Creative Academy since 1940
          </p>
        </div>
      </div>

      {/* Crimson Aether Ripple Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-soft-light opacity-0 transition-opacity duration-1000 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10"></div>
    </main>
  );
}
