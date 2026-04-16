"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  Shield,
  Home,
  Clock,
  Lock,
  Check,
} from "lucide-react";
import DualContactCTA from "@/components/ui/DualContactCTA";

const WHATSAPP_NUMBER = "393299362759";
const AIRBNB_LINK = "https://www.airbnb.com.ro/rooms/1517964247980793952?unique_share_id=d7fecbe5-b751-40f5-a115-83c02ad481fa&viralityEntryPoint=1&s=76&source_impression_id=p3_1776174940_P3vjFjX5W4f5k4KO";
const BOOKING_LINK = "https://booking.com/hotel/it/san-paolo-hideout-roma.ro.html";

const bookingFeatures = [
  { key: "bestPrice", icon: Shield },
  { key: "airbnb", icon: Home },
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-stitch-gold/[0.04] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-stitch-green/[0.05] blur-3xl" />
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
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-gold uppercase block mb-5">
            {t("booking.sectionLabel")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light italic text-white mb-6 leading-[1.1]">
            {t("booking.newTitle")}
          </h2>
          <p className="font-body text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            {t("booking.newSubtitle")}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
        >
          {bookingFeatures.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 md:p-6 hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-400 group"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-stitch-gold/15 mb-3.5 group-hover:bg-stitch-gold/25 transition-colors duration-400">
                <Icon className="w-5 h-5 text-stitch-gold" />
              </div>
              <h3 className="font-label text-xs tracking-wider uppercase text-white/80 mb-1.5">
                {t(`booking.${key}.title`)}
              </h3>
              <p className="font-body text-white/45 text-xs leading-relaxed">
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
          {/* Trust badge — Miglior prezzo garantito */}
          <div className="inline-flex items-center gap-2 bg-stitch-gold/15 border border-stitch-gold/25 rounded-full px-5 py-2 mb-7">
            <Check className="w-3.5 h-3.5 text-stitch-gold" />
            <span className="font-label text-[10px] tracking-[0.22em] uppercase text-stitch-gold">
              {t("booking.bestPriceLabel")}
            </span>
          </div>

          {/* Dual CTA: Chiama + WhatsApp */}
          <div className="mb-5">
            <DualContactCTA
              callLabel={t("booking.ctaCall")}
              whatsappLabel={t("booking.ctaWhatsApp")}
              size="lg"
              variant="dark"
              whatsappText={t("common.whatsapp.booking")}
            />
          </div>

          {/* Divider with label */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="font-label text-[9px] tracking-[0.22em] uppercase text-white/25">
              {t("booking.orPlatforms")}
            </span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* OTA Platform Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {/* Airbnb */}
            <a
              href={AIRBNB_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("booking.ctaAirbnb")}
              className="group inline-flex items-center justify-center gap-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white px-6 py-4 rounded-lg font-label text-[11px] tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-900/20"
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
              className="group inline-flex items-center justify-center gap-3 bg-[#003B95] hover:bg-[#002F77] text-white px-6 py-4 rounded-lg font-label text-[11px] tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20"
            >
              <BookingIcon className="w-5 h-5" />
              {t("booking.ctaBooking")}
            </a>
          </div>

          {/* Trust Microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/40 text-xs">
            {["trustInstant", "trustSecure", "trustTrusted"].map((key) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                <Check className="w-3 h-3 text-stitch-gold/60" />
                {t(`booking.${key}`)}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
