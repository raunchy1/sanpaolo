"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { it } from "date-fns/locale";
import { format } from "date-fns";
import { Lock, Unlock, RefreshCw, AlertCircle, Plus, Trash2, RotateCcw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import "react-day-picker/style.css";

interface AvailabilityBlock {
  id: string;
  date: string;
  reason?: string;
}

interface ICalSource {
  id: string;
  label: string;
  url: string;
  platform: "airbnb" | "booking" | "other";
  lastSync?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  airbnb: "bg-rose-100 text-rose-700",
  booking: "bg-blue-100 text-blue-700",
  other: "bg-gray-100 text-gray-600",
};

export default function CalendarioPage() {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Date[]>([]);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  // iCal state
  const [icalSources, setIcalSources] = useState<ICalSource[]>([]);
  const [icalLoading, setIcalLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showIcalForm, setShowIcalForm] = useState(false);
  const [icalForm, setIcalForm] = useState({ label: "", url: "", platform: "airbnb" as ICalSource["platform"] });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/availability");
      const data = await res.json();
      setBlocks(data.blocks || []);
    } catch {
      toast.error("Errore nel caricamento del calendario");
    } finally {
      setLoading(false);
    }
  }, []);

  async function fetchIcal() {
    setIcalLoading(true);
    try {
      const res = await fetch("/api/admin/ical");
      const data = await res.json();
      setIcalSources(data.sources || []);
    } catch {
      // silent
    } finally {
      setIcalLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    fetchIcal();
  }, [fetchData]);

  const blockedDates = blocks.map((b) => new Date(b.date));

  async function blockSelected() {
    if (selected.length === 0) {
      toast.error("Seleziona almeno una data");
      return;
    }
    setSaving(true);
    try {
      for (const date of selected) {
        await fetch("/api/admin/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: new Date(
              Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            ).toISOString(),
            reason: reason || undefined,
          }),
        });
      }
      toast.success(`${selected.length} ${selected.length === 1 ? "data bloccata" : "date bloccate"}`);
      setSelected([]);
      setReason("");
      fetchData();
    } catch {
      toast.error("Errore durante il blocco delle date");
    } finally {
      setSaving(false);
    }
  }

  async function unblockDate(dateStr: string) {
    setSaving(true);
    try {
      await fetch(`/api/admin/availability?date=${encodeURIComponent(dateStr)}`, {
        method: "DELETE",
      });
      toast.success("Data sbloccata");
      fetchData();
    } catch {
      toast.error("Errore durante lo sblocco");
    } finally {
      setSaving(false);
    }
  }

  async function addIcalSource() {
    if (!icalForm.url.trim()) { toast.error("URL obbligatorio"); return; }
    try {
      const res = await fetch("/api/admin/ical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(icalForm),
      });
      if (!res.ok) throw new Error();
      toast.success("Calendario aggiunto");
      setShowIcalForm(false);
      setIcalForm({ label: "", url: "", platform: "airbnb" });
      fetchIcal();
    } catch {
      toast.error("Errore durante il salvataggio");
    }
  }

  async function deleteIcalSource(id: string) {
    try {
      await fetch(`/api/admin/ical?id=${id}`, { method: "DELETE" });
      setIcalSources((prev) => prev.filter((s) => s.id !== id));
      toast.success("Calendario rimosso");
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  }

  async function syncIcal() {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/ical/sync", { method: "POST" });
      const data = await res.json();
      if (data.errors && data.errors.length > 0) {
        data.errors.forEach((e: { label: string; error: string }) =>
          toast.error(`${e.label}: ${e.error}`)
        );
      }
      if (data.synced > 0 || data.added > 0) {
        toast.success(`Sincronizzati ${data.synced} calendari · ${data.added} date importate`);
      } else if (!data.errors || data.errors.length === 0) {
        toast.success("Nessuna nuova data da importare");
      }
      fetchData();
      fetchIcal();
    } catch {
      toast.error("Errore durante la sincronizzazione");
    } finally {
      setSyncing(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Calendario disponibilità</h1>
          <p className="text-gray-500 text-sm mt-1">Blocca le date non disponibili</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Aggiorna
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Seleziona le date da bloccare</h2>
          <p className="text-sm text-gray-500 mb-4">
            Le date in <span className="text-red-500 font-medium">rosso</span> sono già bloccate.
            Clicca per selezionare nuove date da bloccare.
          </p>

          <div className="flex justify-center">
            <DayPicker
              mode="multiple"
              selected={selected}
              onSelect={(dates) => setSelected(dates || [])}
              locale={it}
              disabled={[
                { before: new Date() },
                ...blockedDates,
              ]}
              modifiers={{
                blocked: blockedDates,
              }}
              modifiersClassNames={{
                blocked: "!bg-red-100 !text-red-600 !font-semibold",
                selected: "!bg-[#072316] !text-white",
              }}
              classNames={{
                today: "font-bold underline",
              }}
            />
          </div>

          {selected.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{selected.length}</span>{" "}
                {selected.length === 1 ? "data selezionata" : "date selezionate"}:{" "}
                {selected.map((d) => format(d, "d MMM", { locale: it })).join(", ")}
              </div>

              <input
                type="text"
                placeholder="Motivo (opzionale): es. Manutenzione, uso personale…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
              />

              <button
                onClick={blockSelected}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-[#072316] hover:bg-[#0F3D28] text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {saving ? "Salvataggio…" : `Blocca ${selected.length} ${selected.length === 1 ? "data" : "date"}`}
              </button>
            </div>
          )}
        </div>

        {/* Lista date bloccate */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Date bloccate{" "}
            <span className="ml-1 text-sm font-normal text-gray-400">({blocks.length})</span>
          </h2>

          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">Nessuna data bloccata</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {[...blocks]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((block) => {
                  const date = new Date(block.date);
                  const isPast = date < new Date();
                  return (
                    <div
                      key={block.id}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border ${
                        isPast ? "bg-gray-50 border-gray-100 opacity-60" : "bg-red-50/50 border-red-100"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 text-sm">
                          {format(date, "EEEE d MMMM yyyy", { locale: it })}
                        </div>
                        {block.reason && (
                          <div className="text-xs text-gray-500 truncate">{block.reason}</div>
                        )}
                      </div>
                      <button
                        onClick={() => unblockDate(block.date)}
                        disabled={saving}
                        title="Sblocca data"
                        className="flex-shrink-0 p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-green-600 hover:border-green-300 transition-colors disabled:opacity-50"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* iCal sync section */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-semibold text-gray-900">Sincronizzazione iCal</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Importa automaticamente le prenotazioni da Airbnb e Booking.com
            </p>
            {/* Auto-sync badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Auto-sync ogni 2 ore
              </span>
              {icalSources.length > 0 && icalSources[0].lastSync && (
                <span className="text-xs text-gray-400">
                  Ultima: {new Date(icalSources[0].lastSync).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowIcalForm(!showIcalForm)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Aggiungi
            </button>
            <button
              onClick={syncIcal}
              disabled={syncing || icalSources.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
            >
              {syncing ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {syncing ? "Sincronizzazione…" : "Sincronizza ora"}
            </button>
          </div>
        </div>

        {/* Add iCal form */}
        {showIcalForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Piattaforma</label>
                <select
                  value={icalForm.platform}
                  onChange={(e) => setIcalForm((p) => ({ ...p, platform: e.target.value as ICalSource["platform"] }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20"
                >
                  <option value="airbnb">Airbnb</option>
                  <option value="booking">Booking.com</option>
                  <option value="other">Altro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome (opzionale)</label>
                <input
                  type="text"
                  value={icalForm.label}
                  onChange={(e) => setIcalForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="es. Airbnb principale"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL iCal *</label>
                <input
                  type="url"
                  value={icalForm.url}
                  onChange={(e) => setIcalForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://www.airbnb.com/calendar/ical/…"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowIcalForm(false); setIcalForm({ label: "", url: "", platform: "airbnb" }); }}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900"
              >
                Annulla
              </button>
              <button
                onClick={addIcalSource}
                className="px-4 py-1.5 bg-[#072316] text-white text-sm rounded-lg hover:bg-[#0F3D28] transition-colors"
              >
                Aggiungi
              </button>
            </div>
          </div>
        )}

        {/* Sources list */}
        {icalLoading ? (
          <div className="mt-4 text-sm text-gray-400">Caricamento…</div>
        ) : icalSources.length === 0 ? (
          <div className="mt-4 text-sm text-gray-400 py-4 text-center">
            Nessun calendario collegato. Aggiungi il link iCal da Airbnb o Booking.com.
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {icalSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${PLATFORM_COLORS[source.platform]}`}>
                  {source.platform}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {source.label || source.platform}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{source.url}</div>
                  {source.lastSync && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      Ultima sync: {new Date(source.lastSync).toLocaleString("it-IT")}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteIcalSource(source.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Rimuovi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Come trovare l&apos;URL iCal: su Airbnb → Calendario → Esporta; su Booking.com → Struttura → Calendario → iCal.
        </p>
      </div>
    </div>
  );
}
