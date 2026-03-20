import React from "react";
import Link from "next/link";

export default function BroadcastChannelsPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#960018] dark:text-[#ff4d67]">sensors</span>
          <h1 className="text-xl font-black text-[#960018] dark:text-[#ff4d67] drop-shadow-[0_0_8px_rgba(150,0,24,0.4)] font-headline tracking-tight">Sejong Pulse</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 duration-200">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">search</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
            {/* Mock User */}
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto pb-32">
        {/* Editorial Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-secondary font-headline">Verified Stream</span>
            <div className="h-[1px] w-8 bg-secondary-container"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline text-on-background mb-4">Broadcast Channels</h2>
          <p className="text-on-surface-variant max-w-md leading-relaxed">Official read-only announcements from University departments and student organizations.</p>
        </header>

        {/* Bento Grid Layout for Featured Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Large Featured Card */}
          <div className="md:col-span-2 glass-glow rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-end min-h-[320px] shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/15 group">
            <div className="absolute inset-0 z-0 opacity-10 scale-110 group-hover:scale-100 transition-transform duration-700 bg-gradient-to-tr from-primary to-transparent"></div>
            <div className="absolute top-6 right-6 z-10">
              <span className="liquid-gradient text-white text-[10px] font-bold px-3 py-1.5 rounded-full crimson-pulse-glow">3 NEW</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-outline-variant/10 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary">school</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl font-headline tracking-tight text-on-surface">CompSci TA Announcements</h3>
                  <p className="text-sm text-on-surface-variant">2.4k Subscribers</p>
                </div>
              </div>
              <p className="text-on-surface mb-4 line-clamp-2 italic">Assignment 4 deadline has been extended by 48 hours for all sections. Check the portal for details.</p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary cursor-pointer hover:underline">
                <span>Read Latest</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* Smaller Bento Card */}
          <div className="glass-glow rounded-[2rem] p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/15">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary crimson-pulse-glow"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg font-headline leading-tight mb-1 text-on-surface">Student Council Updates</h3>
              <p className="text-xs text-on-surface-variant mb-4">Next meeting: Friday 4PM</p>
              <div className="flex items-center -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-surface-container-high"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-surface-container-high"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-surface-container text-[8px] flex items-center justify-center font-bold text-on-surface">+12</div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant">Recommended for you</h3>
            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {/* Channel Item */}
            <div className="bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-[1.5rem] p-4 flex items-center gap-4 group cursor-pointer shadow-[0_5px_15px_rgba(26,28,29,0.02)] border border-transparent hover:border-outline-variant/20">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant/10"></div>
              <div className="flex-grow">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-on-background">Sejong Jazz Society</h4>
                  <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-1">New practice room codes for November...</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] text-slate-400 font-medium">2m ago</span>
                <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">12+</div>
              </div>
            </div>

            {/* Channel Item */}
            <div className="bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-300 rounded-[1.5rem] p-4 flex items-center gap-4 group cursor-pointer shadow-[0_5px_15px_rgba(26,28,29,0.02)] border border-transparent hover:border-outline-variant/20">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant/10"></div>
              <div className="flex-grow">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-on-background">Cyber Security Lab</h4>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-1">CTF Competition starts in 1 hour!</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] text-slate-400 font-medium">1h ago</span>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] border-t border-outline-variant/20">
        <Link href="/pulse" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">amp_stories</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Feed</span>
        </Link>
        <Link href="/messages/channels" className="flex flex-col items-center justify-center liquid-gradient text-white rounded-2xl px-5 py-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] outline outline-1 outline-white/20">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Channels</span>
        </Link>
        <Link href="/messages/chats" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Chats</span>
        </Link>
        <Link href="/discovery" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Discovery</span>
        </Link>
      </nav>
    </>
  );
}
