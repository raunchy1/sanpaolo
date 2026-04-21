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

const FALLBACK = `Ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR), San Paolo Hideout informa che i dati personali forniti tramite il sito web saranno trattati esclusivamente per rispondere alle richieste di informazioni e per gestire le prenotazioni.

## Titolare del trattamento

Titolare del trattamento è il gestore di San Paolo Hideout, con sede in Via Silvio d'Amico 96, 00145 Roma. Per qualsiasi richiesta è possibile contattarci all'indirizzo email sanpaolohideout@gmail.com.

## Dati raccolti

Raccogliamo esclusivamente i dati necessari alla prenotazione e alla comunicazione (nome, cognome, indirizzo email, numero di telefono). Non utilizziamo cookie di profilazione di terze parti.

## Diritti dell'interessato

L'interessato ha diritto di accesso, retifica, cancellazione, limitazione del trattamento, opposizione e portabilità dei dati. Per esercitare tali diritti è sufficiente inviare una richiesta all'indirizzo email indicato.`;

export default async function PrivacyPage() {
  const data = await readContent<LegalContent>("legal_content", { privacy: "", cookie: "" });
  const text = data.privacy || FALLBACK;

  return (
    <main className="min-h-screen bg-stitch-ivory py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-light text-stitch-green mb-8">
          Informativa sulla Privacy
        </h1>
        <div className="space-y-6 text-stitch-on-surface/70 leading-relaxed">
          {renderText(text)}
        </div>
      </div>
    </main>
  );
}
