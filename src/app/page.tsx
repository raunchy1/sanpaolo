"use client";

import { useTranslation } from "@/lib/i18n";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Amenities from "@/components/sections/Amenities";
import RoomTour from "@/components/sections/RoomTour";
import Location from "@/components/sections/Location";
import Reviews from "@/components/sections/Reviews";
import BookingCTA from "@/components/sections/BookingCTA";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import MobileStickyCTA from "@/components/sections/MobileStickyCTA";

export default function Home() {
  const { messages } = useTranslation();

  // Wait for messages to load
  if (!messages || Object.keys(messages).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-roman-warm-white">
        <div className="text-center">
          <div className="font-display text-2xl font-bold text-roman-espresso mb-3 tracking-roman">
            San Paolo Hideout
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-roman-terracotta animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-roman-gold animate-pulse" style={{ animationDelay: "200ms" }} />
            <div className="w-2 h-2 rounded-full bg-roman-olive animate-pulse" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-roman-warm-white">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Amenities />
        <RoomTour />
        <Location />
        <Reviews />
        <BookingCTA />
        <FAQ />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
