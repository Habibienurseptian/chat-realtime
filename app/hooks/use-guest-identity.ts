"use client";

import { useEffect, useState } from "react";

const ADJECTIVES = ["Swift", "Silent", "Brave", "Clever", "Gentle", "Bold", "Calm", "Quick"];
const ANIMALS = ["Fox", "Owl", "Wolf", "Falcon", "Otter", "Lynx", "Hawk", "Panda"];

export type GuestIdentity = {
  id: string;
  name: string;
  avatarUrl: string;
};

export function useGuestIdentity() {
  const [identity, setIdentity] = useState<GuestIdentity | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("guest_identity");
    if (stored) {
      setIdentity(JSON.parse(stored));
      return;
    }

    const id = crypto.randomUUID();
    const name = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${
      ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    }`;
    // DiceBear: avatar SVG deterministik berdasarkan seed, gratis, tanpa API key
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;

    const newIdentity = { id, name, avatarUrl };
    localStorage.setItem("guest_identity", JSON.stringify(newIdentity));
    setIdentity(newIdentity);
  }, []);

  return identity;
}