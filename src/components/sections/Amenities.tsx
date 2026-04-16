"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  Wifi,
  Tv,
  AirVent,
  Sparkles,
  ChefHat,
  Waves,
  Users,
  Car,
  Luggage,
  ChevronDown,
  Check,
  PawPrint,
  Headphones,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Thin check mark for lists
───────────────────────────────────────────── */
function ThinCheck() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0 text-stitch-green" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 8 6 12 14 4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Data definitions
───────────────────────────────────────────── */
const comfortItems = ["wifi", "smarttv", "ac", "newbuild"] as const;
const kitchenItems = ["dishwasher", "microwave", "coffee", "full"] as const;
const bathroomItems = ["shower", "bidet", "towels", "products"] as const;
const familyItems   = ["crib", "friendly", "checkin"] as const;
const extraItems    = ["luggage", "parking", "support"] as const;

const accordionCategories = [
  { key: "comfort",  icon: AirVent,  items: comfortItems,  roman: "I" },
  { key: "kitchen",  icon: ChefHat,  items: kitchenItems,  roman: "II" },
  { key: "bathroom", icon: Waves,    items: bathroomItems, roman: "III" },
  { key: "family",   icon: Users,    items: familyItems,   roman: "IV" },
  { key: "extra",    icon: Car,      items: extraItems,    roman: "V" },
] as const;

/* ─────────────────────────────────────────────
   Motion helpers
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.25, 0.4, 0.25, 1] as [number,number,number,number] },
  }),
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Roman numeral watermark used on each card */
function RomanNumeral({ n, light = false }: { n: string; light?: boolean }) {
  return (
    <span
      className={`absolute top-4 right-5 font-display text-[2.8rem] font-bold leading-none select-none pointer-events-none ${
        light ? "text-white/10" : "text-stitch-on-surface/[0.05]"
      }`}
    >
      {n}
    </span>
  );
}

/** Item row inside a card */
function ItemRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm leading-snug">
      <ThinCheck />
      <span>{text}</span>
    </li>
  );
}

/* ─────────────────────────────────────────────
   Featured COMFORT card (dark green, large)
───────────────────────────────────────────── */
function ComfortCard({ t }: { t: (k: string) => string }) {
  return (
    <motion.div
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      className="relative overflow-hidden flex flex-col justify-between p-8 md:p-10"
      style={{
        background: "linear-gradient(145deg, #1A3A28 0%, #2E6B4A 60%, #3A8A63 100%)",
        borderRadius: "28px 28px 28px 10px",
        minHeight: 420,
      }}
    >
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-stitch-gold/50 to-transparent" />

      <RomanNumeral n="I" light />

      {/* Category badge */}
      <div>
        <span className="inline-block text-stitch-green/60 text-[10px] font-bold tracking-[0.22em] uppercase mb-5">
          {t("amenities.eyebrow")}
        </span>
        <h3
          className="font-display text-white font-bold leading-[0.9] mb-3"
          style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}
        >
          {t("amenities.comfort.label")}
        </h3>
        <p className="text-white/50 text-sm italic mb-8">
          {t("amenities.comfort.tagline")}
        </p>
      </div>

      {/* Items */}
      <ul className="space-y-3 text-white/80">
        {comfortItems.map((item) => (
          <ItemRow key={item} text={t(`amenities.comfort.${item}`)} />
        ))}
      </ul>

      {/* Bottom count */}
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-stitch-gold/70" />
          <Tv className="w-4 h-4 text-stitch-gold/70" />
          <AirVent className="w-4 h-4 text-stitch-gold/70" />
          <Sparkles className="w-4 h-4 text-stitch-gold/70" />
        </div>
        <span className="text-white/30 text-xs font-medium tracking-wide">
          4 amenità
        </span>
      </div>

      {/* Decorative circle */}
      <div
        className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border border-white/[0.07]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent)" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Secondary card (white/cream)
───────────────────────────────────────────── */
type SecondaryCardProps = {
  catKey: "kitchen" | "bathroom" | "family" | "extra";
  items: readonly string[];
  icon: React.ElementType;
  roman: string;
  delay?: number;
  radius?: string;
  bg?: string;
  t: (k: string) => string;
};

