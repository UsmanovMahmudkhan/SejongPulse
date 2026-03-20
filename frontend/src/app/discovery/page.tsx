import React from "react";
import Link from "next/link";

export default function SwipeStackPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-hidden min-h-screen relative flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container/20 flex-shrink-0"></div>
          <span className="text-[#960018] font-black tracking-tighter font-headline text-xl">Sejong Pulse</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-zinc-500">tune</span>
        </button>
      </header>

      {/* Main Discovery Canvas */}
      <main className="relative flex-grow w-full flex items-center justify-center pt-20 pb-24 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary-container/10 blur-[120px] rounded-full"></div>
        <div className="absolute -right-20 top-1/4 w-96 h-96 bg-primary-container/5 blur-[100px] rounded-full"></div>

        {/* Swipe Stack Container */}
        <div className="relative w-full max-w-md px-6 perspective-1000">
          {/* Background Stack Cards */}
          <div className="absolute inset-x-10 top-4 bottom-14 bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-sm transform scale-90 -z-20 border border-outline-variant/10"></div>
          <div className="absolute inset-x-8 top-2 bottom-16 bg-white/60 backdrop-blur-lg rounded-[2.5rem] shadow-md transform scale-95 -z-10 border border-outline-variant/20"></div>

          {/* Main Active Discovery Card */}
          <div className="relative w-full aspect-[3/4.5] rounded-[2.5rem] overflow-hidden shadow-[0px_40px_80px_rgba(0,0,0,0.12)] crimson-pulse-glow group bg-surface-container-low border border-outline-variant/20 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            
            {/* Verified Badge */}
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full glass-glow border border-white/30 flex items-center gap-2 z-20">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-xs font-bold tracking-widest uppercase text-on-surface">Verified Student</span>
            </div>

            {/* Card Content */}
            <div className="relative p-6 glass-glow border-t border-white/20 m-2 rounded-[2.2rem] z-20 overflow-hidden">
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xl -z-10"></div>
              
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-bold font-headline text-on-surface tracking-tight">Ji-won Park, 21</h2>
                  <p className="text-sm text-zinc-600 font-medium">Computer Science & AI</p>
                </div>
                <div className="bg-primary-container/10 px-3 py-1 rounded-lg">
                  <span className="text-primary-container font-bold text-lg">4.2</span>
                  <span className="text-[10px] uppercase font-bold text-primary-container/60 ml-1 tracking-tighter">GPA</span>
                </div>
              </div>

              {/* Course Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-[11px] font-semibold border border-outline-variant/20">#OperatingSystems</span>
                <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-[11px] font-semibold border border-outline-variant/20">#DataStructures</span>
                <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-[11px] font-semibold border border-outline-variant/20">#DeepLearning</span>
              </div>

              {/* Skill Gap Indicator */}
              <div className="bg-primary-container/5 rounded-2xl p-4 border border-primary-container/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-base">psychology</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-black text-primary-container mb-1">Skill-Gap Indicator</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      They know <span className="font-bold text-on-surface">C++ & Python</span>. You both study under <span className="font-bold text-on-surface">Prof. Kim</span>. Great match for the upcoming Project Lab.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
            <button className="w-14 h-14 rounded-full glass-glow border border-outline-variant/30 flex items-center justify-center text-zinc-500 hover:text-error hover:border-error/30 transition-all hover:scale-110 active:scale-90 shadow-sm bg-white/80">
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            
            <Link href="/discovery/match" className="w-20 h-20 rounded-full liquid-gradient flex items-center justify-center text-white shadow-[0_12px_24px_rgba(150,0,24,0.3)] hover:shadow-[0_16px_32px_rgba(150,0,24,0.4)] transition-all hover:-translate-y-1 active:scale-95 group relative">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
              <div className="absolute inset-0 rounded-full border-4 border-primary-container/20 animate-ping pointer-events-none"></div>
            </Link>
            
            <button className="w-14 h-14 rounded-full glass-glow border border-outline-variant/30 flex items-center justify-center text-zinc-500 hover:text-secondary hover:border-secondary/30 transition-all hover:scale-110 active:scale-90 shadow-sm bg-white/80">
              <span className="material-symbols-outlined text-3xl">terminal</span>
            </button>
          </div>
        </div>
      </main>

      {/* Navigation Drawer (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-10 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-2xl z-40 border-r border-zinc-200/50">
        <div className="space-y-8 flex flex-col items-center">
          <span className="material-symbols-outlined text-[#960018] font-bold">school</span>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-200/50 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-primary">explore</span>
          </div>
          <Link href="/discovery/map" className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-200/50 transition-all cursor-pointer">
            <span className="material-symbols-outlined">map</span>
          </Link>
        </div>
      </aside>

      {/* Standard Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] border-t border-outline-variant/20 lg:hidden">
        <Link href="/pulse" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">amp_stories</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Feed</span>
        </Link>
        <Link href="/messages/channels" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Channels</span>
        </Link>
        <Link href="/messages/chats" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Chats</span>
        </Link>
        <Link href="/discovery" className="flex flex-col items-center justify-center liquid-gradient text-white rounded-2xl px-5 py-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] outline outline-1 outline-white/20">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Discovery</span>
        </Link>
      </nav>
    </div>
  );
}
