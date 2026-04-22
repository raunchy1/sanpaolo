"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MapPin, Calendar } from "lucide-react";
import DualContactCTA from "@/components/ui/DualContactCTA";
import ReviewBar from "@/components/ui/ReviewBar";
import { useSettings } from "@/hooks/useSettings";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

const titleContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.7 },
  },
};

const titleWord = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function Hero() {
  const { t } = useTranslation();
  const { heroImage } = useSettings();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="home">
      {/* Background Image — Stitch editorial photography-first */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Basilica di San Paolo fuori le Mura, Roma - San Paolo Hideout"
          className="w-full h-full object-cover scale-105"
          fetchPriority="high"
        />
        {/* Stitch warm gradient overlay — NO blue/purple */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,35,22,0.55)] via-[rgba(7,35,22,0.35)] to-[rgba(7,35,22,0.75)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(89,99,50,0.15)] via-transparent to-[rgba(200,169,107,0.1)]" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 60% 40%, transparent 20%, rgba(7,35,22,0.4) 100%)"
        }} />
      </div>

      {/* Content — Stitch editorial serif typography */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center pt-24 pb-28">
        {/* Location Label */}
        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <MapPin className="w-3.5 h-3.5 text-stitch-gold" />
          <span className="text-white/85 text-xs tracking-[0.2em] uppercase font-semibold font-body">
            Via Silvio D'Amico 96, 00145 Roma
          </span>
        </motion.div>

        {/* Title — Newsreader-style editorial serif, word-by-word reveal */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={titleContainer}
          className="font-display font-bold text-white mb-7 leading-[0.92] tracking-roman"
        >
          {(() => {
            const fullTitle = t("hero.title");
            const pipeIdx = fullTitle.indexOf("|");
            if (pipeIdx === -1) {
              return fullTitle.split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.25em] text-[3.2rem] sm:text-7xl md:text-8xl lg:text-[6.5rem]">
                  <motion.span className="inline-block" variants={titleWord}>{word}</motion.span>
                </span>
              ));
            }
            const primary = fullTitle.slice(0, pipeIdx).trim();
            const secondary = fullTitle.slice(pipeIdx + 1).trim();
            return (
              <>
                <span className="block">
                  {primary.split(" ").map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden mr-[0.25em] text-[3.2rem] sm:text-7xl md:text-8xl lg:text-[6.5rem]">
                      <motion.span className="inline-block" variants={titleWord}>{word}</motion.span>
                    </span>
                  ))}
                </span>
                <span className="block mt-1">
                  {secondary.split(" ").map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden mr-[0.2em] text-[1.55rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.2rem] font-light opacity-75">
                      <motion.span className="inline-block" variants={titleWord}>{word}</motion.span>
                    </span>
                  ))}
                </span>
              </>
            );
          })()}
        </motion.h1>

        {/* Subtitle — Manrope body, warm tone */}
        <motion.p
          custom={0.9}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-body font-light"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Dual CTA */}
        <motion.div
          custom={1.1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <DualContactCTA
            callLabel={t("hero.ctaCall")}
            whatsappLabel={t("hero.ctaWhatsApp")}
            size="lg"
            variant="dark"
          />
        </motion.div>

        {/* Secondary CTA — Ghost style, no border */}
        <motion.div
          custom={1.2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-12"
        >
          <a
            href="#booking"
            className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-9 py-4 text-lg font-medium transition-all duration-400 rounded-sm font-body backdrop-blur-sm"
          >
            <Calendar className="w-5 h-5" />
            {t("hero.ctaAvailability")}
          </a>
        </motion.div>

        {/* Trust Facts — Stitch warm dots */}
        <motion.div
          custom={1.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-white/80 text-sm tracking-wider font-body"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}
        >
          {t("hero.facts").split(" • ").map((fact, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-stitch-gold rounded-full" />
              {fact}
            </span>
          ))}
        </motion.div>

        {/* Review trust bar */}
        <ReviewBar />
      </div>

      {/* Scroll indicator — Stitch minimalist */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-7 h-11 ghost-border rounded-sm flex items-start justify-center pt-2.5"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-1 h-2.5 bg-white/70"
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into Stitch ivory */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stitch-ivory to-transparent z-[5]" />
    </section>
  );
}