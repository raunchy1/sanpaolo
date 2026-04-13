"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MapPin, Star, MessageCircle, Calendar } from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei informazioni su San Paolo Hideout per un soggiorno.")}`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="home">
      {/* Background Image with parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero.png"
          alt="Roma al tramonto - San Paolo Hideout"
          className="w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        {/* Multi-layer cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(61,43,31,0.5)] via-[rgba(196,113,78,0.25)] to-[rgba(61,43,31,0.75)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(61,43,31,0.3)] via-transparent to-[rgba(61,43,31,0.15)]" />
        {/* Warm vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(61,43,31,0.4) 100%)"
        }} />
        {/* Subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center pt-24 pb-28">
        {/* Location Label */}
        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center justify-center gap-2 mb-5"
        >
          <MapPin className="w-3.5 h-3.5 text-roman-gold-light" />
          <span className="text-roman-gold-light text-xs tracking-[0.25em] uppercase font-medium">
            {t("hero.location")}
          </span>
        </motion.div>

        {/* Rating Badge */}
        <motion.div
          custom={0.5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2.5 glass-card rounded-full px-5 py-2.5 mb-8"
        >
          <Star className="w-4 h-4 text-roman-gold-light fill-roman-gold-light" />
          <span className="text-white/95 text-sm font-semibold tracking-wide">{t("hero.rating")}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={0.7}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display text-[3.2rem] sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold text-white mb-7 leading-[0.92] tracking-roman"
        >
          {t("hero.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={0.9}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-lg sm:text-xl md:text-2xl text-white/85 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={1.1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pulse group inline-flex items-center gap-3 bg-roman-whatsapp hover:bg-[#20BD5A] text-white px-9 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-900/20 hover:scale-[1.03] active:scale-[0.98] touch-feedback"
          >
            <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
            {t("hero.ctaWhatsApp")}
          </a>
          <a
            href="#booking"
            className="group inline-flex items-center gap-3 glass-card hover:bg-white/20 text-white px-9 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] touch-feedback"
          >
            <Calendar className="w-5 h-5" />
            {t("hero.ctaAvailability")}
          </a>
        </motion.div>

        {/* Trust Facts */}
        <motion.div
          custom={1.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-white/70 text-sm tracking-wide"
        >
          {t("hero.facts").split(" • ").map((fact, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-roman-gold-light/80" />
              {fact}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-7 h-11 rounded-full border-2 border-white/30 flex items-start justify-center pt-2.5"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-1 h-2.5 bg-white/70 rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-roman-warm-white to-transparent z-[5]" />
    </section>
  );
}
