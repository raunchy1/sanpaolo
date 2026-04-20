"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronUp, ChevronDown, RefreshCw, Save, Images } from "lucide-react";
import { toast } from "sonner";
import type { GalleryConfig, GalleryRoom, GalleryImage } from "@/app/api/admin/gallery/route";

// Default config mirrors RoomTour.tsx static data
const DEFAULT_CONFIG: GalleryConfig = {
  rooms: [
    {
      id: "esterno",
      label: "Esterno",
      images: [
        { src: "/images/rooms/real/esterno-1.jpg", alt: "Esterno", visible: true, order: 0 },
      ],
    },
    {
      id: "salotto",
      label: "Salotto",
      images: [
        { src: "/images/rooms/real/salotto-3.jpg", alt: "Salotto", visible: true, order: 0 },
        { src: "/images/rooms/real/salotto-1.jpg", alt: "Salotto", visible: true, order: 1 },
        { src: "/images/rooms/real/salotto-2.jpg", alt: "Salotto", visible: true, order: 2 },
      ],
    },
    {
      id: "cucina",
      label: "Cucina",
      images: [
        { src: "/images/rooms/real/cucina-1.jpg", alt: "Cucina", visible: true, order: 0 },
        { src: "/images/rooms/real/cucina-2.jpg", alt: "Cucina", visible: true, order: 1 },
        { src: "/images/rooms/real/cucina-3.jpg", alt: "Cucina", visible: true, order: 2 },
      ],
    },
    {
      id: "camera1",
      label: "Camera 1",
      images: [
        { src: "/images/rooms/real/camera1-1.jpg", alt: "Camera 1", visible: true, order: 0 },
      ],
    },
    {
      id: "camera2",
      label: "Camera 2",
      images: [
        { src: "/images/rooms/real/camera2-4.jpg", alt: "Camera 2", visible: true, order: 0 },
        { src: "/images/rooms/real/camera2-1.jpg", alt: "Camera 2", visible: true, order: 1 },
        { src: "/images/rooms/real/camera2-2.jpg", alt: "Camera 2", visible: true, order: 2 },
        { src: "/images/rooms/real/camera2-3.jpg", alt: "Camera 2", visible: true, order: 3 },
        { src: "/images/rooms/real/camera2-5.jpg", alt: "Camera 2", visible: true, order: 4 },
        { src: "/images/rooms/real/camera2-6.jpg", alt: "Camera 2", visible: true, order: 5 },
      ],
    },
    {
      id: "bagno",
      label: "Bagno",
      images: [
        { src: "/images/rooms/real/bagno-1.jpg", alt: "Bagno", visible: true, order: 0 },
        { src: "/images/rooms/real/bagno-2.jpg", alt: "Bagno", visible: true, order: 1 },
        { src: "/images/rooms/real/bagno-3.jpg", alt: "Bagno", visible: true, order: 2 },
      ],
    },
    {
      id: "dettagli",
      label: "Dettagli",
      images: [
        { src: "/images/rooms/real/dettagli-1.jpg", alt: "Dettagli", visible: true, order: 0 },
        { src: "/images/rooms/real/dettagli-2.jpg", alt: "Dettagli", visible: true, order: 1 },
      ],
    },
  ],
};

function mergeWithDefaults(saved: GalleryConfig | null): GalleryConfig {
  if (!saved || !saved.rooms || saved.rooms.length === 0) return DEFAULT_CONFIG;

  // For each default room, merge saved state if available
  const savedMap = new Map<string, GalleryRoom>(saved.rooms.map((r) => [r.id, r]));
  return {
    rooms: DEFAULT_CONFIG.rooms.map((defaultRoom) => {
      const savedRoom = savedMap.get(defaultRoom.id);
      if (!savedRoom) return defaultRoom;

      // Merge images: saved state wins for visibility/order, but ensure all default images exist
      const savedImgMap = new Map<string, GalleryImage>(savedRoom.images.map((img) => [img.src, img]));
      const mergedImages = defaultRoom.images
        .map((defImg) => savedImgMap.get(defImg.src) ?? defImg)
        .sort((a, b) => a.order - b.order);

      return { ...defaultRoom, images: mergedImages };
    }),
  };
}

export default function GalleriaPage() {
  const [config, setConfig] = useState<GalleryConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Errore");
      }
      toast.success("Galleria salvata");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function toggleImage(roomId: string, src: string) {
    setConfig((prev) => ({
      rooms: prev.rooms.map((room) =>
        room.id !== roomId
          ? room
          : {
              ...room,
              images: room.images.map((img) =>
                img.src === src ? { ...img, visible: !img.visible } : img
              ),
            }
      ),
    }));
  }

  function moveImage(roomId: string, idx: number, dir: -1 | 1) {
    setConfig((prev) => ({
      rooms: prev.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const imgs = [...room.images];
        const target = idx + dir;
        if (target < 0 || target >= imgs.length) return room;
        [imgs[idx], imgs[target]] = [imgs[target], imgs[idx]];
        return { ...room, images: imgs.map((img, i) => ({ ...img, order: i })) };
      }),
    }));
  }

  function resetRoom(roomId: string) {
    const defaultRoom = DEFAULT_CONFIG.rooms.find((r) => r.id === roomId);
    if (!defaultRoom) return;
    setConfig((prev) => ({
      rooms: prev.rooms.map((room) => (room.id === roomId ? defaultRoom : room)),
    }));
    toast("Stanza ripristinata. Clicca Salva per confermare.");
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
      </div>
    );
  }

  const totalVisible = config.rooms.reduce(
    (sum, room) => sum + room.images.filter((img) => img.visible).length,
    0
  );
  const totalImages = config.rooms.reduce((sum, room) => sum + room.images.length, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galleria foto</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalVisible} di {totalImages} foto visibili · attiva/disattiva o riordina le foto per stanza
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
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio…" : saved ? "✓ Salvato" : "Salva"}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 mb-6">
        <strong>Come funziona:</strong> usa l&apos;icona <strong>occhio 👁</strong> per nascondere/mostrare una foto, e le <strong>frecce ↑ ↓</strong> per cambiare l&apos;ordine dentro ogni stanza. Poi clicca <strong>Salva</strong>.
      </div>

      {/* Rooms */}
      <div className="space-y-6">
        {config.rooms.map((room) => {
          const visibleCount = room.images.filter((img) => img.visible).length;
          return (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Room header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Images className="w-4 h-4 text-[#072316]" />
                  <span className="font-semibold text-gray-900">{room.label}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {visibleCount}/{room.images.length} visibili
                  </span>
                </div>
                <button
                  onClick={() => resetRoom(room.id)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Ripristina
                </button>
              </div>

              {/* Images grid */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {room.images.map((img, idx) => (
                  <div
                    key={img.src}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      img.visible ? "border-transparent" : "border-dashed border-gray-200 opacity-50"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Controls overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors group flex flex-col justify-between p-1.5">
                      {/* Visibility toggle */}
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleImage(room.id, img.src)}
                          title={img.visible ? "Nascondi foto" : "Mostra foto"}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow-sm transition-colors"
                        >
                          {img.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Order arrows */}
                      <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveImage(room.id, idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow-sm disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveImage(room.id, idx, 1)}
                          disabled={idx === room.images.length - 1}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow-sm disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Hidden badge */}
                    {!img.visible && (
                      <div className="absolute top-1 left-1 bg-gray-800/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Nascosta
                      </div>
                    )}

                    {/* Position badge */}
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#072316] text-white rounded-xl text-sm font-medium hover:bg-[#0F3D28] disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Salvataggio…" : "Salva galleria"}
        </button>
      </div>
    </div>
  );
}
