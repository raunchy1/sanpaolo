import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Casa Vacanza San Paolo Roma — Affitto Breve Indipendente | San Paolo Hideout",
  description: "Casa vacanza indipendente nel quartiere San Paolo di Roma. 2 camere, area esterna verde, parcheggio gratuito, nuova costruzione 2025. Vicino Metro B, Basilica San Paolo, Roma Tre. Prenota direttamente al miglior prezzo.",
  keywords: [
    "casa vacanza San Paolo Roma",
    "affitto breve San Paolo Roma",
    "casa indipendente Roma vacanza",
    "appartamento San Paolo Roma",
    "alloggio San Paolo fuori le Mura",
    "house San Paolo Rome",
    "vacation rental San Paolo Rome",
    "casa vacanze Roma sud",
    "affitto turistico Roma Ostiense",
  ],
  openGraph: {
    title: "Casa Vacanza San Paolo Roma — San Paolo Hideout",
    description: "Casa indipendente con area verde nel quartiere San Paolo. Nuova costruzione 2025, 2 camere, 3 ospiti, parcheggio gratuito.",
    url: "https://sanpaolohideout.it/casa-vacanza-san-paolo-roma",
    images: [{ url: "https://sanpaolohideout.it/images/hero-sanpaolo.png", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://sanpaolohideout.it/casa-vacanza-san-paolo-roma" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  name: "San Paolo Hideout — Casa Vacanza San Paolo Roma",
  description: "Casa vacanza indipendente di nuova costruzione nel quartiere San Paolo di Roma, vicino alla Basilica San Paolo fuori le Mura e alla Metro B. 2 camere da letto, area esterna verde, parcheggio gratuito.",
  url: "https://sanpaolohideout.it/casa-vacanza-san-paolo-roma",
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
    { "@type": "LocationFeatureSpecification", name: "Area esterna verde", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parcheggio gratuito", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi fibra", value: true },
    { "@type": "LocationFeatureSpecification", name: "Aria condizionata", value: true },
    { "@type": "LocationFeatureSpecification", name: "Nuova costruzione 2025", value: true },
    { "@type": "LocationFeatureSpecification", name: "Casa indipendente", value: true },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "9.9", reviewCount: "46", bestRating: "10" },
  priceRange: "€€",
  checkinTime: "15:00",
  checkoutTime: "11:00",
};

export default function CasaVacanzaSanPaoloRomaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-stitch-ivory">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image src="/images/hero-sanpaolo.png" alt="Casa vacanza San Paolo Roma — San Paolo Hideout" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-stitch-green/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="font-label text-xs tracking-[0.25em] text-stitch-gold uppercase mb-4">Casa Vacanza · San Paolo · Roma</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight mb-4 max-w-3xl">
              Casa Vacanza<br /><em>San Paolo Roma</em>
            </h1>
            <p className="font-body text-white/80 text-lg max-w-xl">
              Casa indipendente con area verde, nuova costruzione 2025. Vicino Metro B e Basilica San Paolo.
            </p>
          </div>
        </section>

        {/* Contenuto principale */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="prose prose-lg max-w-none text-stitch-on-surface/80 font-body space-y-6">

            <h2 className="font-display text-3xl text-stitch-green font-light">La tua casa vacanza nel cuore di San Paolo, Roma</h2>
            <p>
              <strong>San Paolo Hideout</strong> è una <strong>casa vacanza indipendente</strong> situata nel quartiere <strong>San Paolo di Roma</strong>, a pochi passi dalla storica <strong>Basilica di San Paolo fuori le Mura</strong> e dalla fermata Metro B. Una soluzione perfetta per chi cerca privacy, comfort e una posizione strategica per esplorare Roma.
            </p>

            <h2 className="font-display text-2xl text-stitch-green font-light mt-10">Cosa include la casa vacanza</h2>
            <ul className="space-y-2">
              {[
                "Casa indipendente su due livelli — nessun condominio, massima privacy",
                "2 camere da letto comode per un totale di 3 ospiti",
                "Area esterna verde privata — ideale per colazioni e relax",
                "Parcheggio gratuito direttamente davanti alla struttura",
                "Wi-Fi fibra ad alta velocità incluso",
                "Aria condizionata in tutte le stanze",
                "Cucina completamente attrezzata",
                "Nuova costruzione 2025 — tutto nuovo e moderno",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-stitch-gold mt-1">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-display text-2xl text-stitch-green font-light mt-10">Posizione — Quartiere San Paolo Roma</h2>
            <p>
              Il quartiere <strong>San Paolo</strong> è uno dei più autentici di Roma, lontano dalla folla turistica ma ben connesso con il centro. La <strong>Metro B (fermata Basilica San Paolo)</strong> è raggiungibile in 9 minuti a piedi, permettendo di raggiungere il Colosseo, la Stazione Termini e tutti i principali attrattivi in meno di 20 minuti.
            </p>
            <p>
              L'<strong>Università Roma Tre</strong> dista soli 300 metri, mentre l'aeroporto di Fiumicino è accessibile in 20-25 minuti di treno.
            </p>

            <h2 className="font-display text-2xl text-stitch-green font-light mt-10">Recensioni ospiti — 9.9/10</h2>
            <p>
              Con un punteggio di <strong>9.9/10 su Booking.com</strong> e <strong>5 stelle su Airbnb</strong>, San Paolo Hideout è tra le strutture più apprezzate di Roma. Gli ospiti apprezzano soprattutto la pulizia, la posizione, la comunicazione con il proprietario e l'area verde esclusiva.
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
              href="https://wa.me/393299362759?text=Ciao!%20Vorrei%20prenotare%20la%20casa%20vacanza%20San%20Paolo%20Roma."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-stitch-green text-stitch-green px-8 py-4 rounded-luxury font-label text-sm tracking-widest uppercase hover:bg-stitch-green/5 transition-colors"
            >
              Prenota su WhatsApp
            </a>
          </div>
        </section>

        {/* Nav back */}
        <div className="text-center py-8 border-t border-stitch-green/10">
          <Link href="/" className="font-body text-sm text-stitch-on-surface/50 hover:text-stitch-green transition-colors">
            ← Torna alla home
          </Link>
        </div>
      </main>
    </>
  );
}
