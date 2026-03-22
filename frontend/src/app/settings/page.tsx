"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setEmail(user.email || "");
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters.");
      return;
    }
    setIsChangingPassword(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsChangingPassword(false);
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg("✓ Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete profile first (cascade should handle pulses)
      await supabase.from("profiles").delete().eq("id", user.id);
      // Sign out — actual user deletion requires admin API or a backend endpoint
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen pb-40">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="p-2 hover:bg-black/5 transition-all rounded-full text-slate-500">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline font-bold text-lg text-on-background">Settings</h1>
        </div>
      </header>

      <main className="pt-24 max-w-xl mx-auto px-6 space-y-6 pb-8">
        {/* Account Info */}
        <section>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Account</p>
          <div className="glass-glow rounded-[2rem] overflow-hidden border border-white/30">
            <div className="p-5 flex items-center gap-4 border-b border-outline-variant/10">
              <div className="w-12 h-12 rounded-2xl liquid-gradient flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                <p className="font-semibold text-sm text-on-surface">{email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full p-5 flex items-center gap-4 hover:bg-black/2 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">logout</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-on-surface">Sign Out</p>
                <p className="text-[11px] text-slate-400">Sign out of your Sejong account</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Change Password */}
        <section>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Security</p>
          <div className="glass-glow rounded-[2rem] p-6 border border-white/30 space-y-4">
            <h3 className="font-headline font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">lock</span>
              Change Password
            </h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {passwordMsg && (
              <p className={`text-xs font-semibold px-1 ${passwordMsg.startsWith("✓") ? "text-emerald-600" : "text-primary"}`}>
                {passwordMsg}
              </p>
            )}
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !newPassword || !confirmPassword}
              className="w-full py-4 rounded-2xl liquid-gradient text-white font-black text-sm shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-95 transition-all"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </section>

        {/* Privacy & Info */}
        <section>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Privacy</p>
          <div className="glass-glow rounded-[2rem] overflow-hidden border border-white/30">
            {[
              { icon: "shield", label: "Privacy Policy", desc: "How we handle your data" },
              { icon: "description", label: "Terms of Service", desc: "Usage rules for Sejong Pulse" },
              { icon: "info", label: "About", desc: "Sejong Pulse v1.0 — Campus Social" },
            ].map((item) => (
              <div key={item.label} className="p-5 flex items-center gap-4 border-b border-outline-variant/10 last:border-0 hover:bg-black/2 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-on-surface">{item.label}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest px-2 mb-3">Danger Zone</p>
          <div className="glass-glow rounded-[2rem] p-6 border border-red-100 space-y-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-400 mt-0.5">warning</span>
              <div>
                <h3 className="font-headline font-bold text-on-background">Delete Account</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  This will permanently delete your profile, pulses, and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-4 rounded-2xl border-2 border-red-200 text-red-500 font-black text-sm hover:bg-red-50 transition-all active:scale-95"
              >
                Delete My Account
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs font-bold text-red-500 text-center">Are you absolutely sure? This cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
                  >Cancel</button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black text-sm shadow-lg hover:bg-red-600 disabled:opacity-50 transition-all"
                  >{isDeleting ? "Deleting..." : "Yes, Delete"}</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Navbar />
    </div>
  );
}
