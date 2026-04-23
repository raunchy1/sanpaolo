"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Save, RefreshCw, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const RichEditor = dynamic(() => import("@/components/ui/RichEditor"), { ssr: false });

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  { id: "q1", question: "Come funziona il check-in?", answer: "Il check-in è disponibile nella fascia 15:00–20:00. Per esigenze particolari gli ospiti possono scriverci e faremo il possibile per venirgli incontro. Vi accogliamo di persona — l'accoglienza personalizzata è la nostra priorità." },
  { id: "q2", question: "Quanto dista la fermata della Metro?", answer: "La fermata Basilica San Paolo della Metro B è a 9 minuti a piedi. Da lì puoi raggiungere il Colosseo in 4 fermate, Termini in 6 fermate e l'EUR in 7 minuti." },
  { id: "q3", question: "C'è il parcheggio?", answer: "Il parcheggio gratuito si trova proprio di fronte alla struttura. Non è un posto assegnato o prenotabile, ma la disponibilità è garantita. L'accesso avviene da una strada privata utilizzata esclusivamente dai residenti, rendendo l'area tranquilla e sicura." },
  { id: "q4", question: "Come arrivo dall'aeroporto?", answer: "Dall'aeroporto di Fiumicino, prendi il treno regionale per Roma Ostiense (20-25 min), poi 2 fermate di Metro B fino a Basilica San Paolo." },
  { id: "q5", question: "È adatto per famiglie con bambini?", answer: "Assolutamente sì! La casa indipendente con area esterna verde è perfetta per i bambini. Abbiamo culla disponibile su richiesta. La casa è spaziosa e sicura per i più piccoli." },
  { id: "q6", question: "Posso lavorare da qui?", answer: "Certamente! Wi-Fi fibra veloce, ambiente tranquillo e casa indipendente. Ideale per smart working, visiting professor o viaggi d'affari all'EUR." },
  { id: "q7", question: "Qual è la struttura della casa?", answer: "San Paolo Hideout è una casa indipendente di nuova costruzione (2025) con: salotto con Smart TV e divano, cucina completamente attrezzata con zona pranzo, camera matrimoniale, seconda camera con letto da una piazza e mezza, bagno con doccia, e area esterna verde condivisa. Perfetta per 3 ospiti." },
];

export default function FaqAdminPage() {
  const [items, setItems] = useState<FaqItem[]>(DEFAULT_FAQS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faq");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setItems(data);
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
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("FAQ salvate con successo");
      setSavedId(true);
      setTimeout(() => setSavedId(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function addFaq() {
    const newItem: FaqItem = { id: Date.now().toString(), question: "", answer: "" };
    setItems((prev) => [...prev, newItem]);
    setTimeout(() => {
      document.getElementById(`faq-q-${newItem.id}`)?.focus();
    }, 50);
  }

  function updateItem(id: string, field: "question" | "answer", value: string) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  }

  function deleteItem(id: string) {
    if (!window.confirm("Eliminare questa FAQ?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("FAQ eliminata");
  }

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} domande — modifiche attive immediatamente sul sito</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio…" : savedId ? "✓ Salvato" : "Salva"}
          </button>
        </div>
      </div>

      {/* FAQ list */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-stretch">
              {/* Order controls */}
              <div className="flex flex-col items-center justify-center gap-1 px-2 py-3 bg-gray-50 border-r border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 w-5 text-center">{idx + 1}</span>
                <button
                  onClick={() => move(item.id, -1)}
                  disabled={idx === 0}
                  className="p-1 rounded text-gray-400 hover:text-[#072316] disabled:opacity-20 transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => move(item.id, 1)}
                  disabled={idx === items.length - 1}
                  className="p-1 rounded text-gray-400 hover:text-[#072316] disabled:opacity-20 transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 p-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Domanda</label>
                  <input
                    id={`faq-q-${item.id}`}
                    type="text"
                    value={item.question}
                    onChange={(e) => updateItem(item.id, "question", e.target.value)}
                    placeholder="es. Come funziona il check-in?"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Risposta</label>
                  <RichEditor
                    value={item.answer}
                    onChange={(html) => updateItem(item.id, "answer", html)}
                    placeholder="Scrivi qui la risposta…"
                    minHeight={80}
                  />
                </div>
              </div>

              {/* Delete */}
              <div className="flex items-center px-3 border-l border-gray-100">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Elimina domanda"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={addFaq}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-200 hover:border-[#072316]/40 hover:bg-[#072316]/3 rounded-2xl text-gray-400 hover:text-[#072316] transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Aggiungi nuova domanda
      </button>

      {/* Save bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Salvataggio…" : "Salva FAQ"}
        </button>
      </div>
    </div>
  );
}
