"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

interface Notification {
  id: string;
  type: "like" | "comment" | "match";
  from_pseudonym: string;
  pulse_content?: string;
  pulse_id?: string;
  created_at: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch real notifications if you have a notifications table,
      // otherwise we fall back to generating them from likes/comments
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data) {
        setNotifications(data);
      }

      // Mark all as read
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      setLoading(false);
    };
    init();
  }, []);

  const iconForType = (type: string) => {
    switch (type) {
      case "like": return { icon: "favorite", color: "text-primary", bg: "bg-primary/10" };
      case "comment": return { icon: "chat_bubble", color: "text-emerald-600", bg: "bg-emerald-50" };
      case "match": return { icon: "hub", color: "text-secondary", bg: "bg-secondary/10" };
      default: return { icon: "notifications", color: "text-slate-500", bg: "bg-slate-100" };
    }
  };

  const textForType = (n: Notification) => {
    switch (n.type) {
      case "like": return `${n.from_pseudonym} liked your pulse`;
      case "comment": return `${n.from_pseudonym} commented on your pulse`;
      case "match": return `${n.from_pseudonym} connected with you!`;
      default: return "New activity";
    }
  };

  return (
    <div className="bg-surface min-h-screen pb-40">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/pulse" className="p-2 hover:bg-black/5 transition-all rounded-full text-slate-500">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline font-bold text-lg text-on-background">Notifications</h1>
        </div>
        <div className="px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
      </header>

      <main className="pt-24 max-w-2xl mx-auto px-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-200">notifications_off</span>
            </div>
            <h2 className="font-headline font-bold text-xl text-slate-500">All quiet here</h2>
            <p className="text-sm text-slate-400 max-w-xs">
              When someone likes or comments on your pulses, you'll see it here.
            </p>
            <Link href="/pulse" className="mt-4 px-6 py-3 liquid-gradient text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
              Browse Feed
            </Link>
          </div>
        ) : (
          <>
            {/* Today */}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pt-2">Recent</p>
            {notifications.map((notification) => {
              const { icon, color, bg } = iconForType(notification.type);
              const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });
              const content = (
                <div className={`glass-glow rounded-3xl p-5 border transition-all flex items-center gap-4 ${!notification.read ? 'border-primary/20 bg-primary/2' : 'border-white/30'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}>
                    <span className={`material-symbols-outlined ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-on-surface leading-snug">{textForType(notification)}</p>
                    {notification.pulse_content && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">"{notification.pulse_content}"</p>
                    )}
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">{timeAgo}</span>
                  </div>
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 crimson-pulse-glow"></div>
                  )}
                </div>
              );

              return notification.pulse_id ? (
                <Link key={notification.id} href={`/pulse/${notification.pulse_id}`}>
                  {content}
                </Link>
              ) : (
                <div key={notification.id}>{content}</div>
              );
            })}
          </>
        )}
      </main>

      <Navbar />
    </div>
  );
}
