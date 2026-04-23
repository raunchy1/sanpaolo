"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("cookie_consent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
      role="dialog"
      aria-label="Consenso cookie"
    >
      <div
        className="max-w-3xl mx-auto rounded-2xl shadow-2xl px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          background: "rgba(7,35,22,0.97)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white/90 text-sm leading-relaxed">
            Utilizziamo solo cookie tecnici necessari al funzionamento del sito.
            Nessun tracciamento pubblicitario.{" "}
            <a
              href="/cookie-policy"
              className="text-[#C8A96B] underline underline-offset-2 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cookie Policy
            </a>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={refuse}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all"
          >
            Solo necessari
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-sm font-semibold bg-[#C8A96B] hover:bg-[#d4b87a] text-[#072316] transition-all"
          >
            Accetta
          </button>
          <button
            onClick={refuse}
            aria-label="Chiudi"
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
