"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Save, RefreshCw, ChevronDown, ChevronUp, CheckCircle, Plus, Trash2 } from "lucide-react";

const RichEditor = dynamic(() => import("@/components/ui/RichEditor"), { ssr: false });
import { toast } from "sonner";

interface Section {
  id: string;
  label: string;
  fields: Field[];
}

interface Field {
  key: string;
  label: string;
  path: string[];
  multiline?: boolean;
  bullets?: boolean;
  placeholder?: string;
}

const SECTIONS: Section[] = [
  /* ─── SEO / Meta ─── */
  {
    id: "meta",
    label: "SEO — Titolo e descrizione Google",
    fields: [
      { key: "meta.title", label: "Titolo pagina (Google)", path: ["meta", "title"], placeholder: "San Paolo Hideout — La tua dimora romana privata" },
      { key: "meta.description", label: "Descrizione (Google / condivisione)", path: ["meta", "description"], multiline: true },
    ],
  },
  /* ─── Hero ─── */
  {
    id: "hero",
    label: "Hero — Prima schermata",
    fields: [
      { key: "hero.title", label: "Titolo principale", path: ["hero", "title"], placeholder: "San Paolo Hideout" },
      { key: "hero.subtitle", label: "Sottotitolo", path: ["hero", "subtitle"], multiline: true },
      { key: "hero.facts", label: "Dettagli struttura (pallini sotto il titolo)", path: ["hero", "facts"], bullets: true },
      { key: "hero.rating", label: "Badge valutazione", path: ["hero", "rating"], placeholder: "9.9 Eccellente • Booking Award 2026" },
      { key: "hero.location", label: "Indirizzo (hero)", path: ["hero", "location"], placeholder: "Via Silvio D'Amico 96, 00145 Roma" },
      { key: "hero.ctaCall", label: "Bottone Chiama — testo", path: ["hero", "ctaCall"], placeholder: "Chiama ora" },
      { key: "hero.ctaWhatsApp", label: "Bottone WhatsApp — testo", path: ["hero", "ctaWhatsApp"], placeholder: "Scrivici su WhatsApp" },
    ],
  },
  /* ─── Guest Favorites ─── */
  {
    id: "guestFavorites",
    label: "Preferiti degli ospiti — strip evidenza",
    fields: [
      { key: "guestFavorites.title", label: "Titolo sezione", path: ["guestFavorites", "title"], placeholder: "Gli ospiti apprezzano soprattutto" },
      { key: "guestFavorites.subtitle", label: "Sottotitolo", path: ["guestFavorites", "subtitle"], placeholder: "I dettagli che rendono il soggiorno memorabile" },
      { key: "guestFavorites.position", label: "Etichetta — Posizione", path: ["guestFavorites", "position"], placeholder: "Posizione" },
      { key: "guestFavorites.cleanliness", label: "Etichetta — Pulizia", path: ["guestFavorites", "cleanliness"], placeholder: "Pulizia" },
      { key: "guestFavorites.garden", label: "Etichetta — Area Verde", path: ["guestFavorites", "garden"], placeholder: "Area Esterna Verde" },
      { key: "guestFavorites.metro", label: "Etichetta — Metro", path: ["guestFavorites", "metro"], placeholder: "Metro a 9 min" },
      { key: "guestFavorites.communication", label: "Etichetta — Comunicazione", path: ["guestFavorites", "communication"], placeholder: "Comunicazione" },
      { key: "guestFavorites.family", label: "Etichetta — Famiglia", path: ["guestFavorites", "family"], placeholder: "Comfort Famiglia" },
    ],
  },
  /* ─── La Casa ─── */
  {
    id: "laCasa",
    label: "La Casa — descrizione proprietà",
    fields: [
      { key: "laCasa.eyebrow", label: "Etichetta sopra titolo", path: ["laCasa", "eyebrow"], placeholder: "La Proprietà" },
      { key: "laCasa.title", label: "Titolo sezione", path: ["laCasa", "title"], placeholder: "La Casa" },
      { key: "laCasa.p1", label: "Paragrafo 1", path: ["laCasa", "p1"], multiline: true },
      { key: "laCasa.p2", label: "Paragrafo 2", path: ["laCasa", "p2"], multiline: true },
      { key: "laCasa.p3", label: "Paragrafo 3", path: ["laCasa", "p3"], multiline: true },
      { key: "laCasa.p4", label: "Paragrafo 4 (cucina)", path: ["laCasa", "p4"], multiline: true },
      { key: "laCasa.p5", label: "Paragrafo 5 (bagno)", path: ["laCasa", "p5"], multiline: true },
      { key: "laCasa.p6intro", label: "Paragrafo 6 — intro lista", path: ["laCasa", "p6intro"] },
      { key: "laCasa.p6items", label: "Paragrafo 6 — lista (separare con |)", path: ["laCasa", "p6items"], multiline: true, placeholder: "**clima**|**Wi-Fi**|**parcheggio**|…" },
      { key: "laCasa.p7", label: "Paragrafo 7 — conclusione", path: ["laCasa", "p7"], multiline: true },
      { key: "laCasa.ctaLabel", label: "Bottone CTA — testo", path: ["laCasa", "ctaLabel"], placeholder: "Scopri di più su WhatsApp" },
    ],
  },
  /* ─── Amenities ─── */
  {
    id: "amenities",
    label: "Servizi inclusi",
    fields: [
      { key: "amenities.eyebrow", label: "Etichetta sopra titolo", path: ["amenities", "eyebrow"], placeholder: "Servizi Inclusi" },
      { key: "amenities.title", label: "Titolo sezione", path: ["amenities", "title"], placeholder: "Ogni dettaglio, pensato per te" },
      { key: "amenities.subtitle", label: "Sottotitolo", path: ["amenities", "subtitle"], placeholder: "Una casa nuova, arredata con cura" },
      { key: "amenities.comfort.label", label: "Categoria Comfort — nome", path: ["amenities", "comfort", "label"], placeholder: "Comfort" },
      { key: "amenities.comfort.tagline", label: "Categoria Comfort — tagline", path: ["amenities", "comfort", "tagline"], placeholder: "Un ambiente moderno e accogliente" },
      { key: "amenities.comfort.wifi", label: "Comfort — Wi-Fi", path: ["amenities", "comfort", "wifi"], placeholder: "Wi-Fi fibra ad alta velocità" },
      { key: "amenities.comfort.smarttv", label: "Comfort — Smart TV", path: ["amenities", "comfort", "smarttv"], placeholder: "Smart TV con streaming incluso" },
      { key: "amenities.comfort.parking", label: "Comfort — Parcheggio", path: ["amenities", "comfort", "parking"], placeholder: "Parcheggio gratuito fronte struttura" },
      { key: "amenities.kitchen.label", label: "Categoria Cucina — nome", path: ["amenities", "kitchen", "label"], placeholder: "Cucina" },
      { key: "amenities.kitchen.tagline", label: "Categoria Cucina — tagline", path: ["amenities", "kitchen", "tagline"], placeholder: "Attrezzata per ogni esigenza" },
      { key: "amenities.bathroom.label", label: "Categoria Bagno — nome", path: ["amenities", "bathroom", "label"], placeholder: "Bagno" },
      { key: "amenities.bathroom.tagline", label: "Categoria Bagno — tagline", path: ["amenities", "bathroom", "tagline"], placeholder: "Moderno, pulito, ben curato" },
      { key: "amenities.family.label", label: "Categoria Famiglia — nome", path: ["amenities", "family", "label"], placeholder: "Famiglia" },
      { key: "amenities.family.tagline", label: "Categoria Famiglia — tagline", path: ["amenities", "family", "tagline"], placeholder: "Pensato anche per i più piccoli" },
      { key: "amenities.pet.label", label: "Categoria Pet — nome", path: ["amenities", "pet", "label"], placeholder: "Pet Friendly" },
      { key: "amenities.pet.desc", label: "Categoria Pet — descrizione", path: ["amenities", "pet", "desc"], multiline: true },
      { key: "amenities.extra.label", label: "Categoria Extra — nome", path: ["amenities", "extra", "label"], placeholder: "Servizi Extra" },
    ],
  },
  /* ─── Camere / Room Tour ─── */
  {
    id: "rooms",
    label: "Camere e spazi — galleria",
    fields: [
      { key: "rooms.title", label: "Titolo sezione", path: ["rooms", "title"], placeholder: "Scopri gli Spazi" },
      { key: "rooms.subtitle", label: "Sottotitolo", path: ["rooms", "subtitle"], placeholder: "Una casa indipendente di nuova costruzione…" },
      { key: "rooms.salotto.title", label: "Salotto — titolo", path: ["rooms", "salotto", "title"], placeholder: "Salotto" },
      { key: "rooms.salotto.desc", label: "Salotto — descrizione", path: ["rooms", "salotto", "desc"], multiline: true },
      { key: "rooms.cucina.title", label: "Cucina — titolo", path: ["rooms", "cucina", "title"], placeholder: "Cucina / Zona Pranzo" },
      { key: "rooms.cucina.desc", label: "Cucina — descrizione", path: ["rooms", "cucina", "desc"], multiline: true },
      { key: "rooms.camera1.title", label: "Camera Matrimoniale — titolo", path: ["rooms", "camera1", "title"], placeholder: "Camera Matrimoniale" },
      { key: "rooms.camera1.desc", label: "Camera Matrimoniale — descrizione", path: ["rooms", "camera1", "desc"], multiline: true },
      { key: "rooms.camera2.title", label: "Seconda Camera — titolo", path: ["rooms", "camera2", "title"], placeholder: "Seconda Camera" },
      { key: "rooms.camera2.desc", label: "Seconda Camera — descrizione", path: ["rooms", "camera2", "desc"], multiline: true },
      { key: "rooms.bagno.title", label: "Bagno — titolo", path: ["rooms", "bagno", "title"], placeholder: "Bagno" },
      { key: "rooms.bagno.desc", label: "Bagno — descrizione", path: ["rooms", "bagno", "desc"], multiline: true },
      { key: "rooms.giardino.title", label: "Area Esterna — titolo", path: ["rooms", "giardino", "title"], placeholder: "Area Esterna Verde" },
      { key: "rooms.giardino.desc", label: "Area Esterna — descrizione", path: ["rooms", "giardino", "desc"], multiline: true },
    ],
  },
  /* ─── Nuova Costruzione ─── */
  {
    id: "newbuild",
    label: "Nuova Costruzione 2025",
    fields: [
      { key: "newbuild.badge", label: "Badge", path: ["newbuild", "badge"], placeholder: "Nuova Costruzione 2025" },
      { key: "newbuild.title", label: "Titolo sezione", path: ["newbuild", "title"], multiline: true },
      { key: "newbuild.subtitle", label: "Sottotitolo", path: ["newbuild", "subtitle"] },
      { key: "newbuild.cert.title", label: "Card certificazione — titolo", path: ["newbuild", "cert", "title"] },
      { key: "newbuild.cert.desc", label: "Card certificazione — testo", path: ["newbuild", "cert", "desc"], multiline: true },
      { key: "newbuild.features.systems.title", label: "Impianti — titolo", path: ["newbuild", "features", "systems", "title"] },
      { key: "newbuild.features.thermal.title", label: "Cappotto termico — titolo", path: ["newbuild", "features", "thermal", "title"] },
      { key: "newbuild.features.comfort.title", label: "Comfort termico — titolo", path: ["newbuild", "features", "comfort", "title"] },
      { key: "newbuild.features.energy.title", label: "Efficienza energetica — titolo", path: ["newbuild", "features", "energy", "title"] },
    ],
  },
  /* ─── Location ─── */
  {
    id: "location",
    label: "Posizione — punti di interesse",
    fields: [
      { key: "location.eyebrow", label: "Etichetta sopra titolo", path: ["location", "eyebrow"], placeholder: "Posizione" },
      { key: "location.title", label: "Titolo sezione", path: ["location", "title"], placeholder: "Posizione Perfetta" },
      { key: "location.subtitle", label: "Sottotitolo", path: ["location", "subtitle"], placeholder: "Nel cuore della Roma autentica" },
      { key: "location.basilica.title", label: "POI — Basilica San Paolo", path: ["location", "basilica", "title"] },
      { key: "location.basilica.desc", label: "POI — Basilica San Paolo — descrizione", path: ["location", "basilica", "desc"] },
      { key: "location.basilica.time", label: "POI — Basilica San Paolo — tempo", path: ["location", "basilica", "time"], placeholder: "9 min a piedi" },
      { key: "location.romaTre.title", label: "POI — Università Roma Tre", path: ["location", "romaTre", "title"] },
      { key: "location.romaTre.desc", label: "POI — Roma Tre — descrizione", path: ["location", "romaTre", "desc"] },
      { key: "location.romaTre.time", label: "POI — Roma Tre — distanza", path: ["location", "romaTre", "time"], placeholder: "300m" },
      { key: "location.fiumicino.title", label: "POI — Aeroporto Fiumicino", path: ["location", "fiumicino", "title"] },
      { key: "location.fiumicino.desc", label: "POI — Fiumicino — descrizione", path: ["location", "fiumicino", "desc"] },
      { key: "location.fiumicino.time", label: "POI — Fiumicino — tempo", path: ["location", "fiumicino", "time"], placeholder: "20/25 min" },
      { key: "location.ostiense.title", label: "POI — Stazione Ostiense", path: ["location", "ostiense", "title"] },
      { key: "location.ostiense.desc", label: "POI — Ostiense — descrizione", path: ["location", "ostiense", "desc"] },
      { key: "location.ostiense.time", label: "POI — Ostiense — tempo", path: ["location", "ostiense", "time"] },
      { key: "location.bambinogesu.title", label: "POI — Bambino Gesù", path: ["location", "bambinogesu", "title"] },
      { key: "location.bambinogesu.desc", label: "POI — Bambino Gesù — descrizione", path: ["location", "bambinogesu", "desc"] },
      { key: "location.bambinogesu.time", label: "POI — Bambino Gesù — tempo", path: ["location", "bambinogesu", "time"] },
      { key: "location.forteostiense.title", label: "POI — Forte Ostiense", path: ["location", "forteostiense", "title"] },
      { key: "location.forteostiense.desc", label: "POI — Forte Ostiense — descrizione", path: ["location", "forteostiense", "desc"] },
    ],
  },
  /* ─── Recensioni (punteggi) ─── */
  {
    id: "reviews",
    label: "Recensioni — punteggi e categorie",
    fields: [
      { key: "reviews.eyebrow", label: "Etichetta sopra titolo", path: ["reviews", "eyebrow"], placeholder: "Recensioni" },
      { key: "reviews.title", label: "Titolo sezione", path: ["reviews", "title"], placeholder: "Cosa Dicono i Nostri Ospiti" },
      { key: "reviews.subtitle", label: "Sottotitolo", path: ["reviews", "subtitle"], placeholder: "Storie autentiche…" },
      { key: "reviews.overallScore", label: "Punteggio generale (es. 9.9)", path: ["reviews", "overallScore"], placeholder: "9.9" },
      { key: "reviews.overallMax", label: "Massimo punteggio (es. 10)", path: ["reviews", "overallMax"], placeholder: "10" },
      { key: "reviews.overallLabel", label: "Etichetta punteggio (es. Eccellente)", path: ["reviews", "overallLabel"], placeholder: "Eccellente" },
      { key: "reviews.categories.location.score", label: "Categoria Posizione — voto", path: ["reviews", "categories", "location", "score"], placeholder: "10" },
      { key: "reviews.categories.cleanliness.score", label: "Categoria Pulizia — voto", path: ["reviews", "categories", "cleanliness", "score"], placeholder: "10" },
      { key: "reviews.categories.comfort.score", label: "Categoria Comfort — voto", path: ["reviews", "categories", "comfort", "score"], placeholder: "10" },
      { key: "reviews.categories.communication.score", label: "Categoria Comunicazione — voto", path: ["reviews", "categories", "communication", "score"], placeholder: "10" },
      { key: "reviews.categories.value.score", label: "Categoria Qualità/Prezzo — voto", path: ["reviews", "categories", "value", "score"], placeholder: "10" },
      { key: "reviews.categories.family.score", label: "Categoria Famiglie — voto", path: ["reviews", "categories", "family", "score"], placeholder: "10" },
    ],
  },
  /* ─── Offerte speciali ─── */
  {
    id: "offers",
    label: "Offerte speciali",
    fields: [
      { key: "offers.badge", label: "Badge sezione", path: ["offers", "badge"], placeholder: "Offerte Esclusive" },
      { key: "offers.title", label: "Titolo sezione", path: ["offers", "title"], placeholder: "Offerte Speciali" },
      { key: "offers.subtitle", label: "Sottotitolo", path: ["offers", "subtitle"] },
      { key: "offers.stay3.title", label: "Offerta 1 — Titolo", path: ["offers", "stay3", "title"] },
      { key: "offers.stay3.description", label: "Offerta 1 — Descrizione", path: ["offers", "stay3", "description"], multiline: true },
      { key: "offers.stay3.waText", label: "Offerta 1 — Messaggio WhatsApp", path: ["offers", "stay3", "waText"], placeholder: "Ciao! Sono interessato allo sconto…" },
      { key: "offers.weekend.title", label: "Offerta 2 — Titolo", path: ["offers", "weekend", "title"] },
      { key: "offers.weekend.description", label: "Offerta 2 — Descrizione", path: ["offers", "weekend", "description"], multiline: true },
      { key: "offers.weekend.waText", label: "Offerta 2 — Messaggio WhatsApp", path: ["offers", "weekend", "waText"] },
      { key: "offers.direct.title", label: "Offerta 3 — Titolo", path: ["offers", "direct", "title"] },
      { key: "offers.direct.description", label: "Offerta 3 — Descrizione", path: ["offers", "direct", "description"], multiline: true },
      { key: "offers.direct.waText", label: "Offerta 3 — Messaggio WhatsApp", path: ["offers", "direct", "waText"] },
      { key: "offers.early.title", label: "Offerta 4 — Titolo", path: ["offers", "early", "title"] },
      { key: "offers.early.description", label: "Offerta 4 — Descrizione", path: ["offers", "early", "description"], multiline: true },
      { key: "offers.early.waText", label: "Offerta 4 — Messaggio WhatsApp", path: ["offers", "early", "waText"] },
    ],
  },
  /* ─── Booking CTA ─── */
  {
    id: "booking",
    label: "Prenota — sezione CTA",
    fields: [
      { key: "booking.sectionLabel", label: "Etichetta sopra titolo", path: ["booking", "sectionLabel"], placeholder: "Prenota Ora" },
      { key: "booking.newTitle", label: "Titolo", path: ["booking", "newTitle"], placeholder: "Prenota il tuo soggiorno" },
      { key: "booking.newSubtitle", label: "Sottotitolo", path: ["booking", "newSubtitle"], multiline: true },
      { key: "booking.bestPriceLabel", label: "Badge miglior prezzo", path: ["booking", "bestPriceLabel"], placeholder: "Miglior prezzo garantito" },
      { key: "booking.ctaCall", label: "Bottone Chiama — testo", path: ["booking", "ctaCall"], placeholder: "Chiama ora" },
      { key: "booking.ctaWhatsApp", label: "Bottone WhatsApp — testo", path: ["booking", "ctaWhatsApp"], placeholder: "Prenota su WhatsApp" },
      { key: "booking.ctaAirbnb", label: "Bottone Airbnb — testo", path: ["booking", "ctaAirbnb"], placeholder: "Vedi su Airbnb" },
      { key: "booking.ctaBooking", label: "Bottone Booking — testo", path: ["booking", "ctaBooking"], placeholder: "Prenota su Booking.com" },
      { key: "booking.trustInstant", label: "Trust — badge 1", path: ["booking", "trustInstant"], placeholder: "Conferma immediata" },
      { key: "booking.trustSecure", label: "Trust — badge 2", path: ["booking", "trustSecure"], placeholder: "Prenotazione sicura" },
      { key: "booking.trustTrusted", label: "Trust — badge 3", path: ["booking", "trustTrusted"], placeholder: "Piattaforme affidabili" },
    ],
  },
  /* ─── Check-in ─── */
  {
    id: "checkin",
    label: "Check-in",
    fields: [
      { key: "checkin.title", label: "Titolo sezione", path: ["checkin", "title"], placeholder: "Check-in flessibile e accoglienza personalizzata" },
      { key: "checkin.description", label: "Descrizione", path: ["checkin", "description"], multiline: true },
      { key: "checkin.features.flexible.title", label: "Card 1 — titolo", path: ["checkin", "features", "flexible", "title"], placeholder: "Check-in flessibile" },
      { key: "checkin.features.flexible.desc", label: "Card 1 — fascia oraria", path: ["checkin", "features", "flexible", "desc"], placeholder: "Fascia oraria 15:00–20:00" },
      { key: "checkin.features.human.title", label: "Card 2 — titolo", path: ["checkin", "features", "human", "title"], placeholder: "Accoglienza personalizzata" },
      { key: "checkin.features.human.desc", label: "Card 2 — testo", path: ["checkin", "features", "human", "desc"], placeholder: "Preferiamo accogliervi di persona" },
    ],
  },
  /* ─── FAQ ─── */
  {
    id: "faq",
    label: "FAQ — Domande frequenti",
    fields: [
      { key: "faq.title", label: "Titolo sezione", path: ["faq", "title"], placeholder: "Domande Frequenti" },
      { key: "faq.subtitle", label: "Sottotitolo", path: ["faq", "subtitle"], placeholder: "Tutto quello che devi sapere…" },
      { key: "faq.q1.question", label: "Domanda 1", path: ["faq", "q1", "question"] },
      { key: "faq.q1.answer", label: "Risposta 1", path: ["faq", "q1", "answer"], multiline: true },
      { key: "faq.q2.question", label: "Domanda 2", path: ["faq", "q2", "question"] },
      { key: "faq.q2.answer", label: "Risposta 2", path: ["faq", "q2", "answer"], multiline: true },
      { key: "faq.q3.question", label: "Domanda 3", path: ["faq", "q3", "question"] },
      { key: "faq.q3.answer", label: "Risposta 3", path: ["faq", "q3", "answer"], multiline: true },
      { key: "faq.q4.question", label: "Domanda 4", path: ["faq", "q4", "question"] },
      { key: "faq.q4.answer", label: "Risposta 4", path: ["faq", "q4", "answer"], multiline: true },
      { key: "faq.q5.question", label: "Domanda 5", path: ["faq", "q5", "question"] },
      { key: "faq.q5.answer", label: "Risposta 5", path: ["faq", "q5", "answer"], multiline: true },
      { key: "faq.q6.question", label: "Domanda 6", path: ["faq", "q6", "question"] },
      { key: "faq.q6.answer", label: "Risposta 6", path: ["faq", "q6", "answer"], multiline: true },
      { key: "faq.q7.question", label: "Domanda 7", path: ["faq", "q7", "question"] },
      { key: "faq.q7.answer", label: "Risposta 7", path: ["faq", "q7", "answer"], multiline: true },
    ],
  },
  /* ─── Messaggi WhatsApp ─── */
  {
    id: "common",
    label: "Messaggi WhatsApp pre-compilati",
    fields: [
      { key: "common.whatsapp.booking", label: "Messaggio prenotazione", path: ["common", "whatsapp", "booking"], placeholder: "Ciao! Vorrei prenotare San Paolo Hideout." },
      { key: "common.whatsapp.info", label: "Messaggio informazioni", path: ["common", "whatsapp", "info"], placeholder: "Ciao! Vorrei sapere di più su San Paolo Hideout." },
      { key: "common.whatsapp.inquiry", label: "Messaggio generico", path: ["common", "whatsapp", "inquiry"], placeholder: "Ciao! Vorrei informazioni su San Paolo Hideout." },
    ],
  },
  /* ─── Footer ─── */
  {
    id: "footer",
    label: "Footer",
    fields: [
      { key: "footer.tagline", label: "Tagline", path: ["footer", "tagline"], placeholder: "La tua dimora romana privata" },
      { key: "footer.description", label: "Descrizione breve", path: ["footer", "description"], multiline: true },
      { key: "footer.metroNote", label: "Nota Metro", path: ["footer", "metroNote"], placeholder: "A 9 minuti dalla Metro Basilica San Paolo" },
      { key: "footer.awardLabel", label: "Label award", path: ["footer", "awardLabel"], placeholder: "Booking.com Traveller Review Award 2026" },
      { key: "footer.copyright", label: "Copyright", path: ["footer", "copyright"], placeholder: "© 2025 San Paolo Hideout. Tutti i diritti riservati." },
    ],
  },
];

