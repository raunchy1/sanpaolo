import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Affitto Breve Vicino Roma Tre — Casa Indipendente con Parcheggio | San Paolo Hideout",
  description: "Affitto breve vicino all'Università Roma Tre (300m). Casa indipendente con parcheggio gratuito, area verde, Wi-Fi fibra. Nuova costruzione 2025 nel quartiere San Paolo, Roma. Ideale per professori, studenti e famiglie.",
  keywords: [
    "affitto breve vicino Roma Tre",
    "casa vacanza Roma Tre università",
    "alloggio vicino università Roma Tre",
    "affitto breve Ostiense Roma",
    "casa vacanza Roma Ostiense",
    "short rental near Roma Tre",
    "affitto turistico Roma sud",
    "alloggio Roma San Paolo Ostiense",
    "casa parcheggio gratuito Roma",
  ],
  openGraph: {
    title: "Affitto Breve Vicino Roma Tre — San Paolo Hideout",
    description: "Casa indipendente a 300m dall'Università Roma Tre. Parcheggio gratuito, area verde, nuova costruzione 2025.",
    url: "https://sanpaolohideout.it/affitto-breve-vicino-roma-tre",
    images: [{ url: "https://sanpaolohideout.it/images/hero-sanpaolo.png", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://sanpaolohideout.it/affitto-breve-vicino-roma-tre" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  name: "San Paolo Hideout — Affitto Breve Vicino Roma Tre",
  description: "Casa vacanza indipendente a soli 300 metri dall'Università Roma Tre. Nuova costruzione 2025, parcheggio gratuito, area esterna verde. Ideale per professori, dottorandi, ricercatori e famiglie in visita a Roma Tre.",
  url: "https://sanpaolohideout.it/affitto-breve-vicino-roma-tre",
  image: "https://sanpaolohideout.it/images/hero-sanpaolo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Silvio d'Amico 96",
    addressLocality: "Roma",
    addressRegion: "Lazio",
    postalCode: "00145",
    addressCountry: "IT",
  },
  geo: { "@type": "GeoCoordinates", latitude: 41.8553, longitude: 12.4734 },
  numberOfRooms: 2,
  occupancy: { "@type": "QuantitativeValue", maxValue: 3 },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "300m da Roma Tre", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parcheggio gratuito", value: true },
    { "@type": "LocationFeatureSpecification", name: "Area esterna verde", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi fibra", value: true },
    { "@type": "LocationFeatureSpecification", name: "Nuova costruzione 2025", value: true },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "9.9", reviewCount: "46", bestRating: "10" },
  priceRange: "€€",
  checkinTime: "15:00",
  checkoutTime: "11:00",
};

export default function AffittoBreviVinoRomaTrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-stitch-ivory">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image src="/images/hero-sanpaolo.png" alt="Affitto breve vicino Roma Tre — San Paolo Hideout" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-stitch-green/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="font-label text-xs tracking-[0.25em] text-stitch-gold uppercase mb-4">Affitto Breve · Vicino Roma Tre · 300m</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-4 max-w-3xl">
              Affitto Breve<br /><em>Vicino Roma Tre</em>
            </h1>
            <p className="font-body text-white/80 text-lg max-w-xl">
              Casa indipendente a 300 metri dall'Università Roma Tre. Parcheggio gratuito, area verde, nuova costruzione 2025.
            </p>
          </div>
        </section>

        {/* Contenuto */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="prose prose-lg max-w-none text-stitch-on-surface/80 font-body space-y-6">

            <h2 className="font-display text-3xl text-stitch-green font-light">L'affitto breve più vicino all'Università Roma Tre</h2>
            <p>
              <strong>San Paolo Hideout</strong> è l'unica <strong>casa vacanza indipendente</strong> situata a soli <strong>300 metri dall'Università degli Studi Roma Tre</strong>. Perfetta per <strong>professori, dottorandi, ricercatori, famiglie in visita</strong> e chiunque abbia necessità di alloggiare vicino al campus universitario di Roma.
            </p>
            <p>
              A differenza dei classici bed & breakfast o degli appartamenti condominiali, <strong>San Paolo Hideout è una casa indipendente</strong>: nessun vicino di pianerottolo, nessun ascensore condiviso, massima privacy e silenzio.
            </p>

            <h2 className="font-display text-2xl text-stitch-green font-light mt-10">Perché scegliere questa casa per Roma Tre</h2>
            <ul className="space-y-2">
              {[
                "A 300 metri a piedi dalle facoltà di Roma Tre — il tempo di un caffè",
                "Parcheggio gratuito incluso — essenziale se arrivi in auto da fuori città",
                "2 camere da letto indipendenti — ideale per coppie, famiglie o colleghi",
                "Area esterna verde privata — spazio per rilassarsi dopo una giornata intensa",
                "Check-in flessibile 15:00–20:00 — adatto agli orari accademici",
                "Wi-Fi fibra ad alta velocità — per lavorare o studiare da casa",
                "Cucina attrezzata — risparmia sui ristoranti durante soggiorni lunghi",
                "Nuovissima costruzione 2025 — standard moderni e impianti efficienti",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-stitch-gold mt-1">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-display text-2xl text-stitch-green font-light mt-10">Posizione e collegamenti</h2>
            <p>
              La casa si trova nel quartiere <strong>San Paolo / Ostiense</strong>, uno dei più vivaci e autentici di Roma. Oltre alla vicinanza con Roma Tre, la posizione offre:
            </p>
            <ul className="space-y-2">
              {[
                "Metro B (fermata Basilica San Paolo) — 9 minuti a piedi",
                "Aeroporto Fiumicino — 20-25 minuti in treno (Stazione Ostiense)",
                "Colosseo — 15 minuti in metro",
                "Ospedale Bambino Gesù — raggiungibile facilmente",
                "Stazione Ostiense — 10 minuti a piedi",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-stitch-gold mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-display text-2xl text-stitch-green font-light mt-10">Valutazioni degli ospiti</h2>
            <p>
              <strong>9.9/10 su Booking.com</strong> · <strong>5 stelle su Airbnb</strong> · <strong>5 stelle su Google</strong>.
              Gli ospiti del mondo accademico apprezzano in particolare la tranquillità della zona, il parcheggio gratuito e la disponibilità del proprietario Nicola.
            </p>

          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-stitch-green text-white px-8 py-4 rounded-luxury font-label text-sm tracking-widest uppercase hover:bg-stitch-green/90 transition-colors"
            >
              Scopri la casa completa
            </Link>
            <a
              href="https://wa.me/393299362759?text=Ciao!%20Vorrei%20informazioni%20sull'affitto%20breve%20vicino%20Roma%20Tre."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-stitch-green text-stitch-green px-8 py-4 rounded-luxury font-label text-sm tracking-widest uppercase hover:bg-stitch-green/5 transition-colors"
            >
              Chiedi informazioni
            </a>
          </div>
        </section>

        <div className="text-center py-8 border-t border-stitch-green/10">
          <Link href="/" className="font-body text-sm text-stitch-on-surface/50 hover:text-stitch-green transition-colors">
            ← Torna alla home
          </Link>
        </div>
      </main>
    </>
  );
}
