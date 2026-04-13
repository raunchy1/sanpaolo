"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;

function FAQItem({
  questionKey,
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  questionKey: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`border-b border-roman-sand/40 last:border-0 transition-colors duration-300 ${
        isOpen ? "bg-roman-warm-white/50" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 md:py-6 px-1 text-left group"
      >
        <span className="font-display text-base md:text-lg font-semibold text-roman-espresso pr-4 group-hover:text-roman-terracotta transition-colors duration-300">
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-roman-terracotta/10 rotate-180" : "bg-roman-cream"
        }`}>
          <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
            isOpen ? "text-roman-terracotta" : "text-roman-stone"
          }`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 md:pb-6 text-muted-foreground leading-relaxed pr-12 px-1">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-32 bg-roman-warm-white" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-roman-terracotta font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            Info
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-roman-espresso mb-4 tracking-roman">
            {t("faq.title")}
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-sm border border-roman-sand/40 p-6 md:p-8"
        >
          {faqKeys.map((key, index) => (
            <FAQItem
              key={key}
              questionKey={key}
              question={t(`faq.${key}.question`)}
              answer={t(`faq.${key}.answer`)}
              isOpen={openIndex === key}
              onToggle={() =>
                setOpenIndex(openIndex === key ? null : key)
              }
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
