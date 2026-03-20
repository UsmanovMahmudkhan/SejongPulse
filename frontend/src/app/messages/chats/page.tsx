import React from "react";
import Link from "next/link";

export default function FlashChatsPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20_40px_rgba(26,28,29,0.04)] md:hidden">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container">sensors</span>
          <h1 className="text-xl font-black text-primary-container drop-shadow-[0_0_8px_rgba(150,0,24,0.4)] font-headline tracking-tight">Sejong Pulse</h1>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:pt-12">
        {/* Left Column: Chat List / Drawer */}
        <aside className="md:col-span-4 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
              Flash <span className="text-primary">Chats</span>
            </h2>
          </div>

          <div className="glass-glow rounded-2xl p-4 flex items-center gap-3 border border-outline-variant/20">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 outline-none" placeholder="Find a pulse..." type="text"/>
          </div>

          <div className="space-y-4">
            <div className="glass-glow p-4 rounded-3xl border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group shadow-sm">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center liquid-gradient crimson-aura">
                    <span className="material-symbols-outlined text-white">groups</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-bold text-on-surface">Design Studio Team</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-1">Alex shared a live location at the Plaza...</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] border-t border-outline-variant/20 md:hidden">
        <Link href="/pulse" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">amp_stories</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Feed</span>
        </Link>
        <Link href="/messages/channels" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">hub</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Channels</span>
        </Link>
        <Link href="/messages/chats" className="flex flex-col items-center justify-center liquid-gradient text-white rounded-2xl px-5 py-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] outline outline-1 outline-white/20">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
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
