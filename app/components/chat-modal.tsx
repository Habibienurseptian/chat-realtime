"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGuestIdentity } from "@/app/hooks/use-guest-identity";
import { useGuestLocation } from "@/app/hooks/use-guest-location";
import { supabase } from "@/app/lib/supabase";

type ChatMessage = {
  id: string;
  sender_id: string;
  sender_name: string;
  avatar_url: string;
  city: string | null;
  country: string | null;
  text: string;
  created_at: string;
};

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(isoString: string) {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(date, today)) return "Hari ini";
  if (isSameDay(date, yesterday)) return "Kemarin";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isDifferentDay(a: string, b: string) {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return (
    dateA.getDate() !== dateB.getDate() ||
    dateA.getMonth() !== dateB.getMonth() ||
    dateA.getFullYear() !== dateB.getFullYear()
  );
}

// Generate beberapa opsi seed avatar acak untuk dipilih
function generateAvatarSeeds(count: number) {
  return Array.from({ length: count }, () => Math.random().toString(36).slice(2, 10));
}

export function ChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { identity, updateIdentity, avatarUrlFromSeed } = useGuestIdentity();
  const location = useGuestLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // State untuk panel edit profil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [avatarSeeds, setAvatarSeeds] = useState<string[]>([]);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("");

  const openEditProfile = () => {
    if (!identity) return;
    setNameDraft(identity.name);
    setSelectedAvatarUrl(identity.avatarUrl);
    setAvatarSeeds(generateAvatarSeeds(6));
    setIsEditingProfile(true);
  };

  const shuffleAvatars = () => {
    setAvatarSeeds(generateAvatarSeeds(6));
  };

  const saveProfile = () => {
    const trimmedName = nameDraft.trim();
    if (!trimmedName) return;
    updateIdentity({ name: trimmedName, avatarUrl: selectedAvatarUrl });
    setIsEditingProfile(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setMessages(data);
      });
  }, [isOpen]);

  useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isEditingProfile) {
        setIsEditingProfile(false);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, isEditingProfile]);

  const sendMessage = async () => {
    if (!input.trim() || !identity) return;

    const text = input.trim();
    setInput("");

    const { error } = await supabase.from("messages").insert({
      sender_id: identity.id,
      sender_name: identity.name,
      avatar_url: identity.avatarUrl,
      city: location.status === "ready" ? location.city : null,
      country: location.status === "ready" ? location.country : null,
      text,
    });

    if (error) console.error("Gagal mengirim pesan:", error.message);
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
            className="fixed inset-x-4 bottom-4 z-[10000] flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[75vh] sm:max-h-[720px] sm:w-[420px] lg:w-[460px] dark:border-white/10 dark:bg-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <button
                onClick={openEditProfile}
                className="flex items-center gap-3 rounded-xl px-1 py-1 text-left transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                {identity && (
                  <img
                    src={identity.avatarUrl}
                    alt={identity.name}
                    className="h-9 w-9 rounded-full bg-black/5 dark:bg-white/10"
                  />
                )}
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-black dark:text-white">
                    {identity?.name || "Guest"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
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
              </button>
              <button
                onClick={onClose}
                aria-label="Tutup chat"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/60 transition hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <AnimatePresence>
              {isEditingProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 top-[73px] z-10 border-b border-black/10 bg-white px-5 py-5 shadow-lg dark:border-white/10 dark:bg-black"
                >
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
                    Edit Profil
                  </p>

                  <input
                    type="text"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    maxLength={30}
                    placeholder="Nama kamu"
                    className="w-full rounded-full border border-black/10 bg-transparent px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:ring-white/20"
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-black/40 dark:text-white/40">Pilih avatar</span>
                    <button
                      onClick={shuffleAvatars}
                      className="flex items-center gap-1 text-xs font-medium text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-5.36M20 15a9 9 0 01-14.13 5.36" />
                      </svg>
                      Acak ulang
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {avatarSeeds.map((seed) => {
                      const url = avatarUrlFromSeed(seed);
                      const isSelected = url === selectedAvatarUrl;
                      return (
                        <button
                          key={seed}
                          onClick={() => setSelectedAvatarUrl(url)}
                          className={`relative overflow-hidden rounded-full transition ${
                            isSelected
                              ? "ring-2 ring-black ring-offset-2 dark:ring-white dark:ring-offset-black"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={url} alt="" className="h-full w-full bg-black/5 dark:bg-white/10" />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                    >
                      Batal
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={!nameDraft.trim()}
                      className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-white/85"
                    >
                      Simpan
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="chat-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4"
            >
              {messages.map((msg, index) => {
                const isMe = msg.sender_id === identity?.id;
                const prevMsg = messages[index - 1];
                const showDateSeparator =
                  !prevMsg || isDifferentDay(prevMsg.created_at, msg.created_at);

                return (
                  <div key={msg.id}>
                    {showDateSeparator && (
                      <div className="my-4 flex items-center justify-center">
                        <span className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-medium text-black/50 dark:bg-white/10 dark:text-white/50">
                          {formatDateLabel(msg.created_at)}
                        </span>
                      </div>
                    )}

                    <div className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <img
                        src={msg.avatar_url}
                        alt={msg.sender_name}
                        className="h-7 w-7 shrink-0 rounded-full bg-black/5 dark:bg-white/10"
                      />

                      <div
                        className={`flex max-w-[75%] flex-col ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        {!isMe && (
                          <span className="mb-1 px-1 text-[11px] text-black/40 dark:text-white/40">
                            {msg.sender_name}
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

                        <span className="mt-1 px-1 text-[10px] text-black/35 dark:text-white/35">
                          {formatTime(msg.created_at)}
                        </span>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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