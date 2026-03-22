"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import { fetchComments, addComment, likePulse } from "@/lib/api";
import Navbar from "@/components/Navbar";

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
}

export default function PulseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pulseId = params.id as string;

  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch the pulse from Supabase directly
      const { data: pulseData, error } = await supabase
        .from("pulses")
        .select("*")
        .eq("id", pulseId)
        .single();

      if (error || !pulseData) {
        setLoading(false);
        return;
      }

      // Look up author pseudonym
      const { data: profileData } = await supabase
        .from("profiles")
        .select("pseudonym")
        .eq("id", pulseData.user_id)
        .single();

      setPulse({
        ...pulseData,
        author_pseudonym: profileData?.pseudonym || "Anonymous",
      });
      setLikeCount(pulseData.likes || 0);

      // Load comments
      try {
        const commentData = await fetchComments(pulseId);
        setComments(commentData);
      } catch (e) {
        console.error("Failed to fetch comments:", e);
      }

      setLoading(false);
    };
    init();
  }, [pulseId]);

  const handleLike = async () => {
    if (!user || hasLiked) return;
    setHasLiked(true);
    setLikeCount(c => c + 1);
    try {
      await likePulse(pulseId, user.id);
    } catch (e) {
      console.error("Like error:", e);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    setIsPosting(true);
    try {
      const data = await addComment(pulseId, newComment, user.id);
      setComments(prev => [...prev, data]);
      setNewComment("");
    } catch (e) {
      console.error("Comment error:", e);
    } finally {
      setIsPosting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied! 🔗");
  };

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!pulse) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-6xl text-slate-200">search_off</span>
      <h2 className="text-xl font-headline font-bold text-slate-500">Pulse not found</h2>
      <Link href="/pulse" className="text-primary font-bold text-sm hover:underline">← Back to Feed</Link>
    </div>
  );

  const timeAgo = pulse.created_at
    ? formatDistanceToNow(new Date(pulse.created_at), { addSuffix: true })
    : "recently";

  return (
    <div className="bg-surface min-h-screen pb-40">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-black/5 transition-all rounded-full text-slate-500">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold text-lg text-on-background">Pulse</h1>
        </div>
        <button onClick={handleShare} className="p-2 hover:bg-black/5 transition-all rounded-full text-slate-500">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <main className="pt-24 max-w-2xl mx-auto px-4 space-y-8">
        {/* Pulse Card */}
        <article className="glass-glow bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white/50">
          {/* Author */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
              <span className="text-2xl font-black text-primary">
                {(pulse.author_pseudonym || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-headline font-black text-xl text-on-surface">{pulse.author_pseudonym}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pulse.category || "Global"}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-on-surface text-lg leading-relaxed font-medium mb-6">{pulse.content}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black text-primary tracking-widest uppercase">
              <span className="material-symbols-outlined text-[12px] mr-1">location_on</span>
              {pulse.building_tag}
            </span>
            {pulse.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/5 border border-secondary/10 text-[10px] font-black text-secondary tracking-widest uppercase">
                {pulse.category}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-8 pt-6 border-t border-outline-variant/10">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all active:scale-95 ${hasLiked ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              <span className="font-black text-sm">{likeCount} likes</span>
            </button>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-2xl">chat_bubble</span>
              <span className="font-black text-sm">{comments.length} comments</span>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-on-background px-2">Comments</h3>

          {comments.length === 0 ? (
            <div className="text-center py-12 glass-glow rounded-[2rem] border border-white/30">
              <span className="material-symbols-outlined text-4xl text-slate-200 block mb-2">chat_bubble</span>
              <p className="text-slate-400 font-semibold text-sm">No comments yet</p>
              <p className="text-slate-300 text-xs mt-1">Be the first to respond!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="glass-glow rounded-3xl p-5 border border-white/30 flex gap-4 animate-fade-in-up">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  <span className="material-symbols-outlined text-slate-400 text-base">person</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{comment.user_id}</span>
                    <span className="text-[9px] text-slate-400">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="glass-glow rounded-3xl p-4 border border-white/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <input
            type="text"
            placeholder="Share your thoughts..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none placeholder:text-slate-300"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || isPosting}
            className="w-10 h-10 rounded-2xl liquid-gradient text-white flex items-center justify-center shadow-md disabled:opacity-40 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
