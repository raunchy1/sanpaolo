"use client";

import { useState, useEffect } from "react";

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  checkinFrom: string;
  checkinTo: string;
  airbnbLink: string;
  bookingLink: string;
  airbnbReviewsLink: string;
  bookingReviewsLink: string;
  instagramLink: string;
  mapsLink: string;
  cin: string;
  cir: string;
  protocollo: string;
  bookingReviewCount: string;
  airbnbReviewCount: string;
  googleReviewCount: string;
  googleReviewsLink: string;
  bookingScore: string;
  airbnbScore: string;
  googleScore: string;
  overallScore: string;
  heroImage: string;
}

const DEFAULTS: SiteSettings = {
  phone: "+393299362759",
  whatsapp: "393299362759",
  email: "sanpaolohideout@gmail.com",
  checkinFrom: "15:00",
  checkinTo: "20:00",
  airbnbLink: "https://www.airbnb.it/rooms/1517964247980793952",
  bookingLink: "https://booking.com/hotel/it/san-paolo-hideout-roma.ro.html",
  airbnbReviewsLink: "https://www.airbnb.com/rooms/1517964247980793952",
  bookingReviewsLink: "https://www.booking.com/hotel/it/san-paolo-hideout-roma.ro.html#tab-reviews",
  googleReviewsLink: "https://share.google/fsOYRwJYMmQVPV3Ah",
  instagramLink: "https://www.instagram.com/casavacanze_sanpaolohideout/",
  mapsLink: "https://maps.google.com/?q=Via+Silvio+D%27Amico+96,+00145+Roma",
  cin: "IT058091C2OS2A4EP2",
  cir: "058091-CAV-15649",
  protocollo: "QA/2025/66178 del 11/07/2025",
  bookingReviewCount: "19",
  airbnbReviewCount: "6",
  googleReviewCount: "19",
  bookingScore: "9.9/10",
  airbnbScore: "5/5",
  googleScore: "5/5",
  overallScore: "9.9",
  heroImage: "/images/hero-sanpaolo.png",
};

// Normalize any Airbnb URL to Italian domain + force Italian locale
function normalizeAirbnbUrl(url: string): string {
  if (!url || !url.includes("airbnb.")) return url;
  try {
    const roomMatch = url.match(/\/rooms\/(\d+)/);
    if (roomMatch) {
      // Force Italian domain + locale param — overrides device/browser language
      return `https://www.airbnb.it/rooms/${roomMatch[1]}?locale=it`;
    }
    const parsed = new URL(url);
    parsed.hostname = "www.airbnb.it";
    parsed.searchParams.set("locale", "it");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: SiteSettings) => {
        // Only override defaults with non-empty values from DB
        const filtered = Object.fromEntries(
          Object.entries(data).filter(([, v]) => v !== "" && v !== null && v !== undefined)
        ) as Partial<SiteSettings>;
        const merged = { ...DEFAULTS, ...filtered };
        // Always serve Italian Airbnb regardless of what's saved
        merged.airbnbLink = normalizeAirbnbUrl(merged.airbnbLink);
        setSettings(merged);
      })
      .catch(() => {});
  }, []);

  return settings;
}
