"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fetchPulses, translatePulse, likePulse, fetchComments, addComment, createPulse } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { uploadImage } from "@/lib/cloudinary";
import { searchClient } from "@/lib/algolia";
import { InstantSearch, SearchBox, Hits, Configure } from "react-instantsearch";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Pulse {
  id: string;
  user_id: string;
  content: string;
  category: string;
  building_tag: string;
  created_at: string;
  likes: number;
  comments_count: number;
  author_pseudonym?: string;
  image_url?: string;
}

const Hit = ({ hit, onClose }: { hit: any, onClose: () => void }) => {
  return (
    <div className="p-4 border-b border-outline-variant/10 hover:bg-slate-50 transition-colors">
      <Link href={`/pulse/${hit.objectID}`} onClick={onClose} className="block">
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold text-sm text-primary-container">{hit.author_pseudonym || "Anonymous"}</span>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{hit.category}</span>
        </div>
        <p className="text-on-surface text-sm line-clamp-2">{hit.content}</p>
      </Link>
    </div>
  );
};

export default function PulseFeedPage() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [myPseudonym, setMyPseudonym] = useState<string>("");
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [showTranslated, setShowTranslated] = useState<{ [key: string]: boolean }>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Social State
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [isLiked, setIsLiked] = useState<{ [key: string]: boolean }>({});
  const [openComments, setOpenComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState<string | null>(null);

  // Create Pulse State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPulseContent, setNewPulseContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Global");
  const [selectedBuilding, setSelectedBuilding] = useState("Campus");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch current user's pseudonym
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("pseudonym")
          .eq("id", user.id)
          .single();
        if (profile) setMyPseudonym(profile.pseudonym);
      }

      try {
        const data = await fetchPulses();

        // Collect unique user_ids to look up display names
        const userIds: string[] = Array.from(new Set<string>(data.map((p: Pulse) => p.user_id)));
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, pseudonym")
          .in("id", userIds);

        const pseudonymMap: Record<string, string> = {};
        (profiles || []).forEach((p: { id: string; pseudonym: string }) => {
          pseudonymMap[p.id] = p.pseudonym;
        });

        const enrichedPulses = data.map((p: Pulse) => ({
          ...p,
          author_pseudonym: pseudonymMap[p.user_id] || "Anonymous",
        }));

        setPulses(enrichedPulses);

        const initialLikes: { [key: string]: number } = {};
        enrichedPulses.forEach((p: Pulse) => {
          initialLikes[p.id] = p.likes;
        });
        setLikes(initialLikes);
      } catch (error) {
        console.error("Error loading pulses:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLike = async (id: string) => {
    if (!user) return alert("Please sign in to like pulses.");
    if (isLiked[id]) return;

    setIsLiked(prev => ({ ...prev, [id]: true }));
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    try {
      await likePulse(id, user.id);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const toggleComments = async (id: string) => {
    const isOpening = !openComments[id];
    setOpenComments(prev => ({ ...prev, [id]: isOpening }));

    if (isOpening && !comments[id]) {
      try {
        const data = await fetchComments(id);
        setComments(prev => ({ ...prev, [id]: data }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const handleAddComment = async (id: string) => {
    if (!user) return alert("Please sign in to comment.");
    if (!newComment.trim()) return;

    setPostingComment(id);
    try {
      const data = await addComment(id, newComment, user.id);
      setComments(prev => ({ ...prev, [id]: [...(prev[id] || []), data] }));
      setNewComment("");
      setPulses(prev => prev.map(p => p.id === id ? { ...p, comments_count: p.comments_count + 1 } : p));
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setPostingComment(null);
    }
  };

  const handleShare = (pulse: Pulse) => {
    navigator.clipboard.writeText(`${window.location.origin}/pulse/${pulse.id}`);
    alert("Pulse link copied! 🚀");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreatePulse = async () => {
    if (!user) return alert("Please sign in to post.");
    if (!newPulseContent.trim()) return;

    setIsCreating(true);
    let imageUrl = null;

    try {
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      // Backend API doesn't fully support saving imageUrl in createPulse yet in this plan, 
      // but assuming it's passed or stored in content for now or backend ignores it gracefully
      // We'll append it to content so users can see it if backend doesn't have image_url column
      const finalContent = imageUrl 
        ? `${newPulseContent}\n\n[Attached Image: ${imageUrl}]` 
        : newPulseContent;

      const data = await createPulse(finalContent, user.id, selectedCategory, selectedBuilding);
      
      const enriched = { 
        ...data, 
        author_pseudonym: myPseudonym || "Anonymous",
        image_url: imageUrl || undefined
      };
      setPulses(prev => [enriched, ...prev]);
      
      // Reset state
      setNewPulseContent("");
      clearImage();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Create pulse error:", error);
      alert("Failed to broadcast pulse.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleTranslate = async (id: string, content: string) => {
    if (translations[id]) {
      setShowTranslated(prev => ({ ...prev, [id]: !prev[id] }));
      return;
    }

    setTranslatingId(id);
    try {
      const data = await translatePulse(content, "ko");
      setTranslations((prev) => ({ ...prev, [id]: data.translated_content }));
      setShowTranslated(prev => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setTranslatingId(null);
    }
  };

  const categories = [
    { id: "all", label: "Global", icon: "public" },
    { id: "academic", label: "Academic", icon: "school" },
    { id: "events", label: "Events", icon: "event" },
    { id: "market", label: "Market", icon: "shopping_bag" },
    { id: "lost", label: "Lost/Found", icon: "search" },
  ];

  const filteredPulses = activeCategory === "all"
    ? pulses
    : pulses.filter(p => p.category?.toLowerCase() === activeCategory);

  return (
    <div className="bg-surface min-h-screen pb-40">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20px_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl liquid-gradient flex items-center justify-center shadow-lg crimson-pulse-glow">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
          </div>
          <h1 className="font-headline font-black tracking-tight text-xl text-primary-container">
            Sejong Pulse
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-full hover:bg-black/5 transition-all text-slate-500 flex items-center justify-center relative"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <Link href="/notifications" className="w-10 h-10 rounded-full hover:bg-black/5 transition-all text-slate-500 flex items-center justify-center relative">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <Link href="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/20 bg-surface-container-highest flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-slate-400">person</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 max-w-2xl mx-auto px-4">
        {/* Category Rails */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar animate-fade-in">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold transition-all duration-300 shrink-0 whitespace-nowrap
                ${activeCategory === cat.id
                  ? "liquid-gradient text-white shadow-[0_12px_24px_rgba(150,0,24,0.15)] scale-105"
                  : "bg-white/60 text-slate-500 hover:bg-white hover:text-primary-container border border-outline-variant/30 shadow-sm"}`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeCategory === cat.id ? "'FILL' 1" : undefined }}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
              <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Synchronizing Pulse...</p>
            </div>
          ) : filteredPulses.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <span className="material-symbols-outlined text-5xl text-slate-200 mb-4 block">wb_twilight</span>
              <p className="text-slate-400 font-semibold">No pulses in this channel yet</p>
            </div>
          ) : (
            filteredPulses.map((pulse) => {
              const content = showTranslated[pulse.id] && translations[pulse.id] ? translations[pulse.id] : pulse.content;
              const isTranslated = !!showTranslated[pulse.id];
              const pulseLikes = likes[pulse.id] || 0;
              const hasLiked = isLiked[pulse.id];
              const showComments = openComments[pulse.id];
              const pulseComments = comments[pulse.id] || [];

              const timeAgo = pulse.created_at
                ? formatDistanceToNow(new Date(pulse.created_at), { addSuffix: true })
                : "recently";

              return (
                <article key={pulse.id} className="glass-glow bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-white/50 group animate-fade-in-up hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 relative">
                      <span className="material-symbols-outlined text-primary text-3xl">account_circle</span>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-4 border-white flex items-center justify-center shadow-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-headline font-black text-on-surface tracking-tight text-lg leading-none mb-1">
                            {pulse.author_pseudonym || "Anonymous"}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {pulse.category || "Global Feed"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{timeAgo}</span>
                          </div>
                        </div>
                        <Link
                          href={`/pulse/${pulse.id}`}
                          className="w-10 h-10 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-slate-300">open_in_full</span>
                        </Link>
                      </div>

                      <div className="relative mb-6">
                        <p className={`text-on-surface leading-relaxed text-[16px] font-medium transition-all duration-300 whitespace-pre-wrap ${isTranslated ? 'text-secondary font-bold' : ''}`}>
                          {content.replace(/\[Attached Image: .*?\]/, '')}
                        </p>
                        
                        {/* Render attached image if it exists in the content */}
                        {content.match(/\[Attached Image: (.*?)\]/) && (
                          <div className="mt-4 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm max-w-full">
                            <img 
                              src={content.match(/\[Attached Image: (.*?)\]/)?.[1]} 
                              alt="Attached to pulse" 
                              className="w-full h-auto max-h-64 object-cover"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black text-primary tracking-widest uppercase shadow-sm">
                            <span className="material-symbols-outlined text-[12px] mr-1">location_on</span>
                            {pulse.building_tag}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                        <div className="flex items-center gap-5">
                          <button
                            className={`flex items-center gap-2 transition-all active:scale-95 ${hasLiked ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                            onClick={() => handleLike(pulse.id)}
                          >
                            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}>
                              favorite
                            </span>
                            <span className="text-xs font-black">{pulseLikes}</span>
                          </button>
                          <button
                            className={`flex items-center gap-2 transition-all active:scale-95 ${showComments ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
                            onClick={() => toggleComments(pulse.id)}
                          >
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: showComments ? "'FILL' 1" : undefined }}>chat_bubble</span>
                            <span className="text-xs font-black">{pulse.comments_count}</span>
                          </button>
                          <button
                            className="flex items-center gap-2 text-slate-400 hover:text-secondary transition-all active:scale-95"
                            onClick={() => handleShare(pulse)}
                          >
                            <span className="material-symbols-outlined text-[20px]">share</span>
                          </button>
                        </div>

                        <button
                          className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 shadow-sm active:scale-95
                            ${isTranslated
                              ? "bg-secondary text-white shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
                              : "bg-surface-container-high text-slate-500 hover:bg-surface-container-highest"}`}
                          onClick={() => handleTranslate(pulse.id, pulse.content)}
                          disabled={translatingId === pulse.id}
                        >
                          {translatingId === pulse.id ? "Sync..." : isTranslated ? "Original" : "Translate"}
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: isTranslated ? "'FILL' 1" : undefined }}>
                            {isTranslated ? "undo" : "translate"}
                          </span>
                        </button>
                      </div>

                      {/* Expandable Comments Section */}
                      {showComments && (
                        <div className="mt-6 pt-6 border-t border-outline-variant/10 animate-fade-in">
                          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {pulseComments.map((comment) => (
                              <div key={comment.id} className="flex gap-3 items-start animate-fade-in-up transition-all">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                  <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                                </div>
                                <div className="flex-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{comment.user_id}</span>
                                    <span className="text-[9px] text-slate-400">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                            {pulseComments.length === 0 && (
                              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest py-4">No comments yet. Be the first! 🕊️</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 bg-white/50 p-2 rounded-2xl border border-outline-variant/20 shadow-inner">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-semibold px-2 outline-none"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(pulse.id)}
                            />
                            <button
                              className="w-8 h-8 rounded-xl liquid-gradient text-white flex items-center justify-center shadow-md disabled:opacity-50"
                              onClick={() => handleAddComment(pulse.id)}
                              disabled={!newComment.trim() || postingComment === pulse.id}
                            >
                              <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>

      <div className="fixed bottom-28 right-0 left-0 max-w-2xl mx-auto flex justify-end px-4 z-50 pointer-events-none">
        <button
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto w-16 h-16 rounded-[2rem] liquid-gradient text-white shadow-[0_20px_40px_rgba(150,0,24,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline outline-3 outline-white/30 border border-white/20 crimson-pulse-glow"
        >
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>
      </div>

      {/* Create Pulse Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-fade-in-up border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-headline font-black text-on-background">Broadcast Pulse</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <textarea
              value={newPulseContent}
              onChange={(e) => setNewPulseContent(e.target.value)}
              placeholder="What's the campus pulse today?"
              className="w-full h-32 bg-slate-50 rounded-3xl p-6 text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 resize-none transition-all outline-none"
            ></textarea>

            {imagePreview && (
              <div className="relative mt-4 rounded-2xl overflow-hidden border border-outline-variant/20 h-32 w-full object-cover group">
                <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between px-2">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-primary text-sm font-bold bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">imagesmode</span>
                Attach Image
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Channel</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Global">Global Feed</option>
                  <option value="Academic">Academic</option>
                  <option value="Events">Campus Events</option>
                  <option value="Market">Marketplace</option>
                  <option value="Lost">Lost & Found</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Location</label>
                <select
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Campus">Main Campus</option>
                  <option value="Gwanggaeto">Gwanggaeto Hall</option>
                  <option value="Student Union">Student Union</option>
                  <option value="Gunja">Gunja Building</option>
                  <option value="Library">Central Library</option>
                  <option value="Dormitory">Dormitory</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreatePulse}
              disabled={isCreating || !newPulseContent.trim()}
              className="w-full mt-8 h-14 rounded-2xl liquid-gradient text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Broadcast</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Algolia Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[110] flex flex-col bg-surface/95 backdrop-blur-xl transition-all duration-300 px-0 animate-fade-in">
          <div className="flex items-center gap-4 p-4 border-b border-outline-variant/10 bg-white/50">
            <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-500 rounded-full hover:bg-black/5">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="font-headline font-black text-lg text-primary-container">Search Pulses</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <InstantSearch searchClient={searchClient} indexName="pulses">
              <Configure filters="deleted:false" hitsPerPage={10} />
              
              <div className="mb-6 relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">search</span>
                {/* Custom styling override for Algolia SearchBox */}
                <div className="search-box-wrapper">
                  <SearchBox 
                    placeholder="Search campus pulses, events, buildings..."
                    classNames={{
                      root: "w-full",
                      form: "relative flex items-center w-full",
                      input: "w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-outline-variant/30 text-sm font-medium focus:ring-2 focus:ring-primary/20 shadow-sm outline-none",
                      submit: "hidden",
                      reset: "hidden",
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
                <Hits hitComponent={({ hit }) => <Hit hit={hit} onClose={() => setIsSearchOpen(false)} />} />
              </div>
            </InstantSearch>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
