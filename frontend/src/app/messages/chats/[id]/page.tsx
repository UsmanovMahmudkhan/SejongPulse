"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSendbirdClient } from "@/lib/sendbird";
import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { BaseMessage, UserMessage } from "@sendbird/chat/message";
import Navbar from "@/components/Navbar";

interface PartnerProfile {
  id: string;
  pseudonym: string;
  major: string;
  current_building: string;
}

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id as string;

  const [channel, setChannel] = useState<GroupChannel | null>(null);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setCurrentUser(user);

      // Get partner profile (Supabase)
      const { data: partnerProfile } = await supabase
        .from("profiles")
        .select("id, pseudonym, major, current_building")
        .eq("id", partnerId)
        .single();
      setPartner(partnerProfile);

      // Initialize Sendbird
      try {
        const sb = getSendbirdClient();
        
        // 1. Get session token from our backend
        const tokenRes = await fetch("http://localhost:8000/api/chat/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, pseudonym: "Me" }) // Pseudonym would normally come from context
        });
        if (!tokenRes.ok) throw new Error("Failed to get chat token");
        
        // 2. Connect
        await sb.connect(user.id);
        
        // 3. Find or create 1:1 channel with partnerId
        const params = {
          invitedUserIds: [partnerId],
          isDistinct: true, // Ensures only one 1:1 channel exists between these two users
        };
        const newChannel = await (sb.groupChannel as any).createChannel(params);
        setChannel(newChannel);

        // 4. Load previous messages
        const query = newChannel.createPreviousMessageListQuery({ limit: 50 });
        const msgs = await query.load();
        setMessages(msgs as UserMessage[]);

        // 5. Listen for incoming messages
        const channelHandler = new (sb.groupChannel as any).GroupChannelHandler({
          onMessageReceived: (ch: any, message: any) => {
            if (ch.url === newChannel.url && message.isUserMessage()) {
              setMessages(prev => [...prev, message as UserMessage]);
            }
          }
        });
        (sb.groupChannel as any).addGroupChannelHandler("chat_page", channelHandler);

      } catch (err) {
        console.error("Sendbird init failed:", err);
      }
      
      setLoading(false);
    };
    init();

    return () => {
      const sb = getSendbirdClient();
      if (sb && sb.groupChannel) {
        (sb.groupChannel as any).removeGroupChannelHandler("chat_page");
      }
    };
  }, [partnerId, router]);

  useEffect(() => {
    // Auto-scroll to bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !channel || !currentUser) return;
    setIsSending(true);
    const content = newMessage;
    setNewMessage("");

    try {
      const params = { message: content };
      channel.sendUserMessage(params)
        .onSucceeded((message) => {
          setMessages(prev => [...prev, message as UserMessage]);
        })
        .onFailed((err) => {
          console.error("Send failed:", err);
        });
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center px-4 h-16 bg-white/70 backdrop-blur-[30px] border-b border-outline-variant/10 shadow-sm gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-black/5 rounded-full text-slate-500">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        {partner && (
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl liquid-gradient flex items-center justify-center shadow-md crimson-pulse-glow shrink-0">
              <span className="text-base font-black text-white">{partner.pseudonym.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="font-headline font-bold text-base text-on-background leading-none">{partner.pseudonym}</h1>
              <p className="text-[10px] text-slate-400 font-medium">{partner.major} · {partner.current_building}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Online</span>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 pt-20 pb-40 px-4 max-w-2xl mx-auto w-full overflow-y-auto space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 gap-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full liquid-gradient flex items-center justify-center shadow-xl crimson-pulse-glow">
              <span className="text-2xl font-black text-white">{partner?.pseudonym.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="font-headline font-bold text-lg text-on-background">{partner?.pseudonym}</h2>
            <p className="text-sm text-slate-400 max-w-xs">{partner?.major} · {partner?.current_building}</p>
            <div className="bg-surface-container-low rounded-2xl px-6 py-3 mt-4">
              <p className="text-xs text-slate-400 font-medium">You matched! Say hello 👋</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender.userId === currentUser?.id;
            return (
              <div key={msg.messageId} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-2xl liquid-gradient flex items-center justify-center shrink-0 mr-2 mt-1 shadow-md">
                    <span className="text-xs font-black text-white">{partner?.pseudonym.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-5 py-3 rounded-3xl shadow-sm
                    ${isMe
                      ? "liquid-gradient text-white rounded-br-lg"
                      : "glass-glow bg-white/60 text-on-surface border border-white/30 rounded-bl-lg"}`}
                >
                  <p className="text-sm leading-relaxed font-medium">{msg.message}</p>
                  <p className={`text-[9px] mt-1 ${isMe ? "text-white/60" : "text-slate-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-24 left-0 w-full z-40 px-4">
        <div className="max-w-2xl mx-auto glass-glow bg-white/50 border border-white/30 rounded-[2.5rem] p-2 shadow-2xl backdrop-blur-2xl flex items-center gap-3">
          <input
            type="text"
            placeholder={`Message ${partner?.pseudonym || ""}...`}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none placeholder:text-slate-300 px-4 py-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="w-12 h-12 liquid-gradient rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all disabled:opacity-40"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
