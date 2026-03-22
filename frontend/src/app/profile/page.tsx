"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

import { updateProfile } from "@/lib/api";
import { uploadImage } from "@/lib/cloudinary";

interface Profile {
  id: string;
  pseudonym: string;
  major: string;
  year: number;
  gpa: number;
  skills: string[];
  current_building: string;
  avatar_url?: string;
}

interface Stats {
  pulseCount: number;
  karmaCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ pulseCount: 0, karmaCount: 0 });
  const [myPulses, setMyPulses] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editBuilding, setEditBuilding] = useState("");
  const [editMajor, setEditMajor] = useState("");
  const [editPseudonym, setEditPseudonym] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        router.push("/onboarding");
        return;
      }
      setProfile(data);
      setEditBuilding(data.current_building || "");
      setEditMajor(data.major || "");
      setEditPseudonym(data.pseudonym || "");
      setEditAvatarPreview(data.avatar_url || null);

      // Fetch real stats: pulse count and total likes received (karma)
      const { count: pulseCount } = await supabase
        .from("pulses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Karma = sum of all likes on user's pulses
      const { data: karmaData } = await supabase
        .from("pulses")
        .select("likes")
        .eq("user_id", user.id);
      const karma = (karmaData || []).reduce((sum: number, p: { likes: number }) => sum + (p.likes || 0), 0);

      setStats({
        pulseCount: pulseCount || 0,
        karmaCount: karma,
      });

      // Fetch user's own pulses for the activity section
      const { data: pulseData } = await supabase
        .from("pulses")
        .select("id, content, created_at, likes, building_tag")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setMyPulses(pulseData || []);
    };
    fetchProfile();
  }, [router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      let avatar_url = profile.avatar_url;
      if (editAvatarFile) {
        const uploadedUrl = await uploadImage(editAvatarFile);
        if (uploadedUrl) avatar_url = uploadedUrl;
      }
      
      const updatedData = {
        ...profile,
        pseudonym: editPseudonym,
        current_building: editBuilding,
        major: editMajor,
        avatar_url
      };

      const newProfile = await updateProfile(profile.id, updatedData);
      setProfile(newProfile);
      setEditAvatarFile(null);
      setIsEditing(false);
    } catch (err: any) {
      alert("Failed to save profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const majors = [
    "Hotel Management", "Computer Science", "Business Administration", "Animation",
    "Architecture", "Law", "Economics", "Music", "Film Arts", "Fashion Design",
    "Physical Education", "International Relations", "Nursing", "Pharmacy",
  ];

  const buildings = ["Happy", "Saimdang", "Gwanggaeto", "Student Union", "Library", "Gunja", "None"];

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/pulse" className="p-2 hover:bg-black/5 transition-all rounded-full text-slate-500 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline font-bold text-lg text-on-background">Student Identity</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/notifications" className="p-2 hover:bg-black/5 rounded-full text-slate-400 transition-all flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <Link href="/settings" className="p-2 hover:bg-black/5 rounded-full text-slate-400 transition-all flex items-center justify-center">
            <span className="material-symbols-outlined">settings</span>
          </Link>
          <button onClick={handleLogout} className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 px-4 py-2 rounded-xl transition-all">Sign Out</button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-xl mx-auto w-full space-y-8">
        {/* Profile Card */}
        <div className="glass-glow rounded-[2.5rem] p-8 shadow-lg border border-white/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 liquid-gradient opacity-10 rounded-bl-[100px] -z-10"></div>

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-[2rem] object-cover shadow-xl border-4 border-white/50" />
              ) : (
                <div className="w-24 h-24 rounded-[2rem] liquid-gradient flex items-center justify-center shadow-xl crimson-pulse-glow">
                  <span className="text-4xl font-black text-white">{profile.pseudonym.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-headline font-black text-on-background">{profile.pseudonym}</h2>
            <p className="text-secondary font-bold text-xs uppercase tracking-widest mt-1 italic">Verified Student</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <div className="col-span-2 space-y-3">
                  <div className="flex flex-col items-center mb-4">
                    <label className="cursor-pointer group relative block">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-primary/40 group-hover:border-primary/80 flex items-center justify-center bg-white/30 transition-all">
                        {editAvatarPreview ? (
                          <img src={editAvatarPreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <span className="material-symbols-outlined text-primary/60 group-hover:text-primary">add_a_photo</span>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Tap to upload</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1 block">Username</label>
                    <input
                      value={editPseudonym}
                      onChange={e => setEditPseudonym(e.target.value)}
                      className="w-full bg-white/60 border border-outline-variant/30 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1 block">Academic Major</label>
                    <select
                      value={editMajor}
                      onChange={e => setEditMajor(e.target.value)}
                      className="w-full bg-white/60 border border-outline-variant/30 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {majors.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1 block">Residential Hall</label>
                    <select
                      value={editBuilding}
                      onChange={e => setEditBuilding(e.target.value)}
                      className="w-full bg-white/60 border border-outline-variant/30 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {buildings.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
                    >Cancel</button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-2xl liquid-gradient text-white font-black text-sm shadow-lg disabled:opacity-50"
                    >{isSaving ? "Saving..." : "Save Changes"}</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/40 p-4 rounded-2xl border border-white/20">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Major</span>
                  <span className="text-on-surface font-semibold text-sm">{profile.major}</span>
                </div>
                <div className="bg-white/40 p-4 rounded-2xl border border-white/20">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-on-surface font-semibold text-sm">Class of {profile.year}</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="col-span-2 mt-2 py-3 rounded-2xl border border-outline-variant/20 text-slate-500 font-bold text-sm hover:bg-surface-container-low transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-glow rounded-3xl p-5 text-center border border-white/20 shadow-sm">
            <span className="block text-2xl font-black text-primary">{profile.gpa?.toFixed(1) || "—"}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">GPA</span>
          </div>
          <div className="glass-glow rounded-3xl p-5 text-center border border-white/20 shadow-sm">
            <span className="block text-2xl font-black text-primary">{stats.pulseCount}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pulses</span>
          </div>
          <div className="glass-glow rounded-3xl p-5 text-center border border-white/20 shadow-sm">
            <span className="block text-2xl font-black text-secondary">{stats.karmaCount}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Karma</span>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
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
        )}

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

        {/* My Pulses Section */}
        {myPulses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline font-bold text-on-background">My Pulses</h3>
              <Link href="/pulse" className="text-xs font-bold text-primary hover:underline">View Feed</Link>
            </div>
            <div className="space-y-3">
              {myPulses.map(pulse => (
                <Link href={`/pulse/${pulse.id}`} key={pulse.id}>
                  <div className="glass-glow rounded-2xl p-4 border border-white/20 hover:border-primary/20 transition-all cursor-pointer">
                    <p className="text-sm font-medium text-on-surface line-clamp-2 mb-2">{pulse.content}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">favorite</span>
                        {pulse.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {pulse.building_tag}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
}
