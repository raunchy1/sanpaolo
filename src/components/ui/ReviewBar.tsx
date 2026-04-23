"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

function Stars({ count, accent }: { count: number; accent: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="w-3 h-3" fill={i < count ? accent : "rgba(255,255,255,0.2)"}>
          <path d="M6 0.5l1.39 2.82 3.11.45-2.25 2.19.53 3.09L6 7.5l-2.78 1.55.53-3.09L1.5 3.77l3.11-.45L6 0.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewBar() {
  const settings = useSettings();

  const items = [
    {
      platform: "BOOKING.COM",
      score: settings.bookingScore,
      count: settings.bookingReviewCount,
      stars: 5,
      accent: "#1a6fbb",
      href: settings.bookingReviewsLink,
      logo: (
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden>
          <rect width="40" height="40" rx="8" fill="#1a6fbb" />
          <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="sans-serif">B</text>
        </svg>
      ),
    },
    {
      platform: "AIRBNB",
      score: settings.airbnbScore,
      count: settings.airbnbReviewCount,
      stars: 5,
      accent: "#ff5a5f",
      href: settings.airbnbReviewsLink,
      logo: (
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden>
          <rect width="40" height="40" rx="8" fill="#ff5a5f" />
          <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="sans-serif">Air</text>
        </svg>
      ),
    },
    {
      platform: "GOOGLE",
      score: settings.googleScore,
      count: settings.googleReviewCount,
      stars: 5,
      accent: "#f5a623",
      href: settings.googleReviewsLink,
      logo: (
        <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden>
          <rect width="40" height="40" rx="8" fill="white" />
          <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily="sans-serif">
            <tspan fill="#4285F4">G</tspan>
          </text>
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl mx-auto"
    >
      {items.map((item) => (
        <motion.a
          key={item.platform}
          href={item.href || "#"}
          target={item.href ? "_blank" : undefined}
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.22)" }}
          transition={{ duration: 0.2 }}
          className="group flex flex-col gap-1.5 sm:gap-2.5 px-2 sm:px-5 pt-2.5 sm:pt-3.5 pb-2 sm:pb-3 rounded-2xl min-w-0 cursor-pointer"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          {/* Top row: logo + score */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="shrink-0 scale-75 sm:scale-100 origin-left">{item.logo}</div>
            <div className="min-w-0">
              <div className="text-[8px] sm:text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 leading-none mb-0.5 sm:mb-1">
                {item.platform}
              </div>
              <div className="flex flex-col gap-0.5 sm:gap-1 items-center">
                <span className="text-base sm:text-2xl font-extrabold leading-none" style={{ color: item.accent }}>
                  {item.score}
                </span>
                <Stars count={item.stars} accent={item.accent} />
              </div>
              <div className="text-[8px] sm:text-[10px] text-white/40 mt-0.5 sm:mt-1 leading-none">
                {item.count && <span className="text-white/60 font-medium mr-1">{item.count}</span>}
                <span className="hidden sm:inline">Recensioni verificate</span>
                <span className="sm:hidden">rec.</span>
              </div>
            </div>
          </div>

          {/* CTA bar */}
          <div
            className="flex items-center justify-between gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <span className="text-[8px] sm:text-[10px] font-semibold tracking-[0.1em] sm:tracking-[0.12em] uppercase text-white/50 group-hover:text-white/80 transition-colors duration-200 hidden sm:block">
              Leggi le recensioni
            </span>
            <span className="text-[8px] font-semibold uppercase text-white/50 group-hover:text-white/80 transition-colors duration-200 sm:hidden">
              Leggi
            </span>
            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/35 group-hover:text-white/70 transition-colors duration-200 shrink-0" />
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
