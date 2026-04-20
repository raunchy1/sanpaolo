"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { it } from "date-fns/locale";
import { format } from "date-fns";
import { Lock, Unlock, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import "react-day-picker/style.css";

interface AvailabilityBlock {
  id: string;
  date: string;
  reason?: string;
}

export default function CalendarioPage() {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Date[]>([]);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchData();
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
    </div>
  );
}
