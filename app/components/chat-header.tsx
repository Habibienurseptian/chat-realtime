"use client";

type Identity = {
  name: string;
  avatarUrl: string;
};

type ChatHeaderProps = {
  identity: Identity | null;
  isConnected: boolean;
  locationLabel: string;
  onEditProfile: () => void;
  onClose: () => void;
};

export function ChatHeader({
  identity,
  isConnected,
  locationLabel,
  onEditProfile,
  onClose,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
      <button
        onClick={onEditProfile}
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

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-black/30 dark:text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </p>

          <p className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected
                  ? "bg-green-500"
                  : "bg-black/30 dark:bg-white/30"
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
  );
}
