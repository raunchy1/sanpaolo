"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
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
      className={`transition-colors duration-300 rounded-xl px-2 ${isOpen ? "bg-[#FFF1EA]" : ""}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 md:py-6 px-2 text-left group"
      >
        <span className="font-display italic text-base md:text-lg text-stitch-on-surface pr-4 group-hover:text-stitch-green transition-colors duration-300">
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-stitch-green/10 rotate-180" : "bg-[#FFF1EA]"
        }`}>
          <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
            isOpen ? "text-stitch-green" : "text-stitch-on-surface/40"
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
            <div className="pb-5 md:pb-6 text-muted-foreground leading-relaxed pr-12 px-1 space-y-3">
              {answer.split("\n").map((line, i) =>
                line.trim() === "" ? null : <p key={i}>{line}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [items, setItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => {});
  }, []);

  // Fall back to i18n if no dynamic items loaded
  const faqItems: FaqItem[] = items.length > 0
    ? items
    : faqKeys.map((key) => ({
        id: key,
        question: t(`faq.${key}.question`),
        answer: t(`faq.${key}.answer`),
      }));

  return (
    <section className="py-20 md:py-32 bg-stitch-ivory-warm" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-14"
        >
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-5">
            Info
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-stitch-green mb-4 leading-[1.1]">
            {t("faq.title")}
          </h2>
          <p className="font-body text-stitch-on-surface/60 text-base max-w-md mx-auto leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-3xl p-6 md:p-8"
          style={{ boxShadow: "0 4px 32px -8px rgba(41,23,13,0.06)" }}
        >
          {faqItems.map((item, index) => (
            <FAQItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === item.id}
              onToggle={() => setOpenIndex(openIndex === item.id ? null : item.id)}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
