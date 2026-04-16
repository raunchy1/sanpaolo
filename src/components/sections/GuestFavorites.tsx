"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MapPin, Sparkles, TreePine, Train, MessageCircle, Users } from "lucide-react";

const features = [
  { key: "position", icon: MapPin, score: "5.0" },
  { key: "cleanliness", icon: Sparkles, score: "5.0" },
  { key: "garden", icon: TreePine, score: "5.0" },
  { key: "metro", icon: Train, score: "5.0" },
  { key: "communication", icon: MessageCircle, score: "5.0" },
  { key: "family", icon: Users, score: "5.0" },
] as const;

export default function GuestFavorites() {
  const { t } = useTranslation();

  return (
    <section className="section-luxury bg-stitch-ivory">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-4">
            Gli Ospiti Apprezzano
          </span>
          <h2 className="heading-luxury mb-4">
            {t("guestFavorites.title")}
          </h2>
          <p className="paragraph-luxury mx-auto text-center">
            {t("guestFavorites.subtitle")}
          </p>
        </motion.div>

        {/* Cards Grid — tonal layering, no hard borders */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-xl p-5 md:p-6 text-center group cursor-default hover:bg-[#FFF1EA] transition-colors duration-400"
                style={{ boxShadow: "0 2px 16px -4px rgba(41,23,13,0.06)" }}
              >
                <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-[#EEF3EF] flex items-center justify-center group-hover:bg-stitch-green/10 transition-colors duration-300">
                  <Icon className="w-4.5 h-4.5 text-stitch-green" />
                </div>
                <h3 className="font-label text-[11px] tracking-wider uppercase text-stitch-on-surface/60 mb-2 leading-tight">
                  {t(`guestFavorites.${feature.key}`)}
                </h3>
                <div className="flex items-center justify-center gap-0.5">
                  <span className="text-stitch-gold text-sm">★</span>
                  <span className="font-display text-base font-semibold text-stitch-green">
                    {feature.score}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}