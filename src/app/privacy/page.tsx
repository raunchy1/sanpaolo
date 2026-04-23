import { readContent } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface LegalContent {
  privacy: string;
  cookie: string;
}

const FALLBACK = `<p>Ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR), San Paolo Hideout informa che i dati personali forniti tramite il sito web saranno trattati esclusivamente per rispondere alle richieste di informazioni e per gestire le prenotazioni.</p><h2>Titolare del trattamento</h2><p>Titolare del trattamento è il gestore di San Paolo Hideout, con sede in Via Silvio d'Amico 96, 00145 Roma. Per qualsiasi richiesta è possibile contattarci all'indirizzo email sanpaolohideout@gmail.com.</p><h2>Dati raccolti</h2><p>Raccogliamo esclusivamente i dati necessari alla prenotazione e alla comunicazione (nome, cognome, indirizzo email, numero di telefono). Non utilizziamo cookie di profilazione di terze parti.</p><h2>Diritti dell'interessato</h2><p>L'interessato ha diritto di accesso, retifica, cancellazione, limitazione del trattamento, opposizione e portabilità dei dati. Per esercitare tali diritti è sufficiente inviare una richiesta all'indirizzo email indicato.</p>`;

export default async function PrivacyPage() {
  const data = await readContent<LegalContent>("legal_content", { privacy: "", cookie: "" });
  const html = data.privacy || FALLBACK;

  return (
    <main className="min-h-screen bg-stitch-ivory py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-light text-stitch-green mb-8">
          Informativa sulla Privacy
        </h1>
        <div
          className="prose prose-lg max-w-none text-stitch-on-surface/70 leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stitch-green [&_h2]:mt-8 [&_h2]:mb-3 [&_a]:text-blue-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </main>
  );
}
