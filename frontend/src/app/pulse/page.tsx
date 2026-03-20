import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function PulseFeedPage() {
  return (
    <>
      {/* TopAppBar Shell */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary-container text-2xl"
          >
            sensors
          </span>
          <h1 className="font-headline font-bold tracking-tight text-xl text-primary-container drop-shadow-[0_0_8px_rgba(150,0,24,0.4)]">
            Sejong Pulse
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-slate-500">
            <span className="material-symbols-outlined">search</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/20 bg-surface-container-highest">
            {/* Mock User Avatar */}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 max-w-2xl mx-auto px-4">
        {/* Feed Categories / Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button className="px-5 py-2 rounded-full liquid-gradient text-white text-sm font-semibold shadow-[0_8px_16px_rgba(150,0,24,0.2)] shrink-0">
            Global
          </button>
          <button className="px-5 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors shrink-0 outline outline-1 outline-outline-variant/30">
            Following
          </button>
          <button className="px-5 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors shrink-0 outline outline-1 outline-outline-variant/30">
            Academic
          </button>
          <button className="px-5 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors shrink-0 outline outline-1 outline-outline-variant/30">
            Life
          </button>
        </div>

        {/* Pulse Timeline */}
        <div className="space-y-6">
          {/* Pulse Post 1 */}
          <article className="glass-glow rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(26,28,29,0.03)] border border-outline-variant/20 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline font-bold text-on-surface">
                    Minji Kim <span className="text-xs font-normal text-slate-400 ml-2">@mj_sejong • 2m</span>
                  </h3>
                  <span className="material-symbols-outlined text-slate-300 text-sm">
                    more_horiz
                  </span>
                </div>
                <p className="text-on-surface leading-relaxed text-[15px] mb-4">
                  The sunset from the 4th floor balcony is absolutely unreal today. Perfect spot to finish this thesis chapter. 🌇📖
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-container/10 gold-edge text-[10px] font-bold text-secondary ml-1 tracking-wider uppercase">
                    #Library4F
                  </span>
                </p>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                    <span className="text-xs font-medium">124</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    <span className="text-xs font-medium">12</span>
                  </button>
                  <button className="ml-auto px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest crimson-pulse-glow flex items-center gap-1 hover:bg-primary/10 transition-colors">
                    Translate <span className="material-symbols-outlined text-[12px]">translate</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Pulse Post 2 (Asymmetric Layout Focus) */}
          <article className="glass-glow rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(26,28,29,0.03)] border border-outline-variant/20 border-l-4 border-l-primary-container">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline font-bold text-on-surface">
                    Junho Park <span className="text-xs font-normal text-slate-400 ml-2">@j_park • 15m</span>
                  </h3>
                  <span className="material-symbols-outlined text-slate-300 text-sm">
                    more_horiz
                  </span>
                </div>
                <p className="text-on-surface leading-relaxed text-[15px] mb-4">
                  Anyone knows if the seasonal strawberry latte is back yet? Im craving it so bad. 🍓☕️
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-container/10 gold-edge text-[10px] font-bold text-secondary ml-1 tracking-wider uppercase">
                    #ChanhaGwan_Cafe
                  </span>
                </p>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-primary font-bold">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span className="text-xs">42</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    <span className="text-xs font-medium">5</span>
                  </button>
                  <button className="ml-auto px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest crimson-pulse-glow flex items-center gap-1 hover:bg-primary/10 transition-colors">
                    Translate <span className="material-symbols-outlined text-[12px]">translate</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Floating Action Button (New Pulse) */}
      <button className="fixed bottom-28 right-6 w-16 h-16 rounded-full liquid-gradient text-white shadow-[0_12px_24px_rgba(150,0,24,0.3)] flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all outline outline-2 outline-white/20 outline-offset-[-2px]">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* BottomNavBar Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] border-t border-outline-variant/20">
        <Link href="/pulse" className="flex flex-col items-center justify-center liquid-gradient text-white rounded-2xl px-5 py-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] outline outline-1 outline-white/20">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            amp_stories
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">
            Feed
          </span>
        </Link>
        <Link href="/messages/channels" className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">hub</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">
            Channels
          </span>
        </Link>
        <Link href="/messages/chats" className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">
            Chats
          </span>
        </Link>
        <Link href="/discovery" className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">
            Discovery
          </span>
        </Link>
      </nav>
    </>
  );
}
