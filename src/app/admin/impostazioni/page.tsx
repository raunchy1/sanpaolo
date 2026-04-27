"use client";

import { useState, useEffect, useRef } from "react";
import { Save, RefreshCw, Phone, Link, Shield, CheckCircle, Search, Upload, Loader2 } from "lucide-react";
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
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  bookingReviewCount: string;
  airbnbReviewCount: string;
  googleReviewCount: string;
  googleReviewsLink: string;
  heroImage: string;
  bookingScore: string;
  airbnbScore: string;
  googleScore: string;
  overallScore: string;
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
  seoTitle: "",
  seoDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  bookingReviewCount: "",
  airbnbReviewCount: "",
  googleReviewCount: "",
  googleReviewsLink: "",
  heroImage: "",
  bookingScore: "",
  airbnbScore: "",
  googleScore: "",
  overallScore: "",
};

type SectionId = "contatti" | "piattaforme" | "legale" | "seo" | "recensioni";

interface FieldDef {
  key: keyof Settings;
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string; // "text" | "email" | "url" | "textarea"
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
      { key: "googleReviewsLink", label: "Link Google Recensioni", placeholder: "https://g.page/r/..." },
      { key: "instagramLink", label: "Link Instagram", placeholder: "https://www.instagram.com/..." },
      { key: "mapsLink", label: "Link Google Maps", placeholder: "https://maps.google.com/?q=..." },
      { key: "heroImage", label: "Immagine di sfondo Hero (URL)", placeholder: "/images/hero-sanpaolo.png", hint: "URL completo o percorso relativo dell'immagine di sfondo della prima schermata" },
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
  {
    id: "seo",
    label: "SEO & Meta Tag",
    icon: Search,
    fields: [
      { key: "seoTitle", label: "Titolo pagina (title tag)", placeholder: "San Paolo Hideout | Boutique Vacation Rental Rome", hint: "Lascia vuoto per usare il valore predefinito. Ideale: 50-60 caratteri." },
      { key: "seoDescription", label: "Meta description", placeholder: "Boutique vacation rental in Rome near Metro B...", hint: "Lascia vuoto per usare il valore predefinito. Ideale: 150-160 caratteri.", type: "textarea" },
      { key: "ogTitle", label: "OG Title (condivisione social)", placeholder: "San Paolo Hideout — Roma | Casa Vacanze Boutique" },
      { key: "ogDescription", label: "OG Description (condivisione social)", placeholder: "Il tuo rifugio romano vicino alla Metro B...", type: "textarea" },
      { key: "ogImage", label: "OG Image URL (immagine di anteprima social)", placeholder: "https://sanpaolohideout.it/images/hero-trevi.jpg", hint: "URL completo dell'immagine. Dimensioni consigliate: 1200×630px." },
    ],
  },
  {
    id: "recensioni",
    label: "Contatori Recensioni",
    icon: CheckCircle,
    fields: [
      { key: "bookingScore", label: "Punteggio Booking.com", placeholder: "9.9/10", hint: "Es. 9.9/10 — mostrato nella barra hero" },
      { key: "airbnbScore", label: "Punteggio Airbnb", placeholder: "5/5", hint: "Es. 5/5 — mostrato nella barra hero" },
      { key: "googleScore", label: "Punteggio Google", placeholder: "5/5", hint: "Es. 5/5 — mostrato nella barra hero" },
      { key: "overallScore", label: "Punteggio generale (sezione recensioni)", placeholder: "9.9", hint: "Es. 9.9 — il numero grande nella sezione Cosa Dicono i Nostri Ospiti" },
      { key: "bookingReviewCount", label: "N° recensioni Booking.com", placeholder: "19", hint: "Numero mostrato nella barra reviews dell'hero" },
      { key: "airbnbReviewCount", label: "N° recensioni Airbnb", placeholder: "6", hint: "Numero mostrato nella barra reviews dell'hero" },
      { key: "googleReviewCount", label: "N° recensioni Google", placeholder: "19", hint: "Numero mostrato nella barra reviews dell'hero" },
    ],
  },
];

export default function ImpostazioniPage() {
  const [values, setValues] = useState<Settings>(EMPTY);
  const [saved, setSaved] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SectionId | null>(null);
  const [justSaved, setJustSaved] = useState<SectionId | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const ogFileRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File, folder: string, field: "heroImage" | "ogImage", setLoad: (v: boolean) => void) {
    setLoad(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setValues((prev) => ({ ...prev, [field]: data.url }));
      toast.success("Immagine caricata — clicca Salva per applicare");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      setLoad(false);
    }
  }

  const uploadHeroImage = (file: File) => uploadImage(file, "hero", "heroImage", setUploading);
  const uploadOgImage   = (file: File) => uploadImage(file, "og", "ogImage", setUploadingOg);

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
                {section.fields.map((field) => {
                  const isWide = field.key.includes("Link") || field.key.includes("Description") || field.key.includes("description") || field.key.includes("Image") || field.key.includes("Title") || field.key.includes("title");
                  const isTextarea = field.type === "textarea";
                  const val = values[field.key];
                  return (
                    <div key={field.key} className={isWide ? "sm:col-span-2" : ""}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        {isTextarea && val && (
                          <span className={`text-xs ${val.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                            {val.length} car.
                          </span>
                        )}
                      </div>
                      {(field.key === "heroImage" || field.key === "ogImage") ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                              placeholder={field.placeholder}
                              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => field.key === "ogImage" ? ogFileRef.current?.click() : heroFileRef.current?.click()}
                              disabled={field.key === "ogImage" ? uploadingOg : uploading}
                              className="flex items-center gap-2 px-4 py-2.5 bg-[#072316] hover:bg-[#0F3D28] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors shrink-0"
                            >
                              {(field.key === "ogImage" ? uploadingOg : uploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              {(field.key === "ogImage" ? uploadingOg : uploading) ? "Caricamento…" : "Carica"}
                            </button>
                            {/* File inputs rendered once via refs outside the loop */}
                          </div>
                          {val && (val.startsWith("http") || val.startsWith("/")) && (
                            <img src={val} alt="Preview" className="h-24 w-full object-cover rounded-xl border border-gray-200" />
                          )}
                          {field.key === "ogImage" && (
                            <p className="text-xs text-gray-400">Dimensioni consigliate: 1200×630px — questa foto appare quando condividi il link su WhatsApp/social.</p>
                          )}
                        </div>
                      ) : isTextarea ? (
                        <textarea
                          value={val}
                          onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all resize-none"
                        />
                      ) : (
                        <input
                          type={field.type || "text"}
                          value={val}
                          onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all"
                        />
                      )}
                      {field.hint && <p className="mt-1 text-xs text-gray-400">{field.hint}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden file inputs — rendered once, outside loop */}
      <input ref={heroFileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadHeroImage(f); e.target.value = ""; }} />
      <input ref={ogFileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadOgImage(f); e.target.value = ""; }} />
    </div>
  );
}
