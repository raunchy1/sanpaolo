"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, RefreshCw, Save, GripVertical } from "lucide-react";
import { toast } from "sonner";

export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero",          label: "🏠 Hero — Prima schermata",        visible: true },
  { id: "checkin",       label: "🕐 Check-in",                       visible: true },
  { id: "guestFavorites",label: "⭐ Preferiti degli ospiti",          visible: true },
  { id: "laCasa",        label: "🏡 La Casa",                         visible: true },
  { id: "amenities",     label: "✅ Servizi inclusi",                  visible: true },
  { id: "roomTour",      label: "📸 Galleria camere",                  visible: true },
  { id: "newBuild",      label: "🏗️ Nuova Costruzione 2025",          visible: true },
  { id: "location",      label: "📍 Posizione",                        visible: true },
  { id: "reviews",       label: "⭐ Recensioni",                       visible: true },
  { id: "specialOffers", label: "🎁 Offerte speciali",                 visible: true },
  { id: "bookingCalendar", label: "🗓️ Calendario prenotazioni",         visible: false },
  { id: "bookingCTA",    label: "📅 Prenota — CTA",                    visible: true },
  { id: "faq",           label: "❓ FAQ",                              visible: true },
];

export default function SezioniPage() {
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sections");
      if (res.ok) {
        const data: SectionConfig[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Merge: keep any new default sections not in saved config
          const savedIds = new Set(data.map((s) => s.id));
          const merged = [
            ...data,
            ...DEFAULT_SECTIONS.filter((s) => !savedIds.has(s.id)),
          ];
          setSections(merged);
        }
      }
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
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Errore");
      }
      toast.success("Configurazione sezioni salvata");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function toggleVisible(id: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSections(next);
  }

  function resetToDefault() {
    setSections(DEFAULT_SECTIONS);
    toast("Ordine ripristinato. Clicca Salva per confermare.");
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
      </div>
    );
  }

  const visibleCount = sections.filter((s) => s.visible).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sezioni homepage</h1>
          <p className="text-gray-500 text-sm mt-1">
            {visibleCount} di {sections.length} sezioni visibili · trascina o usa le frecce per riordinare
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Ripristina ordine
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio…" : saved ? "✓ Salvato" : "Salva ordine"}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-6">
        <strong>Come funziona:</strong> usa le frecce ↑ ↓ per cambiare l&apos;ordine delle sezioni nella pagina principale. Usa l&apos;icona occhio 👁 per nascondere o mostrare una sezione. Poi clicca <strong>Salva ordine</strong>.
      </div>

      {/* Sections list */}
      <div className="space-y-2">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`bg-white rounded-2xl border transition-all duration-200 ${
              section.visible
                ? "border-gray-100 shadow-sm"
                : "border-dashed border-gray-200 opacity-50"
            }`}
          >
            <div className="flex items-center gap-3 px-5 py-4">
              {/* Grip handle (decorative) */}
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />

              {/* Position number */}
              <span className="w-6 text-center text-xs font-bold text-gray-400 shrink-0">
                {idx + 1}
              </span>

              {/* Label */}
              <div className="flex-1">
                <span className={`font-medium text-sm ${section.visible ? "text-gray-900" : "text-gray-400 line-through"}`}>
                  {section.label}
                </span>
                {!section.visible && (
                  <span className="ml-2 text-xs text-gray-400">(nascosta)</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Visibility toggle */}
                <button
                  onClick={() => toggleVisible(section.id)}
                  title={section.visible ? "Nascondi sezione" : "Mostra sezione"}
                  className={`p-2 rounded-xl transition-colors ${
                    section.visible
                      ? "text-[#072316] hover:bg-[#072316]/8"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Move up */}
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                {/* Move down */}
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === sections.length - 1}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save button bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Salvataggio…" : "Salva ordine e visibilità"}
        </button>
      </div>
    </div>
  );
}
