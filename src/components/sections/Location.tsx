"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  Church,
  Landmark,
  Building2,
  GraduationCap,
  Train,
  Plane,
  ChevronDown,
  Shield,
  Hospital,
  Car,
} from "lucide-react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const mainItems = [
  { key: "forteostiense", icon: Shield },
  { key: "bambinogesu", icon: Hospital },
  { key: "basilica", icon: Church },
  { key: "palazzosport", icon: Building2 },
  { key: "ostiense", icon: Train },
  { key: "romaTre", icon: GraduationCap },
  { key: "colosseoquad", icon: Landmark },
  { key: "fiumicino", icon: Plane },
] as const;

const expandedKeys = [
  "metro",
  "colosseo",
  "fao",
  "sancamillo",
  "ciampino",
  "luneur",
  "cinecittaworld",
  "euroma2",
  "maximo",
  "castelromano",
  "eataly",
  "macro",
  "eur",
  "palazzocongressi",
  "lanuvola",
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

const expandVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const expandItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function Location() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-20 md:py-32 bg-stitch-ivory" id="location">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-5">
            {t("location.eyebrow")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-stitch-green leading-[1.1] mb-4">
            {t("location.title")}
          </h2>
          <p className="font-body text-stitch-on-surface/55 text-base max-w-lg mx-auto leading-relaxed">
            {t("location.subtitle")}
          </p>
        </motion.div>

        {/* Main Location Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
        >
          {mainItems.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-5 md:p-6 hover:bg-[#FFF1EA] transition-all duration-300 overflow-hidden"
              style={{ boxShadow: "0 2px 16px -4px rgba(41,23,13,0.06)" }}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-stitch-green/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" />

              <div className="relative flex items-start gap-3.5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-stitch-olive-light/60 flex items-center justify-center group-hover:bg-stitch-green/15 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-stitch-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-display text-sm md:text-base font-semibold text-stitch-on-surface leading-snug">
                      {t(`location.${key}.title`)}
                    </h3>
                    <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stitch-green/10 text-stitch-green tracking-wide">
                      {t(`location.${key}.time`)}
                    </span>
                  </div>
                  <p className="text-xs text-stitch-on-surface/55 leading-relaxed">
                    {t(`location.${key}.desc`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Expand Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-lg bg-stitch-green text-white hover:bg-stitch-green-light font-label text-[11px] tracking-widest uppercase transition-all duration-300 hover:scale-[1.02]"
          >
            {expanded ? t("location.showLess") : t("location.showMore")}
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        {/* Expanded POIs */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
              className="overflow-hidden"
            >
              <motion.div
                variants={expandVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mt-6"
              >
                {expandedKeys.map((key) => (
                  <motion.div
                    key={key}
                    variants={expandItemVariants}
                    className="group bg-white rounded-xl p-4 hover:bg-[#FFF1EA] transition-all duration-250 flex items-start gap-3"
                    style={{ boxShadow: "0 1px 8px -2px rgba(41,23,13,0.05)" }}
                  >
                    <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-stitch-olive-light/50 flex items-center justify-center group-hover:bg-stitch-green/10 transition-colors duration-300">
                      <Car className="w-3.5 h-3.5 text-stitch-green" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-stitch-on-surface leading-snug mb-0.5">
                        {t(`location.expanded.${key}.title`)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-stitch-on-surface/50">
                          {t(`location.expanded.${key}.distance`)}
                        </span>
                        <span className="text-[10px] text-stitch-on-surface/30">•</span>
                        <span className="text-[10px] font-medium text-stitch-green">
                          {t(`location.expanded.${key}.time`)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="mt-14 overflow-hidden rounded-2xl"
          style={{ boxShadow: "0 8px 40px -12px rgba(41,23,13,0.10)" }}
        >
          <div className="aspect-[16/7] min-h-[320px] bg-stitch-olive-light/20 relative w-full">
            <Map />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