/* ─── Helpers ─── */
function getNestedValue(obj: Record<string, unknown>, path: string[]): string {
  let current: unknown = obj;
  for (const key of path) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[key];
    } else return "";
  }
  return typeof current === "string" ? current : "";
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: string
): Record<string, unknown> {
  if (path.length === 0) return obj;
  const [head, ...rest] = path;
  if (rest.length === 0) return { ...obj, [head]: value };
  return {
    ...obj,
    [head]: setNestedValue(((obj[head] as Record<string, unknown>) || {}), rest, value),
  };
}

/* ─── Bullets editor ─── */
function parseBullets(v: string, defaultVal: string): string[] {
  const src = v || defaultVal || "";
  if (!src) return [""];
  if (src.includes("\n")) return src.split("\n");
  if (src.includes(" • ")) return src.split(" • ").filter(Boolean);
  // handle "|" separator saved by old admin
  if (src.includes("|")) return src.split("|").map((s) => s.trim()).filter(Boolean);
  return [src];
}

function BulletsEditor({ value, onChange, defaultVal }: { value: string; onChange: (v: string) => void; defaultVal: string }) {
  const [lines, setLines] = useState<string[]>(() => parseBullets(value, defaultVal));
  const lastExternalRef = useRef(value);

  // Re-parse when value changes from outside (e.g. async data load), but NOT from our own onChange
  useEffect(() => {
    if (value === lastExternalRef.current) return;
    lastExternalRef.current = value;
    setLines(parseBullets(value, defaultVal));
  }, [value, defaultVal]);

  const commit = (next: string[]) => {
    setLines(next);
    const saved = next.filter(Boolean).join("\n");
    lastExternalRef.current = saved;
    onChange(saved);
  };

  const updateLine = (i: number, v: string) => {
    const next = [...lines];
    next[i] = v;
    commit(next);
  };

  const removeLine = (i: number) => commit(lines.filter((_, j) => j !== i));

  const addLine = () => {
    // Only update internal state — don't propagate empty line to parent yet
    setLines((prev) => [...prev, ""]);
  };

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: "#C8A96B" }} />
          <input
            type="text"
            value={line}
            onChange={(e) => updateLine(i, e.target.value)}
            placeholder="es. 2 camere da letto"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all"
          />
          <button onClick={() => removeLine(i)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={addLine}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#072316] transition-colors mt-1"
      >
        <Plus className="w-3.5 h-3.5" /> Aggiungi pallino
      </button>
    </div>
  );
}

