// Testi della landing nelle due versioni scelte con le pillole.
// Regola legale: nessuna promessa di guadagno, ogni numero accompagnato dal suo contesto.

export type Mode = 'neofita' | 'esperto'

interface Item { title: string; text: string }
interface Row { k: string; bad: string; good: string }
interface Faq { q: string; a: string }

export interface Copy {
  ticker: string[]
  hero: { chip: string; h1a: string; h1b: string; sub: string; cta1: string; cta2: string; trust: string[] }
  problem: { eyebrow: string; titleA: string; titleB: string; intro: string; pains: Item[]; closerA: string; closerB: string }
  method: { steps: { kicker: string; title: string; text: string }[]; wait: string; go: string; badge: string }
  proof: { titleA: string; titleB: string; sub: string; notes: [string, string, string, string]; explainer: string }
  compare: { titleA: string; titleB: string; badLabel: string; goodLabel: string; rows: Row[] }
  packages: { featured: Mode; sub: string }
  faq: Faq[]
  final: { titleA: string; titleB: string; sub: string }
}

const FAQ_COMMON: Faq[] = [
  {
    q: 'Il metodo garantisce guadagni?',
    a: 'No, e diffida di chiunque te lo prometta. Il trading comporta sempre il rischio di perdere denaro. Quello che ti diamo sono regole, strumenti e un affiancamento per operare con disciplina e con un rischio deciso in anticipo.',
  },
  {
    q: 'Mi dite voi cosa comprare e vendere?',
    a: 'No. Non forniamo consulenza finanziaria personalizzata né operiamo sul tuo conto. Ti insegniamo un metodo e come usare l\'indicatore: le decisioni restano sempre tue.',
  },
  {
    q: 'Come ricevo l\'accesso?',
    a: 'Dopo l\'iscrizione in chat ti inviamo le credenziali personali. Con quelle entri nell\'area riservata, dove trovi lezioni, materiali e indicatore.',
  },
]

