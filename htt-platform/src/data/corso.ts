// Contenuti dell'area riservata. Per pubblicare una lezione basta inserire
// l'URL embed del video (YouTube non in elenco, Vimeo, Bunny...) in videoUrl.

export interface Lezione {
  id: string
  titolo: string
  durata: string
  videoUrl: string
}

export interface Modulo {
  id: string
  numero: string
  titolo: string
  descrizione: string
  lezioni: Lezione[]
}

export const MODULI: Modulo[] = [
  {
    id: 'm1',
    numero: '01',
    titolo: 'Fondamenta',
    descrizione: 'Come si muove l\'oro, quando operare e la mentalità che separa chi resta da chi brucia il conto.',
    lezioni: [
      { id: 'm1l1', titolo: 'Il mercato dell\'oro (XAU/USD) spiegato semplice', durata: '—', videoUrl: '' },
      { id: 'm1l2', titolo: 'Sessioni, orari e volatilità: quando conviene operare', durata: '—', videoUrl: '' },
      { id: 'm1l3', titolo: 'Mindset: perché la disciplina batte il talento', durata: '—', videoUrl: '' },
    ],
  },
  {
    id: 'm2',
    numero: '02',
    titolo: 'Le 4 conferme',
    descrizione: 'Il cuore del metodo: le quattro condizioni che devono allinearsi prima di ogni ingresso.',
    lezioni: [
      { id: 'm2l1', titolo: 'L\'indicatore Zero Errori: installazione su TradingView', durata: '—', videoUrl: '' },
      { id: 'm2l2', titolo: 'Conferme 1 e 2: leggere la direzione', durata: '—', videoUrl: '' },
      { id: 'm2l3', titolo: 'Conferme 3 e 4: il momento esatto dell\'ingresso', durata: '—', videoUrl: '' },
    ],
  },
  {
    id: 'm3',
    numero: '03',
    titolo: 'Gestione del rischio',
    descrizione: 'Rischio fisso all\'1% per operazione: come proteggere il capitale prima di pensare al profitto.',
    lezioni: [
      { id: 'm3l1', titolo: 'La regola dell\'1%: calcolare la size in 30 secondi', durata: '—', videoUrl: '' },
      { id: 'm3l2', titolo: 'Stop loss e take profit: dove e perché', durata: '—', videoUrl: '' },
      { id: 'm3l3', titolo: 'Gestire le serie negative senza perdere la testa', durata: '—', videoUrl: '' },
    ],
  },
  {
    id: 'm4',
    numero: '04',
    titolo: 'Operatività reale',
    descrizione: 'Dal grafico al trade: routine giornaliera, diario di trading e casi reali commentati.',
    lezioni: [
      { id: 'm4l1', titolo: 'La routine operativa: 15 minuti, niente stress', durata: '—', videoUrl: '' },
      { id: 'm4l2', titolo: 'Il diario di trading: misurare per migliorare', durata: '—', videoUrl: '' },
      { id: 'm4l3', titolo: 'Analisi di operazioni reali, passo dopo passo', durata: '—', videoUrl: '' },
    ],
  },
]

export interface Risorsa {
  id: string
  titolo: string
  descrizione: string
  url: string
  cta: string
}

export const RISORSE: Risorsa[] = [
  { id: 'pdf', titolo: 'Manuale del metodo (PDF)', descrizione: 'Le regole complete da tenere sempre a portata di mano.', url: '', cta: 'Scarica' },
  { id: 'indicatore', titolo: 'Indicatore TradingView', descrizione: 'Accesso all\'indicatore trend a 4 conferme.', url: '', cta: 'Apri' },
  { id: 'community', titolo: 'Community', descrizione: 'Confrontati ogni giorno con gli altri membri del team.', url: '', cta: 'Entra' },
]
