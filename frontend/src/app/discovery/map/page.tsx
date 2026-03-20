import React from "react";
import Link from "next/link";

export default function CampusMapDashboardPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#960018] text-2xl">sensors</span>
          <h1 className="font-headline font-bold tracking-tight text-xl font-black text-[#960018] drop-shadow-[0_0_8px_rgba(150,0,24,0.4)]">Sejong Pulse</h1>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="/discovery" className="text-slate-500 hover:text-[#960018] transition-all text-sm tracking-wide">Swipe</Link>
          <Link href="/discovery/map" className="text-[#960018] font-bold text-sm tracking-wide">Campus Map</Link>
        </nav>
        <button className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined text-slate-500">account_circle</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Hero Display Section */}
        <section className="flex flex-col gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-secondary font-headline">Live Overview</span>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-background">Utility Hub & Map</h2>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Map Container (Large Glass Pod) */}
          <div className="md:col-span-8 relative overflow-hidden rounded-[2rem] bg-surface-container-low border border-outline-variant/20 min-h-[500px] shadow-[0px_20px_40px_rgba(26,28,29,0.04)]">
            <div className="absolute inset-0 z-0 bg-slate-200">
              {/* Fallback for map image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-surface via-transparent to-transparent"></div>
            </div>

            {/* Custom Map Overlay Elements */}
            <div className="absolute inset-0 z-10 p-4 sm:p-8 pointer-events-none">
              <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start pointer-events-auto">
                  <div className="glass-glow bg-white/80 px-4 py-2 rounded-2xl flex items-center gap-3 border border-outline-variant/30 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-semibold tracking-wide text-on-surface">Campus Pulse: Active</span>
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <button className="w-10 h-10 glass-glow bg-white/80 rounded-xl flex items-center justify-center text-slate-700 shadow-sm border border-outline-variant/30 pointer-events-auto hover:bg-white transition-colors">
                      <span className="material-symbols-outlined">layers</span>
                    </button>
                    <button className="w-10 h-10 glass-glow bg-white/80 rounded-xl flex items-center justify-center text-slate-700 shadow-sm border border-outline-variant/30 pointer-events-auto hover:bg-white transition-colors">
                      <span className="material-symbols-outlined">my_location</span>
                    </button>
                  </div>
                </div>

                {/* Pulse Pins */}
                <div className="absolute top-[30%] left-[45%] pointer-events-auto group">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"></div>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 glass-glow bg-white/90 backdrop-blur-md py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-outline-variant/20 pointer-events-none">
                      <p className="text-[10px] font-bold text-primary mb-0.5">STUDY SPOT VIBE</p>
                      <p className="text-[11px] font-medium text-on-surface">Library B1: Silent Focus</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[60%] left-[20%] pointer-events-auto group">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-4 h-4 rounded-full bg-secondary border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"></div>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 glass-glow bg-white/90 backdrop-blur-md py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-outline-variant/20 pointer-events-none">
                      <p className="text-[10px] font-bold text-secondary mb-0.5">STUDY SPOT VIBE</p>
                      <p className="text-[11px] font-medium text-on-surface">Student Union: Ambient Cafe</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pointer-events-auto">
                  <div className="glass-glow bg-white/80 backdrop-blur-xl p-6 rounded-[1.5rem] w-full max-w-xs border border-outline-variant/30 shadow-lg">
                    <h3 className="text-sm font-bold text-on-surface mb-4">Location Search</h3>
                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-outline-variant/20 shadow-inner">
                      <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                      <input className="bg-transparent border-none text-xs text-on-surface w-full focus:ring-0 outline-none" placeholder="Find a vibe..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Tags Side Pod */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0px_20px_40px_rgba(26,28,29,0.04)] border border-outline-variant/10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline font-bold text-lg tracking-tight">Trending #Tags</h3>
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="bg-secondary-container/20 px-4 py-2.5 rounded-full border border-secondary-container/40 flex items-center gap-2 hover:bg-secondary-container/30 transition-all cursor-pointer">
                  <span className="text-xs font-bold text-on-secondary-container tracking-wide">#KondaeDiscount</span>
                </div>
                <div className="bg-surface-container-low px-4 py-2.5 rounded-full border border-outline-variant/20 flex items-center gap-2 hover:bg-surface-container-high transition-all cursor-pointer">
                  <span className="text-xs font-bold text-on-surface-variant tracking-wide">#MidtermCram</span>
                </div>
                <div className="bg-surface-container-low px-4 py-2.5 rounded-full border border-outline-variant/20 flex items-center gap-2 hover:bg-surface-container-high transition-all cursor-pointer">
                  <span className="text-xs font-bold text-on-surface-variant tracking-wide">#FestivalLineup</span>
                </div>
                <div className="bg-surface-container-low px-4 py-2.5 rounded-full border border-outline-variant/20 flex items-center gap-2 hover:bg-surface-container-high transition-all cursor-pointer">
                  <span className="text-xs font-bold text-on-surface-variant tracking-wide">#SejongSquare</span>
                </div>
              </div>

              <div className="mt-auto space-y-4 pt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vibe Analytics</p>
                <div className="flex items-end gap-1 h-20 px-2">
                  <div className="flex-1 bg-primary/20 rounded-t-lg h-[40%] hover:bg-primary/30 transition-colors"></div>
                  <div className="flex-1 bg-primary/40 rounded-t-lg h-[60%] hover:bg-primary/50 transition-colors"></div>
                  <div className="flex-1 bg-primary rounded-t-lg h-[90%] hover:bg-primary/80 transition-colors cursor-pointer relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface text-on-surface text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-outline-variant/10">Peak</div>
                  </div>
                  <div className="flex-1 bg-primary/60 rounded-t-lg h-[50%] hover:bg-primary/70 transition-colors"></div>
                  <div className="flex-1 bg-primary/30 rounded-t-lg h-[30%] hover:bg-primary/40 transition-colors"></div>
                  <div className="flex-1 bg-primary/80 rounded-t-lg h-[75%] hover:bg-primary/90 transition-colors"></div>
                </div>
                <div className="flex justify-between text-[10px] font-medium text-slate-400 font-label">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Pods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-glow bg-surface-container-lowest p-6 rounded-[1.5rem] border border-outline-variant/10 shadow-sm flex items-center gap-4 group hover:border-outline-variant/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Hubs</p>
              <p className="text-lg font-extrabold text-on-surface">1,204</p>
            </div>
          </div>

          <div className="glass-glow bg-surface-container-lowest p-6 rounded-[1.5rem] border border-outline-variant/10 shadow-sm flex items-center gap-4 group hover:border-outline-variant/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">notifications_active</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alerts</p>
              <p className="text-lg font-extrabold text-on-surface">2 Active</p>
            </div>
          </div>

          <div className="glass-glow bg-surface-container-lowest p-6 rounded-[1.5rem] border border-outline-variant/10 shadow-sm flex items-center gap-4 group hover:border-outline-variant/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-white crimson-pulse-glow group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pulse Score</p>
              <p className="text-lg font-extrabold text-on-surface">High</p>
            </div>
          </div>

          <div className="glass-glow bg-surface-container-lowest p-6 rounded-[1.5rem] border border-outline-variant/10 shadow-sm flex items-center gap-4 group hover:border-outline-variant/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container/30 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">wifi_tethering</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Connect</p>
              <p className="text-lg font-extrabold text-on-surface">Stable</p>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
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
    </>
  );
}
