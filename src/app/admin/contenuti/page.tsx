"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id: string;
  label: string;
  fields: Field[];
}

interface Field {
  key: string;
  label: string;
  path: string[];
  multiline?: boolean;
  placeholder?: string;
}

const SECTIONS: Section[] = [
  {
    id: "hero",
    label: "Hero — Prima schermata",
    fields: [
      { key: "hero.subtitle", label: "Sottotitolo hero", path: ["hero", "subtitle"], multiline: true, placeholder: "La tua dimora romana privata…" },
      { key: "hero.facts", label: "Fatti / dettagli (riga sotto titolo)", path: ["hero", "facts"], placeholder: "2 camere da letto • 3 ospiti…" },
      { key: "hero.rating", label: "Badge valutazione", path: ["hero", "rating"], placeholder: "9.9 Eccellente • Booking Award 2026" },
    ],
  },
  {
    id: "checkin",
    label: "Check-in",
    fields: [
      { key: "checkin.description", label: "Descrizione check-in", path: ["checkin", "description"], multiline: true },
      { key: "checkin.features.flexible.desc", label: "Fascia oraria check-in", path: ["checkin", "features", "flexible", "desc"], placeholder: "Fascia oraria 15:00–20:00" },
    ],
  },
  {
    id: "faq",
    label: "FAQ — Domande frequenti",
    fields: [
      { key: "faq.q1.answer", label: "Risposta: Come funziona il check-in?", path: ["faq", "q1", "answer"], multiline: true },
      { key: "faq.q2.answer", label: "Risposta: Distanza dalla Metro?", path: ["faq", "q2", "answer"], multiline: true },
      { key: "faq.q3.answer", label: "Risposta: C'è il parcheggio?", path: ["faq", "q3", "answer"], multiline: true },
      { key: "faq.q4.answer", label: "Risposta: Come arrivo dall'aeroporto?", path: ["faq", "q4", "answer"], multiline: true },
      { key: "faq.q5.answer", label: "Risposta: Adatto per famiglie?", path: ["faq", "q5", "answer"], multiline: true },
      { key: "faq.q6.answer", label: "Risposta: Posso lavorare da qui?", path: ["faq", "q6", "answer"], multiline: true },
      { key: "faq.q7.answer", label: "Risposta: Struttura della casa?", path: ["faq", "q7", "answer"], multiline: true },
    ],
  },
  {
    id: "offers",
    label: "Offerte speciali",
    fields: [
      { key: "offers.stay3.title", label: "Offerta 1 — Titolo", path: ["offers", "stay3", "title"] },
      { key: "offers.stay3.description", label: "Offerta 1 — Descrizione", path: ["offers", "stay3", "description"], multiline: true },
      { key: "offers.weekend.title", label: "Offerta 2 — Titolo", path: ["offers", "weekend", "title"] },
      { key: "offers.weekend.description", label: "Offerta 2 — Descrizione", path: ["offers", "weekend", "description"], multiline: true },
      { key: "offers.direct.title", label: "Offerta 3 — Titolo", path: ["offers", "direct", "title"] },
      { key: "offers.direct.description", label: "Offerta 3 — Descrizione", path: ["offers", "direct", "description"], multiline: true },
      { key: "offers.early.title", label: "Offerta 4 — Titolo", path: ["offers", "early", "title"] },
      { key: "offers.early.description", label: "Offerta 4 — Descrizione", path: ["offers", "early", "description"], multiline: true },
    ],
  },
  {
    id: "footer",
    label: "Footer — Info di contatto",
    fields: [
      { key: "footer.address", label: "Indirizzo", path: ["footer", "address"], placeholder: "Via Silvio D'Amico 96, 00145 Roma" },
      { key: "footer.description", label: "Descrizione breve (footer)", path: ["footer", "description"], multiline: true },
      { key: "footer.tagline", label: "Tagline", path: ["footer", "tagline"], placeholder: "La tua dimora romana privata" },
    ],
  },
];

