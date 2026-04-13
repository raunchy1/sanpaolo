"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Church, Landmark, Building2, GraduationCap, Wine, Plane, MapPin } from "lucide-react";

const locationItems = [
  { key: "basilica", icon: Church, accent: "from-roman-terracotta/10 to-roman-terracotta/5" },
  { key: "colosseo", icon: Landmark, accent: "from-roman-gold/10 to-roman-gold/5" },
  { key: "eur", icon: Building2, accent: "from-roman-olive/10 to-roman-olive/5" },
  { key: "romaTre", icon: GraduationCap, accent: "from-roman-terracotta-light/10 to-roman-terracotta-light/5" },
  { key: "ostiense", icon: Wine, accent: "from-roman-gold-light/10 to-roman-gold-light/5" },
  { key: "fiumicino", icon: Plane, accent: "from-roman-olive/10 to-roman-olive/5" },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export default function Location() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-roman-warm-white" id="location">
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
            Neighborhood
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-roman-espresso mb-4 tracking-roman">
            {t("location.title")}
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            {t("location.subtitle")}
          </p>
        </motion.div>

        {/* Location Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {locationItems.map(({ key, icon: Icon, accent }) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-roman-sand/40 hover:shadow-xl hover:shadow-roman-shadow hover:border-roman-terracotta/10 transition-all duration-400 premium-card-hover overflow-hidden"
            >
              {/* Accent gradient bg */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accent} rounded-bl-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-roman-cream/80 flex items-center justify-center group-hover:bg-roman-terracotta/10 transition-colors duration-400">
                  <Icon className="w-5.5 h-5.5 text-roman-terracotta" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-lg font-semibold text-roman-espresso">
                      {t(`location.${key}.title`)}
                    </h3>
                    <span className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-full bg-roman-cream text-roman-terracotta tracking-wide">
                      {t(`location.${key}.time`)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`location.${key}.desc`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="mt-14 rounded-3xl overflow-hidden shadow-xl border border-roman-sand/40"
        >
          <div className="aspect-[16/7] bg-roman-cream relative">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=12.4550%2C41.8400%2C12.4900%2C41.8650&layer=mapnik&marker=41.8553%2C12.4734"
              className="w-full h-full border-0"
              loading="lazy"
              title="San Paolo Hideout Location"
            />
            {/* Map overlay label */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-md flex items-center gap-2">
              <MapPin className="w-4 h-4 text-roman-terracotta" />
              <span className="text-sm font-semibold text-roman-espresso">San Paolo Hideout</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
