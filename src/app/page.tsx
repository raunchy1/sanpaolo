"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import CheckIn from "@/components/sections/CheckIn";
import GuestFavorites from "@/components/sections/GuestFavorites";
import LaCasa from "@/components/sections/LaCasa";
import Amenities from "@/components/sections/Amenities";
import RoomTour from "@/components/sections/RoomTour";
import NewBuild from "@/components/sections/NewBuild";
import Location from "@/components/sections/Location";
import Reviews from "@/components/sections/Reviews";
import SpecialOffers from "@/components/sections/SpecialOffers";
import BookingCTA from "@/components/sections/BookingCTA";
import BookingCalendar from "@/components/sections/BookingCalendar";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import MobileStickyCTA from "@/components/sections/MobileStickyCTA";

interface SectionConfig {
  id: string;
  visible: boolean;
}

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero:           Hero,
  checkin:        CheckIn,
  guestFavorites: GuestFavorites,
  laCasa:         LaCasa,
  amenities:      Amenities,
  roomTour:       RoomTour,
  newBuild:       NewBuild,
  location:       Location,
  reviews:        Reviews,
  specialOffers:  SpecialOffers,
  bookingCalendar: BookingCalendar,
  bookingCTA:     BookingCTA,
  faq:            FAQ,
};

const DEFAULT_ORDER = [
  "hero", "checkin", "guestFavorites", "laCasa", "amenities",
  "roomTour", "newBuild", "location", "reviews", "specialOffers",
  "bookingCTA", "faq",
];

export default function Home() {
  const { messages } = useTranslation();
  const [sectionConfig, setSectionConfig] = useState<SectionConfig[]>([]);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((data: SectionConfig[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSectionConfig(data);
        }
        setConfigLoaded(true);
      })
      .catch(() => setConfigLoaded(true));
  }, []);

  if (!messages || Object.keys(messages).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stitch-ivory">
        <div className="text-center">
          <div className="font-display text-2xl font-bold text-stitch-on-surface mb-3">
            San Paolo Hideout
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-stitch-green animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-stitch-gold animate-pulse" style={{ animationDelay: "200ms" }} />
            <div className="w-2 h-2 rounded-full bg-stitch-green-light animate-pulse" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    );
  }

  // Build ordered + filtered section list
  const orderedSections: string[] = configLoaded && sectionConfig.length > 0
    ? sectionConfig.filter((s) => s.visible).map((s) => s.id)
    : DEFAULT_ORDER;

  return (
    <div className="min-h-screen flex flex-col bg-stitch-ivory">
      <Navigation />
      <main className="flex-1">
        {orderedSections.map((id) => {
          const Component = SECTION_COMPONENTS[id];
          if (!Component) return null;
          return <Component key={id} />;
        })}
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
