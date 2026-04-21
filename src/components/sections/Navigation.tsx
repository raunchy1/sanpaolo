"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, Locale } from "@/lib/i18n";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";

const navItems = [
  { key: "home", href: "#home" },
  { key: "lacasa", href: "#lacasa" },
  { key: "galleria", href: "#rooms" },
  { key: "amenities", href: "#amenities" },
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
  const { whatsapp } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const WHATSAPP_LINK = `https://wa.me/${whatsapp}?text=${encodeURIComponent(t("common.whatsapp.inquiry"))}`;

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
             ? "glass shadow-ambient"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center py-3">
              <Image
                src="/logo-green.png"
                alt="San Paolo Hideout"
                width={200}
                height={67}
                priority
                className={`h-16 md:h-[72px] w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${
                  !scrolled ? "brightness-[1.15] contrast-125" : ""
                }`}
              />
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  className={`font-display italic text-lg transition-colors duration-300 hover:text-stitch-bronze ${
                    scrolled ? "text-stitch-on-surface/70" : "text-white/75"
                  }`}
                >
                  {t(`nav.${key}`)}
                </a>
              ))}

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1.5 text-[13px] font-medium tracking-wide transition-colors duration-300 hover:text-stitch-green font-body ${
                    scrolled ? "text-stitch-on-surface-muted" : "text-white/70"
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
                      className="absolute right-0 top-full mt-3 bg-white rounded-editorial shadow-ambient overflow-hidden min-w-[150px]"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocale(lang.code);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-5 py-3 text-sm text-left transition-colors font-body ${
                            locale === lang.code
                              ? "bg-stitch-ivory-warm text-stitch-green font-semibold"
                              : "text-stitch-on-surface hover:bg-stitch-surface"
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
                className="inline-flex items-center gap-2 bg-stitch-green hover:bg-stitch-green-light text-white px-7 py-2.5 rounded-lg font-label text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02]"
              >
                {t("nav.bookNow")}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`p-2.5 rounded-editorial transition-colors ${
                  scrolled
                    ? "text-stitch-on-surface hover:bg-stitch-surface"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Globe className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  document.body.style.overflow = !menuOpen ? "hidden" : "";
                }}
                className={`p-2.5 rounded-editorial transition-colors ${
                  scrolled
                    ? "text-stitch-on-surface hover:bg-stitch-surface"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="fixed top-16 right-4 z-50 bg-white rounded-editorial shadow-ambient overflow-hidden min-w-[150px] md:hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setLangOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-5 py-3.5 text-sm text-left transition-colors font-body ${
                  locale === lang.code
                    ? "bg-stitch-ivory-warm text-stitch-green font-semibold"
                    : "text-stitch-on-surface hover:bg-stitch-surface"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                {t(`languageSwitcher.${lang.code}`)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Bottom Sheet */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={handleNavClick}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-[2rem] shadow-ambient-lg md:hidden safe-area-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-stitch-surface-dim" />
              </div>

              <div className="px-6 pb-8 pt-2">
                <nav className="flex flex-col gap-1 mb-6">
                  {navItems.map(({ key, href }, i) => (
                    <motion.a
                      key={key}
                      href={href}
                      onClick={handleNavClick}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-4 py-3.5 rounded-editorial text-stitch-on-surface font-display italic text-xl hover:bg-stitch-surface transition-colors flex items-center justify-between group"
                    >
                      {t(`nav.${key}`)}
                      <span className="text-stitch-on-surface-muted group-hover:text-stitch-green transition-colors text-sm">→</span>
                    </motion.a>
                  ))}
                </nav>

                <div className="flex gap-2 mb-6">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setLangOpen(false);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-editorial text-sm font-medium transition-all font-body ${
                        locale === lang.code
                          ? "bg-stitch-green text-stitch-ivory shadow-glow-green"
                          : "bg-stitch-surface text-stitch-on-surface hover:bg-stitch-ivory-warm"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {t(`languageSwitcher.${lang.code}`)}
                    </button>
                  ))}
                </div>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2.5 bg-stitch-green hover:bg-stitch-green-light text-white w-full py-4 rounded-lg font-label text-xs tracking-widest uppercase transition-all duration-300 shadow-ambient"
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
