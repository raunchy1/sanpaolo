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
    transition: { duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="home">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-trevi.jpg"
          alt="Roma al tramonto - San Paolo Hideout"
          className="w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        {/* Retro high-contrast overlay - blue/purple tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(17,24,39,0.7)] via-[rgba(59,130,246,0.3)] to-[rgba(17,24,39,0.85)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(139,92,246,0.2)] via-transparent to-[rgba(59,130,246,0.15)]" />
        {/* Retro vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(17,24,39,0.5) 100%)"
        }} />
        {/* Retro scanlines */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59,130,246,0.15) 2px, rgba(59,130,246,0.15) 4px)",
        }} />
        {/* Halftone dots */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle, #3B82F6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
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
          <span className="text-roman-gold-light text-xs tracking-[0.3em] uppercase font-bold" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
            {t("hero.location")}
          </span>
        </motion.div>

        {/* Rating Badge - Retro style */}
        <motion.div
          custom={0.5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2.5 border-2 border-roman-terracotta px-5 py-2.5 mb-8"
        >
          <Star className="w-4 h-4 text-roman-gold-light fill-roman-gold-light" />
          <span className="text-white/95 text-sm font-bold tracking-wider" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>{t("hero.rating")}</span>
        </motion.div>

        {/* Title - Retro display font */}
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
          className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 300 }}
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs - Retro sharp buttons */}
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
            className="whatsapp-pulse group inline-flex items-center gap-3 bg-roman-whatsapp hover:bg-[#20BD5A] text-white px-9 py-4 text-lg font-bold transition-all duration-300 shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.4)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0_rgba(0,0,0,0.3)] active:translate-x-0 active:translate-y-0 touch-feedback"
          >
            <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
            {t("hero.ctaWhatsApp")}
          </a>
          <a
            href="#booking"
            className="group inline-flex items-center gap-3 border-2 border-white/60 hover:border-white text-white px-9 py-4 text-lg font-medium transition-all duration-300 hover:bg-white/10"
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
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-white/60 text-sm tracking-wider"
          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
        >
          {t("hero.facts").split(" • ").map((fact, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-roman-terracotta" />
              {fact}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator - Retro style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-7 h-11 border-2 border-white/40 flex items-start justify-center pt-2.5"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-1 h-2.5 bg-white/70"
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-roman-warm-white to-transparent z-[5]" />
    </section>
  );
}