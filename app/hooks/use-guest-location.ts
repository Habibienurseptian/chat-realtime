"use client";

import { useEffect, useState } from "react";

type LocationState =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "unavailable" }
  | { status: "ready"; city: string; country: string };

export function useGuestLocation() {
  const [location, setLocation] = useState<LocationState>({ status: "loading" });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation({ status: "unavailable" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // BigDataCloud reverse-geocode client-side: gratis, tanpa API key,
          // cukup akurat untuk level kota.
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=id`
          );
          const data = await res.json();
          setLocation({
            status: "ready",
            city: data.city || data.locality || "Tidak diketahui",
            country: data.countryName || "",
          });
        } catch {
          setLocation({ status: "unavailable" });
        }
      },
      () => setLocation({ status: "denied" }),
      { timeout: 8000 }
    );
  }, []);

  return location;
}