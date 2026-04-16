"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation, type Locale } from "@/lib/i18n";
import { Star, ExternalLink } from "lucide-react";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const AIRBNB_LINK =
  "https://www.airbnb.com/rooms/1517964247980793952";
const BOOKING_REVIEWS_LINK = "https://www.booking.com/hotel/it/san-paolo-hideout-roma.ro.html#tab-reviews";

const allReviewKeys = [
  "review1", "review2", "review3",
  "review4", "review5", "review6",
  "review7",
] as const;

// Map each review to its primary language based on content
const reviewLocales: Record<typeof allReviewKeys[number], Locale> = {
  review1: "it",
  review2: "en",
  review3: "it",
  review4: "it",
  review5: "de",
  review6: "it",
  review7: "it",
};

const categoryKeys = [
  "location", "cleanliness", "comfort",
  "communication", "value", "family",
] as const;

type ReviewKey = typeof allReviewKeys[number];

function getOrderedReviews(locale: Locale): ReviewKey[] {
  // Locale-first: show reviews matching current language first, then fallback it -> en -> de
  const localeOrder: Record<Locale, Locale[]> = {
    it: ["it", "en", "de"],
    en: ["en", "it", "de"],
    de: ["de", "it", "en"],
  };
  const order = localeOrder[locale];
  const sorted = [...allReviewKeys].sort((a, b) => {
    const rankA = order.indexOf(reviewLocales[a]);
    const rankB = order.indexOf(reviewLocales[b]);
    return rankA - rankB;
  });
  return sorted;
}

/* ─────────────────────────────────────────────
   Airbnb star icon (inline SVG)
───────────────────────────────────────────── */
function AirbnbMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.243 2 7 4.243 7 7c0 1.107.34 2.136.92 2.985-.58.85-.92 1.878-.92 2.985 0 1.38.47 2.65 1.257 3.665-.787 1.015-1.257 2.285-1.257 3.665C6.5 21.38 8.99 23 12 23s5.5-1.62 5.5-5.36c0-1.38-.47-2.65-1.257-3.665.787-1.015 1.257-2.285 1.257-3.665 0-1.107-.34-2.136-.92-2.985.58-.85.92-1.878.92-2.985 0-2.757-2.243-5-5-5zm0 14.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58zm0-5.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58zm0-5.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Score animated bar
───────────────────────────────────────────── */
function ScoreBar({ score }: { score: string }) {
  const pct = (parseFloat(score) / 10) * 100;
  return (
    <div className="w-full h-1 bg-stitch-olive-light/40 rounded-full overflow-hidden mt-1.5">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 }}
        className="h-full rounded-full bg-stitch-green"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Avatar initials
───────────────────────────────────────────── */
const avatarPalette = [
  "bg-stitch-green text-white",
  "bg-stitch-green-light text-white",
  "bg-stitch-gold/80 text-stitch-on-surface",
  "bg-[#3A8A63] text-white",
  "bg-stitch-on-surface text-white",
  "bg-[#C8A96B]/70 text-stitch-on-surface",
];

