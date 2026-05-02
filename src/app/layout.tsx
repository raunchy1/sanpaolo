import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { Newsreader, Manrope } from "next/font/google";

// Force every page to be server-rendered on each request — no edge/ISR cache
export const dynamic = "force-dynamic";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { readContent } from "@/lib/supabase";
import type { SiteSettings } from "@/app/api/settings/route";
import CookieBanner from "@/components/ui/CookieBanner";

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

const STATIC_TITLE = "San Paolo Hideout | Casa Vacanze Roma";
const STATIC_DESC = "San Paolo Hideout: casa vacanze indipendente a Roma vicino alla Basilica San Paolo e alla Metro B. Nuova costruzione 2025, area esterna verde, 2 camere, 3 ospiti. Prenota direttamente al miglior prezzo.";
const STATIC_OG_TITLE = "San Paolo Hideout — Roma | Casa Vacanze con Area Verde";
const STATIC_OG_DESC = "Your private Roman sanctuary near Metro B. Newly built detached house 2025, 2 bedrooms, shared green outdoor area. Book directly on WhatsApp.";
// Fallback = property photo (never Trevi). Overridden by admin settings.
const FALLBACK_OG_IMAGE = "https://sanpaolohideout.it/images/hero-sanpaolo.png";

export async function generateMetadata(): Promise<Metadata> {
  noStore(); // always read fresh settings — no CDN/ISR cache
  let settings: Partial<SiteSettings> = {};
  try {
    settings = await readContent<SiteSettings>("settings", {} as SiteSettings);
  } catch { /* fallback to static */ }

  const title = settings.seoTitle || STATIC_TITLE;
  const description = settings.seoDescription || STATIC_DESC;
  const ogTitle = settings.ogTitle || STATIC_OG_TITLE;
  const ogDesc = settings.ogDescription || STATIC_OG_DESC;
  const ogImage = settings.ogImage?.trim() || FALLBACK_OG_IMAGE;

  return {
    metadataBase: new URL("https://sanpaolohideout.it"),
    title,
    description,
    keywords: [
      "San Paolo Hideout", "Rome vacation rental", "Rome holiday home",
      "boutique stay Rome", "green outdoor area Rome", "Metro B Rome",
      "Basilica San Paolo", "direct booking Rome", "detached house Rome",
      "new build Rome 2025", "Rom Ferienwohnung", "Via Silvio d'Amico Roma",
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
      title: ogTitle,
      description: ogDesc,
      url: "https://sanpaolohideout.it",
      siteName: "San Paolo Hideout",
      type: "website",
      locale: "it_IT",
      alternateLocale: ["en_US", "de_DE"],
      images: [{ url: ogImage, width: 1344, height: 768, alt: "San Paolo Hideout - Roma" }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
    },
  };
}

interface DesignConfig {
  primaryColor?: string;
  primaryHover?: string;
  accentColor?: string;
  borderRadius?: string;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let design: DesignConfig = {};
  try {
    design = await readContent<DesignConfig>("design_config", {});
  } catch { /* no design overrides */ }

  // Build CSS variable overrides only for fields explicitly set
  const cssVars = [
    design.primaryColor && `--color-admin-primary: ${design.primaryColor};`,
    design.primaryHover && `--color-admin-primary-hover: ${design.primaryHover};`,
    design.accentColor  && `--color-admin-accent: ${design.accentColor};`,
    design.borderRadius && `--admin-border-radius: ${design.borderRadius};`,
  ].filter(Boolean).join(" ");

  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {cssVars && (
          <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LodgingBusiness", "VacationRental"],
              name: "San Paolo Hideout",
              alternateName: "Casa Vacanza San Paolo Roma",
              description: "Casa vacanza indipendente di nuova costruzione 2025 nel quartiere San Paolo di Roma. 2 camere da letto, area esterna verde privata, parcheggio gratuito, vicino Metro B e Università Roma Tre.",
              url: "https://sanpaolohideout.it",
              image: [
                "https://sanpaolohideout.it/images/hero-sanpaolo.png",
                "https://sanpaolohideout.it/images/hero.jpg",
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Silvio d'Amico 96",
                addressLocality: "Roma",
                addressRegion: "Lazio",
                postalCode: "00145",
                addressCountry: "IT",
              },
              geo: { "@type": "GeoCoordinates", latitude: 41.8553, longitude: 12.4734 },
              hasMap: "https://maps.google.com/?q=Via+Silvio+D%27Amico+96,+00145+Roma",
              telephone: "+393299362759",
              email: "sanpaolohideout@gmail.com",
              aggregateRating: { "@type": "AggregateRating", ratingValue: "9.9", reviewCount: "46", bestRating: "10", worstRating: "1" },
              starRating: { "@type": "Rating", ratingValue: "9.9", bestRating: "10" },
              numberOfRooms: 2,
              occupancy: { "@type": "QuantitativeValue", maxValue: 3 },
              petsAllowed: true,
              checkinTime: "T15:00",
              checkoutTime: "T11:00",
              priceRange: "€€",
              currenciesAccepted: "EUR",
              paymentAccepted: "Cash, Credit Card",
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Area esterna verde privata", value: true },
                { "@type": "LocationFeatureSpecification", name: "Parcheggio gratuito", value: true },
                { "@type": "LocationFeatureSpecification", name: "Wi-Fi fibra ad alta velocità", value: true },
                { "@type": "LocationFeatureSpecification", name: "Aria condizionata", value: true },
                { "@type": "LocationFeatureSpecification", name: "Smart TV con streaming", value: true },
                { "@type": "LocationFeatureSpecification", name: "Cucina completamente attrezzata", value: true },
                { "@type": "LocationFeatureSpecification", name: "Casa indipendente", value: true },
                { "@type": "LocationFeatureSpecification", name: "Nuova costruzione 2025", value: true },
                { "@type": "LocationFeatureSpecification", name: "Pet friendly", value: true },
                { "@type": "LocationFeatureSpecification", name: "Baby cot disponibile", value: true },
              ],
              sameAs: [
                "https://www.airbnb.it/rooms/1517964247980793952",
                "https://www.booking.com/hotel/it/san-paolo-hideout-roma.it.html",
                "https://www.instagram.com/casavacanze_sanpaolohideout/",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: [
                { "@type": "Review", position: 1, author: { "@type": "Person", name: "Martina" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "Abbiamo passato una notte e siamo rimasti molto soddisfatti. La casa è nuova, all'interno di una zona molto silenziosa ma vicina dell'università Roma Tre e alla metro.", datePublished: "2026-04", itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" } },
                { "@type": "Review", position: 2, author: { "@type": "Person", name: "Jose" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "We had a wonderful stay here and felt comfortable from the moment we arrived. Nicola is an outstanding host — very professional, kind, and attentive.", datePublished: "2024-10", itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" } },
                { "@type": "Review", position: 3, author: { "@type": "Person", name: "Riccardo" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "Ottimo alloggio! Un grazie speciale a Nicola per la sua grande gentilezza. Grande cura in tutti i dettagli della casa, super confortevole.", datePublished: "2024-10", itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" } },
                { "@type": "Review", position: 4, author: { "@type": "Person", name: "Diana" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "Ottima posizione, parcheggio privato, buona comunicazione. Di sicuro torneremo.", datePublished: "2024-11", itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" } },
                { "@type": "Review", position: 5, author: { "@type": "Person", name: "Ili" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "Wir haben einen wunderbaren Aufenthalt in dem sehr netten und gut ausgestatteten Ferienhaus. Vielen Dank für alles, Nicola!", datePublished: "2026-02", itemReviewed: { "@type": "LodgingBusiness", name: "San Paolo Hideout" } },
              ],
            }),
          }}
        />
        <link rel="preload" as="image" href="/images/hero-trevi.jpg" fetchPriority="high" />
      </head>
      <body className={`${newsreader.variable} ${manrope.variable} antialiased bg-stitch-ivory text-stitch-on-surface font-body`}>
        <I18nProvider>{children}</I18nProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