/* ─── Page ─── */
export default function ContenutiPage() {
  const [currentContent, setCurrentContent] = useState<Record<string, unknown>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ hero: true });
  const [search, setSearch] = useState("");

  async function fetchData() {
    setLoading(true);
    try {
      const [contentRes, overridesRes] = await Promise.all([
        fetch("/api/content"),
        fetch("/api/admin/content"),
      ]);
      const overridesData = await overridesRes.json();
      const contentData = await contentRes.json();
      setCurrentContent(contentData.it || {});

      const initialValues: Record<string, string> = {};
      for (const section of SECTIONS) {
        for (const field of section.fields) {
          initialValues[field.key] = getNestedValue(overridesData.it || {}, field.path);
        }
      }
      setValues(initialValues);
    } catch {
      toast.error("Errore nel caricamento dei contenuti");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function getDefaultValue(field: Field): string {
    return getNestedValue(currentContent, field.path) || "";
  }

  async function saveSection(section: Section) {
    setSaving(true);
    try {
      let itOverrides: Record<string, unknown> = {};
      for (const field of section.fields) {
        const val = values[field.key];
        if (val !== undefined && val !== "") {
          itOverrides = setNestedValue(itOverrides, field.path, val);
        }
      }
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ it: itOverrides }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Errore");
      }
      toast.success(`"${section.label}" salvata`);
      setSavedSection(section.id);
      setTimeout(() => setSavedSection(null), 3000);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const filteredSections = search.trim()
    ? SECTIONS.map((s) => ({
        ...s,
        fields: s.fields.filter(
          (f) =>
            f.label.toLowerCase().includes(search.toLowerCase()) ||
            f.key.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((s) => s.fields.length > 0)
    : SECTIONS;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#072316] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contenuti sito</h1>
          <p className="text-gray-500 text-sm mt-1">
            Modifica qualsiasi testo del sito. Le modifiche sono attive al prossimo caricamento.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Ricarica
        </button>
      </div>

      {/* Note + Search */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-4">
        <strong>Come funziona:</strong> i campi vuoti mostrano il testo originale del sito (in grigio). Scrivi solo nei campi che vuoi modificare, poi clicca <strong>Salva sezione</strong>.
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="🔍  Cerca un campo (es. FAQ, titolo, WhatsApp…)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316]"
        />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {filteredSections.map((section) => {
          const isOpen = !!openSections[section.id] || !!search.trim();
          const hasOverrides = section.fields.some((f) => values[f.key]);
          const isSaved = savedSection === section.id;

          return (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{section.label}</span>
                  <span className="text-gray-400 text-xs">{section.fields.length} campi</span>
                  {hasOverrides && (
                    <span className="px-2 py-0.5 rounded-full bg-[#072316]/10 text-[#072316] text-xs font-medium">
                      Modificato
                    </span>
                  )}
                  {isSaved && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Salvato
                    </span>
                  )}
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-50">
                  <div className="pt-4 space-y-4">
                    {section.fields.map((field) => {
                      const defaultVal = getDefaultValue(field);
                      const currentVal = values[field.key] ?? "";
                      const isModified = currentVal !== "";

                      return (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {field.label}
                            {isModified && (
                              <span className="ml-2 text-xs font-normal text-[#072316]">• modificato</span>
                            )}
                          </label>
                          {field.bullets ? (
                            <BulletsEditor
                              value={currentVal}
                              onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
                              defaultVal={defaultVal}
                            />
                          ) : field.multiline ? (
                            <RichEditor
                              value={currentVal}
                              onChange={(html) => setValues((prev) => ({ ...prev, [field.key]: html }))}
                              placeholder={field.placeholder || defaultVal || ""}
                              minHeight={80}
                            />
                          ) : (
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                              placeholder={field.placeholder || defaultVal || ""}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072316]/20 focus:border-[#072316] transition-all"
                            />
                          )}
                          {defaultVal && !field.placeholder && (
                            <p className="mt-1 text-xs text-gray-400 truncate">
                              Attuale: {defaultVal.substring(0, 90)}{defaultVal.length > 90 ? "…" : ""}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => saveSection(section)}
                    disabled={saving}
                    className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-[#072316] hover:bg-[#0F3D28] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Salvataggio…" : "Salva sezione"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
