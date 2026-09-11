"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGuestIdentity } from "@/app/hooks/use-guest-identity";
import { useGuestLocation } from "@/app/hooks/use-guest-location";
import { supabase } from "@/app/lib/supabase";
import { ChatHeader } from "./chat-header";
import { EditProfileModal } from "./modal-edit";


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
            <ChatHeader
              identity={identity}
              isConnected={isConnected}
              locationLabel={locationLabel}
              onEditProfile={openEditProfile}
              onClose={onClose}
            />

            <EditProfileModal
              isOpen={isEditingProfile}
              onClose={() => setIsEditingProfile(false)}
              nameDraft={nameDraft}
              setNameDraft={setNameDraft}
              avatarSeeds={avatarSeeds}
              avatarUrlFromSeed={avatarUrlFromSeed}
              selectedAvatarUrl={selectedAvatarUrl}
              setSelectedAvatarUrl={setSelectedAvatarUrl}
              shuffleAvatars={shuffleAvatars}
              saveProfile={saveProfile}
            />

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