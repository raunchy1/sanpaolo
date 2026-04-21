"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface LegalContent {
  privacy: string;
  cookie: string;
}

const PRIVACY_DEFAULT = `Ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR), San Paolo Hideout informa che i dati personali forniti tramite il sito web saranno trattati esclusivamente per rispondere alle richieste di informazioni e per gestire le prenotazioni.

## Titolare del trattamento

Titolare del trattamento è il gestore di San Paolo Hideout, con sede in Via Silvio d'Amico 96, 00145 Roma. Per qualsiasi richiesta è possibile contattarci all'indirizzo email sanpaolohideout@gmail.com.

## Dati raccolti

Raccogliamo esclusivamente i dati necessari alla prenotazione e alla comunicazione (nome, cognome, indirizzo email, numero di telefono). Non utilizziamo cookie di profilazione di terze parti.

## Diritti dell'interessato

L'interessato ha diritto di accesso, retifica, cancellazione, limitazione del trattamento, opposizione e portabilità dei dati. Per esercitare tali diritti è sufficiente inviare una richiesta all'indirizzo email indicato.`;

const COOKIE_DEFAULT = `Il sito sanpaolohideout.it utilizza cookie tecnici necessari al corretto funzionamento della piattaforma e per garantire una migliore esperienza di navigazione.

## Cookie tecnici

I cookie tecnici sono indispensabili per il funzionamento del sito e non richiedono il consenso dell'utente. Essi consentono, ad esempio, di mantenere la preferenza della lingua selezionata.

## Cookie di terze parti

Non utilizziamo cookie di profilazione né strumenti di tracciamento comportamentale. Eventuali collegamenti a piattaforme esterne (Booking.com, Airbnb, Google Maps) sono regolati dalle rispettive privacy policy.

## Come disabilitare i cookie

È possibile disabilitare i cookie direttamente dalle impostazioni del browser. Si segnala che la disattivazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito.`;

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

  const placeholder = activeTab === "privacy" ? PRIVACY_DEFAULT : COOKIE_DEFAULT;
  const charCount = values[activeTab].length;

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

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-6">
        <strong>Formattazione:</strong> usa <code className="bg-blue-100 px-1 rounded">## Titolo paragrafo</code> per creare un titolo e una riga vuota per separare i paragrafi.
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
          <textarea
            value={values[activeTab]}
            onChange={(e) => setValues((prev) => ({ ...prev, [activeTab]: e.target.value }))}
            placeholder={placeholder}
            rows={24}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all resize-y font-mono leading-relaxed"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>Lascia vuoto per usare il testo predefinito del sito</span>
            {charCount > 0 && <span>{charCount} caratteri</span>}
          </div>
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
