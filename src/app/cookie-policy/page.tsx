import { readContent } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface LegalContent {
  privacy: string;
  cookie: string;
}

const FALLBACK = `<p>Il sito sanpaolohideout.it utilizza cookie tecnici necessari al corretto funzionamento della piattaforma e per garantire una migliore esperienza di navigazione.</p><h2>Cookie tecnici</h2><p>I cookie tecnici sono indispensabili per il funzionamento del sito e non richiedono il consenso dell'utente. Essi consentono, ad esempio, di mantenere la preferenza della lingua selezionata.</p><h2>Cookie di terze parti</h2><p>Non utilizziamo cookie di profilazione né strumenti di tracciamento comportamentale. Eventuali collegamenti a piattaforme esterne (Booking.com, Airbnb, Google Maps) sono regolati dalle rispettive privacy policy.</p><h2>Come disabilitare i cookie</h2><p>È possibile disabilitare i cookie direttamente dalle impostazioni del browser. Si segnala che la disattivazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito.</p>`;

export default async function CookiePolicyPage() {
  const data = await readContent<LegalContent>("legal_content", { privacy: "", cookie: "" });
  const html = data.cookie || FALLBACK;

  return (
    <main className="min-h-screen bg-stitch-ivory py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-light text-stitch-green mb-8">
          Cookie Policy
        </h1>
        <div
          className="html-content prose prose-lg max-w-none text-stitch-on-surface/70 leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stitch-green [&_h2]:mt-8 [&_h2]:mb-3 [&_a]:text-blue-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </main>
  );
}
