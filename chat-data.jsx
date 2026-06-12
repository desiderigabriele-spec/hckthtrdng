/* ============================================================
   HTT — chatData
   Canali, messaggi mock, stream simulato e MODERAZIONE AI.
   >>> PUNTO DI INNESTO AI REALE <<<
     moderate(text) → sostituire con la chiamata al modello di
     moderazione vero. Ritorna { ok:true } oppure { ok:false, reason }.
   ============================================================ */
(function () {
  const PD = window.platformData;
  const ME = 'me';

  const CHANNELS = [
    { id: 'general', name: '#general' },
    { id: 'xauusd',  name: '#xauusd' },
    { id: 'segnali', name: '#segnali-talk' },
    { id: 'sfide',   name: '#sfide' },
  ];

  const now = Date.now();
  const m = (sec) => now - sec * 1000;

  // messaggi seed per canale
  const SEED = {
    general: [
      { id: 'g1', author: 'neon',   text: 'mercato oggi pulito su @V0ID_RUNNER hai visto il break di XAUUSD?', at: m(640) },
      { id: 'g2', author: 'void',   text: 'sì, entrato long sopra 2342. teniamo duro', at: m(610) },
      { id: 'g3', author: 'raven',  text: 'occhio alle 14:30, escono i dati USA. volatilità in arrivo', at: m(520) },
      { id: 'g4', author: 'glitch', text: 'qualcuno fa la sfida 1v1 stasera? cerco avversario su EURUSD', at: m(360) },
      { id: 'g5', author: 'echo',   text: 'io ci sto. lancia pure, accetto', at: m(300) },
      { id: 'sys1', system: true, text: 'AI_MOD attivo · niente spam, link esterni o garanzie di profitto.', at: m(280) },
      { id: 'g6', author: 'cipher', text: 'disciplina > previsioni. gestione del rischio prima di tutto', at: m(140) },
    ],
    xauusd: [
      { id: 'x1', author: 'echo',   text: 'XAUUSD respinto a 2360, possibile short se rompe 2348', at: m(420) },
      { id: 'x2', author: 'neon',   text: 'concordo, ma aspetto conferma su H1 prima di entrare', at: m(360) },
      { id: 'x3', author: 'flux',   text: 'io resto flat finché non vedo volume vero', at: m(120) },
    ],
    segnali: [
      { id: 's1', author: 'raven',  text: 'il mio segnale EURUSD ha toccato TP1, sposto SL a BE', at: m(500) },
      { id: 's2', author: 'glitch', text: 'come si legge lo stato OPEN vs WIN nel feed segnali?', at: m(260) },
      { id: 's3', author: 'echo',   text: 'OPEN = ancora in corso, WIN/LOSS = chiuso dal tracking prezzi', at: m(220) },
    ],
    sfide: [
      { id: 'f1', author: 'void',   text: 'rivincita @NEON_WOLF? l\'ultima l\'hai vinta per 26 pips', at: m(480) },
      { id: 'f2', author: 'neon',   text: 'quando vuoi. XAUUSD, 24h, conto demo', at: m(300) },
      { id: 'f3', author: 'nyx',    text: 'io sfido il leader, vediamo se reggo la pressione', at: m(90) },
    ],
  };

  // pool di messaggi in arrivo (stream simulato)
  const INCOMING = {
    general: [
      ['hex',  'rientro ora, mi sono perso qualcosa di buono?'],
      ['byte', 'setup pulito su US30, lo seguo'],
      ['delta','grande @NULL_MASK bella scalata in classifica'],
      ['axon', 'ricordatevi: è conto demo, allenate la testa'],
    ],
    xauusd: [
      ['nyx',  'XAUUSD sta caricando, occhio al falso break'],
      ['kilo', 'entrato short, SL stretto sopra 2362'],
    ],
    segnali: [
      ['cipher','bel segnale @ECH0_PRIME, entry chiara'],
      ['mort', 'io aspetto il prossimo su BTCUSD'],
    ],
    sfide: [
      ['glitch','chi accetta una aperta su GBPUSD 6h?'],
      ['sable', 'sfida lanciata, in attesa di un coraggioso'],
    ],
  };

  /* ============================================================
     >>> MODERAZIONE AI (punto da rimpiazzare) <<<
     Regole mock terminali: niente garanzie di profitto, link/spam,
     insulti. Tutto in chiaro così il modello reale subentra qui.
     ============================================================ */
  const RULES = [
    { re: /(profitto|guadagno|vincita)\s*(garantit|sicur)|garantit[oi]\s*(profitto|guadagno)|100\s*%\s*(sicur|garantit)|soldi\s*facili|raddoppi[ao]\s*(sicur|garantit)/i,
      reason: 'niente garanzie di profitto — il trading è rischio, non certezza.' },
    { re: /(https?:\/\/|www\.|t\.me\/|telegram|whatsapp|instagram|\bdm\b\s*per)/i,
      reason: 'niente link esterni o inviti a canali privati.' },
    { re: /(idiota|cretino|scemo|coglion|stupid[oi]|imbecille|deficiente)/i,
      reason: 'linguaggio non consentito — rispetto nella community.' },
    { re: /(segnale a pagamento|vip a pagamento|paga e ti dico|prezzo del segnale)/i,
      reason: 'i segnali su HTT sono pubblici e verificati, non a pagamento.' },
  ];
  function moderate(text) {
    for (const r of RULES) if (r.re.test(text)) return { ok: false, reason: r.reason };
    return { ok: true };
  }

  function authorMeta(id) {
    if (id === ME) return { id: ME, username: 'NULL_MASK', rank: PD && PD.trader(ME) ? PD.trader(ME).rank : 7 };
    const t = PD && PD.trader(id);
    return t || { id, username: id.toUpperCase(), rank: 99 };
  }
  function relTime(ts) { return PD ? PD.relTime(ts) : ''; }
  function initials(n) { return PD ? PD.initials(n) : (n || '?')[0]; }

  window.chatData = {
    ME, CHANNELS, SEED, INCOMING, moderate, authorMeta, relTime, initials,
    seedFor: id => (SEED[id] || []).slice(),
    incomingFor: id => (INCOMING[id] || []).slice(),
  };
  window.CHAT = window.chatData;
})();
