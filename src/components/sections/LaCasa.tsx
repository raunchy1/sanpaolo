"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MessageCircle, Home, Users, MapPin } from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei sapere di più su San Paolo Hideout.")}`;

const chips = [
  { icon: Home, label: "Nuova costruzione 2025" },
  { icon: Users, label: "Fino a 3 ospiti" },
  { icon: MapPin, label: "Metro B · 9 min" },
] as const;

export default function LaCasa() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-stitch-ivory overflow-hidden" id="la-casa">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: Editorial Text ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-5">
              {t("laCasa.eyebrow")}
            </span>

            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-stitch-green leading-[1.05] mb-7">
              {t("laCasa.title")}
            </h2>

            <div className="w-12 h-px bg-stitch-green/25 mb-8" />

            <p className="font-body text-stitch-on-surface/75 text-base md:text-lg leading-relaxed mb-5">
              {t("laCasa.intro")}
            </p>

            <p className="font-body text-stitch-on-surface/60 text-base leading-relaxed mb-5">
              {t("laCasa.body1")}
            </p>

            <p className="font-body text-stitch-on-surface/60 text-base leading-relaxed mb-10">
              {t("laCasa.body2")}
            </p>

            {/* Info chips */}
            <div className="flex flex-wrap gap-3 mb-10">
              {chips.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 bg-[#EEF3EF] text-stitch-green px-4 py-2 rounded-lg"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-label text-[10px] tracking-[0.18em] uppercase">{label}</span>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-stitch-green hover:bg-stitch-green-light text-white px-8 py-4 rounded-lg font-label text-[11px] tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ boxShadow: "0 8px 24px -8px rgba(7,35,22,0.30)" }}
            >
              <MessageCircle className="w-4 h-4" />
              {t("laCasa.ctaLabel")}
            </a>
          </motion.div>

          {/* ── Right: Lifestyle Image ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: 0.12 }}
            className="relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "4/5",
                boxShadow: "0 32px 64px -16px rgba(7,35,22,0.16)",
              }}
            >
              <img
                src="/images/rooms/real/salotto-1.jpg"
                alt="San Paolo Hideout — Soggiorno"
                className="w-full h-full object-cover"
              />
              {/* Subtle warm gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stitch-green/15 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl px-4 py-3.5"
              style={{ boxShadow: "0 8px 32px -8px rgba(7,35,22,0.14)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3EF] flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-stitch-green" />
                </div>
                <div>
                  <p className="font-label text-[9px] tracking-[0.2em] uppercase text-stitch-olive mb-0.5">
                    Casa Indipendente
                  </p>
                  <p className="font-display text-sm font-semibold text-stitch-on-surface">
                    Nuova Costruzione 2025
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
