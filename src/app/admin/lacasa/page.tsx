"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const DEFAULTS = {
  p1: "San Paolo Hideout è una **casa vacanza indipendente ed esclusiva**, di **nuovissima costruzione (2025)**, pensata per offrire un autentico ~~rifugio di pace e tranquillità nel cuore di Roma~~.",
  p2: "Situata a pochi passi dalla **Metro San Paolo**, la struttura gode di una **posizione privilegiata**, ~~immersa nel verde~~, una vera **rarità nella capitale**, regalando agli ospiti una sensazione di ~~oasi fuori dal tempo~~, pur restando perfettamente collegata alle principali attrazioni della città eterna.",
  p3: "L'abitazione, progettata per ospitare **fino a tre persone in totale comfort**, dispone di una **ampia camera matrimoniale**, una **camera singola da una piazza e mezzo** e un **salone accogliente**, arricchito da **Smart TV** e da una curata **selezione di libri dedicati a Roma**.",
  p4: "La **cucina completamente attrezzata**, dotata di **elettrodomestici di ultima generazione**, include **lavastoviglie**, **macchina per il caffè** e un **omaggio di benvenuto con caffè, tè e condimenti essenziali**.",
  p5: "Il **bagno moderno** offre un comodo **box doccia** e una **lavatrice**, garantendo massima autonomia anche per soggiorni più lunghi.",
  p6intro: "Ogni dettaglio del San Paolo Hideout è pensato per il **benessere e la privacy degli ospiti**:",
  p6items: "**climatizzazione in tutti gli ambienti**|**Wi-Fi ad alta velocità**|**ingresso indipendente**|**parcheggio gratuito riservato**|**biancheria completa**|su richiesta, **culla per bambini**, rendendola perfetta anche per famiglie",
  p7: "Sintesi perfetta tra **design moderno**, **calore domestico** e **posizione strategica**, il San Paolo Hideout è la scelta ideale per chi desidera ~~scoprire la Roma storica senza rinunciare alla quietezza di un esclusivo angolo verde~~.",
};

type Key = keyof typeof DEFAULTS;

const FIELDS: { key: Key; label: string; hint?: string }[] = [
  { key: "p1", label: "Paragrafo 1 — Introduzione" },
  { key: "p2", label: "Paragrafo 2 — Posizione" },
  { key: "p3", label: "Paragrafo 3 — Camere e spazi" },
  { key: "p4", label: "Paragrafo 4 — Cucina" },
  { key: "p5", label: "Paragrafo 5 — Bagno" },
  { key: "p6intro", label: "Paragrafo 6 — Intro lista servizi" },
  {
    key: "p6items",
    label: "Paragrafo 6 — Lista servizi (separare con |)",
    hint: "Ogni voce separata da |  es.  Wi-Fi veloce|Parcheggio gratuito|Climatizzazione",
  },
  { key: "p7", label: "Paragrafo 7 — Conclusione" },
];

function getNestedValue(obj: Record<string, unknown>, path: string[]): string {
  let cur: unknown = obj;
  for (const k of path) {
    if (!cur || typeof cur !== "object") return "";
    cur = (cur as Record<string, unknown>)[k];
  }
  return typeof cur === "string" ? cur : "";
}

function setNested(
  obj: Record<string, unknown>,
  path: string[],
  val: string
): Record<string, unknown> {
  if (path.length === 0) return obj;
  const [h, ...rest] = path;
  if (rest.length === 0) return { ...obj, [h]: val };
  return { ...obj, [h]: setNested(((obj[h] as Record<string, unknown>) || {}), rest, val) };
}

export default function LaCasaAdminPage() {
  const [values, setValues] = useState<Record<Key, string>>({
    p1: "", p2: "", p3: "", p4: "", p5: "", p6intro: "", p6items: "", p7: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      const it = data.it || {};
      const loaded: Record<Key, string> = {} as Record<Key, string>;
      for (const f of FIELDS) {
        loaded[f.key] = getNestedValue(it, ["laCasa", f.key]);
      }
      setValues(loaded);
    } catch {
      toast.error("Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    try {
      let itOverrides: Record<string, unknown> = {};
      for (const f of FIELDS) {
        const val = values[f.key];
        if (val.trim() !== "") {
          itOverrides = setNested(itOverrides, ["laCasa", f.key], val);
        }
      }
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ it: itOverrides }),
      });
      if (!res.ok) throw new Error();
      toast.success("Testi La Casa salvati");
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testi — La Casa</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modifica i paragrafi della sezione descrittiva della casa. Attivi subito.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="/#lacasa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Vedi sul sito
          </a>
        </div>
      </div>

      {/* Hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-6">
        <strong>Formattazione:</strong> usa <code className="bg-blue-100 px-1 rounded">**testo**</code> per il{" "}
        <strong>grassetto</strong> e <code className="bg-blue-100 px-1 rounded">~~testo~~</code> per lo{" "}
        <s>strikethrough</s>. Lascia vuoto per usare il testo originale.
      </div>

      {/* Fields */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {FIELDS.map((f) => {
          const isModified = values[f.key].trim() !== "";
          return (
            <div key={f.key} className="px-6 py-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {f.label}
                {isModified && (
                  <span className="ml-2 text-xs font-normal text-[#072316]">• modificato</span>
                )}
              </label>
              {f.hint && (
                <p className="text-xs text-gray-400 mb-2">{f.hint}</p>
              )}
              <textarea
                value={values[f.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={DEFAULTS[f.key]}
                rows={f.key === "p6items" ? 4 : 3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] resize-y transition-all"
              />
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="mt-5 flex items-center justify-end gap-3">
        {justSaved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Salvato
          </span>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Salvataggio…" : "Salva testi"}
        </button>
      </div>
    </div>
  );
}
