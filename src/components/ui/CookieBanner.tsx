"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Cookie, ChevronDown, ChevronUp } from "lucide-react";

interface ConsentData {
  analytics: boolean;
  profiling: boolean;
  date: string;
}

function loadConsent(): ConsentData | null {
  try {
    const raw = localStorage.getItem("cookie_consent_v2");
    if (!raw) return null;
    const data = JSON.parse(raw) as ConsentData;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (new Date(data.date) < sixMonthsAgo) return null;
    return data;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, profiling: boolean) {
  localStorage.setItem(
    "cookie_consent_v2",
    JSON.stringify({ analytics, profiling, date: new Date().toISOString() })
  );
}

type View = "hidden" | "banner" | "preferences";

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${checked ? "bg-[#C8A96B]" : "bg-white/20"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 mt-[3px] rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const [view, setView] = useState<View>("hidden");
  const [prefs, setPrefs] = useState({ analytics: false, profiling: false });
  const [techOpen, setTechOpen] = useState(false);

  useEffect(() => {
    const stored = loadConsent();
    if (!stored) {
      setView("banner");
    }
    // Listen for "Rivedi le tue scelte" from footer
    const handler = () => {
      const stored = loadConsent();
      if (stored) setPrefs({ analytics: stored.analytics, profiling: stored.profiling });
      setView("preferences");
    };
    window.addEventListener("openCookiePreferences", handler);
    return () => window.removeEventListener("openCookiePreferences", handler);
  }, []);

  const refuseAll = useCallback(() => {
    saveConsent(false, false);
    setView("hidden");
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent(true, true);
    setView("hidden");
  }, []);

  const savePrefs = useCallback(() => {
    saveConsent(prefs.analytics, prefs.profiling);
    setView("hidden");
  }, [prefs]);

  if (view === "hidden") return null;

  /* ─── Preferences Modal ─── */
  if (view === "preferences") {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
        <div
          className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: "rgba(7,35,22,0.98)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[#C8A96B]" />
              <span className="text-white font-semibold text-sm">Gestisci preferenze cookie</span>
            </div>
            <button onClick={refuseAll} aria-label="Chiudi — solo cookie tecnici" className="p-1.5 rounded-lg text-white/50 hover:text-white border border-white/15 hover:border-white/35 transition-all text-xs font-medium flex items-center gap-1">
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chiudi</span>
            </button>
          </div>

          <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <p className="text-white/55 text-xs leading-relaxed">
              Puoi modificare le tue scelte in qualsiasi momento. I cookie tecnici non possono essere disattivati in quanto necessari al funzionamento del sito. Per i cookie analitici e di profilazione, il consenso non è stato ancora espresso (impostazione predefinita: negato).
            </p>

            {/* Cookie tecnici */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setTechOpen(!techOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Toggle checked={true} disabled />
                  <div className="text-left">
                    <p className="text-white/80 text-sm font-medium">Cookie tecnici</p>
                    <p className="text-white/40 text-xs">Sempre attivi — necessari al funzionamento</p>
                  </div>
                </div>
                {techOpen ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
              </button>
              {techOpen && (
                <div className="px-4 pb-3 text-white/40 text-xs leading-relaxed border-t border-white/[0.06] pt-2">
                  Necessari per la navigazione di base, la gestione della sessione e le preferenze di lingua. Non richiedono consenso.
                </div>
              )}
            </div>

            {/* Cookie analitici */}
            <div className="rounded-xl border border-white/10 px-4 py-3 flex items-start gap-3">
              <Toggle checked={prefs.analytics} onChange={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))} />
              <div>
                <p className="text-white/80 text-sm font-medium">Cookie analitici / statistici</p>
                <p className="text-white/40 text-xs leading-relaxed mt-0.5">
                  Consentono di misurare il traffico e le interazioni con i contenuti del sito per migliorare il servizio. Attualmente non in uso.
                </p>
              </div>
            </div>

            {/* Cookie profilazione */}
            <div className="rounded-xl border border-white/10 px-4 py-3 flex items-start gap-3">
              <Toggle checked={prefs.profiling} onChange={() => setPrefs(p => ({ ...p, profiling: !p.profiling }))} />
              <div>
                <p className="text-white/80 text-sm font-medium">Cookie di profilazione</p>
                <p className="text-white/40 text-xs leading-relaxed mt-0.5">
                  Creano profili per inviare messaggi pubblicitari in linea con le preferenze dell&apos;utente. Attualmente non in uso.
                </p>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="px-5 py-4 border-t border-white/10 flex gap-2">
            <button onClick={refuseAll} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white border border-white/15 hover:border-white/35 transition-all">
              Rifiuta tutti
            </button>
            <button onClick={savePrefs} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
              Salva scelte
            </button>
            <button onClick={acceptAll} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#C8A96B] hover:bg-[#d4b87a] text-[#072316] transition-all">
              Accetta tutti
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Main Banner ─── */
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-5 sm:pb-5" role="dialog" aria-label="Consenso cookie">
      <div
        className="max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "rgba(7,35,22,0.98)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2">
          <Cookie className="w-4 h-4 text-[#C8A96B] shrink-0" />
          <p className="flex-1 text-white font-semibold text-sm">Questo sito utilizza cookie</p>
          {/* X — stessa enfasi dei pulsanti (requisito Garante) */}
          <button
            onClick={refuseAll}
            aria-label="Chiudi — solo cookie tecnici"
            title="Chiudi: equivale a Rifiuta tutti"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white border border-white/15 hover:border-white/35 transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chiudi</span>
          </button>
        </div>

        <div className="px-5 pb-4 space-y-3">
          {/* Informativa minima */}
          <p className="text-white/65 text-xs leading-relaxed">
            Utilizziamo cookie tecnici necessari al funzionamento del sito. Previo tuo consenso, potremmo utilizzare cookie analitici o di profilazione.{" "}
            <a href="/cookie-policy" target="_blank" rel="noopener noreferrer" className="text-[#C8A96B] underline underline-offset-2 hover:text-white transition-colors">
              Cookie Policy ↗
            </a>
          </p>

          {/* Avviso obbligatorio Garante */}
          <p className="text-white/35 text-[10px] leading-relaxed border-t border-white/[0.07] pt-2.5">
            La chiusura tramite &ldquo;X&rdquo; o &ldquo;Rifiuta tutti&rdquo; equivale al mantenimento delle impostazioni predefinite: navigazione senza cookie diversi da quelli tecnici.
          </p>

          {/* Bottoni — tutti stessa enfasi (requisito Garante) */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={refuseAll}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-all"
            >
              RIFIUTA TUTTI
            </button>
            <button
              onClick={() => setView("preferences")}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-all"
            >
              GESTISCI PREFERENZE
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#C8A96B] hover:bg-[#d4b87a] text-[#072316] transition-all"
            >
              ACCETTA TUTTI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
