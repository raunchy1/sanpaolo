import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/supabase";

export interface AmenityCategory {
  id: string;
  label: string;
  tagline: string;
  items: string[];
}

export interface AmenitiesConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  categories: AmenityCategory[];
  pet: {
    label: string;
    tagline: string;
    desc: string;
    badge: string;
  };
}

export const DEFAULT_CONFIG: AmenitiesConfig = {
  eyebrow: "Servizi Inclusi",
  title: "Ogni dettaglio, pensato per te",
  subtitle: "Una casa nuova, arredata con cura — ogni comfort al suo posto",
  categories: [
    {
      id: "comfort",
      label: "Comfort",
      tagline: "Un ambiente moderno e accogliente",
      items: [
        "Wi-Fi fibra ad alta velocità",
        "Smart TV con streaming incluso",
        "Aria condizionata in ogni ambiente",
        "Casa di nuova costruzione 2025",
        "Parcheggio gratuito fronte struttura",
      ],
    },
    {
      id: "kitchen",
      label: "Cucina",
      tagline: "Attrezzata per ogni esigenza",
      items: [
        "Tavolo da pranzo",
        "Macchina da caffè",
        "Prodotti per le pulizie",
        "Tostapane",
        "Piano cottura a induzione",
        "Forno",
        "Bollitore elettrico",
        "Lavatrice",
        "Lavastoviglie",
        "Forno a microonde",
        "Frigorifero",
      ],
    },
    {
      id: "bathroom",
      label: "Bagno",
      tagline: "Moderno, pulito, ben curato",
      items: [
        "Doccia moderna",
        "Bidet",
        "Asciugamani di qualità inclusi",
        "Set prodotti bagno premium",
        "Asciugacapelli",
      ],
    },
    {
      id: "family",
      label: "Famiglia",
      tagline: "Pensato anche per i più piccoli",
      items: [
        "Culla disponibile su richiesta",
        "100% family friendly",
        "Check-in flessibile 15:00–20:00",
      ],
    },
    {
      id: "extra",
      label: "Servizi Extra",
      tagline: "I dettagli che fanno la differenza",
      items: [
        "Deposito bagagli flessibile",
        "Parcheggio gratuito fronte struttura",
        "Supporto ospiti rapido e personalizzato",
      ],
    },
  ],
  pet: {
    label: "Pet Friendly",
    tagline: "Animali benvenuti su richiesta",
    desc: "Accettiamo piccoli animali domestici previo accordo con l'host. Scriveteci prima della prenotazione.",
    badge: "Su richiesta",
  },
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await readContent<AmenitiesConfig>("amenities_config", DEFAULT_CONFIG);
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: AmenitiesConfig = await req.json();
  await writeContent("amenities_config", body);
  return NextResponse.json({ ok: true });
}
