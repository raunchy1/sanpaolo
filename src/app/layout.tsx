import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sanpaolohideout.it"),
  title: "San Paolo Hideout | Casa Vacanza Roma San Paolo",
  description:
    "San Paolo Hideout: casa vacanze boutique a Roma vicino alla Basilica San Paolo e Metro B. Casa indipendente di nuova costruzione 2025, area esterna verde condivisa, 2 camere, 3 ospiti. Prenota direttamente al miglior prezzo.",
  keywords: [
    "San Paolo Hideout",
    "Rome vacation rental",
    "Roma casa vacanze",
    "boutique stay Rome",
    "area esterna verde Roma",
    "Metro B Rome",
    "Basilica San Paolo",
    "direct booking Rome",
    "casa indipendente Roma",
    "nuova costruzione Roma 2025",
    "Rom Ferienwohnung",
    "Via Silvio d'Amico Roma",
  ],
  authors: [{ name: "San Paolo Hideout" }],
  icons: {
    icon: [
      { url: "/logo-green.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-green.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-green.png", sizes: "any" },
    ],
    apple: { url: "/logo-green.png", sizes: "180x180", type: "image/png" },
    shortcut: "/logo-green.png",
  },
  openGraph: {
    title: "San Paolo Hideout — Roma | Casa Vacanze Boutique con Area Esterna Verde",
    description:
      "La tua dimora romana privata vicino Metro B. Casa indipendente nuova 2025, 2 camere, area esterna verde condivisa. Prenota direttamente su WhatsApp.",
    url: "https://sanpaolohideout.it",
    siteName: "San Paolo Hideout",
    type: "website",
    locale: "it_IT",
    alternateLocale: ["en_US", "de_DE"],
    images: [
      {
        url: "/images/hero-trevi.jpg",
        width: 1344,
        height: 768,
        alt: "San Paolo Hideout - Roma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "San Paolo Hideout — Roma",
    description:
      "La tua dimora romana privata vicino Metro B. Casa nuova 2025, area verde. Prenota direttamente.",
    images: ["/images/hero-trevi.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: "San Paolo Hideout",
              description:
                "Boutique vacation rental in Rome near Basilica San Paolo and Metro B. Newly built detached house 2025, shared green outdoor area, 2 bedrooms, 3 guests.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Silvio d'Amico 96",
                addressLocality: "Roma",
                postalCode: "00145",
                addressRegion: "Lazio",
                addressCountry: "IT",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 41.8553,
                longitude: 12.4734,
              },
              starRating: {
                "@type": "Rating",
                ratingValue: "9.9",
                bestRating: "10",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "9.9",
                reviewCount: "46",
                bestRating: "10",
              },
              numberOfRooms: "2",
              occupancy: {
                "@type": "QuantitativeValue",
                maxValue: 3,
              },
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Shared Green Outdoor Area", value: true },
                { "@type": "LocationFeatureSpecification", name: "Free Parking", value: true },
{ "@type": "LocationFeatureSpecification", name: "Fast Wi-Fi", value: true },
                { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
                { "@type": "LocationFeatureSpecification", name: "Smart TV", value: true },
                { "@type": "LocationFeatureSpecification", name: "Newly Built 2025", value: true },
              ],
              image: "/images/hero-trevi.jpg",
              url: "https://sanpaolohideout.it",
              priceRange: "€€",
              checkinTime: "15:00",
              checkoutTime: "11:00",
            }),
          }}
        />
        {/* Review structured data — real Airbnb guest reviews */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "Review",
                  position: 1,
                  author: { "@type": "Person", name: "Martina" },
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  reviewBody: "Abbiamo passato una notte e siamo rimasti molto soddisfatti. La casa è nuova, all'interno di una zona molto silenziosa ma vicina dell'università Roma Tre e alla metro. Nicola è stato molto disponibile e ci ha aiutato. L'host è gentile e molto disponibile, ci ha dato la possibilità di lasciare i bagagli molto prima del checkin.",
                  datePublished: "2026-04",
                  itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" },
                },
                {
                  "@type": "Review",
                  position: 2,
                  author: { "@type": "Person", name: "Jose" },
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  reviewBody: "We had a wonderful stay here and felt comfortable from the moment we arrived. The beds were very comfortable, the sofa was amazing, and having Netflix on the TV was a great bonus. The private parking was a huge advantage. Nicola is an outstanding host — very professional, kind, and attentive.",
                  datePublished: "2024-10",
                  itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" },
                },
                {
                  "@type": "Review",
                  position: 3,
                  author: { "@type": "Person", name: "Riccardo" },
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  reviewBody: "Ottimo alloggio! Un grazie speciale a Nicola per la sua grande gentilezza, attenzione e disponibilità. Grande cura in tutti i dettagli della casa, super confortevole e immersa in un bellissimo verde.",
                  datePublished: "2024-10",
                  itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" },
                },
                {
                  "@type": "Review",
                  position: 4,
                  author: { "@type": "Person", name: "Diana" },
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  reviewBody: "Era il nostro 2° giorno a Roma. Per fortuna avevamo un parcheggio privato — fuori era impossibile parcheggiare. Buona posizione, anche a piedi è facile raggiungere tanti posti. Di sicuro torneremo.",
                  datePublished: "2024-11",
                  itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" },
                },
                {
                  "@type": "Review",
                  position: 5,
                  author: { "@type": "Person", name: "Ili" },
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  reviewBody: "Wir haben einen wunderbaren Aufenthalt in dem sehr netten und gut ausgestatteten Ferienhaus. Der Gastgeber hat uns sehr viel geholfen und wir kommen bestimmt bald wieder. Vielen Dank für alles, Nicola!",
                  datePublished: "2026-02",
                  itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" },
                },
                {
                  "@type": "Review",
                  position: 6,
                  author: { "@type": "Person", name: "Umberto" },
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  reviewBody: "Ottimo e accurato: davvero gentile, la struttura è impeccabile e si sta molto bene.",
                  datePublished: "2024-09",
                  itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" },
                },
                {
                  "@type": "Review",
                  position: 7,
                  author: { "@type": "Person", name: "Giacomo" },
                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                  reviewBody: "Ottimo alloggio.",
                  datePublished: "2024-01",
                  itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" },
                },
              ],
            }),
          }}
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-trevi.jpg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${newsreader.variable} ${manrope.variable} antialiased bg-stitch-ivory text-stitch-on-surface font-body`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}