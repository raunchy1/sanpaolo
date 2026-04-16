"use client";

import { motion } from "framer-motion";
import { useTranslation, Locale } from "@/lib/i18n";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  ExternalLink,
  Train,
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const PHONE_NUMBER = "+393299362759";
const WHATSAPP_NUMBER = "393299362759";
const MAPS_LINK = "https://maps.google.com/?q=Via+Silvio+D'Amico+96,+00145+Roma";
const INSTAGRAM_LINK = "https://www.instagram.com/casavacanze_sanpaolohideout/";

const LEGAL = {
  prot: "QA/2025/66178 del 11/07/2025",
  cin: "IT058091C2OS2A4EP2",
  cir: "058091-CAV-15649",
};

const serviceLinks = [
  { labelKey: "rooms", href: "#rooms" },
  { labelKey: "amenities", href: "#amenities" },
  { label: "Offerte Speciali", href: "#offers" },
  { labelKey: "faq", href: "#faq" },
  { labelKey: "location", href: "#location" },
  { label: "Prenota", href: "#booking" },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function Footer() {
  const { t, locale, setLocale } = useTranslation();

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: "it", label: "IT", flag: "🇮🇹" },
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "de", label: "DE", flag: "🇩🇪" },
  ];

  return (
    <footer
      className="text-white/80 mt-auto"
      style={{ background: "linear-gradient(180deg, #181818 0%, #111111 100%)" }}
    >
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-stitch-green/40 to-transparent" />

      {/* Award Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className=""
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Platform review badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Booking.com */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#003580] flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/30">
                  <span className="text-white font-bold text-sm leading-none">9.9</span>
                </div>
                <div>
                  <p className="text-white/50 text-[9px] font-label uppercase tracking-wider leading-none mb-0.5">Booking.com</p>
                  <p className="text-white text-xs font-semibold leading-tight">Eccellente</p>
                  <p className="text-white/35 text-[9px] mt-0.5">19 recensioni</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-7 bg-white/[0.08]" />

              {/* Airbnb */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A5F] flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/20">
                  <span className="text-white font-bold text-sm leading-none">5</span>
                </div>
                <div>
                  <p className="text-white/50 text-[9px] font-label uppercase tracking-wider leading-none mb-0.5">Airbnb</p>
                  <p className="text-white text-xs font-semibold leading-tight">★★★★★</p>
                  <p className="text-white/35 text-[9px] mt-0.5">8 recensioni</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-7 bg-white/[0.08]" />

              {/* Google */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm leading-none">5</span>
                </div>
                <div>
                  <p className="text-white/50 text-[9px] font-label uppercase tracking-wider leading-none mb-0.5">Google</p>
                  <p className="text-white text-xs font-semibold leading-tight">★★★★★</p>
                  <p className="text-white/35 text-[9px] mt-0.5">19 recensioni</p>
                </div>
              </div>
            </div>

            {/* Language switcher compact */}
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-white/35 shrink-0" />
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={`px-3 py-1.5 rounded-lg font-label text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center gap-1.5 ${
                      locale === lang.code
                        ? "bg-stitch-green/25 text-stitch-green"
                        : "text-white/35 hover:text-white/65 hover:bg-white/5"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
        >
          {/* ── Column 1: Brand ── */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo-green.png"
                alt="San Paolo Hideout"
                className="w-10 h-10 rounded-xl object-contain brightness-0 invert"
              />
              <div>
                <h3 className="font-display italic text-white text-xl leading-tight">
                  San Paolo Hideout
                </h3>
                <p className="font-label text-stitch-green text-[9px] tracking-[0.2em] uppercase mt-0.5">
                  Roma, Italia
                </p>
              </div>
            </div>

            <p className="text-white/45 text-sm leading-relaxed mb-7 max-w-[26ch]">
              {t("footer.description")}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-stitch-green/20 hover:border-stitch-green/30 transition-all duration-250"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei informazioni su San Paolo Hideout.")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-[#25D366]/15 hover:border-[#25D366]/25 transition-all duration-250"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                aria-label="Telefono"
                className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-stitch-green/20 hover:border-stitch-green/30 transition-all duration-250"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* ── Column 2: Esplora ── */}
          <motion.div variants={itemVariants}>
            <h4 className="font-label text-[9px] text-white/50 uppercase tracking-[0.28em] mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-stitch-green/40" />
              {t("footer.servicesTitle")}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/45 hover:text-white text-sm transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-stitch-green transition-all duration-300 shrink-0" />
                    {"labelKey" in link ? t(`nav.${link.labelKey}`) : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 3: Contatti ── */}
          <motion.div variants={itemVariants}>
            <h4 className="font-label text-[9px] text-white/50 uppercase tracking-[0.28em] mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-stitch-green/40" />
              {t("footer.contactsTitle")}
            </h4>
            <ul className="space-y-3.5">
              {/* Address */}
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stitch-green" />
                </div>
                <div>
                  <p className="text-white/55 text-sm leading-snug">Via Silvio d'Amico 96</p>
                  <p className="text-white/55 text-sm">00145 Roma</p>
                </div>
              </li>

              {/* Metro note */}
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                  <Train className="w-3.5 h-3.5 text-stitch-green" />
                </div>
                <p className="text-stitch-green/80 text-xs font-medium">
                  {t("footer.metroNote")}
                </p>
              </li>

              {/* Phone */}
              <li>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-3 text-white/45 hover:text-white transition-colors duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] group-hover:bg-stitch-green/15 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{PHONE_NUMBER}</span>
                </a>
              </li>

              {/* WhatsApp */}
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/45 hover:text-[#25D366] transition-colors duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] group-hover:bg-[#25D366]/10 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">WhatsApp</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:info@sanpaolohideout.it"
                  className="flex items-center gap-3 text-white/45 hover:text-white transition-colors duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] group-hover:bg-stitch-gold/10 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">info@sanpaolohideout.it</span>
                </a>
              </li>

              {/* Maps */}
              <li>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/45 hover:text-white transition-colors duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] group-hover:bg-red-500/10 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{t("footer.getDirections")}</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* ── Column 4: Licenze & Legale ── */}
          <motion.div variants={itemVariants}>
            <h4 className="font-label text-[9px] text-white/50 uppercase tracking-[0.28em] mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-stitch-green/40" />
              {t("footer.legalTitle")}
            </h4>

            {/* License data */}
            <div className="space-y-3 mb-7">
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06] space-y-2.5">
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-wider font-medium mb-0.5">
                    Protocollo
                  </p>
                  <p className="text-white/60 text-xs font-mono leading-snug">
                    n. {LEGAL.prot}
                  </p>
                </div>
                <div className="w-full h-px bg-white/[0.05]" />
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-wider font-medium mb-0.5">
                    CIN (Codice Identificativo Nazionale)
                  </p>
                  <p className="text-white/60 text-xs font-mono break-all">
                    {LEGAL.cin}
                  </p>
                </div>
                <div className="w-full h-px bg-white/[0.05]" />
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-wider font-medium mb-0.5">
                    CIR
                  </p>
                  <p className="text-white/60 text-xs font-mono">
                    {LEGAL.cir}
                  </p>
                </div>
              </div>
            </div>

            {/* Legal links */}
            <div className="flex flex-col gap-2">
              <a
                href="/privacy"
                className="text-white/35 hover:text-white/70 text-xs transition-colors duration-200 inline-flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-stitch-green/50" />
                {t("footer.legal")}
              </a>
              <a
                href="/cookie-policy"
                className="text-white/35 hover:text-white/70 text-xs transition-colors duration-200 inline-flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-stitch-green/50" />
                {t("footer.cookies")}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">
              {t("footer.copyright")}
            </p>
            <p className="text-white/20 text-xs text-center">
              Casa Vacanze · CIN {LEGAL.cin}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-stitch-green animate-pulse" />
              <span className="text-white/20 text-xs">sanpaolohideout.it</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
