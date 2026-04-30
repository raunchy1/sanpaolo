"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, CheckCircle, Loader2, ExternalLink, Info } from "lucide-react";
import { toast } from "sonner";

export default function SocialImagePage() {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const url = data.ogImage || "";
        setCurrentUrl(url);
        setPreviewUrl(url);
      })
      .catch(() => toast.error("Errore nel caricamento"))
      .finally(() => setLoading(false));
  }, []);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Seleziona un file immagine (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Immagine troppo grande. Massimo 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "og");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPreviewUrl(data.url);
      setCurrentUrl(data.url);
      await saveUrl(data.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il caricamento");
    } finally {
      setUploading(false);
    }
  }

  async function saveUrl(url: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ogImage: url }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      toast.success("Immagine aggiornata! Apparirà nei nuovi link condivisi ✓");
    } catch {
      toast.error("Errore durante il salvataggio. Riprova.");
    } finally {
      setSaving(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#072316]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Immagine anteprima social</h1>
        <p className="mt-1 text-sm text-gray-500">
          Questa è la foto che appare quando condividi il link del sito su WhatsApp, Facebook, Instagram e altri.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <div className="text-sm text-blue-800">
          <strong>Dimensioni consigliate:</strong> 1200 × 630 px — formato orizzontale.
          Formati accettati: JPG, PNG, WebP. Massimo 5 MB.
        </div>
      </div>

      {/* Current preview */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Anteprima attuale</label>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          {previewUrl ? (
            <div>
              {/* WhatsApp-style preview */}
              <div className="border-b border-gray-200 bg-white px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Anteprima WhatsApp / Social
                </p>
              </div>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="OG image preview"
                  className="h-52 w-full object-cover"
                  onError={() => setPreviewUrl("")}
                />
              </div>
              <div className="bg-[#f0f2f5] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-gray-500">SANPAOLOHIDEOUT.IT</p>
                <p className="text-sm font-semibold text-gray-900">San Paolo Hideout — Roma | Casa Vacanze con Area Verde</p>
              </div>
            </div>
          ) : (
            <div className="flex h-52 flex-col items-center justify-center gap-2 text-gray-400">
              <ImageIcon className="h-10 w-10 opacity-30" />
              <p className="text-sm">Nessuna immagine impostata</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="mb-4 cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center transition-colors hover:border-[#072316] hover:bg-gray-50"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {uploading || saving ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#072316]" />
            <p className="text-sm font-medium text-gray-600">
              {uploading ? "Caricamento in corso…" : "Salvataggio…"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#072316]/8">
              <Upload className="h-6 w-6 text-[#072316]" />
            </div>
            <p className="font-medium text-gray-700">Trascina qui la tua foto</p>
            <p className="text-sm text-gray-400">oppure clicca per selezionarla dal dispositivo</p>
          </div>
        )}
      </div>

      {/* Success state */}
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            Immagine salvata con successo! I nuovi link condivisi mostreranno questa foto.
          </p>
        </div>
      )}

      {/* Current URL display */}
      {currentUrl && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="mb-1 text-xs font-medium text-gray-500">URL immagine attuale</p>
          <div className="flex items-center gap-2">
            <p className="flex-1 truncate text-xs text-gray-600 font-mono">{currentUrl}</p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-gray-400 hover:text-gray-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
