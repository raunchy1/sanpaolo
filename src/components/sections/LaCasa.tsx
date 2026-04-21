"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MessageCircle, Home } from "lucide-react";

const WHATSAPP_NUMBER = "393299362759";

/**
 * Two-tier rich text renderer:
 *  **text** → bold, dark (structural keywords — rooms, amenities, features)
 *  ~~text~~ → bold, deep forest green (emotional / nature keywords — peace, green, oasis)
 */
function B({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*|~~.*?~~)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("~~") && part.endsWith("~~")) {
          // Emotional / nature keywords — deep forest green
          return (
            <strong key={i} className="font-semibold" style={{ color: "#072316" }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          // Structural bold — refined dark semibold
          return (
            <strong key={i} className="font-semibold text-stitch-on-surface/90">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

const pClass =
  "font-body text-stitch-on-surface/60 text-[15px] md:text-[15.5px] leading-[1.85] mb-5";
const pIntroClass =
  "font-body text-stitch-on-surface/78 text-[16px] md:text-[17px] leading-[1.85] mb-5";

export default function LaCasa() {
  const { t } = useTranslation();

  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("common.whatsapp.info"))}`;

  const featureItems: string[] = t("laCasa.p6items")
    .split("|")
    .map((s: string) => s.trim())
    .filter(Boolean);

  return (
    <section
      className="py-20 md:py-32 bg-stitch-ivory overflow-hidden"
      id="lacasa"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── Left: Editorial Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.25, 0.4, 0.25, 1] }}
            className="max-w-[70ch]"
          >
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-stitch-green leading-[1.05] mb-7">
              {t("laCasa.title")}
            </h2>

            <div className="w-12 h-px bg-stitch-green/25 mb-8" />

            {/* P1 — Identity (intro weight) */}
            <p className={pIntroClass}>
              <B text={t("laCasa.p1")} />
            </p>

            {/* P2 — Location & nature feeling */}
            <p className={pClass}>
              <B text={t("laCasa.p2")} />
            </p>

            {/* P3 — Rooms */}
            <p className={pClass}>
              <B text={t("laCasa.p3")} />
            </p>

            {/* P4 — Kitchen */}
            <p className={pClass}>
              <B text={t("laCasa.p4")} />
            </p>

            {/* P5 — Bathroom */}
            <p className={pClass}>
              <B text={t("laCasa.p5")} />
            </p>

            {/* P6 — Privacy & features */}
            <div className="mb-5">
              <p className={pClass + " mb-3"}>
                <B text={t("laCasa.p6intro")} />
              </p>
              <ul className="space-y-2 pl-1">
                {featureItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-[0.65em]"
                      style={{ background: "rgba(7,35,22,0.35)" }}
                    />
                    <span className="font-body text-[15px] md:text-[15.5px] leading-[1.85] text-stitch-on-surface/60">
                      <B text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* P7 — Closing editorial statement with left accent line */}
            <p
              className="font-body text-stitch-on-surface/65 text-[15px] md:text-[15.5px] leading-[1.85] mb-10 pl-5"
              style={{ borderLeft: "2px solid rgba(7,35,22,0.18)" }}
            >
              <B text={t("laCasa.p7")} />
            </p>

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

          {/* ── Right: Exterior Photo (sticky on desktop) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
            className="relative lg:sticky lg:top-28"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "4/5",
                boxShadow: "0 32px 64px -16px rgba(7,35,22,0.16)",
              }}
            >
              <img
                src="/images/rooms/real/esterno-1.jpg"
                alt="San Paolo Hideout — Esterno verde e accesso privato"
                className="w-full h-full object-cover"
              />
              {/* Warm-green overlay for oasis mood */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,35,22,0.18)] via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl px-4 py-3.5"
              style={{ boxShadow: "0 8px 32px -8px rgba(7,35,22,0.14)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3EF] flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-stitch-green" />
                </div>
                <div>
                  <p className="font-label text-[9px] tracking-[0.2em] uppercase text-stitch-olive mb-0.5">
                    {t("laCasa.floatingBadge.title")}
                  </p>
                  <p className="font-display text-sm font-semibold text-stitch-on-surface">
                    {t("laCasa.floatingBadge.subtitle")}
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
