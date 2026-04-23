"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryConfig, GalleryVideo } from "@/app/api/admin/gallery/route";

function getYouTubeEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
}

interface RoomData {
  key: string;
  images: string[];
}

const STATIC_ROOMS: RoomData[] = [
  { key: "esterno",  images: ["/images/rooms/real/esterno-1.jpg"] },
  { key: "salotto",  images: ["/images/rooms/real/salotto-3.jpg", "/images/rooms/real/salotto-1.jpg", "/images/rooms/real/salotto-2.jpg", "/images/rooms/real/cucina-1.jpg", "/images/rooms/real/cucina-2.jpg", "/images/rooms/real/cucina-3.jpg"] },
  { key: "camera1",  images: ["/images/rooms/real/camera1-1.jpg"] },
  { key: "camera2",  images: ["/images/rooms/real/camera2-1.jpg", "/images/rooms/real/camera2-2.jpg", "/images/rooms/real/camera2-3.jpg", "/images/rooms/real/camera2-4.jpg", "/images/rooms/real/camera2-5.jpg", "/images/rooms/real/camera2-6.jpg"] },
  { key: "bagno",    images: ["/images/rooms/real/bagno-1.jpg", "/images/rooms/real/bagno-2.jpg", "/images/rooms/real/bagno-3.jpg"] },
  { key: "dettagli", images: ["/images/rooms/real/dettagli-1.jpg", "/images/rooms/real/dettagli-2.jpg"] },
];

