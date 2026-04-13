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
} from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei prenotare San Paolo Hideout.")}`;

const bookingFeatures = [
  { key: "bestPrice", icon: Shield },
  { key: "whatsapp", icon: MessageCircle },
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
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

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
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-roman-gold-light font-semibold mb-3">
            Direct Booking
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-roman">
            {t("booking.title")}
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-white/60 text-lg max-w-lg mx-auto leading-relaxed">
            {t("booking.subtitle")}
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

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pulse group inline-flex items-center gap-3 bg-roman-whatsapp hover:bg-[#20BD5A] text-white px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 shadow-2xl shadow-green-900/30 hover:shadow-green-900/40 hover:scale-[1.03] active:scale-[0.98] touch-feedback"
          >
            <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
            {t("booking.ctaWhatsApp")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="https://www.airbnb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-md border border-white/[0.15] hover:border-white/[0.25] text-white px-8 py-5 rounded-full text-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-feedback"
          >
            <Home className="w-5 h-5" />
            {t("booking.ctaAirbnb")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
