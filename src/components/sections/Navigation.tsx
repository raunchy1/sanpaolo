"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, Locale } from "@/lib/i18n";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

const WHATSAPP_NUMBER = "393401234567";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao! Vorrei informazioni su San Paolo Hideout.")}`;

const navItems = [
  { key: "home", href: "#home" },
  { key: "rooms", href: "#rooms" },
  { key: "location", href: "#location" },
  { key: "reviews", href: "#reviews" },
  { key: "faq", href: "#faq" },
] as const;

const languages: { code: Locale; flag: string }[] = [
  { code: "it", flag: "🇮🇹" },
  { code: "en", flag: "🇬🇧" },
  { code: "de", flag: "🇩🇪" },
];

export default function Navigation() {
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
             ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_0_#3B82F6] border-b-2 border-roman-terracotta"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#home"
              className={`font-display text-xl md:text-2xl font-bold transition-colors duration-300 tracking-roman ${
                scrolled ? "text-roman-espresso" : "text-white"
              }`}
            >
              San Paolo Hideout
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {navItems.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  className={`text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 hover:text-roman-terracotta ${
                    scrolled ? "text-roman-espresso/60" : "text-white/70"
                  }`}
                >
                  {t(`nav.${key}`)}
                </a>
              ))}

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1.5 text-[13px] font-medium tracking-wide transition-colors duration-300 hover:text-roman-terracotta ${
                    scrolled ? "text-roman-espresso/60" : "text-white/70"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang?.flag}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 bg-white rounded-2xl shadow-xl border border-roman-sand/40 overflow-hidden min-w-[150px]"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocale(lang.code);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-5 py-3 text-sm text-left transition-colors ${
                            locale === lang.code
                              ? "bg-roman-cream/80 text-roman-terracotta font-semibold"
                              : "text-roman-espresso hover:bg-roman-warm-white"
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          {t(`languageSwitcher.${lang.code}`)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Book Now CTA */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-roman-whatsapp hover:bg-[#20BD5A] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-md hover:shadow-green-900/10"
              >
                {t("nav.bookNow")}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile Language */}
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`p-2.5 rounded-xl transition-colors ${
                  scrolled
                    ? "text-roman-espresso hover:bg-roman-cream"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Globe className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  document.body.style.overflow = !menuOpen ? "hidden" : "";
                }}
                className={`p-2.5 rounded-xl transition-colors ${
                  scrolled
                    ? "text-roman-espresso hover:bg-roman-cream"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Language Dropdown */}
      <AnimatePresence>
        {langOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 z-50 bg-white rounded-2xl shadow-xl border border-roman-sand/40 overflow-hidden min-w-[150px] md:hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setLangOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-5 py-3.5 text-sm text-left transition-colors ${
                  locale === lang.code
                    ? "bg-roman-cream/80 text-roman-terracotta font-semibold"
                    : "text-roman-espresso hover:bg-roman-warm-white"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                {t(`languageSwitcher.${lang.code}`)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Bottom Sheet Style */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={handleNavClick}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl md:hidden safe-area-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-roman-sand" />
              </div>

              <div className="px-6 pb-8 pt-2">
                {/* Nav Items */}
                <nav className="flex flex-col gap-1 mb-6">
                  {navItems.map(({ key, href }, i) => (
                    <motion.a
                      key={key}
                      href={href}
                      onClick={handleNavClick}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-4 py-3.5 rounded-xl text-roman-espresso font-medium text-lg hover:bg-roman-cream transition-colors flex items-center justify-between group"
                    >
                      {t(`nav.${key}`)}
                      <span className="text-roman-sand group-hover:text-roman-terracotta transition-colors text-sm">→</span>
                    </motion.a>
                  ))}
                </nav>

                {/* Language Row */}
                <div className="flex gap-2 mb-6">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setLangOpen(false);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        locale === lang.code
                          ? "bg-roman-terracotta text-white shadow-md"
                          : "bg-roman-cream text-roman-espresso hover:bg-roman-sand"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {t(`languageSwitcher.${lang.code}`)}
                    </button>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2.5 bg-roman-whatsapp hover:bg-[#20BD5A] text-white w-full py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg touch-feedback"
                >
                  {t("nav.bookNow")}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
