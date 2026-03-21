"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Domain Validation
    if (!email.endsWith("@sju.ac.kr")) {
      setError("Access restricted. Please use your @sju.ac.kr email.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Verification email sent! Check your Sejong inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/pulse");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 bg-surface overflow-hidden">
      {/* Ambient Pulsing Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
        {/* Branding Area */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 glass-glow rounded-[2rem] crimson-pulse-glow relative overflow-hidden group">
            <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
          </div>
          <h1 className="font-headline text-4xl font-black tracking-tighter text-on-background mb-2">
            Sejong <span className="text-secondary">Pulse</span>
          </h1>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-[0.2em] opacity-60">
            University Gateway
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full glass-glow p-8 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.05)] border border-white/40">
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2 ml-4">Academic Email</label>
              <input 
                type="email" 
                placeholder="id@sju.ac.kr"
                required
                className="w-full bg-white/50 border border-outline-variant/30 rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner placeholder:text-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2 ml-4">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className="w-full bg-white/50 border border-outline-variant/30 rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-inner placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl animate-fade-in">
                <p className="text-[10px] text-primary font-black uppercase tracking-wider text-center">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full liquid-gradient text-white py-5 rounded-2xl font-headline font-black text-lg shadow-[0_12px_24px_rgba(150,0,24,0.15)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isSignUp ? "Create Account" : "Access Pulse"}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-black text-slate-400 hover:text-primary transition-colors tracking-tight"
            >
              {isSignUp ? "Already a citizen? Sign In" : "New student? Create Account"}
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-10 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-3 bg-white/40 px-6 py-2 rounded-full border border-white/50">
            <span className="material-symbols-outlined text-[16px]">shield_lock</span>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Secured by Sejong Auth</span>
          </div>
          <p className="text-[9px] font-bold tracking-[0.2em] text-on-surface uppercase italic leading-none">Creative Academy since 1940</p>
        </div>
      </div>
    </main>
  );
}
