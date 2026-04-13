"use client";

import { motion } from "framer-motion";
import { useTranslation, Locale } from "@/lib/i18n";
import { MapPin, Phone, Mail, Globe, Heart, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";

export default function Footer() {
  const { t, locale, setLocale } = useTranslation();

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <footer className="bg-roman-espresso text-white/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-roman">
              San Paolo Hideout
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-roman-terracotta-light" />
              <span>{t("footer.address")}</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white/90 mb-5 tracking-wide uppercase">
              Contatti
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/50 hover:text-roman-whatsapp transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-roman-whatsapp/10 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  {t("footer.whatsapp")}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@sanpaolohideout.com"
                  className="flex items-center gap-2.5 text-white/50 hover:text-roman-gold-light transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-roman-gold/10 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  {t("footer.email")}
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=41.8553,12.4734"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/50 hover:text-roman-terracotta-light transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-roman-terracotta/10 transition-colors">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  {t("footer.map")}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white/90 mb-5 tracking-wide uppercase">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {[
                { key: "home", href: "#home" },
                { key: "rooms", href: "#rooms" },
                { key: "location", href: "#location" },
                { key: "reviews", href: "#reviews" },
                { key: "faq", href: "#faq" },
              ].map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="text-white/50 hover:text-roman-gold-light transition-colors text-sm inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-roman-gold-light transition-all duration-300" />
                    {t(`nav.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Language */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white/90 mb-5 tracking-wide uppercase flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              {t("footer.language")}
            </h4>
            <div className="flex flex-col gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-2.5 ${
                    locale === lang.code
                      ? "bg-roman-terracotta/20 text-roman-terracotta-light font-semibold border border-roman-terracotta/20"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-roman-terracotta fill-roman-terracotta" />
            <span>in Roma</span>
          </div>
          <div className="flex gap-5">
            <a
              href="#"
              className="text-white/30 hover:text-white/60 transition-colors text-xs"
            >
              {t("footer.legal")}
            </a>
            <a
              href="#"
              className="text-white/30 hover:text-white/60 transition-colors text-xs"
            >
              {t("footer.cookies")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
