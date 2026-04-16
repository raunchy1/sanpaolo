"use client";

import { useTranslation } from "@/lib/i18n";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import CheckIn from "@/components/sections/CheckIn";
import Amenities from "@/components/sections/Amenities";
import RoomTour from "@/components/sections/RoomTour";
import NewBuild from "@/components/sections/NewBuild";
import Location from "@/components/sections/Location";
import Reviews from "@/components/sections/Reviews";
import SpecialOffers from "@/components/sections/SpecialOffers";
import BookingCTA from "@/components/sections/BookingCTA";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import MobileStickyCTA from "@/components/sections/MobileStickyCTA";

export default function Home() {
  const { messages } = useTranslation();

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

  return (
    <div className="min-h-screen flex flex-col bg-stitch-ivory">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <CheckIn />
        <Amenities />
        <RoomTour />
        <NewBuild />
        <Location />
        <Reviews />
        <SpecialOffers />
        <BookingCTA />
        <FAQ />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
