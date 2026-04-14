import type { Metadata } from "next";
import { Macondo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const macondo = Macondo({
  variable: "--font-macondo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sanpaolohideout.com"),
  title: "San Paolo Hideout — La tua dimora romana privata",
  description:
    "San Paolo Hideout: casa vacanze boutique a Roma vicino alla Basilica San Paolo e Metro B. Giardino privato, 2 camere, design elegante. Prenota direttamente al miglior prezzo.",
  keywords: [
    "San Paolo Hideout",
    "Rome vacation rental",
    "Roma casa vacanze",
    "boutique stay Rome",
    "private garden Rome",
    "Metro B Rome",
    "Basilica San Paolo",
    "direct booking Rome",
    "luxury Rome apartment",
    "Rom Ferienwohnung",
    "römische Zuflucht",
  ],
  authors: [{ name: "San Paolo Hideout" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "San Paolo Hideout — Roma | Casa Vacanze Boutique con Giardino Privato",
    description:
      "La tua dimora romana privata vicino Metro B. 2 camere, giardino privato, design elegante. Prenota direttamente su WhatsApp.",
    url: "https://sanpaolohideout.com",
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
      "La tua dimora romana privata vicino Metro B. Prenota direttamente.",
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
                "Boutique vacation rental in Rome near Basilica San Paolo and Metro B. Private garden, 2 bedrooms, elegant design.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via delle Sette Chiese",
                addressLocality: "Roma",
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
                ratingValue: "4.97",
                bestRating: "5",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.97",
                reviewCount: "127",
                bestRating: "5",
              },
              numberOfRooms: "2",
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Private Garden", value: true },
                { "@type": "LocationFeatureSpecification", name: "Self Check-in", value: true },
                { "@type": "LocationFeatureSpecification", name: "Fast Wi-Fi", value: true },
                { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
              ],
              image: "/images/hero-trevi.jpg",
              url: "https://sanpaolohideout.com",
              priceRange: "€€",
              checkinTime: "15:00",
              checkoutTime: "11:00",
            }),
          }}
        />
        {/* Preload hero image */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-trevi.jpg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${macondo.variable} ${jetbrainsMono.variable} antialiased bg-roman-warm-white text-foreground`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}