"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Save, RefreshCw, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const RichEditor = dynamic(() => import("@/components/ui/RichEditor"), { ssr: false });

interface LegalContent {
  privacy: string;
  cookie: string;
}

type Tab = "privacy" | "cookie";

export default function LegalAdminPage() {
  const [values, setValues] = useState<LegalContent>({ privacy: "", cookie: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Tab | null>(null);
  const [justSaved, setJustSaved] = useState<Tab | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("privacy");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/legal");
      if (res.ok) {
        const data = await res.json();
        setValues({
          privacy: data.privacy || "",
          cookie: data.cookie || "",
        });
      }
    } catch {
      toast.error("Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveTab(tab: Tab) {
    setSaving(tab);
    try {
      const res = await fetch("/api/admin/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [tab]: values[tab] }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(tab === "privacy" ? "Privacy Policy salvata" : "Cookie Policy salvata");
      setJustSaved(tab);
      setTimeout(() => setJustSaved(null), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(null);
    }
  }

  const tabs: { id: Tab; label: string; href: string }[] = [
    { id: "privacy", label: "Privacy Policy", href: "/privacy" },
    { id: "cookie", label: "Cookie Policy", href: "/cookie-policy" },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Privacy & Cookie Policy</h1>
          <p className="text-gray-500 text-sm mt-1">Modifica i testi legali del sito. Attivi immediatamente.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#072316] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {justSaved === tab.id && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">
              {activeTab === "privacy" ? "Privacy Policy" : "Cookie Policy"}
            </span>
            {justSaved === activeTab && (
              <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Salvato
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={activeTab === "privacy" ? "/privacy" : "/cookie-policy"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#072316] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Vedi sul sito
            </a>
            <button
              onClick={() => saveTab(activeTab)}
              disabled={saving === activeTab}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#072316] hover:bg-[#0F3D28] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              {saving === activeTab ? "Salvataggio…" : "Salva"}
            </button>
          </div>
        </div>

        <div className="p-5">
          <RichEditor
            key={activeTab}
            value={values[activeTab]}
            onChange={(html) => setValues((prev) => ({ ...prev, [activeTab]: html }))}
            placeholder={activeTab === "privacy" ? "Scrivi la Privacy Policy…" : "Scrivi la Cookie Policy…"}
            minHeight={500}
          />
          <p className="mt-2 text-xs text-gray-400">Lascia vuoto per usare il testo predefinito del sito</p>
        </div>
      </div>

      {/* Save bottom */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => saveTab(activeTab)}
          disabled={saving === activeTab}
          className="flex items-center gap-2 px-6 py-3 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving === activeTab ? "Salvataggio…" : `Salva ${activeTab === "privacy" ? "Privacy Policy" : "Cookie Policy"}`}
        </button>
      </div>
    </div>
  );
}
