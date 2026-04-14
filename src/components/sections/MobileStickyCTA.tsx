"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei prenotare San Paolo Hideout.")}`;
const AIRBNB_LINK = "https://www.airbnb.com.ro/rooms/1517964247980793952?unique_share_id=d7fecbe5-b751-40f5-a115-83c02ad481fa&viralityEntryPoint=1&s=76&source_impression_id=p3_1776174940_P3vjFjX5W4f5k4KO";
const BOOKING_LINK = "https://booking.com/hotel/it/san-paolo-hideout-roma.ro.html";
const VRBO_LINK = "https://www.vrbo.com/it-it/affitto-vacanze/p11976038";

function AirbnbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.243 2 7 4.243 7 7c0 1.107.34 2.136.92 2.985-.58.85-.92 1.878-.92 2.985 0 1.38.47 2.65 1.257 3.665-.787 1.015-1.257 2.285-1.257 3.665C6.5 21.38 8.99 23 12 23s5.5-1.62 5.5-5.36c0-1.38-.47-2.65-1.257-3.665.787-1.015 1.257-2.285 1.257-3.665 0-1.107-.34-2.136-.92-2.985.58-.85.92-1.878.92-2.985 0-2.757-2.243-5-5-5zm0 14.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58zm0-5.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58zm0-5.27c-1.21 0-2.27-.63-2.89-1.58.62-.95 1.68-1.58 2.89-1.58s2.27.63 2.89 1.58c-.62.95-1.68 1.58-2.89 1.58z"/>
    </svg>
  );
}

function BookingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm4 2v2h2V8H6zm0 4v2h2v-2H6zm0 4v2h2v-2H6zm4-8v2h8V8h-8zm0 4v2h8v-2h-8zm0 4v2h5v-2h-5z"/>
    </svg>
  );
}

function VrboIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l-9.53 6.63a.75.75 0 0 0 .43 1.37H4v8h3v-6h2v6h3v-8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V20h3v-6h2v6h3v-8h1.1a.75.75 0 0 0 .43-1.37L12 2z"/>
    </svg>
  );
}

export default function MobileStickyCTA() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 700);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return null;

  const buttons = [
    {
      key: "whatsapp",
      href: WHATSAPP_LINK,
      bg: "bg-roman-whatsapp hover:bg-[#20BD5A]",
      text: "text-white",
      icon: MessageCircle,
      label: t("mobileCta.whatsapp"),
      badge: t("mobileCta.bestRate"),
      shadow: "shadow-green-900/20",
      width: "min-w-[11.5rem]",
    },
    {
      key: "airbnb",
      href: AIRBNB_LINK,
      bg: "bg-[#FF5A5F] hover:bg-[#E0484D]",
      text: "text-white",
      icon: AirbnbIcon,
      label: "Airbnb",
      shadow: "shadow-rose-900/15",
      width: "min-w-[8.5rem]",
    },
    {
      key: "booking",
      href: BOOKING_LINK,
      bg: "bg-[#003B95] hover:bg-[#002F77]",
      text: "text-white",
      icon: BookingIcon,
      label: "Booking",
      shadow: "shadow-blue-900/15",
      width: "min-w-[9.5rem]",
    },
    {
      key: "vrbo",
      href: VRBO_LINK,
      bg: "bg-[#1D2D3C] hover:bg-[#14202B]",
      text: "text-white",
      icon: VrboIcon,
      label: "VRBO",
      shadow: "shadow-slate-900/15",
      width: "min-w-[8rem]",
    },
  ];

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/[0.98] backdrop-blur-xl border-t border-roman-sand/30 shadow-[0_-8px_30px_rgba(61,43,31,0.08)] safe-area-bottom"
        >
          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-3.5 right-4 w-7 h-7 rounded-full bg-white shadow-md border border-roman-sand/40 text-roman-espresso/60 flex items-center justify-center hover:bg-roman-cream transition-colors"
            aria-label={t("mobileCta.close")}
          >
            <X className="w-3 h-3" />
          </button>

          {/* Swipeable bar */}
          <div
            ref={scrollRef}
            className="flex gap-2.5 px-4 py-3.5 overflow-x-auto scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {buttons.map(({ key, href, bg, text, icon: Icon, label, badge, shadow, width }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${width} flex-shrink-0 flex items-center justify-center gap-2 ${bg} ${text} py-3.5 rounded-2xl font-semibold text-[15px] transition-all duration-200 active:scale-[0.98] touch-feedback shadow-lg ${shadow}`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {badge && (
                  <span className="ml-0.5 inline-flex items-center text-[11px] font-medium opacity-95 bg-white/20 px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Trust line */}
          <div className="px-4 pb-3 -mt-1">
            <p className="text-[11px] text-roman-espresso/50 text-center tracking-wide">
              {t("mobileCta.trust")}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
