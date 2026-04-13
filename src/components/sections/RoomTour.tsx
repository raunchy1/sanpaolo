"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface RoomData {
  key: string;
  image: string;
}

const rooms: RoomData[] = [
  { key: "salotto", image: "/images/rooms/salotto.png" },
  { key: "zonaPranzo", image: "/images/rooms/zona-pranzo.png" },
  { key: "camera1", image: "/images/rooms/camera-letto-1.png" },
  { key: "camera2", image: "/images/rooms/camera-letto-2.png" },
  { key: "bagno", image: "/images/rooms/bagno.png" },
  { key: "esterni", image: "/images/rooms/esterni.png" },
  { key: "dettagli", image: "/images/rooms/dettagli.png" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function RoomTour() {
  const { t } = useTranslation();
  const [currentRoom, setCurrentRoom] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextRoom = useCallback(() => {
    setDirection(1);
    setCurrentRoom((prev) => (prev + 1) % rooms.length);
  }, []);

  const prevRoom = useCallback(() => {
    setDirection(-1);
    setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
  }, []);

  const goToRoom = useCallback((index: number) => {
    setDirection(index > currentRoom ? 1 : -1);
    setCurrentRoom(index);
  }, [currentRoom]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) nextRoom();
      else prevRoom();
    }
    setTouchStart(null);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % rooms.length);
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  // Lightbox touch/swipe
  const [lbTouchStart, setLbTouchStart] = useState<number | null>(null);
  const handleLbTouchStart = (e: React.TouchEvent) => {
    setLbTouchStart(e.touches[0].clientX);
  };
  const handleLbTouchEnd = (e: React.TouchEvent) => {
    if (lbTouchStart === null) return;
    const diff = lbTouchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) lightboxNext();
      else lightboxPrev();
    }
    setLbTouchStart(null);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft") lightboxPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  const room = rooms[currentRoom];

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
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-roman-terracotta font-semibold mb-3">
            Photo Tour
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-roman-espresso mb-4 tracking-roman">
            {t("rooms.title")}
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            {t("rooms.subtitle")}
          </p>
        </motion.div>

        {/* Room Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-10 pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
          {rooms.map((r, i) => (
            <button
              key={r.key}
              onClick={() => goToRoom(i)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-400 whitespace-nowrap ${
                i === currentRoom
                  ? "bg-roman-terracotta text-white shadow-md shadow-roman-terracotta/20"
                  : "bg-roman-cream text-roman-espresso/70 hover:bg-roman-sand hover:text-roman-espresso"
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
              {/* Main Room Image */}
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-roman-shadow mb-8 img-zoom-hover cursor-pointer"
                onClick={() => openLightbox(currentRoom)}
              >
                <div className="aspect-[16/10] md:aspect-[16/9] relative">
                  <img
                    src={room.image}
                    alt={t(`rooms.${room.key}.title`)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 bg-white/95 rounded-full p-4 shadow-lg">
                      <ZoomIn className="w-6 h-6 text-roman-espresso" />
                    </div>
                  </div>
                </div>
                {/* Room label overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent p-6 md:p-8">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                    {t(`rooms.${room.key}.title`)}
                  </h3>
                </div>
              </div>

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
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-roman-cream hover:bg-roman-sand text-roman-espresso font-medium transition-all duration-300 hover:shadow-md touch-feedback"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">{t("rooms.previousRoom")}</span>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {rooms.map((_, i) => (
              <button
                key={i}
                onClick={() => goToRoom(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === currentRoom
                    ? "w-8 h-2.5 bg-roman-terracotta"
                    : "w-2.5 h-2.5 bg-roman-sand hover:bg-roman-stone"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextRoom}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-roman-cream hover:bg-roman-sand text-roman-espresso font-medium transition-all duration-300 hover:shadow-md touch-feedback"
          >
            <span className="hidden sm:inline text-sm">{t("rooms.nextRoom")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Masonry Grid - Other Rooms Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {rooms.map((r, i) => (
            <motion.div
              key={r.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.4, 0.25, 1] }}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-400 ${
                i === 0 || i === 3 ? "row-span-2" : ""
              }`}
              onClick={() => {
                goToRoom(i);
                document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className={`relative ${i === 0 || i === 3 ? "aspect-[3/4]" : "aspect-square"}`}>
                <img
                  src={r.image}
                  alt={t(`rooms.${r.key}.title`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-white font-display font-semibold text-sm">{t(`rooms.${r.key}.title`)}</p>
                </div>
                {/* Active indicator */}
                {i === currentRoom && (
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-roman-terracotta shadow-lg" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/[0.97] lightbox-overlay flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors touch-feedback"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/50 text-sm font-medium z-10">
              {lightboxIndex + 1} / {rooms.length}
            </div>

            {/* Lightbox Image with swipe */}
            <motion.div
              key={lightboxIndex}
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
                src={rooms[lightboxIndex].image}
                alt={t(`rooms.${rooms[lightboxIndex].key}.title`)}
                className="max-w-full max-h-[82vh] object-contain rounded-xl"
                draggable={false}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 rounded-b-xl">
                <h4 className="font-display text-xl md:text-2xl text-white font-bold mb-1">
                  {t(`rooms.${rooms[lightboxIndex].key}.title`)}
                </h4>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                  {t(`rooms.${rooms[lightboxIndex].key}.desc`)}
                </p>
              </div>
            </motion.div>

            {/* Lightbox Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors touch-feedback"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
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
