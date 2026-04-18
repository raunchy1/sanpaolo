"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Phone, Link, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  phone: string;
  whatsapp: string;
  email: string;
  checkinFrom: string;
  checkinTo: string;
  airbnbLink: string;
  bookingLink: string;
  airbnbReviewsLink: string;
  bookingReviewsLink: string;
  instagramLink: string;
  mapsLink: string;
  cin: string;
  cir: string;
  protocollo: string;
}

const EMPTY: Settings = {
  phone: "",
  whatsapp: "",
  email: "",
  checkinFrom: "",
  checkinTo: "",
  airbnbLink: "",
  bookingLink: "",
  airbnbReviewsLink: "",
  bookingReviewsLink: "",
  instagramLink: "",
  mapsLink: "",
  cin: "",
  cir: "",
  protocollo: "",
};

type SectionId = "contatti" | "piattaforme" | "legale";

interface FieldDef {
  key: keyof Settings;
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
}

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType; fields: FieldDef[] }[] = [
  {
    id: "contatti",
    label: "Contatti",
    icon: Phone,
    fields: [
      { key: "phone", label: "Telefono", placeholder: "+393299362759", hint: "Con prefisso internazionale" },
      { key: "whatsapp", label: "WhatsApp (solo numeri)", placeholder: "393299362759", hint: "Senza + né spazi — es. 393299362759" },
      { key: "email", label: "Email", placeholder: "sanpaolohideout@gmail.com", type: "email" },
      { key: "checkinFrom", label: "Check-in dalle", placeholder: "15:00", hint: "Orario inizio check-in" },
      { key: "checkinTo", label: "Check-in fino alle", placeholder: "20:00", hint: "Orario fine check-in" },
    ],
  },
  {
    id: "piattaforme",
    label: "Link Piattaforme",
    icon: Link,
    fields: [
      { key: "airbnbLink", label: "Link Airbnb (prenotazione)", placeholder: "https://www.airbnb.com/rooms/..." },
      { key: "bookingLink", label: "Link Booking.com (prenotazione)", placeholder: "https://booking.com/hotel/it/..." },
      { key: "airbnbReviewsLink", label: "Link Airbnb Recensioni", placeholder: "https://www.airbnb.com/rooms/..." },
      { key: "bookingReviewsLink", label: "Link Booking Recensioni", placeholder: "https://www.booking.com/hotel/..." },
      { key: "instagramLink", label: "Link Instagram", placeholder: "https://www.instagram.com/..." },
      { key: "mapsLink", label: "Link Google Maps", placeholder: "https://maps.google.com/?q=..." },
    ],
  },
  {
    id: "legale",
    label: "Info Legali",
    icon: Shield,
    fields: [
      { key: "cin", label: "CIN (Codice Identificativo Nazionale)", placeholder: "IT058091C2OS2A4EP2" },
      { key: "cir", label: "CIR", placeholder: "058091-CAV-15649" },
      { key: "protocollo", label: "Protocollo", placeholder: "QA/2025/66178 del 11/07/2025" },
    ],
  },
];

export default function ImpostazioniPage() {
  const [values, setValues] = useState<Settings>(EMPTY);
  const [saved, setSaved] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SectionId | null>(null);
  const [justSaved, setJustSaved] = useState<SectionId | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setValues({ ...EMPTY, ...data });
      setSaved({ ...EMPTY, ...data });
    } catch {
      toast.error("Errore nel caricamento delle impostazioni");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function hasChanges(sectionId: SectionId) {
    const section = SECTIONS.find((s) => s.id === sectionId)!;
    return section.fields.some((f) => values[f.key] !== saved[f.key]);
  }

  async function saveSection(sectionId: SectionId) {
    setSaving(sectionId);
    const section = SECTIONS.find((s) => s.id === sectionId)!;
    const payload: Partial<Settings> = {};
    section.fields.forEach((f) => { payload[f.key] = values[f.key]; });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSaved((prev) => ({ ...prev, ...payload }));
      toast.success(`"${section.label}" salvate con successo`);
      setJustSaved(sectionId);
      setTimeout(() => setJustSaved(null), 3000);
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(null);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
          <p className="text-gray-500 text-sm mt-1">
            Contatti, link piattaforme e info legali. Le modifiche sono attive immediatamente.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Ricarica
        </button>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const changed = hasChanges(section.id);
          const isSaving = saving === section.id;
          const saved_ = justSaved === section.id;

          return (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#072316]/8 text-[#072316]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-gray-900">{section.label}</span>
                  {changed && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      Modifiche non salvate
                    </span>
                  )}
                  {saved_ && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Salvato
                    </span>
                  )}
                </div>
                <button
                  onClick={() => saveSection(section.id)}
                  disabled={isSaving || !changed}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#072316] hover:bg-[#0F3D28] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? "Salvataggio…" : "Salva"}
                </button>
              </div>

              {/* Fields */}
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.key} className={field.key.includes("Link") ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      value={values[field.key]}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all"
                    />
                    {field.hint && (
                      <p className="mt-1 text-xs text-gray-400">{field.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