function SecondaryCard({ catKey, items, icon: Icon, roman, delay = 0, radius = "20px", bg = "#fff", t }: SecondaryCardProps) {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(46,107,74,0.10)" }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative overflow-hidden p-6 md:p-7 group cursor-default"
      style={{ borderRadius: radius, background: bg }}
    >
      <RomanNumeral n={roman} />

      {/* Category header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-stitch-olive-light/50 flex items-center justify-center group-hover:bg-stitch-green/15 transition-colors duration-300">
          <Icon className="w-4 h-4 text-stitch-green" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-stitch-on-surface/35 leading-none mb-0.5">
            {t(`amenities.${catKey}.label`)}
          </p>
          <p className="text-[11px] text-stitch-on-surface/45 italic leading-none">
            {t(`amenities.${catKey}.tagline`)}
          </p>
        </div>
      </div>

      {/* Items */}
      <ul className="space-y-2.5 text-stitch-on-surface/70">
        {items.map((item) => (
          <ItemRow key={item} text={t(`amenities.${catKey}.${item}`)} />
        ))}
      </ul>

      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-stitch-green/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Pet strip — full-width horizontal
───────────────────────────────────────────── */
function PetStrip({ t }: { t: (k: string) => string }) {
  return (
    <motion.div
      custom={0.4}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-5 px-7 py-6"
      style={{
        borderRadius: "16px",
        background: "linear-gradient(135deg, #FFF1EA 0%, #EEF3EF 100%)",
        boxShadow: "0 4px 24px -8px rgba(41,23,13,0.07)",
      }}
    >
      <div className="w-12 h-12 rounded-2xl bg-stitch-green/15 flex items-center justify-center shrink-0">
        <PawPrint className="w-5 h-5 text-stitch-green" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-stitch-on-surface/40 mb-0.5">
          {t("amenities.pet.label")}
        </p>
        <p className="font-display text-stitch-on-surface font-semibold text-base leading-snug mb-1">
          {t("amenities.pet.tagline")}
        </p>
        <p className="text-sm text-stitch-on-surface/55 leading-relaxed max-w-prose">
          {t("amenities.pet.desc")}
        </p>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1.5 bg-stitch-green/10 text-stitch-green font-label text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg">
        <Check className="w-3 h-3" />
        Su richiesta
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Mobile accordion
───────────────────────────────────────────── */
type AKey = "comfort" | "kitchen" | "bathroom" | "family" | "extra";
type AItems = typeof comfortItems | typeof kitchenItems | typeof bathroomItems | typeof familyItems | typeof extraItems;

function AccordionItem({
  catKey, icon: Icon, items, roman, t,
}: { catKey: AKey; icon: React.ElementType; items: AItems; roman: string; t: (k: string) => string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: open ? "#fff" : "#FAFAF8",
        boxShadow: "0 2px 12px -4px rgba(41,23,13,0.06)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${open ? "bg-stitch-green text-white" : "bg-stitch-olive-light/50 text-stitch-green"}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-display text-stitch-on-surface font-semibold text-sm">
              {t(`amenities.${catKey}.label`)}
            </p>
            <p className="text-[11px] text-stitch-on-surface/40 italic">
              {t(`amenities.${catKey}.tagline`)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-xs text-stitch-on-surface/30 font-mono">{roman}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-4 h-4 text-stitch-on-surface/40" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <ul className="px-5 pb-5 space-y-3 text-stitch-on-surface/70 pt-4" style={{ borderTop: "1px solid rgba(41,23,13,0.06)" }}>
              {(items as readonly string[]).map((item) => (
                <ItemRow key={item} text={t(`amenities.${catKey}.${item}`)} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
export default function Amenities() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-stitch-ivory overflow-hidden" id="amenities">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mb-14 md:mb-18"
        >
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-5">
            {t("amenities.eyebrow")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-stitch-green leading-[1.1] max-w-xl mb-4">
            {t("amenities.title")}
          </h2>
          <p className="font-body text-stitch-on-surface/55 text-base italic max-w-md leading-relaxed">
            {t("amenities.subtitle")}
          </p>
        </motion.div>

        {/* ── DESKTOP LAYOUT (lg+) ── */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5 mb-5">

          {/* Col 1: Featured COMFORT — spans 2 rows */}
          <div className="row-span-2">
            <ComfortCard t={t} />
          </div>

          {/* Col 2 top: CUCINA */}
          <SecondaryCard
            catKey="kitchen"
            items={kitchenItems}
            icon={ChefHat}
            roman="II"
            delay={0.1}
            radius="20px 20px 8px 20px"
            t={t}
          />

          {/* Col 3 top: BAGNO */}
          <SecondaryCard
            catKey="bathroom"
            items={bathroomItems}
            icon={Waves}
            roman="III"
            delay={0.15}
            radius="20px 20px 20px 8px"
            bg="#FDFCF8"
            t={t}
          />

          {/* Col 2 bottom: FAMIGLIA */}
          <SecondaryCard
            catKey="family"
            items={familyItems}
            icon={Users}
            roman="IV"
            delay={0.2}
            radius="8px 20px 20px 20px"
            bg="#F8FBF9"
            t={t}
          />

          {/* Col 3 bottom: EXTRA */}
          <SecondaryCard
            catKey="extra"
            items={extraItems}
            icon={Luggage}
            roman="V"
            delay={0.25}
            radius="20px 8px 20px 20px"
            t={t}
          />
        </div>

        {/* ── MOBILE/TABLET LAYOUT (< lg) ── */}
        <div className="lg:hidden space-y-3 mb-5">
          {/* Comfort featured — compact version */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-2xl p-6"
            style={{ background: "linear-gradient(145deg, #1A3A28, #2E6B4A)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-stitch-gold/50 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <AirVent className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-display font-semibold text-base">
                  {t("amenities.comfort.label")}
                </p>
                <p className="text-white/45 text-xs italic">
                  {t("amenities.comfort.tagline")}
                </p>
              </div>
            </div>
            <ul className="space-y-2.5 text-white/75">
              {comfortItems.map((item) => (
                <ItemRow key={item} text={t(`amenities.comfort.${item}`)} />
              ))}
            </ul>
          </motion.div>

          {/* Other categories as accordion */}
          {accordionCategories.slice(1).map((cat) => (
            <AccordionItem
              key={cat.key}
              catKey={cat.key as AKey}
              icon={cat.icon}
              items={cat.items as unknown as AItems}
              roman={cat.roman}
              t={t}
            />
          ))}
        </div>

        {/* ── PET strip (all screen sizes) ── */}
        <PetStrip t={t} />

        {/* ── Bottom trust line ── */}
        <motion.div
          custom={0.5}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {[
            { icon: Wifi,       label: "Wi-Fi fibra" },
            { icon: Car,        label: "Parcheggio gratis" },
            { icon: Sparkles,   label: "Pulizia finale inclusa" },
            { icon: Headphones, label: "Supporto rapido" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-stitch-on-surface/40 text-xs">
              <Icon className="w-3.5 h-3.5 text-stitch-green/60" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
