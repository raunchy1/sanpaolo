"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Clock, UserCheck, Key } from "lucide-react";

const features = [
  { key: "flexible", icon: Clock },
  { key: "human", icon: UserCheck },
  { key: "self", icon: Key },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function CheckIn() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28 bg-stitch-ivory" id="checkin">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="rounded-[28px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FFF1EA 0%, #EEF3EF 100%)",
            boxShadow: "0 8px 48px -16px rgba(41,23,13,0.08)",
          }}
        >
          <div className="p-8 md:p-12 lg:p-14">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 mb-10">
              {/* Icon */}
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-stitch-green flex items-center justify-center shadow-lg shadow-stitch-green/20">
                <Clock className="w-7 h-7 text-white" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <span className="inline-block text-xs tracking-[0.2em] uppercase text-stitch-green font-semibold mb-2">
                  Accoglienza
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-stitch-on-surface mb-5 leading-tight">
                  {t("checkin.title")}
                </h2>
                <div className="space-y-1.5">
                  {t("checkin.description").split("\n").map((line: string, i: number) => (
                    <p key={i} className="text-stitch-on-surface/70 text-base leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider — ghost suggestion only */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-stitch-on-surface/8 to-transparent mb-10" />

            {/* Feature cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5"
            >
              {features.map(({ key, icon: Icon }) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className="group relative bg-white/70 rounded-2xl p-6 hover:bg-white transition-all duration-300"
                  style={{ boxShadow: "0 2px 20px -6px rgba(41,23,13,0.06)" }}
                >
                  {/* Subtle green top accent */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-stitch-green/30 to-transparent rounded-full" />

                  <div className="w-11 h-11 rounded-xl bg-stitch-green/10 flex items-center justify-center mb-4 group-hover:bg-stitch-green/15 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-stitch-green" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-stitch-on-surface mb-1.5">
                    {t(`checkin.features.${key}.title`)}
                  </h3>
                  <p className="text-sm text-stitch-on-surface/55 leading-relaxed">
                    {t(`checkin.features.${key}.desc`)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