export const COPY: Record<Mode, Copy> = {
  neofita: {
    ticker: ['Regole semplici', 'Oro · XAU/USD', 'Grafici a 15 minuti', 'Rischio massimo 1% per operazione', 'Assistenza in chat 24/7', 'Backtest pubblico'],
    hero: {
      chip: 'oro · 15 minuti · 4 conferme',
      h1a: 'Il mercato non premia chi fa di più.',
      h1b: 'Premia chi sbaglia di meno.',
      sub: 'Ti insegniamo un metodo con regole chiare: un indicatore che ti dice quando aspettare e quando è il momento di agire. Parti da zero, con persone vere che ti seguono passo dopo passo.',
      cta1: 'Scopri il percorso per iniziare',
      cta2: 'Come funziona, in parole semplici',
      trust: ['Backtest pubblico su TradingView', 'Assistenza in chat 24/7', 'Live su TikTok'],
    },
    problem: {
      eyebrow: 'Ti suona familiare?',
      titleA: 'Non serve sapere tutto.',
      titleB: 'Serve sapere quando fermarsi.',
      intro: 'Chi inizia di solito non sbaglia per mancanza di impegno. Sbaglia perché nessuno gli ha dato regole semplici da seguire.',
      pains: [
        { title: 'Non sai da dove cominciare', text: 'Video, gruppi, opinioni opposte. Più informazioni raccogli, più confusione hai.' },
        { title: 'Entri sull\'onda dell\'emozione', text: 'Il prezzo sale, temi di perdere l\'occasione e compri. Spesso proprio nel momento sbagliato.' },
        { title: 'Hai paura di bruciare il conto', text: 'Senza una regola sul rischio, ogni operazione sembra una scommessa.' },
        { title: 'Pensi di dover stare ore al grafico', text: 'Non è così. Con un metodo chiaro bastano poche decisioni, prese con calma.' },
      ],
      closerA: 'La soluzione non è fare di più.',
      closerB: 'È avere un filtro.',
    },
    method: {
      steps: [
        { kicker: 'Il metodo', title: 'Funziona come un semaforo.', text: 'L\'indicatore controlla quattro condizioni sul grafico dell\'oro. Finché non sono tutte d\'accordo, la luce resta gialla: si aspetta.' },
        { kicker: 'Conferma 1 di 4', title: 'Una luce si accende.', text: 'Da sola non basta. Chi entra adesso sta tirando a indovinare. Tu aspetti.' },
        { kicker: 'Conferma 2 di 4', title: 'Il quadro si fa più chiaro.', text: 'È il momento in cui molti principianti perdono la pazienza. Tu no.' },
        { kicker: 'Conferma 3 di 4', title: 'Ci siamo quasi.', text: 'Ma "quasi" non è ancora un sì. La disciplina si vede proprio qui.' },
        { kicker: 'Conferma 4 di 4 · Via libera', title: 'Ora, e solo ora, entri.', text: 'Tutte e quattro allineate: la luce diventa verde. Entri rischiando al massimo l\'1% del conto, deciso prima.' },
      ],
      wait: 'Aspetta',
      go: 'Via libera',
      badge: 'Le 4 conferme te le spieghiamo nel corso',
    },
    proof: {
      titleA: 'Non ti chiediamo di fidarti.',
      titleB: 'Ti chiediamo di controllare.',
      sub: 'Il backtest del metodo è pubblico su TradingView: puoi vedere ogni operazione simulata, una per una.',
      notes: [
        'nel backtest pubblico da luglio: per ogni euro perso, 3,5 guadagnati',
        'grafici a 15 minuti: niente decisioni prese in pochi secondi',
        'il massimo che rischi su ogni operazione, deciso prima',
        'condizioni che devono allinearsi prima di entrare',
      ],
      explainer: 'Cos\'è il Profit Factor? È il rapporto tra quanto si è guadagnato e quanto si è perso. Sopra 1 il sistema è in attivo: 3,5 è il valore registrato nel backtest. Un backtest è una simulazione sul passato, non una previsione del futuro.',
    },
    compare: {
      titleA: 'Uno ti consuma.',
      titleB: 'L\'altro ti lascia vivere.',
      badLabel: 'Fare trading a istinto',
      goodLabel: 'Con il metodo',
      rows: [
        { k: 'Ogni quanto guardi il grafico', bad: 'Di continuo, ogni minuto', good: 'A intervalli di 15 minuti' },
        { k: 'Quando entri', bad: 'Quando "te lo senti"', good: 'Solo con 4 conferme' },
        { k: 'Quanto rischi', bad: 'Un po\' a caso', good: 'Sempre l\'1%, deciso prima' },
        { k: 'Come ti senti', bad: 'Ansia e fretta', good: 'Calma e controllo' },
        { k: 'Chi ti aiuta', bad: 'Nessuno', good: 'Un team in chat 24/7' },
      ],
    },
    packages: { featured: 'neofita', sub: 'Se parti da zero, il percorso Neofita ti accompagna con più lezioni e più sessioni individuali.' },
    faq: [
      { q: 'Non so niente di trading. Posso iniziare?', a: 'Sì, il percorso Neofita è pensato per questo: 12 videolezioni che partono dalle basi e 5 sessioni individuali in cui ti seguiamo passo dopo passo.' },
      { q: 'Quanto tempo devo dedicarci?', a: 'Il metodo usa grafici a 15 minuti e non richiede di stare ore davanti allo schermo. Ti insegniamo una routine breve, da ripetere con calma.' },
      { q: 'Quanti soldi servono per iniziare?', a: 'Il metodo prevede di rischiare al massimo l\'1% del conto per operazione, quindi si può partire anche con cifre contenute. Investi solo denaro che puoi permetterti di perdere: ne parliamo in chat in base alla tua situazione.' },
      ...FAQ_COMMON,
    ],
    final: {
      titleA: 'Il primo passo',
      titleB: 'è una domanda.',
      sub: 'Scrivici: ti spieghiamo tutto con calma, senza impegno e senza gergo tecnico.',
    },
  },

  esperto: {
    ticker: ['Confluenza 4/4', 'XAU/USD · M15', 'Rischio fisso 1%', 'No scalping', 'Backtest PF 3,5', 'Supporto 24/7'],
    hero: {
      chip: 'xau/usd · m15 · confluenza 4/4',
      h1a: 'Il tuo edge non è entrare di più.',
      h1b: 'È filtrare meglio.',
      sub: 'Un indicatore trend che lavora per confluenza: quattro condizioni indipendenti devono allinearsi prima del trigger. Rischio fisso all\'1%, nessuno scalping, metriche verificabili su TradingView.',
      cta1: 'Vedi il percorso Esperto',
      cta2: 'Analizza il metodo',
      trust: ['Backtest pubblico · PF 3,5', 'Rischio fisso 1%', 'Supporto 24/7'],
    },
    problem: {
      eyebrow: 'Diagnosi',
      titleA: 'Non ti manca un setup.',
      titleB: 'Ti manca un filtro.',
      intro: 'Dopo uno o due anni di mercato il limite raramente è tecnico. È l\'esecuzione: ingressi anticipati, size incoerenti, troppi trade a bassa probabilità.',
      pains: [
        { title: 'Overtrading', text: 'Troppi ingressi su setup marginali. Spread, commissioni e rumore erodono l\'edge.' },
        { title: 'Strategy hopping', text: 'Cambi sistema prima di avere un campione statistico sufficiente per giudicarlo.' },
        { title: 'Size emotiva', text: 'Il rischio per trade varia con l\'umore e il drawdown diventa imprevedibile.' },
        { title: 'Timeframe troppo bassi', text: 'Su M1-M5 il rapporto segnale/rumore è sfavorevole e la fatica decisionale cresce.' },
      ],
      closerA: 'Sintomi diversi, una sola causa:',
      closerB: 'ingressi senza confluenza.',
    },
    method: {
      steps: [
        { kicker: 'Architettura del metodo', title: 'Confluenza, non previsione.', text: 'Indicatore trend su TradingView, timeframe M15. Il trigger scatta solo con quattro condizioni indipendenti allineate: meno trade, qualità media più alta.' },
        { kicker: 'Condizione 1/4', title: 'Primo filtro soddisfatto.', text: 'Probabilità ancora insufficiente: nessun ordine.' },
        { kicker: 'Condizione 2/4', title: 'Due filtri concordi.', text: 'È qui che l\'overtrader entra in anticipo e paga il rumore.' },
        { kicker: 'Condizione 3/4', title: 'Setup quasi completo.', text: 'Entrare ora significa rinunciare al vantaggio statistico per un ingresso anticipato.' },
        { kicker: 'Condizione 4/4 · Trigger', title: 'Confluenza completa.', text: 'Ingresso con stop definito e rischio fisso all\'1% del capitale. Size calcolata sullo stop, non sull\'umore.' },
      ],
      wait: 'Standby',
      go: 'Trigger',
      badge: 'Le 4 condizioni sono spiegate nel corso',
    },
    proof: {
      titleA: 'Testato. Pubblico.',
      titleB: 'Verificabile.',
      sub: 'Backtest pubblicato su TradingView da luglio, consultabile trade per trade. Nessun cherry picking.',
      notes: [
        'profitti lordi / perdite lorde nel backtest pubblico da luglio',
        'timeframe operativo: niente scalping, meno rumore',
        'rischio fisso per trade, sizing calcolato sullo stop',
        'condizioni di confluenza per il trigger',
      ],
      explainer: 'Profit Factor 3,5: nel periodo testato i profitti lordi sono 3,5 volte le perdite lorde. È un dato di backtest: leggilo sempre insieme a drawdown massimo e numero di operazioni, e ricorda che non anticipa i risultati futuri.',
    },
    compare: {
      titleA: 'Due approcci.',
      titleB: 'Due curve di equity.',
      badLabel: 'Scalping discrezionale',
      goodLabel: 'Metodo a confluenza',
      rows: [
        { k: 'Timeframe', bad: 'M1–M5', good: 'M15' },
        { k: 'Trigger', bad: 'Discrezionale', good: '4 condizioni allineate' },
        { k: 'Risk management', bad: 'Size variabile', good: '1% fisso per trade' },
        { k: 'Frequenza', bad: 'Alta, bassa selettività', good: 'Bassa, alta selettività' },
        { k: 'Carico mentale', bad: 'Decision fatigue', good: 'Routine definita' },
      ],
    },
    packages: { featured: 'esperto', sub: 'Hai già le basi: il percorso Esperto va dritto alla strategia, con manuale in PDF e una sessione individuale di revisione.' },
    faq: [
      { q: 'Su quale strumento e timeframe lavora il metodo?', a: 'Principalmente oro (XAU/USD) su timeframe M15, con l\'indicatore trend su TradingView.' },
      { q: 'Posso integrarlo con il mio sistema attuale?', a: 'Molti lo usano come filtro di conferma sul proprio operativo. Nella sessione one to one valutiamo insieme come inserirlo nella tua routine.' },
      { q: 'Come è gestito il rischio?', a: 'Rischio fisso dell\'1% del capitale per operazione, con stop definito prima dell\'ingresso e size calcolata di conseguenza.' },
      ...FAQ_COMMON,
    ],
    final: {
      titleA: 'Meno trade.',
      titleB: 'Più qualità.',
      sub: 'Parla con il team: valutiamo insieme se il metodo si integra con la tua operatività.',
    },
  },
}
