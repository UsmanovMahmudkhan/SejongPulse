"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pseudonym, setPseudonym] = useState("");
  const [residentialHall, setResidentialHall] = useState("");
  const [major, setMajor] = useState("Hotel Management");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  const handleNextStep = () => {
    setStep(2);
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("profiles").insert([
        {
          id: user.id,
          pseudonym,
          major,
          current_building: residentialHall,
          year: 2026, // Default for now
          gpa: 4.0 // Default for now
        }
      ]);

      if (error) throw error;
      router.push("/pulse");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background Atmospheric Auras */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg z-10">
        {/* Branding/Progress Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="material-symbols-outlined text-primary-container text-3xl"
            >
              sensors
            </span>
            <span className="font-headline font-black text-2xl tracking-tight text-primary-container drop-shadow-[0_0_8px_rgba(150,0,24,0.3)]">
              Sejong Pulse
            </span>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? "liquid-gradient shadow-[0_4px_12px_rgba(150,0,24,0.2)]" : "bg-surface-container-highest"}`}></div>
            <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? "liquid-gradient shadow-[0_4px_12px_rgba(150,0,24,0.2)]" : "bg-surface-container-highest"}`}></div>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-background mb-3">
            Identity Synthesis
          </h1>
          <p className="text-on-surface-variant font-medium">
            Verify your student credentials to join the pulse.
          </p>
        </div>

        {/* Step 1: Pseudonym Selection */}
        {step === 1 && (
          <div className="relative group">
            {/* Underlay Plate */}
            <div className="absolute inset-0 translate-y-4 scale-95 opacity-40 glass-glow rounded-[2rem] -z-10 border border-outline-variant/15"></div>

            {/* Main Content Plate */}
            <div className="glass-glow rounded-[2rem] p-8 md:p-10 shadow-[0_20_40px_rgba(26,28,29,0.04)] border border-outline-variant/15">
              <div className="mb-10">
                <label className="font-headline font-bold text-xs uppercase tracking-[0.1em] text-secondary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary gold-glow border-0.5 border-secondary/30"></span>
                  Phase 01: Digital Alias
                </label>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  Choose a unique pseudonym that will represent you within the campus channels. This cannot be changed later.
                </p>

                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl py-5 px-6 font-headline font-semibold text-lg text-on-background focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-slate-400 outline-none"
                    placeholder="e.g., Gwanggaeto_Hacker"
                    type="text"
                    value={pseudonym}
                    onChange={(e) => setPseudonym(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                </div>

                {/* Suggestions Bento */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <button onClick={() => setPseudonym("King_Sejong_99")} className="p-4 rounded-xl bg-white/40 border border-outline-variant/10 text-left hover:bg-white/80 transition-all group">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Randomized</span>
                    <span className="text-on-surface font-semibold text-sm">King_Sejong_99</span>
                  </button>
                  <button onClick={() => setPseudonym("Scholar_Pulse")} className="p-4 rounded-xl bg-white/40 border border-outline-variant/10 text-left hover:bg-white/80 transition-all group">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Academic</span>
                    <span className="text-on-surface font-semibold text-sm">Scholar_Pulse</span>
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleNextStep}
                disabled={!pseudonym}
                className="w-full liquid-gradient text-white font-headline font-bold py-5 rounded-full flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] hover:scale-[1.02] transition-transform active:scale-95 group disabled:opacity-50 disabled:hover:scale-100"
              >
                Proceed to Affiliation
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" data-icon="arrow_forward">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Affiliation (Replaces Step 1 in this simplified implementation) */}
        {step === 2 && (
          <div className="relative group">
            <div className="glass-glow rounded-[2rem] p-8 md:p-10 shadow-[0_20_40px_rgba(26,28,29,0.04)] border border-outline-variant/15">
              <div className="mb-10">
                <label className="font-headline font-bold text-xs uppercase tracking-[0.1em] text-secondary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary gold-glow border-0.5 border-secondary/30"></span>
                  Phase 02: Academic Anchor
                </label>
                <h2 className="font-headline text-3xl font-extrabold text-on-background mb-8">Identify your domain</h2>

                <div className="space-y-6">
                  {/* Dorm Selection */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2"> Residential Hall</span>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setResidentialHall("Happy")} className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white/40 border-2 transition-all ${residentialHall === "Happy" ? "border-primary-container shadow-lg" : "border-transparent hover:border-primary-container/20"}`}>
                        <span className={`material-symbols-outlined mb-2 ${residentialHall === "Happy" ? "text-primary" : "text-slate-400"}`} style={{ fontVariationSettings: residentialHall === "Happy" ? "'FILL' 1" : undefined }}>home</span>
                        <span className="text-xs font-bold text-on-surface">Happy</span>
                      </button>
                      <button onClick={() => setResidentialHall("Saimdang")} className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white/40 border-2 transition-all ${residentialHall === "Saimdang" ? "border-primary-container shadow-lg" : "border-transparent hover:border-primary-container/20"}`}>
                        <span className={`material-symbols-outlined mb-2 ${residentialHall === "Saimdang" ? "text-primary" : "text-slate-400"}`} style={{ fontVariationSettings: residentialHall === "Saimdang" ? "'FILL' 1" : undefined }}>home</span>
                        <span className="text-xs font-bold text-on-surface">Saimdang</span>
                      </button>
                      <button onClick={() => setResidentialHall("None")} className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white/40 border-2 transition-all ${residentialHall === "None" ? "border-primary-container shadow-lg" : "border-transparent hover:border-primary-container/20"}`}>
                        <span className={`material-symbols-outlined mb-2 ${residentialHall === "None" ? "text-primary" : "text-slate-400"}`}>block</span>
                        <span className="text-xs font-bold text-on-surface">None</span>
                      </button>
                    </div>
                  </div>

                  {/* Major Selection */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Academic Major</span>
                    <div className="relative group">
                      <select 
                        className="w-full bg-surface-container-low border-none rounded-2xl py-5 px-6 font-headline font-semibold text-lg text-on-background appearance-none outline-none focus:ring-2 focus:ring-primary-container/20"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                      >
                        <option value="Hotel Management">Hotel Management</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Animation">Animation</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <span className="material-symbols-outlined text-secondary">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinalize}
                disabled={!residentialHall || !major}
                className="w-full liquid-gradient text-white font-headline font-bold py-5 rounded-full flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(150,0,24,0.15)] hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                Finalize Verification
              </button>
            </div>
          </div>
        )}

        {/* Future Step Visual (Partial) shown only in step 1 */}
        {step === 1 && (
          <div className="mt-8 opacity-40 grayscale pointer-events-none scale-95 translate-y-[-10px] overflow-hidden max-h-24">
            <div className="glass-glow rounded-[2rem] p-8 border border-outline-variant/15">
              <label className="block font-headline font-bold text-xs uppercase tracking-[0.1em] text-slate-400 mb-4">
                Phase 02: Affiliation
              </label>
            </div>
          </div>
        )}

        {/* Footer Help */}
        <div className="mt-12 text-center">
          <button className="text-on-surface-variant font-medium text-sm flex items-center justify-center gap-2 mx-auto hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">help_outline</span>
            Why do I need a pseudonym?
          </button>
        </div>
      </div>
    </main>
  );
}
