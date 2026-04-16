export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stitch-ivory py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-light text-stitch-green mb-8">
          Informativa sulla Privacy
        </h1>
        <div className="space-y-6 text-stitch-on-surface/70 leading-relaxed">
          <p>
            Ai sensi dell&apos;art. 13 del Regolamento UE 2016/679 (GDPR), San Paolo Hideout informa che i dati personali forniti tramite il sito web saranno trattati esclusivamente per rispondere alle richieste di informazioni e per gestire le prenotazioni.
          </p>
          <h2 className="font-display text-xl font-semibold text-stitch-green mt-8 mb-3">
            Titolare del trattamento
          </h2>
          <p>
            Titolare del trattamento è il gestore di San Paolo Hideout, con sede in Via Silvio d&apos;Amico 96, 00145 Roma. Per qualsiasi richiesta è possibile contattarci all&apos;indirizzo email sanpaolohideout@gmail.com.
          </p>
          <h2 className="font-display text-xl font-semibold text-stitch-green mt-8 mb-3">
            Dati raccolti
          </h2>
          <p>
            Raccogliamo esclusivamente i dati necessari alla prenotazione e alla comunicazione (nome, cognome, indirizzo email, numero di telefono). Non utilizziamo cookie di profilazione di terze parti.
          </p>
          <h2 className="font-display text-xl font-semibold text-stitch-green mt-8 mb-3">
            Diritti dell&apos;interessato
          </h2>
          <p>
            L&apos;interessato ha diritto di accesso, retifica, cancellazione, limitazione del trattamento, opposizione e portabilità dei dati. Per esercitare tali diritti è sufficiente inviare una richiesta all&apos;indirizzo email indicato.
          </p>
        </div>
      </div>
    </main>
  );
}
