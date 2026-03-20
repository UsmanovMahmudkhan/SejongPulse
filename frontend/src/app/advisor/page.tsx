"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AcademicAdvisorPage() {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col relative overflow-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <Link href="/pulse" className="p-2 hover:bg-black/5 transition-all active:scale-95 duration-200 rounded-full text-slate-500 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg liquid-gradient flex items-center justify-center shadow-lg crimson-pulse-glow">
               <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <h1 className="font-headline font-bold tracking-tight text-lg text-on-background">AcademicBot</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">Online</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow pt-24 pb-32 px-4 max-w-3xl mx-auto w-full flex flex-col justify-end space-y-6">
        
        {/* Intro / Empty State */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex w-20 h-20 rounded-3xl liquid-gradient items-center justify-center shadow-[0_12px_30px_rgba(150,0,24,0.3)] mb-4">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h2 className="text-2xl font-headline font-extrabold text-on-background">How can I assist your studies?</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Ask me about degree requirements, prerequisites, or finding the best courses for your major.
          </p>
          
          {/* Suggestion Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button className="px-4 py-2 rounded-full glass-glow border border-outline-variant/20 text-xs font-semibold text-on-surface-variant hover:bg-white transition-colors" onClick={() => setQuery("What are the prerequisites for Deep Learning?")}>
              Prerequisites for Deep Learning
            </button>
            <button className="px-4 py-2 rounded-full glass-glow border border-outline-variant/20 text-xs font-semibold text-on-surface-variant hover:bg-white transition-colors" onClick={() => setQuery("How many credits for CS minor?")}>
              CS Minor Requirements
            </button>
            <button className="px-4 py-2 rounded-full glass-glow border border-outline-variant/20 text-xs font-semibold text-on-surface-variant hover:bg-white transition-colors" onClick={() => setQuery("Recommend electives for AI track")}>
              Electives for AI track
            </button>
          </div>
        </div>

        {/* Agent Message (Mock) */}
        <div className="flex items-start gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg liquid-gradient flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div className="glass-glow bg-white/70 backdrop-blur-md p-4 rounded-2xl rounded-tl-sm border border-outline-variant/20 shadow-sm">
                <p className="text-sm text-on-surface leading-relaxed">
                    Hello! I&apos;m your Sejong Academic Advisor. I have access to the latest curriculum and course catalogs. What are we planning today?
                </p>
            </div>
        </div>

        {/* User Message (Mock) */}
        {query && (
          <div className="flex flex-col items-end gap-1 self-end w-full max-w-[85%] animate-fade-in-up">
            <div className="liquid-gradient p-4 rounded-2xl rounded-tr-sm crimson-aura shadow-md text-white">
                <p className="text-sm text-white">{query}</p>
            </div>
            <span className="text-[10px] font-label text-slate-400 mr-2">Sent</span>
          </div>
        )}

      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/60 backdrop-blur-[40px] px-6 pt-3 pb-8 rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-outline-variant/20">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-full glass-glow bg-surface-container-low flex items-center justify-center text-slate-500 hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="flex-1 bg-surface-container-lowest rounded-2xl px-6 py-4 flex items-center gap-3 border border-outline-variant/20 shadow-inner">
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium text-on-surface outline-none" 
                placeholder="Message AcademicBot..." 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && query.trim()) {
                        setIsTyping(true);
                        // Mock API call delay
                        setTimeout(() => setIsTyping(false), 2000);
                    }
                }}
              />
            </div>
            <button 
                className="w-14 h-14 liquid-gradient rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 duration-200 hover:-translate-y-1 transition-transform"
                onClick={() => {
                    if (query.trim()) {
                        setIsTyping(true);
                        setTimeout(() => setIsTyping(false), 2000);
                    }
                }}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

       {/* Background Subtle Aura */}
       <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/10 blur-[120px] -z-10 rounded-full"></div>
       <div className="fixed bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-secondary-container/10 blur-[100px] -z-10 rounded-full"></div>
    </div>
  );
}
