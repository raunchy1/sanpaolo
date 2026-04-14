"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviewKeys = [
  "review1",
  "review2",
  "review3",
  "review4",
  "review5",
  "review6",
] as const;

const categoryKeys = [
  "location",
  "cleanliness",
  "garden",
  "metro",
  "communication",
  "family",
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
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
};

export default function Reviews() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviewKeys.length / reviewsPerPage);

  const currentReviews = reviewKeys.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  return (
    <section className="py-20 md:py-32 bg-white" id="reviews">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
          className="text-center mb-6"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-roman-terracotta font-semibold mb-3">
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-roman-espresso mb-4 tracking-roman">
            {t("reviews.title")}
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            {t("reviews.subtitle")}
          </p>
        </motion.div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-4 bg-roman-warm-white rounded-2xl px-8 py-4 border border-roman-sand/40">
            <span className="font-display text-4xl font-bold text-roman-espresso">
              {t("reviews.overallRating")}
            </span>
            <div className="flex flex-col items-start gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4.5 h-4.5 text-roman-gold fill-roman-gold"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {t("reviews.totalReviews")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Rating Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-14"
        >
          {categoryKeys.map((key) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className="text-center p-3 md:p-4 rounded-2xl bg-roman-warm-white border border-roman-sand/30"
            >
              <p className="text-[11px] text-muted-foreground mb-1.5 uppercase tracking-wider">
                {t(`reviews.categories.${key}`)}
              </p>
              <p className="font-display text-xl font-bold text-roman-espresso">
                5.0
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Review Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {currentReviews.map((key) => {
              const rating = parseFloat(t(`reviews.${key}.rating`));
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
                  className="bg-roman-warm-white rounded-2xl p-6 md:p-8 shadow-sm border border-roman-sand/40 hover:shadow-lg hover:shadow-roman-shadow hover:border-roman-terracotta/10 transition-all duration-400"
                >
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(rating)
                              ? "text-roman-gold fill-roman-gold"
                              : "text-roman-sand"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-roman-espresso">
                      {t(`reviews.${key}.rating`)}
                    </span>
                  </div>

                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-roman-sand/50 mb-3 fill-roman-sand/20" />

                  {/* Review Text */}
                  <p className="text-roman-espresso/80 leading-relaxed mb-6 text-[15px]">
                    &ldquo;{t(`reviews.${key}.text`)}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-5 border-t border-roman-sand/40">
                    <div>
                      <p className="font-display font-semibold text-roman-espresso text-sm">
                        {t(`reviews.${key}.name`)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t(`reviews.${key}.location`)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {t(`reviews.${key}.date`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-5 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-2.5 rounded-full hover:bg-roman-cream disabled:opacity-25 transition-colors touch-feedback"
            >
              <ChevronLeft className="w-5 h-5 text-roman-espresso" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`rounded-full transition-all duration-400 ${
                    i === currentPage
                      ? "bg-roman-terracotta w-9 h-2.5"
                      : "w-2.5 h-2.5 bg-roman-sand hover:bg-roman-stone"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="p-2.5 rounded-full hover:bg-roman-cream disabled:opacity-25 transition-colors touch-feedback"
            >
              <ChevronRight className="w-5 h-5 text-roman-espresso" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
