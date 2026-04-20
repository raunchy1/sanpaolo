"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Palette, RotateCcw, Eye } from "lucide-react";
import { toast } from "sonner";

interface DesignConfig {
  primaryColor?: string;
  primaryHover?: string;
  accentColor?: string;
  borderRadius?: string;
}

const DEFAULTS: DesignConfig = {
  primaryColor: "#072316",
  primaryHover: "#0F3D28",
  accentColor: "#C8A96B",
  borderRadius: "12px",
};

const PRESETS = [
  { name: "Verde Originale", primary: "#072316", hover: "#0F3D28", accent: "#C8A96B", radius: "12px" },
  { name: "Blu Elegante",    primary: "#0F2657", hover: "#1A3A7A", accent: "#D4AF6B", radius: "12px" },
  { name: "Bordeaux",        primary: "#5C1A1A", hover: "#7A2828", accent: "#D4AF6B", radius: "12px" },
  { name: "Antracite",       primary: "#1A1A2E", hover: "#2D2D44", accent: "#C8A96B", radius: "12px" },
  { name: "Terracotta",      primary: "#7C3D1E", hover: "#9B4D25", accent: "#E8C070", radius: "16px" },
];

export default function DesignPage() {
  const [config, setConfig] = useState<DesignConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/design");
      if (res.ok) setConfig(await res.json());
    } catch { /* use defaults */ }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function val(key: keyof DesignConfig): string {
    return config[key] || DEFAULTS[key] || "";
  }

  function set(key: keyof DesignConfig, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(p: typeof PRESETS[0]) {
    setConfig({ primaryColor: p.primary, primaryHover: p.hover, accentColor: p.accent, borderRadius: p.radius });
    toast("Preset applicato — clicca Salva per rendere attivo");
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      toast.success("Design aggiornato — effettivo al prossimo caricamento della pagina");
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function resetToDefault() {
    setSaving(true);
    try {
      await fetch("/api/admin/design", { method: "DELETE" });
      setConfig({});
      toast.success("Design ripristinato ai valori originali");
    } catch {
      toast.error("Errore durante il ripristino");
    } finally {
      setSaving(false);
    }
  }

  const primaryColor = val("primaryColor");
  const hoverColor = val("primaryHover");
  const accentColor = val("accentColor");
  const borderRadius = val("borderRadius");

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Design & Colori</h1>
          <p className="text-gray-500 text-sm mt-1">
            Personalizza i colori principali del sito. Le modifiche sono attive al prossimo caricamento.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${preview ? "bg-[#072316] text-white border-[#072316]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            <Eye className="w-4 h-4" />
            Anteprima
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Ripristina
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio…" : saved ? "✓ Salvato" : "Salva"}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6">
        <strong>Nota:</strong> I colori modificano il design dell&apos;intero sito. Le modifiche sono visibili solo dopo il salvataggio e il ricaricamento della pagina. Usa <strong>Ripristina</strong> per tornare al design originale.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color controls */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-[#072316]/8 text-[#072316]"><Palette className="w-4 h-4" /></div>
              <span className="font-semibold text-gray-900">Colori principali</span>
            </div>

            <div className="space-y-4">
              {[
                { key: "primaryColor" as const, label: "Colore principale", hint: "Usato per bottoni, link attivi, sidebar" },
                { key: "primaryHover" as const, label: "Colore hover (al passaggio del mouse)", hint: "Versione più chiara del colore principale" },
                { key: "accentColor" as const, label: "Colore accento (oro)", hint: "Usato per dettagli e icone" },
              ].map(({ key, label, hint }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={val(key)}
                        onChange={(e) => set(key, e.target.value)}
                        className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer p-1 bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      value={val(key)}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder="#072316"
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                    />
                  </div>
                  {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Arrotondamento angoli (border radius)</label>
                <div className="flex gap-2 flex-wrap">
                  {["0px", "4px", "8px", "12px", "16px", "24px"].map((r) => (
                    <button
                      key={r}
                      onClick={() => set("borderRadius", r)}
                      className={`px-3 py-1.5 text-xs font-medium border-2 transition-all ${
                        borderRadius === r
                          ? "border-[#072316] bg-[#072316]/5 text-[#072316]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                      style={{ borderRadius: r }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="font-semibold text-gray-900 mb-4 text-sm">Preset colori</div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left"
                >
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-5 h-5 rounded-full" style={{ background: p.primary }} />
                    <div className="w-5 h-5 rounded-full" style={{ background: p.accent }} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="sticky top-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900 text-sm">Anteprima componenti</span>
            </div>
            <div className="p-6 space-y-4 bg-gray-50">
              {/* Simulated button */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Bottone principale</p>
                <button
                  className="px-6 py-3 text-white text-sm font-medium transition-colors"
                  style={{ background: primaryColor, borderRadius }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
                >
                  Prenota ora
                </button>
              </div>

              {/* Simulated card */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Card con bordo</p>
                <div
                  className="bg-white p-4 border-2 text-sm text-gray-700"
                  style={{ borderColor: primaryColor, borderRadius }}
                >
                  <div className="font-semibold mb-1" style={{ color: primaryColor }}>San Paolo Hideout</div>
                  <div className="text-gray-500 text-xs">Via Silvio D&apos;Amico 96, Roma</div>
                </div>
              </div>

              {/* Simulated accent */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Badge / accento</p>
                <span
                  className="inline-block px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ background: accentColor, borderRadius }}
                >
                  ★ 9.9/10 · 46 recensioni
                </span>
              </div>

              {/* Color swatches */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Palette attiva</p>
                <div className="flex gap-2">
                  {[primaryColor, hoverColor, accentColor].map((c, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl shadow-sm" style={{ background: c }} />
                      <span className="text-[10px] text-gray-400 font-mono">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
