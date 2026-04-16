"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Calendar, Sun, Gift, Clock } from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";

const offers = [
  {
    key: "stay3",
    icon: Calendar,
    gradient: "from-[#2E6B4A] to-[#1D4D35]",
  },
  {
    key: "weekend",
    icon: Sun,
    gradient: "from-[#1D4D35] to-[#2E6B4A]",
  },
  {
    key: "direct",
    icon: Gift,
    gradient: "from-[#234d38] to-[#2E6B4A]",
  },
  {
    key: "early",
    icon: Clock,
    gradient: "from-[#1a3a28] to-[#2E6B4A]",
  },
] as const;

export default function SpecialOffers() {
  const { t } = useTranslation();

  return (
    <section className="section-luxury bg-stitch-ivory">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-5">
            {t("offers.badge")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-stitch-green leading-[1.1] mb-4">
            {t("offers.title")}
          </h2>
          <p className="font-body text-stitch-on-surface/55 text-base max-w-xl mx-auto leading-relaxed">
            {t("offers.subtitle")}
          </p>
        </motion.div>

        {/* Cards — 2×2 grid on desktop, single col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {offers.map((offer, i) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-luxury bg-gradient-to-br ${offer.gradient} p-7 md:p-8 text-white group transition-all duration-300`}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(46, 107, 74, 0.32)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                {/* Gold accent top line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-stitch-gold/60 to-transparent" />

                {/* Icon badge */}
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-display italic text-2xl md:text-3xl font-light mb-2 leading-snug">
                  {t(`offers.${offer.key}.title`)}
                </h3>
                <p className="font-body text-white/65 text-sm leading-relaxed mb-6 max-w-[38ch]">
                  {t(`offers.${offer.key}.description`)}
                </p>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t(`offers.${offer.key}.waText`))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-stitch-green px-6 py-2.5 rounded-lg font-label text-[11px] tracking-widest uppercase transition-all duration-300 hover:bg-stitch-ivory hover:scale-[1.02]"
                >
                  {t("offers.cta")}
                  <span className="text-xs">→</span>
                </a>

                {/* Decorative circle */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/[0.05] group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
