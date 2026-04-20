"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, Star, RefreshCw, ChevronUp, ChevronDown, Bookmark } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  platform: "airbnb" | "booking" | "google";
  hidden?: boolean;
  featured?: boolean;
}

const EMPTY_FORM: Omit<Review, "id" | "hidden"> = {
  name: "",
  location: "",
  text: "",
  rating: 5,
  date: new Date().getFullYear().toString(),
  platform: "booking",
};

const platformColors: Record<string, string> = {
  airbnb: "bg-rose-100 text-rose-700",
  booking: "bg-blue-100 text-blue-700",
  google: "bg-yellow-100 text-yellow-700",
};

export default function RecensioniPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Errore nel caricamento delle recensioni");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveAll(updated: Review[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      setReviews(updated);
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function addReview() {
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Nome e testo sono obbligatori");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Recensione aggiunta");
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch {
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function deleteReview(id: string) {
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Recensione eliminata");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      toast.error("Errore durante l'eliminazione");
    }
  }

  async function toggleHidden(review: Review) {
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, hidden: !r.hidden } : r
    );
    await saveAll(updated);
    toast.success(review.hidden ? "Recensione visibile" : "Recensione nascosta");
  }

  async function toggleFeatured(review: Review) {
    const updated = reviews.map((r) =>
      r.id === review.id ? { ...r, featured: !r.featured } : r
    );
    await saveAll(updated);
    toast.success(review.featured ? "Rimossa dai preferiti" : "Aggiunta ai preferiti");
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...reviews];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    saveAll(next);
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
          <h1 className="text-2xl font-bold text-gray-900">Recensioni</h1>
          <p className="text-gray-500 text-sm mt-1">
            {reviews.length} recensioni · trascina o usa le frecce per riordinare
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Aggiungi
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Nuova recensione</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Mario Rossi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provenienza</label>
              <input
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Milano, Italia"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Testo *</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] resize-none"
                value={form.text}
                onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                placeholder="Appartamento fantastico..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm((p) => ({ ...p, rating: n }))}
                    className={`p-1 transition-colors ${n <= form.rating ? "text-amber-400" : "text-gray-300"}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anno</label>
              <input
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                placeholder="2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piattaforma</label>
              <select
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                value={form.platform}
                onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value as Review["platform"] }))}
              >
                <option value="booking">Booking.com</option>
                <option value="airbnb">Airbnb</option>
                <option value="google">Google</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={addReview}
              disabled={saving}
              className="px-5 py-2 bg-[#072316] text-white text-sm font-medium rounded-xl hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
            >
              {saving ? "Salvataggio…" : "Aggiungi"}
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
            Nessuna recensione. Aggiungine una!
          </div>
        )}
        {reviews.map((review, idx) => (
          <div
            key={review.id}
            className={`bg-white rounded-2xl border p-5 flex gap-4 items-start transition-opacity ${review.hidden ? "opacity-50" : ""} ${review.featured ? "border-amber-200 bg-amber-50/30" : "border-gray-100"}`}
          >
            {/* Order arrows */}
            <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
              <button
                onClick={() => move(idx, -1)}
                disabled={idx === 0 || saving}
                className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => move(idx, 1)}
                disabled={idx === reviews.length - 1 || saving}
                className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                {review.location && (
                  <span className="text-gray-400 text-xs">· {review.location}</span>
                )}
                {review.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                    ★ In evidenza
                  </span>
                )}
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${platformColors[review.platform] ?? "bg-gray-100 text-gray-600"}`}>
                  {review.platform}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} className={`w-3 h-3 ${n <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
                <span className="text-gray-400 text-xs ml-1">{review.date}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{review.text}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => toggleFeatured(review)}
                disabled={saving}
                title={review.featured ? "Rimuovi dai preferiti" : "Metti in evidenza"}
                className={`p-2 rounded-xl transition-colors ${review.featured ? "text-amber-500 bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-100 text-gray-300 hover:text-amber-400"}`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleHidden(review)}
                disabled={saving}
                title={review.hidden ? "Mostra" : "Nascondi"}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {review.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => deleteReview(review.id)}
                title="Elimina"
                className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
