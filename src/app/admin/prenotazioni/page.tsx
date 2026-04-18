"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, RefreshCw, User, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

const STATUS_CONFIG = {
  PENDING: { label: "In attesa", color: "bg-amber-100 text-amber-800", icon: Clock },
  CONFIRMED: { label: "Confermata", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Annullata", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function PrenotazioniPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookings(data);
    } catch {
      toast.error("Errore nel caricamento delle prenotazioni");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success("Stato aggiornato con successo");
    } catch {
      toast.error("Errore nell'aggiornamento");
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prenotazioni</h1>
          <p className="text-gray-500 text-sm mt-1">Gestisci le richieste di prenotazione</p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Aggiorna
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === s
                ? "bg-[#072316] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "ALL" ? "Tutte" : STATUS_CONFIG[s].label}{" "}
            <span className="ml-1 opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-gray-300 mb-3">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">Nessuna prenotazione trovata</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const cfg = STATUS_CONFIG[booking.status];
            const Icon = cfg.icon;
            const nights = Math.round(
              (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                86400000
            );

            return (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        Ricevuta il {new Date(booking.createdAt).toLocaleDateString("it-IT")}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400" />
                      {booking.name}
                    </h3>

                    <div className="mt-1 text-sm text-gray-500 space-y-0.5">
                      <div>{booking.email}</div>
                      {booking.phone && <div>{booking.phone}</div>}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(booking.checkIn).toLocaleDateString("it-IT")} →{" "}
                          {new Date(booking.checkOut).toLocaleDateString("it-IT")}
                        </span>
                        <span className="text-gray-400">({nights} {nights === 1 ? "notte" : "notti"})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        {booking.guests} {booking.guests === 1 ? "ospite" : "ospiti"}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="font-medium text-gray-700">Note: </span>
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {booking.status !== "CONFIRMED" && (
                      <button
                        onClick={() => updateStatus(booking.id, "CONFIRMED")}
                        disabled={updating === booking.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Conferma
                      </button>
                    )}
                    {booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => updateStatus(booking.id, "CANCELLED")}
                        disabled={updating === booking.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Annulla
                      </button>
                    )}
                    {booking.status !== "PENDING" && (
                      <button
                        onClick={() => updateStatus(booking.id, "PENDING")}
                        disabled={updating === booking.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Rimetti in attesa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
