"use client";

import { useState, useEffect, useRef } from "react";
import {
  Eye, EyeOff, ChevronUp, ChevronDown, RefreshCw, Save,
  Images, Trash2, Plus, X, Upload, Link, Pencil, Check,
} from "lucide-react";
import { toast } from "sonner";
import type { GalleryConfig, GalleryRoom, GalleryImage } from "@/app/api/admin/gallery/route";

const DEFAULT_CONFIG: GalleryConfig = {
  rooms: [
    { id: "esterno",  label: "Esterno",           images: [{ src: "/images/rooms/real/esterno-1.jpg",  alt: "Esterno",  visible: true, order: 0 }] },
    { id: "salotto",  label: "Salotto / Zona Pranzo", images: [
      { src: "/images/rooms/real/salotto-3.jpg", alt: "Salotto", visible: true, order: 0 },
      { src: "/images/rooms/real/salotto-1.jpg", alt: "Salotto", visible: true, order: 1 },
      { src: "/images/rooms/real/salotto-2.jpg", alt: "Salotto", visible: true, order: 2 },
      { src: "/images/rooms/real/cucina-1.jpg",  alt: "Cucina",  visible: true, order: 3 },
      { src: "/images/rooms/real/cucina-2.jpg",  alt: "Cucina",  visible: true, order: 4 },
      { src: "/images/rooms/real/cucina-3.jpg",  alt: "Cucina",  visible: true, order: 5 },
    ] },
    { id: "camera1",  label: "Camera Matrimoniale", images: [{ src: "/images/rooms/real/camera1-1.jpg",  alt: "Camera 1", visible: true, order: 0 }] },
    { id: "camera2",  label: "Seconda Camera",      images: [
      { src: "/images/rooms/real/camera2-1.jpg", alt: "Camera 2", visible: true, order: 0 },
      { src: "/images/rooms/real/camera2-2.jpg", alt: "Camera 2", visible: true, order: 1 },
      { src: "/images/rooms/real/camera2-3.jpg", alt: "Camera 2", visible: true, order: 2 },
      { src: "/images/rooms/real/camera2-4.jpg", alt: "Camera 2", visible: true, order: 3 },
      { src: "/images/rooms/real/camera2-5.jpg", alt: "Camera 2", visible: true, order: 4 },
      { src: "/images/rooms/real/camera2-6.jpg", alt: "Camera 2", visible: true, order: 5 },
    ] },
    { id: "bagno",    label: "Bagno",              images: [{ src: "/images/rooms/real/bagno-1.jpg",    alt: "Bagno",    visible: true, order: 0 }, { src: "/images/rooms/real/bagno-2.jpg", alt: "Bagno", visible: true, order: 1 }, { src: "/images/rooms/real/bagno-3.jpg", alt: "Bagno", visible: true, order: 2 }] },
    { id: "dettagli", label: "Dettagli",            images: [{ src: "/images/rooms/real/dettagli-1.jpg", alt: "Dettagli", visible: true, order: 0 }, { src: "/images/rooms/real/dettagli-2.jpg", alt: "Dettagli", visible: true, order: 1 }] },
  ],
};

function mergeWithDefaults(saved: GalleryConfig | null): GalleryConfig {
  if (!saved?.rooms?.length) return DEFAULT_CONFIG;
  const savedMap = new Map<string, GalleryRoom>(saved.rooms.map((r) => [r.id, r]));
  return {
    rooms: DEFAULT_CONFIG.rooms.map((defaultRoom) => {
      const savedRoom = savedMap.get(defaultRoom.id);
      if (!savedRoom) return defaultRoom;
      const savedImgMap = new Map<string, GalleryImage>(savedRoom.images.map((img) => [img.src, img]));
      // Merge: keep saved state for existing static images, keep any custom (non-static) images too
      const staticSrcs = new Set(defaultRoom.images.map((i) => i.src));
      const customImages = savedRoom.images.filter((i) => !staticSrcs.has(i.src));
      const mergedStatic = defaultRoom.images.map((defImg) => savedImgMap.get(defImg.src) ?? defImg);
      const all = [...mergedStatic, ...customImages].sort((a, b) => a.order - b.order);
      return { ...defaultRoom, label: savedRoom.label ?? defaultRoom.label, images: all };
    }),
  };
}

interface AddPhotoModal {
  roomId: string;
  mode: "upload" | "url";
  url: string;
  alt: string;
  uploading: boolean;
}

