import React from "react";
import Link from "next/link";

export default function MatchCelebrationPage() {
  return (
    <div className="bg-background font-body text-on-background antialiased overflow-hidden min-h-screen relative flex items-center justify-center p-6">
      {/* Animated Background Elements (Visual Only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]"></div>
        
        {/* Particles */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-secondary rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-2 h-2 bg-primary-container rounded-full opacity-30 animate-pulse delay-150"></div>
        <div className="absolute top-1/2 left-20 w-4 h-4 bg-secondary-container rounded-full opacity-20 blur-sm"></div>
      </div>

      {/* The Celebration Card (Glass Pod) */}
      <div className="relative z-10 w-full max-w-lg glass-glow bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 text-center border border-white/40 shadow-2xl flex flex-col items-center">
        
        {/* Floating Academic Icon */}
        <div className="mb-8 w-20 h-20 liquid-gradient rounded-2xl flex items-center justify-center crimson-pulse-glow transform -rotate-6 shadow-xl">
          <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">
          It&apos;s a <span className="text-primary-container">Match!</span>
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-xs mx-auto leading-relaxed mb-12">
          Your academic journey just found a perfect companion at Sejong.
        </p>

        {/* Overlapping Avatars Section */}
        <div className="relative flex items-center justify-center mb-16 h-32 w-full">
          {/* Particle Explosion Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-secondary/20 rounded-full blur-2xl animate-pulse"></div>
          </div>

          {/* Avatar 1 (User) */}
          <div className="relative z-20 -mr-6 transform -rotate-3 transition-transform hover:rotate-0 duration-500 hover:z-30">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1.5 bg-white shadow-xl border border-outline-variant/10">
              <div className="w-full h-full object-cover rounded-full bg-surface-container-high"></div>
            </div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(254,214,91,0.5)] border-2 border-white">
              <span className="material-symbols-outlined text-on-secondary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
          </div>

          {/* Avatar 2 (Match) */}
          <div className="relative z-10 -ml-6 transform rotate-6 transition-transform hover:rotate-0 duration-500 hover:z-30">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1.5 bg-white shadow-xl border border-outline-variant/10">
              <div className="w-full h-full object-cover rounded-full bg-surface-container-high"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary-container rounded-full flex items-center justify-center crimson-pulse-glow border-2 border-white">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </div>
          </div>
        </div>

        {/* Actions Container */}
        <div className="w-full space-y-4">
          <Link href="/pulse/thread" className="w-full flex items-center justify-center gap-3 liquid-gradient text-white py-4 px-8 rounded-full font-headline font-bold text-lg crimson-pulse-glow hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-center block">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
            Message Now
          </Link>
          
          <Link href="/discovery" className="w-full py-3 text-on-surface-variant font-label text-sm uppercase tracking-widest font-bold hover:text-primary-container transition-colors active:scale-95 duration-200 block">
            Keep Discovering
          </Link>
        </div>
      </div>

      {/* Floating Decorative Glass Pods (Contextual UI) - Desktop Only */}
      <div className="absolute top-10 left-10 lg:left-32 hidden lg:flex">
        <div className="glass-glow bg-white/70 border border-white/40 px-5 py-4 rounded-2xl shadow-sm rotate-6 flex items-center gap-3 hover:rotate-0 transition-transform">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(254,214,91,0.8)]"></div>
          <span className="text-xs font-label uppercase tracking-tighter font-semibold text-on-surface">Study Match: 98%</span>
        </div>
      </div>
      
      <div className="absolute bottom-20 right-10 lg:right-32 hidden lg:flex">
        <div className="glass-glow bg-white/70 border border-white/40 px-5 py-4 rounded-2xl shadow-sm -rotate-3 flex items-center gap-3 hover:rotate-0 transition-transform">
          <span className="material-symbols-outlined text-primary-container text-sm">groups</span>
          <span className="text-xs font-label uppercase tracking-tighter font-semibold text-on-surface">Shared Project: Lab B</span>
        </div>
      </div>
    </div>
  );
}
