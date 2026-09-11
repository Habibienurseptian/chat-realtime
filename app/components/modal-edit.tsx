"use client";

import { AnimatePresence, motion } from "framer-motion";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  nameDraft: string;
  setNameDraft: (value: string) => void;
  avatarSeeds: string[];
  avatarUrlFromSeed: (seed: string) => string;
  selectedAvatarUrl: string;
  setSelectedAvatarUrl: (url: string) => void;
  shuffleAvatars: () => void;
  saveProfile: () => void;
};

export function EditProfileModal({
  isOpen,
  onClose,
  nameDraft,
  setNameDraft,
  avatarSeeds,
  avatarUrlFromSeed,
  selectedAvatarUrl,
  setSelectedAvatarUrl,
  shuffleAvatars,
  saveProfile,
}: EditProfileModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-white">
                  Edit Profil
                </h3>

                <p className="mt-0.5 text-xs text-black/40 dark:text-white/40">
                  Ubah nama dan avatar kamu
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Tutup"
                className="flex h-8 w-8 items-center justify-center rounded-full text-black/50 transition hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-5">
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                maxLength={30}
                placeholder="Nama kamu"
                autoFocus
                className="w-full rounded-full border border-black/10 bg-transparent px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus:ring-white/20"
              />

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-medium text-black/50 dark:text-white/50">
                  Pilih avatar
                </span>

                <button
                  onClick={shuffleAvatars}
                  className="flex items-center gap-1.5 text-xs font-medium text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-5.36M20 15a9 9 0 01-14.13 5.36"
                    />
                  </svg>
                  Acak ulang
                </button>
              </div>

              {/* Avatar List */}
              <div className="mt-3 grid grid-cols-6 gap-2">
                {avatarSeeds.map((seed) => {
                  const url = avatarUrlFromSeed(seed);
                  const isSelected = url === selectedAvatarUrl;

                  return (
                    <button
                      key={seed}
                      onClick={() => setSelectedAvatarUrl(url)}
                      className={`aspect-square overflow-hidden rounded-full transition ${
                        isSelected
                          ? "ring-2 ring-black ring-offset-2 dark:ring-white dark:ring-offset-neutral-950"
                          : "opacity-60 hover:scale-105 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full bg-black/5 dark:bg-white/10"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 border-t border-black/10 px-5 py-4 dark:border-white/10">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-black/10 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
              >
                Batal
              </button>

              <button
                onClick={saveProfile}
                disabled={!nameDraft.trim()}
                className="flex-1 rounded-full bg-black py-2.5 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                Simpan
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
