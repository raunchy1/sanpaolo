"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Phone, MessageCircle } from "lucide-react";

const PHONE_NUMBER = "+393299362759";
const WHATSAPP_NUMBER = "393299362759";
const PHONE_LINK = `tel:${PHONE_NUMBER}`;
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei prenotare San Paolo Hideout.")}`;

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
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: "rgba(255, 248, 245, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 -8px 32px -4px rgba(41,23,13,0.08)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <div className="flex gap-3 px-4 pt-3.5 pb-3">
            {/* Chiama */}
            <a
              href={PHONE_LINK}
              className="flex-1 flex items-center justify-center gap-2 bg-stitch-green hover:bg-stitch-green-light text-white py-3.5 rounded-lg font-label text-[10px] tracking-widest uppercase transition-all duration-200 active:scale-[0.98]"
              style={{ boxShadow: "0 4px 16px -4px rgba(7,35,22,0.25)" }}
            >
              <Phone className="w-4 h-4" />
              <span>{t("mobileCta.call")}</span>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-stitch-green hover:bg-stitch-green-light text-white py-3.5 rounded-lg font-label text-[10px] tracking-widest uppercase transition-all duration-200 active:scale-[0.98]"
              style={{ boxShadow: "0 4px 16px -4px rgba(7,35,22,0.25)" }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Trust line */}
          <div className="px-4 pb-2 -mt-0.5">
            <p className="text-[11px] text-stitch-green font-semibold text-center tracking-wide flex items-center justify-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-stitch-green inline-block" />
              {t("mobileCta.bestPrice")}
              <span className="w-1 h-1 rounded-full bg-stitch-green inline-block" />
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}