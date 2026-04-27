"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, RefreshCw, Save, GripVertical } from "lucide-react";
import { toast } from "sonner";

export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface NavItemConfig {
  key: string;
  href: string;
  visible: boolean;
}

const DEFAULT_NAV: NavItemConfig[] = [
  { key: "home",      href: "#home",     visible: true },
  { key: "lacasa",    href: "#lacasa",   visible: true },
  { key: "galleria",  href: "#rooms",    visible: true },
  { key: "amenities", href: "#amenities",visible: true },
  { key: "location",  href: "#location", visible: true },
  { key: "reviews",   href: "#reviews",  visible: true },
  { key: "faq",       href: "#faq",      visible: true },
  { key: "booking",   href: "#prenota",  visible: true },
];

const NAV_LABELS: Record<string, string> = {
  home: "Home",
  lacasa: "La Casa",
  galleria: "Galleria",
  amenities: "Servizi Inclusi",
  location: "Posizione",
  reviews: "Recensioni",
  faq: "FAQ",
  booking: "Controlla Disponibilità",
};

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
  const [navItems, setNavItems] = useState<NavItemConfig[]>(DEFAULT_NAV);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingNav, setSavingNav] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedNav, setSavedNav] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [secRes, navRes] = await Promise.all([
        fetch("/api/admin/sections"),
        fetch("/api/admin/navbar"),
      ]);
      if (secRes.ok) {
        const data: SectionConfig[] = await secRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const savedIds = new Set(data.map((s) => s.id));
          const merged = [...data, ...DEFAULT_SECTIONS.filter((s) => !savedIds.has(s.id))];
          setSections(merged);
        }
      }
      if (navRes.ok) {
        const data: NavItemConfig[] = await navRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const savedKeys = new Set(data.map((i) => i.key));
          const merged = [...data, ...DEFAULT_NAV.filter((i) => !savedKeys.has(i.key))];
          setNavItems(merged);
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
      if (!res.ok) throw new Error((await res.json()).error || "Errore");
      toast.success("Sezioni homepage salvate");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore");
    } finally {
      setSaving(false);
    }
  }

  async function saveNav() {
    setSavingNav(true);
    try {
      const res = await fetch("/api/admin/navbar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(navItems),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Errore");
      toast.success("Barra di navigazione salvata");
      setSavedNav(true);
      setTimeout(() => setSavedNav(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore");
    } finally {
      setSavingNav(false);
    }
  }

  function toggleVisible(id: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  }

  function toggleNavVisible(key: string) {
    setNavItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, visible: !i.visible } : i))
    );
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSections(next);
  }

  function moveNav(idx: number, dir: -1 | 1) {
    const next = [...navItems];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setNavItems(next);
  }

  function resetToDefault() {
    setSections(DEFAULT_SECTIONS);
    toast("Ordine sezioni ripristinato. Clicca Salva per confermare.");
  }

  function resetNavToDefault() {
    setNavItems(DEFAULT_NAV);
    toast("Ordine navbar ripristinato. Clicca Salva per confermare.");
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
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sezioni & Navigazione</h1>
          <p className="text-gray-500 text-sm mt-1">Ordina e mostra/nascondi le voci della navbar e le sezioni della homepage</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── NAVBAR ORDER ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Barra di navigazione</h2>
            <p className="text-gray-400 text-xs mt-0.5">Ordine e visibilità delle voci nel menu in cima</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetNavToDefault} className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              Ripristina
            </button>
            <button onClick={saveNav} disabled={savingNav}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#072316] text-white rounded-lg text-xs font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors">
              <Save className="w-3.5 h-3.5" />
              {savingNav ? "Salvataggio…" : savedNav ? "✓ Salvato" : "Salva navbar"}
            </button>
          </div>
        </div>
        <div className="p-4 space-y-1.5">
          {navItems.map((item, idx) => (
            <div key={item.key} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${item.visible ? "border-gray-100 bg-gray-50/50" : "border-dashed border-gray-200 opacity-50"}`}>
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
              <span className="w-5 text-center text-xs font-bold text-gray-400">{idx + 1}</span>
              <div className="flex-1">
                <span className={`text-sm font-medium ${item.visible ? "text-gray-900" : "text-gray-400 line-through"}`}>
                  {NAV_LABELS[item.key] ?? item.key}
                </span>
                <span className="ml-2 text-xs text-gray-400 font-mono">{item.href}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleNavVisible(item.key)} title={item.visible ? "Nascondi" : "Mostra"}
                  className={`p-1.5 rounded-lg transition-colors ${item.visible ? "text-[#072316] hover:bg-[#072316]/8" : "text-gray-400 hover:bg-gray-100"}`}>
                  {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => moveNav(idx, -1)} disabled={idx === 0}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition-colors">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveNav(idx, 1)} disabled={idx === navItems.length - 1}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTIONS ORDER ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Sezioni homepage</h2>
          <p className="text-gray-500 text-sm mt-0.5">{visibleCount} di {sections.length} sezioni visibili</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetToDefault} className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            Ripristina ordine
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#072316] text-white rounded-lg text-xs font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors">
            <Save className="w-3.5 h-3.5" />
            {saving ? "Salvataggio…" : saved ? "✓ Salvato" : "Salva sezioni"}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-4">
        <strong>Come funziona:</strong> usa le frecce ↑ ↓ per cambiare l&apos;ordine. Usa l&apos;occhio 👁 per nascondere/mostrare. Poi clicca <strong>Salva sezioni</strong>.
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

      {/* Save bottom */}
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={saveNav} disabled={savingNav}
          className="flex items-center gap-2 px-5 py-2.5 border border-[#072316] text-[#072316] rounded-xl text-sm font-medium hover:bg-[#072316]/5 disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />
          {savingNav ? "Salvataggio…" : "Salva navbar"}
        </button>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />
          {saving ? "Salvataggio…" : "Salva sezioni"}
        </button>
      </div>
    </div>
  );
}