function Avatar({ name, idx }: { name: string; idx: number }) {
  const initials = name
    .split(/[\s&]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 ${avatarPalette[idx % avatarPalette.length]}`}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Single Review Card
───────────────────────────────────────────── */
function ReviewCard({
  reviewKey,
  idx,
  t,
}: {
  reviewKey: string;
  idx: number;
  t: (k: string) => string;
}) {
  const name     = t(`reviews.${reviewKey}.name`);
  const location = t(`reviews.${reviewKey}.location`);
  const text     = t(`reviews.${reviewKey}.text`);
  const date     = t(`reviews.${reviewKey}.date`);
  const rating   = parseFloat(t(`reviews.${reviewKey}.rating`));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(46,107,74,0.09)" }}
      className="break-inside-avoid mb-5 bg-white rounded-[20px] p-6 md:p-7 group cursor-default flex flex-col gap-5 transition-all duration-300"
      style={{ boxShadow: "0 4px 24px -8px rgba(41,23,13,0.07)" }}
    >
      {/* Top row: stars + Airbnb badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "text-stitch-gold fill-stitch-gold" : "text-stitch-olive-light"}`}
            />
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-[#FF5A5F] text-[10px] font-semibold tracking-wide">
          <AirbnbMark className="w-3 h-3" />
          {t("reviews.verified")}
        </span>
      </div>

      {/* Large opening quote — decorative, not a standard quote mark */}
      <div
        className="font-display text-stitch-olive-light/40 leading-none select-none"
        style={{ fontSize: idx === 0 ? "5rem" : "3.5rem", lineHeight: 0.6, marginBottom: "-0.6rem" }}
        aria-hidden
      >
        &ldquo;
      </div>

      {/* Review text */}
      <p className="text-stitch-on-surface/75 text-[14px] leading-[1.75] flex-1">
        {text}
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3 pt-4 border-t border-stitch-olive-light/30">
        <Avatar name={name} idx={idx} />
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-stitch-on-surface text-sm leading-snug truncate">
            {name}
          </p>
          <p className="text-xs text-stitch-on-surface/40 mt-0.5 truncate">{location}</p>
        </div>
        <span className="shrink-0 text-[11px] text-stitch-on-surface/35 font-medium italic">
          {date}
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────── */
export default function Reviews() {
  const { t, locale } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const reviewKeys = getOrderedReviews(locale);

  return (
    <section className="py-20 md:py-32 bg-stitch-ivory" id="reviews">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-12"
        >
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-5">
            {t("reviews.eyebrow")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-stitch-green leading-[1.1] mb-4">
            {t("reviews.title")}
          </h2>
          <p className="font-body text-stitch-on-surface/55 text-base italic max-w-md leading-relaxed">
            {t("reviews.subtitle")}
          </p>
        </motion.div>

        {/* ── Trust strip + score ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #FFF1EA 0%, #EEF3EF 100%)",
              boxShadow: "0 4px 32px -8px rgba(41,23,13,0.07)",
            }}
          >
            <div className="p-6 md:p-8 lg:p-10">
              {/* Overall + Airbnb link row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div className="flex items-center gap-6 md:gap-10">
                  {/* Big score */}
                  <div className="text-center sm:text-left">
                    <div className="font-display text-5xl md:text-6xl font-bold text-stitch-green leading-none">
                      {t("reviews.overallScore")}
                    </div>
                    <div className="text-stitch-on-surface/35 text-xs font-medium mt-1">
                      / {t("reviews.overallMax")}
                    </div>
                  </div>

                  <div className="w-px h-16 bg-stitch-olive-light/50 hidden sm:block" />

                  <div>
                    <div className="font-display text-xl md:text-2xl font-semibold text-stitch-on-surface mb-1.5">
                      {t("reviews.overallLabel")}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-stitch-gold fill-stitch-gold" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Platform review pills */}
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-center shrink-0">
                  <a
                    href={BOOKING_REVIEWS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-white hover:bg-[#FFF1EA] px-5 py-3 rounded-full font-label text-xs tracking-wider uppercase text-stitch-on-surface/60 hover:text-stitch-on-surface transition-all duration-300"
                    style={{ boxShadow: "0 2px 12px -4px rgba(41,23,13,0.08)" }}
                  >
                    <span className="w-4 h-4 rounded-sm bg-[#003580] text-white text-[8px] font-bold flex items-center justify-center">B</span>
                    <span>{t("reviews.readOnBooking")}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stitch-on-surface/30" />
                  </a>
                  <a
                    href={AIRBNB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-white hover:bg-[#FFF1EA] px-5 py-3 rounded-full font-label text-xs tracking-wider uppercase text-stitch-on-surface/60 hover:text-stitch-on-surface transition-all duration-300"
                    style={{ boxShadow: "0 2px 12px -4px rgba(41,23,13,0.08)" }}
                  >
                    <AirbnbMark className="w-4 h-4 text-[#FF5A5F]" />
                    <span>{t("reviews.readOnAirbnb")}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stitch-on-surface/30" />
                  </a>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {categoryKeys.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="bg-white rounded-xl p-3.5 hover:bg-[#FFF1EA] transition-all duration-300 text-center"
                    style={{ boxShadow: "0 1px 8px -2px rgba(41,23,13,0.05)" }}
                  >
                    <p className="text-[10px] text-stitch-on-surface/40 uppercase tracking-wider font-semibold mb-1">
                      {t(`reviews.categories.${key}.name`)}
                    </p>
                    <p className="font-display text-lg font-bold text-stitch-green leading-none">
                      {t(`reviews.categories.${key}.score`)}
                    </p>
                    <ScoreBar score={t(`reviews.categories.${key}.score`)} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── DESKTOP: CSS Columns masonry ── */}
        <div className="hidden md:block columns-1 md:columns-2 lg:columns-3 gap-5">
          {reviewKeys.map((key, idx) => (
            <ReviewCard key={key} reviewKey={key} idx={idx} t={t} />
          ))}
        </div>

        {/* ── MOBILE: Horizontal snap carousel ── */}
        <div className="md:hidden relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {reviewKeys.map((key, idx) => (
              <div
                key={key}
                className="shrink-0 w-[82vw] max-w-[320px]"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Mobile card — inline version (no break-inside) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="h-full bg-white rounded-[20px] p-5 flex flex-col gap-4"
                  style={{ boxShadow: "0 4px 24px -8px rgba(41,23,13,0.07)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-stitch-gold fill-stitch-gold" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#FF5A5F] text-[9px] font-semibold">
                      <AirbnbMark className="w-2.5 h-2.5" />
                      {t("reviews.verified")}
                    </span>
                  </div>

                  <div
                    className="font-display text-stitch-olive-light/40 leading-none"
                    style={{ fontSize: "3rem", lineHeight: 0.6 }}
                    aria-hidden
                  >
                    &ldquo;
                  </div>

                  <p className="text-stitch-on-surface/70 text-[13px] leading-[1.7] flex-1">
                    {t(`reviews.${key}.text`)}
                  </p>

                  <div className="flex items-center gap-2.5 pt-3 border-t border-stitch-olive-light/30">
                    <Avatar name={t(`reviews.${key}.name`)} idx={idx} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-stitch-on-surface text-xs truncate">
                        {t(`reviews.${key}.name`)}
                      </p>
                      <p className="text-[10px] text-stitch-on-surface/40 truncate">
                        {t(`reviews.${key}.location`)} · {t(`reviews.${key}.date`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Scroll dots indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {reviewKeys.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-stitch-olive-light"
              />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center flex flex-wrap items-center justify-center gap-6"
        >
          <a
            href={BOOKING_REVIEWS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-stitch-on-surface/50 hover:text-stitch-on-surface text-sm transition-colors duration-200"
          >
            <span className="w-4 h-4 rounded-sm bg-[#003580] text-white text-[8px] font-bold flex items-center justify-center">B</span>
            {t("reviews.viewAllOnBooking")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={AIRBNB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-stitch-on-surface/50 hover:text-stitch-on-surface text-sm transition-colors duration-200"
          >
            <AirbnbMark className="w-4 h-4 text-[#FF5A5F]" />
            {t("reviews.viewAllOnAirbnb")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
