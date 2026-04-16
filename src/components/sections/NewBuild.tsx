"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Zap, Thermometer, Volume2, Leaf, LayoutGrid, Package, ShieldCheck } from "lucide-react";

const features = [
  { key: "systems", icon: Zap },
  { key: "thermal", icon: Thermometer },
  { key: "comfort", icon: Volume2 },
  { key: "energy", icon: Leaf },
  { key: "modern", icon: LayoutGrid },
  { key: "materials", icon: Package },
  { key: "security", icon: ShieldCheck },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function NewBuild() {
  const { t } = useTranslation();

  return (
    <section
      className="py-20 md:py-32 relative overflow-hidden"
      id="newbuild"
      style={{ background: "linear-gradient(160deg, #1a3a28 0%, #2E6B4A 50%, #1D4D35 100%)" }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Glow accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-stitch-green/[0.15] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-stitch-gold/[0.06] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-lg bg-white/10 backdrop-blur-sm mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-stitch-gold animate-pulse" />
            <span className="font-label text-[10px] text-white/85 tracking-[0.28em] uppercase">
              {t("newbuild.badge")}
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light italic text-white mb-6 leading-[1.1] max-w-3xl mx-auto">
            {t("newbuild.title")}
          </h2>
          <p className="font-body text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            {t("newbuild.subtitle")}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {features.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="group relative bg-white/[0.07] backdrop-blur-sm border border-white/[0.1] rounded-2xl p-5 md:p-6 hover:bg-white/[0.12] hover:border-white/[0.2] transition-all duration-400"
            >
              {/* Gold top accent line */}
              <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-stitch-gold/40 to-transparent" />

              <div className="w-11 h-11 rounded-xl bg-stitch-gold/15 flex items-center justify-center mb-4 group-hover:bg-stitch-gold/25 transition-colors duration-300">
                <Icon className="w-5 h-5 text-stitch-gold" />
              </div>
              <h3 className="font-label text-xs tracking-wider uppercase text-white/75 mb-1.5 leading-snug">
                {t(`newbuild.features.${key}.title`)}
              </h3>
              <p className="font-body text-white/45 text-xs leading-relaxed">
                {t(`newbuild.features.${key}.desc`)}
              </p>
            </motion.div>
          ))}

          {/* Trust card — span full on last row if odd */}
          <motion.div
            variants={itemVariants}
            className="group col-span-2 sm:col-span-3 lg:col-span-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
          >
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-stitch-gold/15 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-stitch-gold" />
            </div>
            <div>
              <p className="text-white font-display text-base font-semibold mb-1">
                {t("newbuild.cert.title")}
              </p>
              <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                {t("newbuild.cert.desc")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
