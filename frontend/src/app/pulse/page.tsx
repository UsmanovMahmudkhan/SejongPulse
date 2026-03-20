"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPulses, translatePulse } from "@/lib/api";

interface Pulse {
  id: string;
  user_id: string;
  content: string;
  category: string;
  building_tag: string;
  created_at: string;
}

export default function PulseFeedPage() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPulses() {
      try {
        const data = await fetchPulses();
        setPulses(data);
      } catch (error) {
        console.error("Error loading pulses:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPulses();
  }, []);

  const handleTranslate = async (id: string, content: string) => {
    setTranslatingId(id);
    try {
      const data = await translatePulse(content, "ko");
      setTranslations((prev) => ({ ...prev, [id]: data.translated_content }));
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setTranslatingId(null);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container text-2xl">
            sensors
          </span>
          <h1 className="font-headline font-bold tracking-tight text-xl text-primary-container drop-shadow-[0_0_8px_rgba(150,0,24,0.4)]">
            Sejong Pulse
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-black/5 transition-all text-slate-500">
            <span className="material-symbols-outlined">search</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/20 bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400">person</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 max-w-2xl mx-auto px-4">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button className="px-5 py-2 rounded-full liquid-gradient text-white text-sm font-semibold shadow-[0_8px_16px_rgba(150,0,24,0.2)] shrink-0">
            Global
          </button>
          <button className="px-5 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors shrink-0 outline outline-1 outline-outline-variant/30">
            Academic
          </button>
          <button className="px-5 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-medium hover:bg-surface-container-high transition-colors shrink-0 outline outline-1 outline-outline-variant/30">
            Life
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            pulses.map((pulse) => (
              <article key={pulse.id} className="glass-glow rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(26,28,29,0.03)] border border-outline-variant/20 group animate-fade-in-up">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">account_circle</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-headline font-bold text-on-surface flex items-center gap-2">
                        Post By {pulse.user_id}
                        <span className="text-[10px] font-normal text-slate-400">@user_{pulse.id} • Just now</span>
                      </h3>
                      <span className="material-symbols-outlined text-slate-300 text-sm">more_horiz</span>
                    </div>
                    <p className="text-on-surface leading-relaxed text-[15px] mb-4">
                      {translations[pulse.id] || pulse.content}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-container/10 gold-edge text-[10px] font-bold text-secondary ml-1 tracking-wider uppercase">
                        #{pulse.building_tag}
                      </span>
                    </p>
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                        <span className="text-xs font-medium">0</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                        <span className="text-xs font-medium">0</span>
                      </button>
                      <button 
                        className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm
                          ${translations[pulse.id] 
                            ? "bg-secondary-container/20 text-secondary border border-secondary/20" 
                            : "bg-primary/5 text-primary hover:bg-primary/10 crimson-pulse-glow"}`}
                        onClick={() => handleTranslate(pulse.id, pulse.content)}
                        disabled={translatingId === pulse.id}
                      >
                        {translatingId === pulse.id ? "Translating..." : translations[pulse.id] ? "Translated" : "Translate"}
                        <span className="material-symbols-outlined text-[12px]">translate</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <button className="fixed bottom-28 right-6 w-16 h-16 rounded-full liquid-gradient text-white shadow-[0_12px_24px_rgba(150,0,24,0.3)] flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all outline outline-2 outline-white/20 outline-offset-[-2px]">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/60 backdrop-blur-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem] border-t border-outline-variant/20">
        <Link href="/pulse" className="flex flex-col items-center justify-center liquid-gradient text-white rounded-2xl px-5 py-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] outline outline-1 outline-white/20">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>amp_stories</span>
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
        <Link href="/discovery" className="flex flex-col items-center justify-center text-slate-400 p-3 hover:scale-110 transition-transform hover:text-primary">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] font-headline mt-1">Discovery</span>
        </Link>
      </nav>
    </>
  );
}
