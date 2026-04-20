"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Save, RefreshCw, ChevronUp, ChevronDown,
  Pencil, Check, X, GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import type { AmenitiesConfig, AmenityCategory } from "@/app/api/admin/amenities/route";

/* ── mini preview helpers ── */
function ThinCheck() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0 text-emerald-500" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 8 6 12 14 4" />
    </svg>
  );
}

/* ── Inline editable text ── */
function InlineEdit({
  value, onSave, className = "", multiline = false,
}: {
  value: string; onSave: (v: string) => void; className?: string; multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() { onSave(draft.trim() || value); setEditing(false); }
  function cancel() { setDraft(value); setEditing(false); }

  if (editing) {
    return (
      <span className="inline-flex items-start gap-1 w-full">
        {multiline ? (
          <textarea
            autoFocus
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") cancel(); }}
            className={`${className} flex-1 bg-white border border-[#072316]/30 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 resize-none`}
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
            className={`${className} flex-1 bg-white border border-[#072316]/30 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20`}
          />
        )}
        <button onClick={commit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-3.5 h-3.5" /></button>
        <button onClick={cancel} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X className="w-3.5 h-3.5" /></button>
      </span>
    );
  }
  return (
    <span
      className={`${className} group cursor-pointer inline-flex items-center gap-1.5 hover:bg-[#072316]/5 rounded px-1 py-0.5 transition-colors`}
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      {value}
      <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0" />
    </span>
  );
}

/* ── Category card ── */
function CategoryCard({
  cat, roman, isComfort,
  onChange, onMoveItem, onDeleteItem, onAddItem, onMoveCategory, isFirst, isLast,
}: {
  cat: AmenityCategory;
  roman: string;
  isComfort: boolean;
  onChange: (updated: AmenityCategory) => void;
  onMoveItem: (idx: number, dir: -1 | 1) => void;
  onDeleteItem: (idx: number) => void;
  onAddItem: () => void;
  onMoveCategory: (dir: -1 | 1) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [newItem, setNewItem] = useState("");

  function addItem() {
    const text = newItem.trim();
    if (!text) return;
    onChange({ ...cat, items: [...cat.items, text] });
    setNewItem("");
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${isComfort ? "border-[#2E6B4A]/30" : "border-gray-100"}`}>
      {/* Header */}
      <div className={`flex items-start gap-3 p-4 ${isComfort ? "bg-gradient-to-r from-[#1A3A28] to-[#2E6B4A]" : "bg-white"}`}>
        <div className="flex flex-col gap-0.5 mt-0.5 shrink-0">
          <button onClick={() => onMoveCategory(-1)} disabled={isFirst}
            className={`p-0.5 rounded transition-colors disabled:opacity-20 ${isComfort ? "text-white/40 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onMoveCategory(1)} disabled={isLast}
            className={`p-0.5 rounded transition-colors disabled:opacity-20 ${isComfort ? "text-white/40 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold tracking-[0.2em] ${isComfort ? "text-white/40" : "text-gray-400"}`}>{roman}</span>
            <InlineEdit
              value={cat.label}
              onSave={(v) => onChange({ ...cat, label: v })}
              className={`font-bold text-base ${isComfort ? "text-white" : "text-gray-900"}`}
            />
          </div>
          <InlineEdit
            value={cat.tagline}
            onSave={(v) => onChange({ ...cat, tagline: v })}
            className={`text-xs italic ${isComfort ? "text-white/50" : "text-gray-400"}`}
          />
        </div>
      </div>

      {/* Items list */}
      <div className={`p-4 space-y-1.5 ${isComfort ? "bg-[#1A3A28]/95" : "bg-gray-50/60"}`}>
        {cat.items.map((item, idx) => (
          <div key={idx} className={`group flex items-center gap-2 px-3 py-2 rounded-lg ${isComfort ? "bg-white/5 hover:bg-white/10" : "bg-white hover:bg-gray-50"} transition-colors`}>
            <GripVertical className={`w-3.5 h-3.5 shrink-0 ${isComfort ? "text-white/20" : "text-gray-300"}`} />
            <ThinCheck />
            <InlineEdit
              value={item}
              onSave={(v) => {
                const items = [...cat.items];
                items[idx] = v;
                onChange({ ...cat, items });
              }}
              className={`flex-1 text-sm ${isComfort ? "text-white/80" : "text-gray-700"}`}
            />
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
              <button onClick={() => onMoveItem(idx, -1)} disabled={idx === 0}
                className={`p-0.5 rounded disabled:opacity-20 ${isComfort ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}>
                <ChevronUp className="w-3 h-3" />
              </button>
              <button onClick={() => onMoveItem(idx, 1)} disabled={idx === cat.items.length - 1}
                className={`p-0.5 rounded disabled:opacity-20 ${isComfort ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}>
                <ChevronDown className="w-3 h-3" />
              </button>
              <button onClick={() => onDeleteItem(idx)}
                className="p-0.5 rounded text-red-400 hover:text-red-600">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {/* Add new item */}
        <div className="flex items-center gap-2 mt-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addItem(); }}
            placeholder="Aggiungi voce…"
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#072316]/20 ${
              isComfort
                ? "bg-white/10 border-white/10 text-white placeholder-white/30 focus:border-white/30"
                : "bg-white border-gray-200 text-gray-700 placeholder-gray-400"
            }`}
          />
          <button onClick={addItem}
            className={`p-1.5 rounded-lg transition-colors ${isComfort ? "bg-white/15 text-white hover:bg-white/25" : "bg-[#072316] text-white hover:bg-[#0F3D28]"}`}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Pet section editor ── */
function PetEditor({ pet, onChange }: {
  pet: AmenitiesConfig["pet"];
  onChange: (updated: AmenitiesConfig["pet"]) => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-gradient-to-r from-[#FFF1EA] to-[#EEF3EF] p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🐾</span>
        <InlineEdit value={pet.label} onSave={(v) => onChange({ ...pet, label: v })}
          className="font-bold text-gray-900 text-base" />
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Tagline</span>
          <InlineEdit value={pet.tagline} onSave={(v) => onChange({ ...pet, tagline: v })}
            className="text-sm text-gray-600 italic" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Descrizione</span>
          <InlineEdit value={pet.desc} onSave={(v) => onChange({ ...pet, desc: v })}
            className="text-sm text-gray-600" multiline />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Badge</span>
          <InlineEdit value={pet.badge} onSave={(v) => onChange({ ...pet, badge: v })}
            className="text-sm text-emerald-700 font-medium" />
        </div>
      </div>
    </div>
  );
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/* ── Main page ── */
export default function ServiziPage() {
  const [config, setConfig] = useState<AmenitiesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/amenities");
      const data = await res.json();
      setConfig(data);
    } catch {
      toast.error("Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      toast.success("Servizi salvati ✓ — le modifiche sono live");
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function updateCategory(idx: number, updated: AmenityCategory) {
    if (!config) return;
    const categories = [...config.categories];
    categories[idx] = updated;
    setConfig({ ...config, categories });
  }

  function moveItem(catIdx: number, itemIdx: number, dir: -1 | 1) {
    if (!config) return;
    const categories = [...config.categories];
    const cat = { ...categories[catIdx], items: [...categories[catIdx].items] };
    const target = itemIdx + dir;
    if (target < 0 || target >= cat.items.length) return;
    [cat.items[itemIdx], cat.items[target]] = [cat.items[target], cat.items[itemIdx]];
    categories[catIdx] = cat;
    setConfig({ ...config, categories });
  }

  function deleteItem(catIdx: number, itemIdx: number) {
    if (!config) return;
    const categories = [...config.categories];
    const cat = { ...categories[catIdx], items: categories[catIdx].items.filter((_, i) => i !== itemIdx) };
    categories[catIdx] = cat;
    setConfig({ ...config, categories });
  }

  function moveCategory(idx: number, dir: -1 | 1) {
    if (!config) return;
    const categories = [...config.categories];
    const target = idx + dir;
    if (target < 0 || target >= categories.length) return;
    [categories[idx], categories[target]] = [categories[target], categories[idx]];
    setConfig({ ...config, categories });
  }

  if (loading || !config) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servizi inclusi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Clicca su qualsiasi testo per modificarlo. Usa + per aggiungere voci, 🗑 per eliminare.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio…" : "Salva"}
          </button>
        </div>
      </div>

      {/* Section title + subtitle */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Intestazione sezione</h2>
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Etichetta</span>
          <InlineEdit value={config.eyebrow} onSave={(v) => setConfig({ ...config, eyebrow: v })}
            className="text-sm font-semibold text-gray-800" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Titolo</span>
          <InlineEdit value={config.title} onSave={(v) => setConfig({ ...config, title: v })}
            className="text-xl font-bold text-gray-900" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Sottotitolo</span>
          <InlineEdit value={config.subtitle} onSave={(v) => setConfig({ ...config, subtitle: v })}
            className="text-sm text-gray-500 italic" />
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 mb-6">
        <strong>Come modificare:</strong> clicca su un testo per editarlo → premi <kbd className="bg-blue-100 px-1 rounded">Enter</kbd> per confermare o <kbd className="bg-blue-100 px-1 rounded">Esc</kbd> per annullare. Le modifiche non sono live finché non clicchi <strong>Salva</strong>.
      </div>

      {/* Category cards */}
      <div className="space-y-4">
        {config.categories.map((cat, idx) => (
          <CategoryCard
            key={cat.id + idx}
            cat={cat}
            roman={ROMAN[idx] ?? String(idx + 1)}
            isComfort={idx === 0}
            onChange={(updated) => updateCategory(idx, updated)}
            onMoveItem={(itemIdx, dir) => moveItem(idx, itemIdx, dir)}
            onDeleteItem={(itemIdx) => deleteItem(idx, itemIdx)}
            onAddItem={() => {}}
            onMoveCategory={(dir) => moveCategory(idx, dir)}
            isFirst={idx === 0}
            isLast={idx === config.categories.length - 1}
          />
        ))}
      </div>

      {/* Pet section */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2 px-1">Striscia Pet Friendly</p>
        <PetEditor pet={config.pet} onChange={(p) => setConfig({ ...config, pet: p })} />
      </div>

      {/* Save bottom */}
      <div className="mt-8 flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />
          {saving ? "Salvataggio…" : "Salva tutte le modifiche"}
        </button>
      </div>
    </div>
  );
}
