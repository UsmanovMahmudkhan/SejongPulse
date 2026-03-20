import React from "react";
import Link from "next/link";

export default function ThreadConversationPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <Link href="/pulse" className="p-2 hover:bg-black/5 transition-all active:scale-95 duration-200 rounded-full text-slate-500">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#960018] drop-shadow-[0_0_8px_rgba(150,0,24,0.4)]" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
            <h1 className="font-headline font-bold tracking-tight text-xl text-[#960018]">Sejong Pulse</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-black/5 transition-all rounded-full">
            <span className="material-symbols-outlined text-slate-500">more_vert</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-3xl mx-auto space-y-8">
        {/* OP (Original Poster) Content */}
        <article className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl object-cover bg-surface-container-highest border border-outline-variant/20 shadow-sm flex-shrink-0"></div>
              <div className="absolute -bottom-1 -right-1 bg-secondary-container p-1 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[12px] text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              </div>
            </div>
            <div>
              <h2 className="font-headline font-extrabold text-on-background tracking-tight">Prof. Min-kyu Park</h2>
              <p className="text-label text-slate-400 font-medium tracking-wide uppercase text-[10px]">Quantum Computing Division • 2h ago</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-headline font-bold text-on-background leading-tight tracking-tight">
              Announcement: Breakthrough in Ambient Superconductivity simulations at the Sejong AI Hub.
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed font-body">
              Our team successfully validated the new algorithmic approach for Phase 4 transition modeling. This represents a significant leap for our collective research. Detailed findings are in the Hub repository. Thoughts on the stability of the lattice?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high"></div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high"></div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high text-white text-[10px] flex items-center justify-center font-bold bg-primary">+4</div>
            </div>
            <span className="text-sm font-medium text-slate-500 ml-2">42 Research Fellows joining the conversation</span>
          </div>
        </article>

        {/* Thread & Replies Section */}
        <section className="space-y-6 relative">
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary-container/20 to-transparent"></div>

          {/* Reply Level 1 */}
          <div className="relative pl-12">
            <div className="glass-glow rounded-[2rem] rounded-tr-sm p-5 shadow-[0_10px_30px_rgba(26,28,29,0.03)] border border-outline-variant/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest border border-outline-variant/10 flex-shrink-0"></div>
                <div>
                  <span className="font-bold text-sm text-on-background">Dr. Elena Choi</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-2 uppercase">1h ago</span>
                </div>
              </div>
              <p className="text-on-background leading-relaxed">
                The lattice stability looks promising, Prof. Park. However, did you account for the thermal variance in the cryogenic substrate? My lab saw different results last week.
              </p>
              <div className="flex items-center gap-6 mt-4">
                <button className="flex items-center gap-1.5 text-primary font-bold text-xs hover:bg-primary/5 px-2 py-1 rounded-md transition-colors">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span>12</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-400 font-bold text-xs hover:bg-black/5 px-2 py-1 rounded-md transition-colors">
                  <span className="material-symbols-outlined text-[18px]">reply</span>
                  <span>Reply</span>
                </button>
              </div>
            </div>

            {/* Nested Reply Level 2 */}
            <div className="mt-4 space-y-4">
              <div className="relative pl-10">
                <div className="absolute left-0 top-6 w-8 h-[1px] bg-primary-container/20"></div>
                <div className="bg-white/40 rounded-[1.5rem] rounded-tr-sm p-4 shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-surface-container-highest flex-shrink-0"></div>
                    <span className="font-bold text-xs text-on-background">
                      Prof. Min-kyu Park <span className="text-[10px] bg-primary-container/10 text-primary-container px-1.5 py-0.5 rounded uppercase ml-1 font-bold">OP</span>
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Good catch, Elena. We used the new graphene-based isolation method to mitigate that. Check the PDF in the Hub.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Reply Bar with AcademicBot */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/60 backdrop-blur-[40px] px-6 pt-3 pb-8 rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-outline-variant/20">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {/* Agentic Assist Trigger */}
          <button className="flex items-center justify-between w-full p-3 bg-white/40 border border-primary/20 rounded-2xl group active:scale-[0.98] transition-all crimson-pulse-glow shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 liquid-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-headline font-bold text-primary tracking-tight">Ask AcademicBot</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Research Assistant Active</p>
              </div>
            </div>
            <div className="flex gap-1 pr-2">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150"></div>
            </div>
          </button>

          {/* Text Input Area */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface-container-low rounded-2xl px-4 py-3 flex items-center gap-3 border border-outline-variant/10">
              <span className="material-symbols-outlined text-slate-400">add_circle</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium text-on-surface outline-none" placeholder="Add a thoughtful reply..." type="text"/>
            </div>
            <button className="w-12 h-12 liquid-gradient rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 duration-200 hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
