"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle, XCircle, Clock, RefreshCw, User, Calendar, Users,
  Plus, Pencil, Trash2, X, Phone, Mail, FileText, Save,
} from "lucide-react";
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

interface FormData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  status: BookingStatus;
  notes: string;
}

const EMPTY_FORM: FormData = {
  name: "", email: "", phone: "", checkIn: "", checkOut: "",
  guests: "2", status: "CONFIRMED", notes: "",
};

const STATUS_CONFIG = {
  PENDING:   { label: "In attesa",  color: "bg-amber-100 text-amber-800",  icon: Clock },
  CONFIRMED: { label: "Confermata", color: "bg-green-100 text-green-800",  icon: CheckCircle },
  CANCELLED: { label: "Annullata",  color: "bg-red-100 text-red-700",      icon: XCircle },
};

function toLocalDate(isoStr: string) {
  // parse YYYY-MM-DD without timezone shift
  const [y, m, d] = isoStr.slice(0, 10).split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function formatDate(isoStr: string) {
  return toLocalDate(isoStr).toLocaleDateString("it-IT", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function nightsBetween(ci: string, co: string) {
  return Math.round((toLocalDate(co).getTime() - toLocalDate(ci).getTime()) / 86400000);
}

export default function PrenotazioniPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      if (!res.ok) throw new Error();
      setBookings(await res.json());
    } catch {
      toast.error("Errore nel caricamento delle prenotazioni");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(b: Booking) {
    setForm({
      name: b.name,
      email: b.email,
      phone: b.phone || "",
      checkIn: b.checkIn.slice(0, 10),
      checkOut: b.checkOut.slice(0, 10),
      guests: String(b.guests),
      status: b.status,
      notes: b.notes || "",
    });
    setEditingId(b.id);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingId(null);
  }

  function setField<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function saveBooking() {
    if (!form.name.trim() || !form.email.trim() || !form.checkIn || !form.checkOut || !form.guests) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    if (form.checkOut <= form.checkIn) {
      toast.error("Il check-out deve essere dopo il check-in");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        status: form.status,
        notes: form.notes.trim() || undefined,
      };

      if (editingId) {
        const res = await fetch("/api/admin/bookings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const { booking } = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === editingId ? booking : b)));
        toast.success("Prenotazione aggiornata");
      } else {
        const res = await fetch("/api/admin/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const { booking } = await res.json();
        setBookings((prev) => [booking, ...prev]);
        toast.success("Prenotazione aggiunta");
      }
      closeDrawer();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBooking(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/bookings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Prenotazione eliminata");
    } catch {
      toast.error("Errore durante l'eliminazione");
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  }

  async function updateStatus(id: string, status: BookingStatus) {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success("Stato aggiornato");
    } catch {
      toast.error("Errore nell'aggiornamento");
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
    <div className="p-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prenotazioni</h1>
          <p className="text-gray-500 text-sm mt-1">Gestisci le richieste di prenotazione</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuova prenotazione
          </button>
        </div>
      </div>

      {/* Filters */}
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

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 mb-4">Nessuna prenotazione trovata</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Aggiungi la prima prenotazione
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const cfg = STATUS_CONFIG[booking.status];
            const Icon = cfg.icon;
            const nights = booking.checkIn && booking.checkOut ? nightsBetween(booking.checkIn, booking.checkOut) : 0;
            const isDeleting = deletingId === booking.id;
            const confirmDelete = deleteConfirmId === booking.id;

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
                        Aggiunta il {new Date(booking.createdAt).toLocaleDateString("it-IT")}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      {booking.name}
                    </h3>

                    <div className="mt-1 text-sm text-gray-500 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <a href={`mailto:${booking.email}`} className="hover:text-[#072316] transition-colors">
                          {booking.email}
                        </a>
                      </div>
                      {booking.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          <a href={`tel:${booking.phone}`} className="hover:text-[#072316] transition-colors">
                            {booking.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                        </span>
                        {nights > 0 && (
                          <span className="text-gray-400">({nights} {nights === 1 ? "notte" : "notti"})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        {booking.guests} {booking.guests === 1 ? "ospite" : "ospiti"}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 flex items-start gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {/* Status buttons */}
                    {booking.status !== "CONFIRMED" && (
                      <button
                        onClick={() => updateStatus(booking.id, "CONFIRMED")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Conferma
                      </button>
                    )}
                    {booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => updateStatus(booking.id, "CANCELLED")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Annulla
                      </button>
                    )}
                    {booking.status !== "PENDING" && (
                      <button
                        onClick={() => updateStatus(booking.id, "PENDING")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-lg transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        In attesa
                      </button>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-1 flex gap-1.5">
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(booking)}
                        title="Modifica prenotazione"
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white border border-gray-200 text-gray-500 hover:text-[#072316] hover:border-[#072316]/30 text-xs font-medium rounded-lg transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Modifica
                      </button>

                      {/* Delete */}
                      {confirmDelete ? (
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          disabled={isDeleting}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? "…" : "Conferma"}
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(booking.id)}
                          title="Elimina prenotazione"
                          className="flex items-center justify-center px-2 py-2 bg-white border border-gray-200 text-red-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {confirmDelete && (
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex items-center justify-center px-2 py-2 bg-white border border-gray-200 text-gray-500 rounded-lg transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Drawer ─── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">
                {editingId ? "Modifica prenotazione" : "Nuova prenotazione"}
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nome ospite <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Mario Rossi"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="mario@email.com"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                />
              </div>

              {/* Telefono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Telefono / WhatsApp
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+39 333 123 4567"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                />
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Check-in <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setField("checkIn", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Check-out <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) => setField("checkOut", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                  />
                </div>
              </div>

              {/* Notti preview */}
              {form.checkIn && form.checkOut && form.checkOut > form.checkIn && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-800">
                  {nightsBetween(form.checkIn, form.checkOut)} {nightsBetween(form.checkIn, form.checkOut) === 1 ? "notte" : "notti"} di soggiorno
                </div>
              )}

              {/* Ospiti */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Numero ospiti <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => setField("guests", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "ospite" : "ospiti"}</option>
                  ))}
                </select>
              </div>

              {/* Stato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stato</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["CONFIRMED", "PENDING", "CANCELLED"] as BookingStatus[]).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setField("status", s)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                          form.status === s
                            ? "border-[#072316] bg-[#072316]/5 text-[#072316]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Note (opzionale)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Richieste speciali, note sull'ospite…"
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeDrawer}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={saveBooking}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Salvataggio…" : editingId ? "Aggiorna" : "Aggiungi"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
