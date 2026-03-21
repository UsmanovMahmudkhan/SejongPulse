"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Profile {
  id: string;
  pseudonym: string;
  major: string;
  year: number;
  gpa: number;
  skills: string[];
  current_building: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Mocking a fetch from /api/profiles/u1
    setProfile({
      id: "u1",
      pseudonym: "CrimsonKnight",
      major: "Computer Science",
      year: 2024,
      gpa: 4.2,
      skills: ["Python", "Next.js", "AI"],
      current_building: "Gwanggaeto"
    });
  }, []);

  if (!profile) return null;

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/pulse" className="p-2 hover:bg-black/5 transition-all rounded-full text-slate-500 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline font-bold text-lg text-on-background">Student Identity</h1>
        </div>
        <button className="text-primary font-bold text-sm">Edit</button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-xl mx-auto w-full space-y-8">
        {/* Profile Card */}
        <div className="glass-glow rounded-[2.5rem] p-8 shadow-lg border border-white/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 liquid-gradient opacity-10 rounded-bl-[100px] -z-10"></div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-[2rem] liquid-gradient flex items-center justify-center shadow-xl crimson-pulse-glow mb-4">
              <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <h2 className="text-2xl font-headline font-black text-on-background">{profile.pseudonym}</h2>
            <p className="text-secondary font-bold text-xs uppercase tracking-widest mt-1 italic">Verified Student</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/40 p-4 rounded-2xl border border-white/20">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Major</span>
              <span className="text-on-surface font-semibold text-sm">{profile.major}</span>
            </div>
            <div className="bg-white/40 p-4 rounded-2xl border border-white/20">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
              <span className="text-on-surface font-semibold text-sm">Class of {profile.year}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-glow rounded-3xl p-5 text-center border border-white/20 shadow-sm">
            <span className="block text-2xl font-black text-primary">4.2</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">GPA</span>
          </div>
          <div className="glass-glow rounded-3xl p-5 text-center border border-white/20 shadow-sm">
            <span className="block text-2xl font-black text-primary">12</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pulses</span>
          </div>
          <div className="glass-glow rounded-3xl p-5 text-center border border-white/20 shadow-sm">
            <span className="block text-2xl font-black text-primary">84</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Karma</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-on-background px-2">Expertise Domains</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span key={skill} className="px-5 py-2 rounded-full bg-white/60 border border-outline-variant/30 text-xs font-semibold text-on-surface-variant flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div className="glass-glow rounded-[2rem] p-6 border border-white/20 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">location_on</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Signal</span>
              <span className="text-on-surface font-bold">{profile.current_building} Building</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-emerald-500 animate-pulse">sensors</span>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
