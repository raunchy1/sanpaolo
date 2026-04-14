"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  Shield,
  MessageCircle,
  Home,
  Clock,
  Lock,
  ArrowRight,
  Building2,
  Check,
} from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei prenotare San Paolo Hideout.")}`;
const AIRBNB_LINK = "https://www.airbnb.com.ro/rooms/1517964247980793952?unique_share_id=d7fecbe5-b751-40f5-a115-83c02ad481fa&viralityEntryPoint=1&s=76&source_impression_id=p3_1776174940_P3vjFjX5W4f5k4KO";
const BOOKING_LINK = "https://booking.com/hotel/it/san-paolo-hideout-roma.ro.html";
const VRBO_LINK = "https://www.vrbo.com/it-it/affitto-vacanze/p11976038";

const bookingFeatures = [
  { key: "bestPrice", icon: Shield },
  { key: "airbnb", icon: Home },
  { key: "booking", icon: Building2 },
  { key: "fastReply", icon: Clock },
  { key: "secure", icon: Lock },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

function AirbnbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.243 2 7 4.243 7 7c0 1.107.34 2.136.92 2.985-.58.85-.92 1.878-.92 2.985 0 1.38.47 2.65 1.257 3.665-.787 1.015-1.257 2.285-1.257 3.665C6.5 21.38 8.99 23 12 23s5.5-1.62 5.5-5.36c0-1.38-.47-2.65-1.257-3.665.787-1.015 1.257-2.285 1.257-3.665 0-1.107-.34-2.136-.92-2.985.58-.85.92-1.878.92-2.985 0-2.757-2.243-5-5-5zm0 14.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58zm0-5.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58zm0-5.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58z"/>
    </svg>
  );
}

function BookingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm4 2v2h2V8H6zm0 4v2h2v-2H6zm0 4v2h2v-2H6zm4-8v2h8V8h-8zm0 4v2h8v-2h-8zm0 4v2h5v-2h-5z"/>
    </svg>
  );
}

function VrboIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l-9.53 6.63a.75.75 0 0 0 .43 1.37H4v8h3v-6h2v6h3v-8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V20h3v-6h2v6h3v-8h1.1a.75.75 0 0 0 .43-1.37L12 2z"/>
    </svg>
  );
}

export default function BookingCTA() {
  const { t } = useTranslation();

  return (
    <section
      className="py-20 md:py-32 relative overflow-hidden"
      id="booking"
      style={{
        background:
          "linear-gradient(160deg, #3D2B1F 0%, #5A4030 35%, #6B4E3A 65%, #4A3528 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-roman-gold/[0.04] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-roman-terracotta/[0.05] blur-3xl" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2l2 3.5-2 3z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E\")",
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
          className="mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-roman-gold-light font-semibold mb-3">
            {t("booking.sectionLabel")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-roman">
            {t("booking.newTitle")}
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("booking.newSubtitle")}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-14"
        >
          {bookingFeatures.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 md:p-6 hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-400 group"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-roman-gold/15 mb-3.5 group-hover:bg-roman-gold/25 transition-colors duration-400">
                <Icon className="w-5 h-5 text-roman-gold-light" />
              </div>
              <h3 className="font-display text-sm font-semibold text-white mb-1.5">
                {t(`booking.${key}.title`)}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed">
                {t(`booking.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Reservation Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          {/* Platform Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {/* WhatsApp — primary CTA */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("booking.ctaWhatsApp")}
              className="whatsapp-pulse group col-span-1 sm:col-span-2 inline-flex items-center justify-center gap-3 bg-roman-whatsapp hover:bg-[#20BD5A] text-white px-8 py-5 rounded-full text-lg font-semibold transition-all duration-300 shadow-2xl shadow-green-900/30 hover:shadow-green-900/40 hover:scale-[1.02] active:scale-[0.98] touch-feedback"
            >
              <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
              {t("booking.ctaWhatsApp")}
              <span className="hidden sm:inline-flex items-center gap-1 text-sm font-medium opacity-90 bg-white/20 px-2.5 py-0.5 rounded-full">
                {t("booking.bestRateBadge")}
              </span>
            </a>

            {/* Airbnb */}
            <a
              href={AIRBNB_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("booking.ctaAirbnb")}
              className="group inline-flex items-center justify-center gap-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-feedback shadow-lg shadow-rose-900/20 hover:shadow-rose-900/30"
            >
              <AirbnbIcon className="w-5 h-5" />
              {t("booking.ctaAirbnb")}
            </a>

            {/* Booking.com */}
            <a
              href={BOOKING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("booking.ctaBooking")}
              className="group inline-flex items-center justify-center gap-3 bg-[#003B95] hover:bg-[#002F77] text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-feedback shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 border border-white/10"
            >
              <BookingIcon className="w-5 h-5" />
              {t("booking.ctaBooking")}
            </a>

            {/* VRBO */}
            <a
              href={VRBO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("booking.ctaVrbo")}
              className="group inline-flex items-center justify-center gap-3 bg-[#1D2D3C] hover:bg-[#14202B] text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-feedback shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 border border-white/10"
            >
              <VrboIcon className="w-5 h-5" />
              {t("booking.ctaVrbo")}
            </a>

            {/* Secondary direct link style */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("booking.ctaWhatsApp")}
              className="group inline-flex sm:hidden items-center justify-center gap-3 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-md border border-white/[0.15] hover:border-white/[0.25] text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-feedback"
            >
              <MessageCircle className="w-5 h-5" />
              {t("booking.ctaWhatsAppShort")}
            </a>
          </div>

          {/* Trust Microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/50 text-sm">
            {[
              "trustInstant",
              "trustSecure",
              "trustTrusted",
              "trustRates",
            ].map((key) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-roman-gold-light" />
                {t(`booking.${key}`)}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
