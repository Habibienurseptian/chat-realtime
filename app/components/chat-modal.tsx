"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGuestIdentity } from "@/app/hooks/use-guest-identity";
import { useGuestLocation } from "@/app/hooks/use-guest-location";
import { getSocket } from "@/app/lib/socket";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  avatarUrl: string;
  city?: string;
  country?: string;
  text: string;
  timestamp: number;
};

export function ChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const identity = useGuestIdentity();
  const location = useGuestLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("history", (past: ChatMessage[]) => setMessages(past));
    socket.on("message", (msg: ChatMessage) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("history");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const sendMessage = () => {
    if (!input.trim() || !identity) return;

    const payload = {
      senderId: identity.id,
      senderName: identity.name,
      avatarUrl: identity.avatarUrl,
      city: location.status === "ready" ? location.city : undefined,
      country: location.status === "ready" ? location.country : undefined,
      text: input.trim(),
    };

    getSocket().emit("message", payload);
    setInput("");
  };

  const locationLabel =
    location.status === "ready"
      ? `${location.city}, ${location.country}`
      : location.status === "denied"
      ? "Lokasi ditolak"
      : location.status === "unavailable"
      ? "Lokasi tidak tersedia"
      : "Mendeteksi lokasi...";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-4 bottom-4 z-[10000] flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 dark:border-white/10 dark:bg-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                {identity && (
                  <img
                    src={identity.avatarUrl}
                    alt={identity.name}
                    className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/10"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {identity?.name || "Guest"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-black/30 dark:bg-white/30"
                      }`}
                    />
                    {locationLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-black/60 transition hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((msg) => {
                const isMe = msg.senderId === identity?.id;
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                    <img
                      src={msg.avatarUrl}
                      alt={msg.senderName}
                      className="h-7 w-7 shrink-0 rounded-full bg-black/5 dark:bg-white/10"
                    />
                    <div className={`flex max-w-[75%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {!isMe && (
                        <span className="mb-1 px-1 text-[11px] text-black/40 dark:text-white/40">
                          {msg.senderName}
                          {msg.city ? ` · ${msg.city}` : ""}
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          isMe
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-black/10 px-4 py-3 dark:border-white/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Tulis pesan..."
                className="flex-1 rounded-full border border-black/10 bg-transparent px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:ring-white/20"
              />
              <button
                onClick={sendMessage}
                aria-label="Kirim pesan"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}