function getNestedValue(obj: Record<string, unknown>, path: string[]): string {
  let current: unknown = obj;
  for (const key of path) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[key];
    } else return "";
  }
  return typeof current === "string" ? current : "";
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: string
): Record<string, unknown> {
  if (path.length === 0) return obj;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: setNestedValue(
      ((obj[head] as Record<string, unknown>) || {}),
      rest,
      value
    ),
  };
}

export default function ContenutiPage() {
  const [currentContent, setCurrentContent] = useState<Record<string, unknown>>({});
  const [overrides, setOverrides] = useState<Record<string, unknown>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ hero: true });

  async function fetchData() {
    setLoading(true);
    try {
      const [contentRes, overridesRes] = await Promise.all([
        fetch("/api/content"),
        fetch("/api/admin/content"),
      ]);
      const overridesData = await overridesRes.json();
      const contentData = await contentRes.json();

      setCurrentContent(contentData.it || {});
      setOverrides(overridesData.it || {});

      const initialValues: Record<string, string> = {};
      for (const section of SECTIONS) {
        for (const field of section.fields) {
          const overrideVal = getNestedValue(overridesData.it || {}, field.path);
          initialValues[field.key] = overrideVal;
        }
      }
      setValues(initialValues);
    } catch {
      toast.error("Errore nel caricamento dei contenuti");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function getDefaultValue(field: Field): string {
    return getNestedValue(currentContent, field.path) || "";
  }

  async function saveSection(section: Section) {
    setSaving(true);
    try {
      let itOverrides: Record<string, unknown> = {};
      for (const field of section.fields) {
        const val = values[field.key];
        if (val !== undefined && val !== "") {
          itOverrides = setNestedValue(itOverrides, field.path, val);
        }
      }

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ it: itOverrides }),
      });

      if (!res.ok) throw new Error();
      toast.success(`Sezione "${section.label}" salvata con successo`);
      setSavedSection(section.id);
      setTimeout(() => setSavedSection(null), 3000);
      fetchData();
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contenuti sito</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modifica i testi del sito. Le modifiche sono attive immediatamente.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Ricarica
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6">
        <strong>Nota:</strong> i campi vuoti mostrano il testo originale del sito. Compila solo i
        campi che vuoi modificare, poi clicca &ldquo;Salva sezione&rdquo;.
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section) => {
          const isOpen = openSections[section.id];
          const hasOverrides = section.fields.some((f) => values[f.key]);
          const isSaved = savedSection === section.id;

          return (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{section.label}</span>
                  {hasOverrides && (
                    <span className="px-2 py-0.5 rounded-full bg-[#072316]/10 text-[#072316] text-xs font-medium">
                      Modificato
                    </span>
                  )}
                  {isSaved && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Salvato
                    </span>
                  )}
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-50">
                  <div className="pt-4 space-y-4">
                    {section.fields.map((field) => {
                      const defaultVal = getDefaultValue(field);
                      const currentVal = values[field.key] ?? "";
                      const isModified = currentVal !== "";

                      return (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {field.label}
                            {isModified && (
                              <span className="ml-2 text-xs font-normal text-[#072316]">• modificato</span>
                            )}
                          </label>
                          {field.multiline ? (
                            <textarea
                              value={currentVal}
                              onChange={(e) =>
                                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                              placeholder={field.placeholder || defaultVal}
                              rows={3}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] resize-y transition-all"
                            />
                          ) : (
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) =>
                                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                              }
                              placeholder={field.placeholder || defaultVal}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all"
                            />
                          )}
                          {defaultVal && (
                            <p className="mt-1 text-xs text-gray-400 truncate">
                              Testo attuale: {defaultVal.substring(0, 80)}
                              {defaultVal.length > 80 ? "…" : ""}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => saveSection(section)}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#072316] hover:bg-[#0F3D28] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Salvataggio…" : "Salva sezione"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
