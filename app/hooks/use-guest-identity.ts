"use client";

import { useEffect, useState } from "react";

const ADJECTIVES = ["Swift", "Silent", "Brave", "Clever", "Gentle", "Bold", "Calm", "Quick"];
const ANIMALS = ["Fox", "Owl", "Wolf", "Falcon", "Otter", "Lynx", "Hawk", "Panda"];

export type GuestIdentity = {
  id: string;
  name: string;
  avatarUrl: string;
};

function randomName() {
  return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${
    ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  }`;
}

function avatarUrlFromSeed(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

export function useGuestIdentity() {
  const [identity, setIdentity] = useState<GuestIdentity | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("guest_identity");
    if (stored) {
      setIdentity(JSON.parse(stored));
      return;
    }

    const id = crypto.randomUUID();
    const newIdentity: GuestIdentity = {
      id,
      name: randomName(),
      avatarUrl: avatarUrlFromSeed(id),
    };
    localStorage.setItem("guest_identity", JSON.stringify(newIdentity));
    setIdentity(newIdentity);
  }, []);

  const updateIdentity = (updates: Partial<Pick<GuestIdentity, "name" | "avatarUrl">>) => {
    setIdentity((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem("guest_identity", JSON.stringify(next));
      return next;
    });
  };

  return { identity, updateIdentity, avatarUrlFromSeed };
}