function configToRooms(config: GalleryConfig): RoomData[] {
  // If old config still has separate "cucina" room, merge its images into "salotto"
  const cucinaRoom = config.rooms.find((r) => r.id === "cucina");
  const rooms = config.rooms
    .filter((r) => r.id !== "cucina")
    .map((room) => {
      let images = room.images
        .filter((img) => img.visible)
        .sort((a, b) => a.order - b.order)
        .map((img) => img.src);
      if (room.id === "salotto" && cucinaRoom) {
        const cucinaImages = cucinaRoom.images
          .filter((img) => img.visible)
          .sort((a, b) => a.order - b.order)
          .map((img) => img.src);
        images = [...images, ...cucinaImages];
      }
      return { key: room.id, images };
    })
    .filter((room) => room.images.length > 0);
  return rooms;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function RoomTour() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomData[]>(STATIC_ROOMS);
  const [videoConfig, setVideoConfig] = useState<GalleryVideo | null>(null);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data: GalleryConfig | null) => {
        if (data && data.rooms && data.rooms.length > 0) {
          const dynamic = configToRooms(data);
          if (dynamic.length > 0) setRooms(dynamic);
        }
        if (data?.video) setVideoConfig(data.video);
      })
      .catch(() => {});
  }, []);

  const allImages = rooms.flatMap((room, ri) =>
    room.images.map((src) => ({ src, roomKey: room.key, roomIndex: ri }))
  );

  const room = rooms[Math.min(currentRoom, rooms.length - 1)];
  const heroImage = room.images[0];

  // ─── Room navigation ───
  const nextRoom = useCallback(() => {
    setDirection(1);
    setCurrentRoom((prev) => (prev + 1) % rooms.length);
  }, []);

  const prevRoom = useCallback(() => {
    setDirection(-1);
    setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
  }, []);

  const goToRoom = useCallback(
    (index: number) => {
      setDirection(index > currentRoom ? 1 : -1);
      setCurrentRoom(index);
    },
    [currentRoom]
  );

  // ─── Touch / swipe ───
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) nextRoom();
      else prevRoom();
    }
    setTouchStart(null);
  };

  // ─── Lightbox (navigates ALL 19 images) ───
  const openLightboxAt = (globalIndex: number) => {
    setLightboxIdx(globalIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const openLightboxForRoom = (roomIdx: number, imgIdx: number) => {
    let globalIdx = 0;
    for (let i = 0; i < roomIdx; i++) globalIdx += rooms[i].images.length;
    globalIdx += imgIdx;
    openLightboxAt(globalIdx);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const lbNext = () => setLightboxIdx((prev) => (prev + 1) % allImages.length);
  const lbPrev = () => setLightboxIdx((prev) => (prev - 1 + allImages.length) % allImages.length);

  const [lbTouchStart, setLbTouchStart] = useState<number | null>(null);
  const handleLbTouchStart = (e: React.TouchEvent) => setLbTouchStart(e.touches[0].clientX);
  const handleLbTouchEnd = (e: React.TouchEvent) => {
    if (lbTouchStart === null) return;
    const diff = lbTouchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) lbNext();
      else lbPrev();
    }
    setLbTouchStart(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lbNext();
      if (e.key === "ArrowLeft") lbPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  // ─── Masonry: ALL 19 images, dynamic ───
  const masonryItems = rooms.flatMap((r, ri) =>
    r.images.map((src, ii) => ({
      src,
      roomKey: r.key,
      roomIndex: ri,
      imgIndex: ii,
      isHero: ii === 0,
    }))
  );

  const currentLb = allImages[lightboxIdx];

  return (
    <section className="py-20 md:py-32 bg-white" id="rooms">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-14"
        >
          <span className="font-label text-[10px] tracking-[0.28em] text-stitch-olive uppercase block mb-5">
            Photo Tour
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-stitch-green leading-[1.1] mb-4">
            {t("rooms.title")}
          </h2>
          <p className="font-body text-stitch-on-surface/55 text-base max-w-xl mx-auto leading-relaxed">
            {t("rooms.subtitle")}
          </p>
        </motion.div>

        {/* Room Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-10 pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
          {rooms.map((r, i) => (
            <button
              key={r.key}
              onClick={() => goToRoom(i)}
              className={`shrink-0 px-5 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap border-2 ${
                i === currentRoom
                  ? "bg-stitch-green text-white border-stitch-green shadow-[3px_3px_0_rgba(0,0,0,0.2)]"
                  : "bg-stitch-ivory-warm text-stitch-on-surface/70 border-stitch-surface-dim hover:bg-stitch-surface-dim hover:text-stitch-on-surface hover:border-stitch-green/30"
              }`}
            >
              {t(`rooms.${r.key}.title`)}
            </button>
          ))}
        </div>

        {/* Current Room Display with swipe */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentRoom}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
            >
              {/* Main Room Hero Image */}
              <div
                className="relative group overflow-hidden mb-4 img-zoom-hover cursor-pointer rounded-xl"
                style={{ boxShadow: "0 8px 40px -12px rgba(41,23,13,0.14)" }}
                onClick={() => openLightboxForRoom(currentRoom, 0)}
              >
                <div className="aspect-[16/10] md:aspect-[16/9] relative">
                  <img
                    src={heroImage}
                    alt={t(`rooms.${room.key}.title`)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 bg-white/95 rounded-full p-4 shadow-lg">
                      <ZoomIn className="w-6 h-6 text-stitch-on-surface" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent p-6 md:p-8">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                    {t(`rooms.${room.key}.title`)}
                  </h3>
                </div>
              </div>

              {/* Support thumbnails for this room (all non-hero images) */}
              {room.images.length > 1 && (
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
                  {room.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => openLightboxForRoom(currentRoom, idx)}
                      className="relative shrink-0 overflow-hidden transition-all duration-300 cursor-pointer group/thumb rounded-lg"
                      style={{ boxShadow: idx === 0 ? "0 0 0 2px #072316" : "0 2px 8px -2px rgba(41,23,13,0.10)" }}
                    >
                      <div className="w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 relative">
                        <img
                          src={img}
                          alt={`${t(`rooms.${room.key}.title`)} ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {idx + 1}/{room.images.length}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Room Description */}
              <div className="max-w-2xl mx-auto text-center mb-8">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t(`rooms.${room.key}.desc`)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Swipe hint on mobile */}
          <div className="md:hidden text-center mt-4">
            <p className="text-xs text-muted-foreground/60 tracking-wide">← Swipe →</p>
          </div>
        </div>

        {/* Room Navigation Arrows */}
        <div className="flex items-center justify-center gap-5 mb-14">
          <button
            onClick={prevRoom}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-stitch-ivory-warm hover:bg-stitch-surface-dim text-stitch-on-surface font-label text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02]"
            style={{ boxShadow: "0 2px 12px -4px rgba(41,23,13,0.06)" }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">{t("rooms.previousRoom")}</span>
          </button>

          <div className="flex gap-2">
            {rooms.map((_, i) => (
              <button
                key={i}
                onClick={() => goToRoom(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === currentRoom
                    ? "w-8 h-2.5 bg-stitch-green"
                    : "w-2.5 h-2.5 bg-stitch-surface-dim hover:bg-stitch-on-surface-muted"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextRoom}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-stitch-ivory-warm hover:bg-stitch-surface-dim text-stitch-on-surface font-medium transition-all duration-300 hover:shadow-md touch-feedback"
          >
            <span className="hidden sm:inline text-sm">{t("rooms.nextRoom")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ─── FULL MASONRY — ALL 19 IMAGES, no cap ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h3 className="font-display italic text-2xl font-light text-stitch-green mb-6 text-center">
            {t("rooms.viewGallery")}
          </h3>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {masonryItems.map((item, i) => {
            // Make hero images taller for visual variety
            const isTall = item.isHero && (item.roomIndex % 2 === 0);
            return (
              <motion.div
                key={`${item.src}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 8) * 0.06, ease: [0.25, 0.4, 0.25, 1] }}
                className={`relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 ${
                  isTall ? "row-span-2" : ""
                }`}
                style={{ boxShadow: "0 4px 20px -6px rgba(41,23,13,0.10)" }}
                onClick={() => openLightboxAt(i)}
              >
                <div className={`relative ${isTall ? "aspect-[3/4]" : "aspect-square"}`}>
                  <img
                    src={item.src}
                    alt={t(`rooms.${item.roomKey}.title`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                    <p className="text-white font-display font-semibold text-xs sm:text-sm">
                      {t(`rooms.${item.roomKey}.title`)}
                    </p>
                  </div>
                  {/* Active room indicator */}
                  {item.roomIndex === currentRoom && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-stitch-green shadow-lg" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── Video embed (shown only when enabled from admin) ─── */}
      {videoConfig?.enabled && videoConfig.url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {videoConfig.title && (
            <h3 className="font-display text-xl font-semibold text-stitch-green text-center mb-4">
              {videoConfig.title}
            </h3>
          )}
          <div className="aspect-video rounded-2xl overflow-hidden shadow-ambient-lg">
            <iframe
              src={getYouTubeEmbedUrl(videoConfig.url)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={videoConfig.title || "Video presentazione"}
            />
          </div>
        </div>
      )}

      {/* ─── Fullscreen Lightbox — ALL 19 IMAGES ─── */}
      <AnimatePresence>
        {lightboxOpen && currentLb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/[0.97] lightbox-overlay flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors touch-feedback"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-6 left-6 text-white/50 text-sm font-medium z-10">
              {lightboxIdx + 1} / {allImages.length}
            </div>

            {/* Room label in lightbox */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
              <span className="text-white/40 text-xs tracking-widest uppercase">
                {t(`rooms.${currentLb.roomKey}.title`)}
              </span>
            </div>

            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative max-w-[92vw] max-h-[82vh] select-none"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleLbTouchStart}
              onTouchEnd={handleLbTouchEnd}
            >
              <img
                src={currentLb.src}
                alt={t(`rooms.${currentLb.roomKey}.title`)}
                className="max-w-full max-h-[82vh] object-contain rounded-xl"
                draggable={false}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 rounded-b-xl">
                <h4 className="font-display text-xl md:text-2xl text-white font-bold mb-1">
                  {t(`rooms.${currentLb.roomKey}.title`)}
                </h4>
                {(() => {
                  const desc = t(`rooms.${currentLb.roomKey}.desc`);
                  return desc.trim().startsWith("<") ? (
                    <div className="text-white/70 text-sm leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: desc }} />
                  ) : (
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{desc}</p>
                  );
                })()}
              </div>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); lbPrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors touch-feedback"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); lbNext(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors touch-feedback"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}