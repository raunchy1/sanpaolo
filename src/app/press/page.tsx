import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Press & Media Kit — San Paolo Hideout Roma",
  description: "Press kit ufficiale di San Paolo Hideout: descrizione della struttura, foto ufficiali, dati e contatti per giornalisti, blogger e media. Casa vacanza boutique a Roma, quartiere San Paolo.",
  openGraph: {
    title: "Press & Media Kit — San Paolo Hideout Roma",
    description: "Informazioni ufficiali per media, blogger e giornalisti su San Paolo Hideout, casa vacanza boutique a Roma.",
    url: "https://sanpaolohideout.it/press",
  },
  alternates: { canonical: "https://sanpaolohideout.it/press" },
};

const STATS = [
  { label: "Punteggio Booking.com", value: "9.9/10" },
  { label: "Stelle Airbnb", value: "5/5" },
  { label: "Stelle Google", value: "5/5" },
  { label: "Recensioni totali", value: "46+" },
  { label: "Ospiti max", value: "3" },
  { label: "Camere da letto", value: "2" },
  { label: "Anno costruzione", value: "2025" },
  { label: "Distanza Metro B", value: "9 min" },
];

const FEATURES = [
  "Casa indipendente su due livelli — nessun condominio",
  "Area esterna verde privata esclusiva",
  "Parcheggio gratuito fronte struttura",
  "Wi-Fi fibra ad alta velocità",
  "Aria condizionata in tutte le stanze",
  "Smart TV con streaming incluso",
  "Cucina completamente attrezzata",
  "Pet friendly — animali benvenuti",
  "CIN: IT058091C2OS2A4EP2 — struttura regolare",
  "Check-in flessibile 15:00–20:00",
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-stitch-ivory">
      {/* Header */}
      <section className="bg-stitch-green text-white py-20 px-6 text-center">
        <span className="font-label text-xs tracking-[0.3em] text-stitch-gold uppercase block mb-4">Press & Media Kit</span>
        <h1 className="font-display text-4xl sm:text-5xl font-light mb-4">San Paolo Hideout</h1>
        <p className="font-body text-white/70 text-lg max-w-2xl mx-auto">
          Informazioni ufficiali per giornalisti, blogger, content creator e media.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Descrizione breve */}
        <section>
          <h2 className="font-display text-2xl text-stitch-green font-light mb-4">Descrizione breve (100 parole)</h2>
          <div className="bg-white rounded-2xl border border-stitch-green/10 p-6">
            <p className="font-body text-stitch-on-surface/80 leading-relaxed">
              <strong>San Paolo Hideout</strong> è una casa vacanza indipendente di nuova costruzione (2025) situata nel quartiere San Paolo di Roma, a 9 minuti a piedi dalla Metro B e a 300 metri dall'Università Roma Tre. La struttura offre 2 camere da letto per un massimo di 3 ospiti, un'area esterna verde privata e parcheggio gratuito. Valutata <strong>9.9/10 su Booking.com</strong> e <strong>5 stelle su Airbnb</strong>, è tra le strutture più apprezzate di Roma per privacy, pulizia e comunicazione con il proprietario. Prenotazione diretta disponibile via WhatsApp.
            </p>
          </div>
        </section>

        {/* Descrizione lunga */}
        <section>
          <h2 className="font-display text-2xl text-stitch-green font-light mb-4">Descrizione estesa</h2>
          <div className="bg-white rounded-2xl border border-stitch-green/10 p-6 space-y-4 font-body text-stitch-on-surface/80 leading-relaxed">
            <p>
              San Paolo Hideout nasce dall'idea di offrire a Roma qualcosa di raro: una <strong>casa indipendente autentica</strong>, non un appartamento anonimo in un palazzo. Costruita nel 2025, la struttura si sviluppa su due livelli e comprende 2 camere da letto, soggiorno, cucina attrezzata e un bagno moderno.
            </p>
            <p>
              Il fiore all'occhiello è l'<strong>area esterna verde privata</strong>: un giardino esclusivo per gli ospiti dove fare colazione, rilassarsi o organizzare una cena all'aperto — una rarità nel tessuto urbano romano. La struttura dispone inoltre di <strong>parcheggio gratuito</strong> direttamente di fronte all'ingresso, eliminando uno dei maggiori stress del soggiorno a Roma.
            </p>
            <p>
              La posizione nel quartiere <strong>San Paolo / Ostiense</strong> è strategica: autentica e vivace, lontana dal caos turistico ma ben connessa. La fermata Metro B (Basilica San Paolo) è a 9 minuti a piedi, permettendo di raggiungere il centro in pochi minuti. L'aeroporto di Fiumicino dista 20-25 minuti di treno dalla vicina Stazione Ostiense.
            </p>
            <p>
              Il proprietario <strong>Nicola Franchino</strong> gestisce personalmente la struttura con oltre 7 anni di esperienza nell'ospitalità. Il check-in è sempre in presenza: ogni ospite viene accolto personalmente e guidato alla scoperta del quartiere.
            </p>
          </div>
        </section>

        {/* Dati chiave */}
        <section>
          <h2 className="font-display text-2xl text-stitch-green font-light mb-6">Dati chiave</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-stitch-green/10 p-5 text-center">
                <p className="font-display text-3xl text-stitch-green font-light">{value}</p>
                <p className="font-body text-xs text-stitch-on-surface/50 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Servizi */}
        <section>
          <h2 className="font-display text-2xl text-stitch-green font-light mb-4">Servizi inclusi</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2 font-body text-sm text-stitch-on-surface/80">
                <span className="text-stitch-gold mt-0.5 shrink-0">✦</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Foto ufficiali */}
        <section>
          <h2 className="font-display text-2xl text-stitch-green font-light mb-4">Foto ufficiali</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-2xl">
              <Image src="/images/hero-sanpaolo.png" alt="San Paolo Hideout — esterno" width={600} height={400} className="object-cover w-full h-56" />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image src="/images/hero.jpg" alt="San Paolo Hideout — area esterna" width={600} height={400} className="object-cover w-full h-56" />
            </div>
          </div>
          <p className="font-body text-xs text-stitch-on-surface/40 mt-3">
            Per immagini ad alta risoluzione: <a href="mailto:sanpaolohideout@gmail.com" className="underline">sanpaolohideout@gmail.com</a>
          </p>
        </section>

        {/* Link e contatti */}
        <section>
          <h2 className="font-display text-2xl text-stitch-green font-light mb-4">Link & Contatti</h2>
          <div className="bg-white rounded-2xl border border-stitch-green/10 p-6 space-y-3 font-body text-sm">
            {[
              { label: "Sito ufficiale", href: "https://sanpaolohideout.it", text: "sanpaolohideout.it" },
              { label: "Airbnb", href: "https://www.airbnb.it/rooms/1517964247980793952", text: "airbnb.it/rooms/1517964247980793952" },
              { label: "Booking.com", href: "https://www.booking.com/hotel/it/san-paolo-hideout-roma.it.html", text: "booking.com" },
              { label: "Instagram", href: "https://www.instagram.com/casavacanze_sanpaolohideout/", text: "@casavacanze_sanpaolohideout" },
              { label: "Email", href: "mailto:sanpaolohideout@gmail.com", text: "sanpaolohideout@gmail.com" },
              { label: "WhatsApp", href: "https://wa.me/393299362759", text: "+39 329 936 2759" },
            ].map(({ label, href, text }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-28 text-stitch-on-surface/40 shrink-0">{label}</span>
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-stitch-green hover:underline truncate">{text}</a>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Back */}
      <div className="text-center py-8 border-t border-stitch-green/10">
        <Link href="/" className="font-body text-sm text-stitch-on-surface/50 hover:text-stitch-green transition-colors">
          ← Torna alla home
        </Link>
      </div>
    </main>
  );
}