export default function GalleriaPage() {
  const [config, setConfig] = useState<GalleryConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ roomId: string; src: string } | null>(null);
  const [addModal, setAddModal] = useState<AddPhotoModal | null>(null);
  const [editingLabel, setEditingLabel] = useState<{ roomId: string; value: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setConfig(mergeWithDefaults(data));
      }
    } catch {
      toast.error("Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save(cfg = config) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Galleria salvata");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function updateRooms(fn: (rooms: GalleryRoom[]) => GalleryRoom[]) {
    setConfig((prev) => ({ rooms: fn(prev.rooms) }));
  }

  function toggleImage(roomId: string, src: string) {
    updateRooms((rooms) =>
      rooms.map((room) =>
        room.id !== roomId ? room : {
          ...room,
          images: room.images.map((img) => img.src === src ? { ...img, visible: !img.visible } : img),
        }
      )
    );
  }

  function moveImage(roomId: string, idx: number, dir: -1 | 1) {
    updateRooms((rooms) =>
      rooms.map((room) => {
        if (room.id !== roomId) return room;
        const imgs = [...room.images];
        const target = idx + dir;
        if (target < 0 || target >= imgs.length) return room;
        [imgs[idx], imgs[target]] = [imgs[target], imgs[idx]];
        return { ...room, images: imgs.map((img, i) => ({ ...img, order: i })) };
      })
    );
  }

  function deleteImage(roomId: string, src: string) {
    updateRooms((rooms) =>
      rooms.map((room) =>
        room.id !== roomId ? room : {
          ...room,
          images: room.images.filter((img) => img.src !== src).map((img, i) => ({ ...img, order: i })),
        }
      )
    );
    setDeleteConfirm(null);
    toast.success("Foto rimossa");
  }

  function saveLabel() {
    if (!editingLabel) return;
    updateRooms((rooms) =>
      rooms.map((room) =>
        room.id === editingLabel.roomId ? { ...room, label: editingLabel.value } : room
      )
    );
    setEditingLabel(null);
  }

  function openAddModal(roomId: string) {
    const room = config.rooms.find((r) => r.id === roomId);
    setAddModal({ roomId, mode: "upload", url: "", alt: room?.label || "", uploading: false });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!addModal || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    setAddModal((prev) => prev ? { ...prev, uploading: true } : null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/gallery/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore upload");
      setAddModal((prev) => prev ? { ...prev, url: data.url, uploading: false } : null);
      toast.success("Foto caricata — clicca Aggiungi per confermare");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
      setAddModal((prev) => prev ? { ...prev, uploading: false } : null);
    }
  }

  function addPhoto() {
    if (!addModal) return;
    if (!addModal.url.trim()) { toast.error("Inserisci l'URL della foto"); return; }

    updateRooms((rooms) =>
      rooms.map((room) => {
        if (room.id !== addModal.roomId) return room;
        const newImg: GalleryImage = {
          src: addModal.url.trim(),
          alt: addModal.alt.trim() || room.label,
          visible: true,
          order: room.images.length,
        };
        return { ...room, images: [...room.images, newImg] };
      })
    );
    setAddModal(null);
    toast.success("Foto aggiunta — clicca Salva per confermare");
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
      </div>
    );
  }

  const totalVisible = config.rooms.reduce((s, r) => s + r.images.filter((i) => i.visible).length, 0);
  const totalImages = config.rooms.reduce((s, r) => s + r.images.length, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galleria foto</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalVisible} di {totalImages} foto visibili
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio…" : saved ? "✓ Salvato" : "Salva"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-6">
        <strong>Come funziona:</strong> 👁 mostra/nascondi · ↑↓ riordina · 🗑 elimina · <strong>+ Aggiungi foto</strong> per aggiungere nuove foto. Clicca sul nome della stanza per modificarlo. Poi premi <strong>Salva</strong>.
      </div>

      {/* Rooms */}
      <div className="space-y-6">
        {config.rooms.map((room) => {
          const visibleCount = room.images.filter((img) => img.visible).length;
          const isEditingLabel = editingLabel?.roomId === room.id;

          return (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Room header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3 flex-1">
                  <Images className="w-4 h-4 text-[#072316] shrink-0" />
                  {isEditingLabel ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={editingLabel.value}
                        onChange={(e) => setEditingLabel({ roomId: room.id, value: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter") saveLabel(); if (e.key === "Escape") setEditingLabel(null); }}
                        className="px-2.5 py-1 border border-[#072316] rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072316]/20"
                      />
                      <button onClick={saveLabel} className="p-1.5 rounded-lg bg-[#072316] text-white hover:bg-[#0F3D28]">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingLabel(null)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingLabel({ roomId: room.id, value: room.label })}
                      className="flex items-center gap-1.5 group"
                      title="Clicca per modificare il nome"
                    >
                      <span className="font-semibold text-gray-900 group-hover:text-[#072316] transition-colors">{room.label}</span>
                      <Pencil className="w-3 h-3 text-gray-300 group-hover:text-[#072316] transition-colors" />
                    </button>
                  )}
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                    {visibleCount}/{room.images.length}
                  </span>
                </div>

                {/* Add photo button */}
                <button
                  onClick={() => openAddModal(room.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072316]/5 hover:bg-[#072316]/10 text-[#072316] text-xs font-medium rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Aggiungi foto
                </button>
              </div>

              {/* Images grid */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {room.images.map((img, idx) => {
                  const confirmDel = deleteConfirm?.roomId === room.id && deleteConfirm?.src === img.src;
                  return (
                    <div
                      key={img.src}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        img.visible ? "border-transparent" : "border-dashed border-gray-200"
                      } ${!img.visible ? "opacity-50" : ""}`}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-square bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                      </div>

                      {/* Alt text */}
                      {img.alt && img.alt !== room.label && (
                        <div className="px-2 py-1 text-[10px] text-gray-500 truncate bg-white border-t border-gray-100">
                          {img.alt}
                        </div>
                      )}

                      {/* Controls bar */}
                      <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
                        {/* Visibility */}
                        <button
                          onClick={() => toggleImage(room.id, img.src)}
                          title={img.visible ? "Nascondi" : "Mostra"}
                          className="p-1.5 rounded-lg bg-white/95 text-gray-600 hover:text-[#072316] shadow-sm transition-colors"
                        >
                          {img.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        {/* Delete */}
                        {confirmDel ? (
                          <button
                            onClick={() => deleteImage(room.id, img.src)}
                            className="p-1.5 rounded-lg bg-red-600 text-white shadow-sm transition-colors"
                            title="Conferma eliminazione"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm({ roomId: room.id, src: img.src })}
                            title="Elimina foto"
                            className="p-1.5 rounded-lg bg-white/95 text-gray-400 hover:text-red-600 shadow-sm transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Order arrows (bottom) */}
                      <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                        <button
                          onClick={() => moveImage(room.id, idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded-md bg-white/90 text-gray-500 hover:text-[#072316] shadow-sm disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveImage(room.id, idx, 1)}
                          disabled={idx === room.images.length - 1}
                          className="p-1 rounded-md bg-white/90 text-gray-500 hover:text-[#072316] shadow-sm disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Position badge */}
                      <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {idx + 1}
                      </div>

                      {/* Cancel delete */}
                      {confirmDel && (
                        <div
                          className="absolute inset-0 bg-red-600/20 flex items-center justify-center cursor-pointer"
                          onClick={() => setDeleteConfirm(null)}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Add photo placeholder */}
                <button
                  onClick={() => openAddModal(room.id)}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#072316]/40 hover:bg-[#072316]/3 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#072316] transition-all"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs font-medium">Aggiungi</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => save()}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Salvataggio…" : "Salva galleria"}
        </button>
      </div>

      {/* ─── Add Photo Modal ─── */}
      {addModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setAddModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">
                  Aggiungi foto — {config.rooms.find((r) => r.id === addModal.roomId)?.label}
                </h3>
                <button onClick={() => setAddModal(null)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Mode toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setAddModal((p) => p ? { ...p, mode: "upload", url: "" } : null)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${addModal.mode === "upload" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <Upload className="w-4 h-4" />
                    Carica dal dispositivo
                  </button>
                  <button
                    onClick={() => setAddModal((p) => p ? { ...p, mode: "url" } : null)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${addModal.mode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <Link className="w-4 h-4" />
                    URL esterno
                  </button>
                </div>

                {addModal.mode === "upload" ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    {addModal.url ? (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={addModal.url} alt="preview" className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700"
                          >
                            Cambia foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={addModal.uploading}
                        className="w-full h-36 border-2 border-dashed border-gray-200 hover:border-[#072316]/40 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#072316] transition-all disabled:opacity-50"
                      >
                        {addModal.uploading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
                            <span className="text-sm">Caricamento…</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8" />
                            <span className="text-sm font-medium">Clicca per selezionare una foto</span>
                            <span className="text-xs">JPG, PNG, WEBP</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">URL della foto</label>
                    <input
                      type="url"
                      value={addModal.url}
                      onChange={(e) => setAddModal((p) => p ? { ...p, url: e.target.value } : null)}
                      placeholder="https://esempio.com/foto.jpg"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                    />
                    {addModal.url && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={addModal.url} alt="preview" className="w-full h-36 object-cover" onError={() => toast.error("URL non valido o foto non accessibile")} />
                      </div>
                    )}
                  </div>
                )}

                {/* Alt text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Descrizione foto <span className="text-gray-400 font-normal">(opzionale)</span>
                  </label>
                  <input
                    type="text"
                    value={addModal.alt}
                    onChange={(e) => setAddModal((p) => p ? { ...p, alt: e.target.value } : null)}
                    placeholder="es. Vista del salotto con divano"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setAddModal(null)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                  Annulla
                </button>
                <button
                  onClick={addPhoto}
                  disabled={!addModal.url || addModal.uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi foto
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
