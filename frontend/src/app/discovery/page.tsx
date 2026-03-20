"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRecommendations } from "@/lib/api";

interface Profile {
  id: string;
  pseudonym: string;
  major: string;
  year: number;
  gpa: number;
  skills: string[];
  current_building: string;
}

export default function SwipeStackPage() {
  const [recommendations, setRecommendations] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadRecs() {
      try {
        const data = await fetchRecommendations("user_123");
        setRecommendations(data);
      } catch (error) {
        console.error("Error loading recommendations:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRecs();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    setCurrentIndex((prev) => prev + 1);
  };

  const currentProfile = recommendations[currentIndex];

  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-hidden min-h-screen relative flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container/20 flex-shrink-0 flex items-center justify-center">
             <span className="material-symbols-outlined text-slate-400">person</span>
          </div>
          <span className="text-[#960018] font-black tracking-tighter font-headline text-xl">Sejong Pulse</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100/50 transition-colors">
          <span className="material-symbols-outlined text-zinc-500">tune</span>
        </button>
      </header>

      {/* Main Discovery Canvas */}
      <main className="relative flex-grow w-full flex items-center justify-center pt-20 pb-24 overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary-container/10 blur-[120px] rounded-full"></div>
        <div className="absolute -right-20 top-1/4 w-96 h-96 bg-primary-container/5 blur-[100px] rounded-full"></div>

        <div className="relative w-full max-w-md px-6 perspective-1000">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[500px] glass-glow rounded-[2.5rem] border border-outline-variant/20">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Algorithmic DNA Matching...</p>
            </div>
          ) : currentProfile ? (
            <>
              <div className="absolute inset-x-10 top-4 bottom-14 bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-sm transform scale-90 -z-20 border border-outline-variant/10"></div>
              <div className="absolute inset-x-8 top-2 bottom-16 bg-white/60 backdrop-blur-lg rounded-[2.5rem] shadow-md transform scale-95 -z-10 border border-outline-variant/20"></div>

              <div className="relative w-full aspect-[3/4.5] rounded-[2.5rem] overflow-hidden shadow-[0px_40px_80px_rgba(0,0,0,0.12)] crimson-pulse-glow group bg-surface-container-low border border-outline-variant/20 flex flex-col justify-end animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                
                <div className="absolute top-6 left-6 px-4 py-2 rounded-full glass-glow border border-white/30 flex items-center gap-2 z-20">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-xs font-bold tracking-widest uppercase text-on-surface">Verified Student</span>
                </div>

                <div className="relative p-6 glass-glow border-t border-white/20 m-2 rounded-[2.2rem] z-20 overflow-hidden">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-xl -z-10"></div>
                  
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h2 className="text-2xl font-bold font-headline text-on-surface tracking-tight">{currentProfile.pseudonym}, {2026 - currentProfile.year + 19}</h2>
                      <p className="text-sm text-zinc-600 font-medium">{currentProfile.major}</p>
                    </div>
                    <div className="bg-primary-container/10 px-3 py-1 rounded-lg">
                      <span className="text-primary-container font-bold text-lg">{currentProfile.gpa}</span>
                      <span className="text-[10px] uppercase font-bold text-primary-container/60 ml-1 tracking-tighter">GPA</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {currentProfile.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-[11px] font-semibold border border-outline-variant/20">#{skill.replace(/\s/g, '')}</span>
                    ))}
                  </div>

                  <div className="bg-primary-container/5 rounded-2xl p-4 border border-primary-container/10">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-base">psychology</span>
                      </div>
                      <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-black text-primary-container mb-1">DNA Correlation</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          Great match for <span className="font-bold text-on-surface">{currentProfile.major}</span> study groups in <span className="font-bold text-on-surface">{currentProfile.current_building}</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
                <button 
                  className="w-14 h-14 rounded-full glass-glow border border-outline-variant/30 flex items-center justify-center text-zinc-500 hover:text-error hover:border-error/30 transition-all hover:scale-110 active:scale-90 shadow-sm bg-white/80"
                  onClick={() => handleSwipe('left')}
                >
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
                
                <Link href="/discovery/match" className="w-20 h-20 rounded-full liquid-gradient flex items-center justify-center text-white shadow-[0_12px_24px_rgba(150,0,24,0.3)] hover:shadow-[0_16px_32px_rgba(150,0,24,0.4)] transition-all hover:-translate-y-1 active:scale-95 group relative">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                  <div className="absolute inset-0 rounded-full border-4 border-primary-container/20 animate-ping pointer-events-none"></div>
                </Link>
                
                <button 
                  className="w-14 h-14 rounded-full glass-glow border border-outline-variant/30 flex items-center justify-center text-zinc-500 hover:text-secondary hover:border-secondary/30 transition-all hover:scale-110 active:scale-90 shadow-sm bg-white/80"
                  onClick={() => handleSwipe('right')}
                >
                  <span className="material-symbols-outlined text-3xl">terminal</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 animate-fade-in">
               <div className="w-20 h-20 rounded-full bg-surface-container-high mx-auto flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-slate-300">person_off</span>
               </div>
               <h3 className="text-xl font-headline font-bold text-slate-500">No more matches today</h3>
               <p className="text-sm text-slate-400 mt-2">Check back later for more Sejong peers!</p>
               <button onClick={() => setCurrentIndex(0)} className="mt-6 px-6 py-2 rounded-full border border-primary text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/5 transition-colors">Refresh Stack</button>
            </div>
          )}
        </div>
      </main>

      {/* Standard Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/60 backdrop-blur-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] border-t border-outline-variant/20">
        <Link href="/pulse" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">amp_stories</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Feed</span>
        </Link>
        <Link href="/messages/channels" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">hub</span>
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
