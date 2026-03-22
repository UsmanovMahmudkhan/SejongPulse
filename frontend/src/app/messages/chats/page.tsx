"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { getSendbirdClient } from "@/lib/sendbird";
import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { UserMessage } from "@sendbird/chat/message";

export default function FlashChatsPage() {
  const [channels, setChannels] = useState<GroupChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);

      try {
        const sb = getSendbirdClient();
        await sb.connect(user.id);

        const query = (sb.groupChannel as any).createMyGroupChannelListQuery({
          includeEmpty: true,
          order: 'latest_last_message',
          limit: 20
        });

        if (query.hasNext) {
          const channelList = await query.next();
          setChannels(channelList);
        }
      } catch (err) {
        console.error("Failed to fetch Sendbird channels:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-[0_20px_40px_rgba(26,28,29,0.04)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container">sensors</span>
          <h1 className="text-xl font-black text-primary-container drop-shadow-[0_0_8px_rgba(150,0,24,0.4)] font-headline tracking-tight">Sejong Pulse</h1>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:pt-12">
        {/* Left Column: Chat List / Drawer */}
        <aside className="md:col-span-4 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
              Flash <span className="text-primary">Chats</span>
            </h2>
          </div>

          <div className="glass-glow rounded-2xl p-4 flex items-center gap-3 border border-outline-variant/20">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 outline-none" placeholder="Find a pulse..." type="text" />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : channels.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">chat_bubble</span>
                <p className="text-slate-500 font-medium">No active chats yet.<br/>Find someone in Discovery!</p>
              </div>
            ) : (
              channels.map((channel) => {
                // Find the other user in the channel (assuming 1:1 for now)
                const partner = channel.members.find(m => m.userId !== currentUser?.id);
                const lastMessage = channel.lastMessage as UserMessage | undefined;
                const unreadCount = channel.unreadMessageCount;

                return (
                  <Link href={`/messages/chats/${partner?.userId || channel.url}`} key={channel.url} className="block">
                    <div className="glass-glow p-4 rounded-3xl border border-outline-variant/20 hover:border-primary/40 transition-all cursor-pointer group shadow-sm bg-white/40">
                      <div className="flex gap-4 items-center">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center liquid-gradient">
                            <span className="text-xl font-black text-white">
                              {partner ? partner.nickname?.charAt(0).toUpperCase() || "U" : "G"}
                            </span>
                          </div>
                          {partner?.connectionStatus === 'online' && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-on-surface">{partner?.nickname || "Unknown"}</span>
                            {lastMessage && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={`text-sm line-clamp-1 ${unreadCount > 0 ? 'text-primary font-bold' : 'text-slate-500'}`}>
                              {lastMessage ? lastMessage.message : "No messages yet"}
                            </p>
                            {unreadCount > 0 && (
                              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </aside>
      </main>

      <Navbar />
    </>
  );
}
