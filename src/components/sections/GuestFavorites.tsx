"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MapPin, Sparkles, Trees, Train, MessageCircle, Users } from "lucide-react";

const categories = [
  { key: "position",      icon: MapPin },
  { key: "cleanliness",   icon: Sparkles },
  { key: "garden",        icon: Trees },
  { key: "metro",         icon: Train },
  { key: "communication", icon: MessageCircle },
  { key: "family",        icon: Users },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function GuestFavorites() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-stitch-ivory" id="guest-favorites">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-stitch-on-surface mb-3 leading-tight">
            {t("guestFavorites.title")}
          </h2>
          <p className="font-body text-stitch-on-surface/55 text-base">
            {t("guestFavorites.subtitle")}
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
        >
          {categories.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="bg-white rounded-2xl p-5 text-center flex flex-col items-center gap-3 hover:shadow-md transition-shadow duration-300"
              style={{ boxShadow: "0 2px 16px -4px rgba(41,23,13,0.06)" }}
            >
              <div className="w-11 h-11 rounded-xl bg-stitch-green/8 flex items-center justify-center">
                <Icon className="w-5 h-5 text-stitch-green/70" />
              </div>
              <p className="font-label text-[9px] tracking-[0.18em] uppercase text-stitch-on-surface/50 leading-tight">
                {t(`guestFavorites.${key}`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
