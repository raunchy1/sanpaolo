import { readContent } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface LegalContent {
  privacy: string;
  cookie: string;
}

function renderText(text: string) {
  return text.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-xl font-semibold text-stitch-green mt-8 mb-3">
          {block.slice(3)}
        </h2>
      );
    }
    return (
      <p key={i}>{block}</p>
    );
  });
}

const FALLBACK = `Il sito sanpaolohideout.it utilizza cookie tecnici necessari al corretto funzionamento della piattaforma e per garantire una migliore esperienza di navigazione.

## Cookie tecnici

I cookie tecnici sono indispensabili per il funzionamento del sito e non richiedono il consenso dell'utente. Essi consentono, ad esempio, di mantenere la preferenza della lingua selezionata.

## Cookie di terze parti

Non utilizziamo cookie di profilazione né strumenti di tracciamento comportamentale. Eventuali collegamenti a piattaforme esterne (Booking.com, Airbnb, Google Maps) sono regolati dalle rispettive privacy policy.

## Come disabilitare i cookie

È possibile disabilitare i cookie direttamente dalle impostazioni del browser. Si segnala che la disattivazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito.`;

export default async function CookiePolicyPage() {
  const data = await readContent<LegalContent>("legal_content", { privacy: "", cookie: "" });
  const text = data.cookie || FALLBACK;

  return (
    <main className="min-h-screen bg-stitch-ivory py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-light text-stitch-green mb-8">
          Cookie Policy
        </h1>
        <div className="space-y-6 text-stitch-on-surface/70 leading-relaxed">
          {renderText(text)}
        </div>
      </div>
    </main>
  );
}
