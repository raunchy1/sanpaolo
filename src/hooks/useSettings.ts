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
}

const DEFAULTS: SiteSettings = {
  phone: "+393299362759",
  whatsapp: "393299362759",
  email: "sanpaolohideout@gmail.com",
  checkinFrom: "15:00",
  checkinTo: "20:00",
  airbnbLink: "https://www.airbnb.com.ro/rooms/1517964247980793952?unique_share_id=d7fecbe5-b751-40f5-a115-83c02ad481fa&viralityEntryPoint=1&s=76&source_impression_id=p3_1776174940_P3vjFjX5W4f5k4KO",
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
};

export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: SiteSettings) => {
        setSettings({ ...DEFAULTS, ...data });
      })
      .catch(() => {});
  }, []);

  return settings;
}
