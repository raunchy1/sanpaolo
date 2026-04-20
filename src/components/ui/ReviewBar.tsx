"use client";

import { motion } from "framer-motion";

const items = [
  {
    platform: "BOOKING.COM",
    score: "9/10",
    stars: 5,
    subtitle: "Recensioni verificate",
    accent: "#1a6fbb",
    bg: "#1a6fbb22",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden>
        <rect width="40" height="40" rx="8" fill="#1a6fbb" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="sans-serif">B</text>
      </svg>
    ),
  },
  {
    platform: "AIRBNB",
    score: "5/5",
    stars: 5,
    subtitle: "Recensioni verificate",
    accent: "#ff5a5f",
    bg: "#ff5a5f22",
    logo: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden>
        <rect width="40" height="40" rx="8" fill="#ff5a5f" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="sans-serif">Air</text>
      </svg>
    ),
  },
  {
    platform: "GOOGLE",
    score: "5/5",
    stars: 5,
    subtitle: "Recensioni verificate",
    accent: "#f5a623",
    bg: "#f5a62322",
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto"
    >
      {items.map((item) => (
        <motion.div
          key={item.platform}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl flex-1 min-w-0 w-full sm:w-auto"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          {/* Icon */}
          <div className="shrink-0">{item.logo}</div>

          {/* Text */}
          <div className="min-w-0">
            <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50 leading-none mb-1">
              {item.platform}
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl font-extrabold leading-none"
                style={{ color: item.accent }}
              >
                {item.score}
              </span>
              <Stars count={item.stars} accent={item.accent} />
            </div>
            <div className="text-[10px] text-white/40 mt-1 leading-none">
              {item.subtitle}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
