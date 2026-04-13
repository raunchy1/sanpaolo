"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import {
  TreePine,
  KeyRound,
  Wifi,
  TrainFront,
  Baby,
  Briefcase,
  AirVent,
  GraduationCap,
} from "lucide-react";

const amenityKeys = [
  { key: "garden", icon: TreePine },
  { key: "checkin", icon: KeyRound },
  { key: "wifi", icon: Wifi },
  { key: "metro", icon: TrainFront },
  { key: "family", icon: Baby },
  { key: "business", icon: Briefcase },
  { key: "ac", icon: AirVent },
  { key: "university", icon: GraduationCap },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export default function Amenities() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-roman-warm-white" id="amenities">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-roman-terracotta font-semibold mb-3">
            Amenities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-roman-espresso mb-4 tracking-roman">
            {t("amenities.title")}
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            {t("amenities.subtitle")}
          </p>
        </motion.div>

        {/* Amenity Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {amenityKeys.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm border border-roman-sand/40 hover:shadow-xl hover:shadow-roman-shadow hover:border-roman-terracotta/15 transition-all duration-400 premium-card-hover"
            >
              {/* Subtle gradient bg on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-roman-terracotta/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-roman-cream/80 mb-5 group-hover:bg-roman-terracotta/10 transition-all duration-400 group-hover:scale-105">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-roman-terracotta" />
                </div>
                <h3 className="font-display text-base md:text-lg font-semibold text-roman-espresso mb-2">
                  {t(`amenities.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`amenities.${key}.desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
