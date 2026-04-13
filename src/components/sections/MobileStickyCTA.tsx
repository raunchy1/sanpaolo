"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MessageCircle, Calendar, X } from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei informazioni su San Paolo Hideout.")}`;

export default function MobileStickyCTA() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 700);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  // Only show on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/[0.97] backdrop-blur-xl border-t border-roman-sand/40 shadow-[0_-8px_30px_rgba(61,43,31,0.08)] safe-area-bottom"
        >
          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-3.5 right-4 w-7 h-7 rounded-full bg-white shadow-md border border-roman-sand/40 text-roman-espresso/60 flex items-center justify-center hover:bg-roman-cream transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex gap-3 px-4 py-3.5">
            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-pulse flex-1 flex items-center justify-center gap-2.5 bg-roman-whatsapp hover:bg-[#20BD5A] text-white py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 touch-feedback shadow-lg shadow-green-900/15"
            >
              <MessageCircle className="w-5 h-5" />
              {t("mobileCta.whatsapp")}
            </a>

            {/* Availability CTA */}
            <a
              href="#booking"
              className="flex items-center justify-center gap-2 bg-roman-terracotta hover:bg-roman-terracotta-light text-white px-6 py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 touch-feedback"
            >
              <Calendar className="w-4.5 h-4.5" />
              {t("mobileCta.availability")}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
