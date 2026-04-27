"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Clock } from "lucide-react";

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
                  {(() => {
                    const desc = t("checkin.description");
                    if (desc.trim().startsWith("<")) {
                      return <div className="html-content text-stitch-on-surface/70 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />;
                    }
                    return desc.split("\n").map((line: string, i: number) => (
                      <p key={i} className="text-stitch-on-surface/70 text-base leading-relaxed">{line}</p>
                    ));
                  })()}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
