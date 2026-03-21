"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { queryAdvisor } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AcademicAdvisorPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Sejong Academic Advisor. I have access to the latest curriculum and course catalogs. What are we planning today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setIsTyping(true);

    try {
      const data = await queryAdvisor(text);
      const assistantMsg: Message = { role: "assistant", content: data.answer };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to the knowledge base right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

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

      {/* Ambient Background Aether */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full animate-bounce [animation-duration:10s]"></div>
      </div>

      {/* Main Chat Area */}
      <main className="relative z-10 flex-grow pt-24 pb-48 px-4 max-w-3xl mx-auto w-full flex flex-col space-y-6 overflow-y-auto hide-scrollbar" ref={scrollRef}>
        
        {/* Intro / Empty State */}
        {messages.length === 1 && (
          <div className="text-center mb-8 space-y-6 pt-10 animate-fade-in shadow-sm bg-white/30 backdrop-blur-md p-8 rounded-[3rem] border border-white/40">
            <div className="inline-flex w-24 h-24 rounded-[2.5rem] liquid-gradient items-center justify-center shadow-[0_20px_40px_rgba(150,0,24,0.3)] mb-4 crimson-pulse-glow">
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-black text-on-background tracking-tight">University Oracle</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                I've indexed 2,595 courses and 793 professors for the 2026 Spring semester. How can I guide your academic path?
              </p>
            </div>
            
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 max-w-sm mx-auto flex items-start gap-3 text-left">
              <span className="material-symbols-outlined text-primary text-sm mt-0.5">lightbulb</span>
              <p className="text-[11px] text-primary/70 font-semibold leading-relaxed">
                TIP: You can ask about course venues, credits, or even who teaches a specific course code!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {["Who teaches 011614?", "Courses in Gwanggaeto Hall", "Prerequisites for Deep Learning"].map((chip) => (
                <button 
                  key={chip}
                  className="px-5 py-2.5 rounded-full glass-glow border border-outline-variant/30 text-xs font-bold text-on-surface-variant hover:bg-white hover:border-primary/30 hover:text-primary transition-all shadow-sm active:scale-95" 
                  onClick={() => handleSend(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse self-end w-full max-w-[85%]" : "max-w-[85%] animate-fade-in-up"}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${msg.role === "assistant" ? "liquid-gradient" : "bg-zinc-200"}`}>
                <span className={`material-symbols-outlined text-[16px] ${msg.role === "assistant" ? "text-white" : "text-zinc-500"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {msg.role === "assistant" ? "auto_awesome" : "person"}
                </span>
            </div>
            <div className={`p-4 rounded-2xl shadow-sm border ${msg.role === "assistant" ? "glass-glow bg-white/70 rounded-tl-sm border-white/40" : "liquid-gradient text-white rounded-tr-sm crimson-aura border-white/20"}`}>
                <p className="text-sm leading-relaxed">
                    {msg.content}
                </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3 max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-lg liquid-gradient flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div className="glass-glow bg-white/40 p-4 rounded-2xl rounded-tl-sm border border-white/20">
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
            </div>
          </div>
        )}

      </main>

      {/* Input Area - Adjusted to sit above Navbar */}
      <div className="fixed bottom-24 left-0 w-full z-40 px-6 animate-fade-in-up">
        <div className="max-w-3xl mx-auto glass-glow bg-white/40 border border-white/30 rounded-[2.5rem] p-3 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-full glass-glow bg-white/20 flex items-center justify-center text-slate-500 hover:bg-white/40 transition-all hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="flex-1 bg-white/30 rounded-2xl px-6 py-4 flex items-center gap-3 border border-white/20 shadow-inner">
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium text-on-surface outline-none placeholder:text-slate-400" 
                placeholder="Message AcademicBot..." 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend(query);
                }}
                disabled={isTyping}
              />
            </div>
            <button 
                className="w-14 h-14 liquid-gradient rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 duration-200 hover:-translate-y-1 transition-all disabled:opacity-50"
                onClick={() => handleSend(query)}
                disabled={isTyping || !query.trim()}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

       <Navbar />
    </div>
  );
}
