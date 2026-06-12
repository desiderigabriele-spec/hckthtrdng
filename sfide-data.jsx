/* ============================================================
   HTT — challengeData
   Layer dati astratto. Per collegare i dati reali AvaTrade (MT5/API)
   basta sostituire UNA funzione: challengeData.fetchTick().
   Tutto il resto (UI, simulazione) resta invariato.
   ============================================================ */
(function () {
  const ME = { id: 'me', username: 'NULL_MASK', rank: 7, winRate: 71 };

  // Community traders (username stile HTT)
  const TRADERS = [
    { id: 'neon',   username: 'NEØN_WOLF',   rank: 1, winRate: 87, badge: 'TOP_TRADER' },
    { id: 'void',   username: 'V0ID_RUNNER', rank: 4, winRate: 79, badge: 'RISING_STAR' },
    { id: 'glitch', username: 'GL1TCH_KID',  rank: 9, winRate: 64, badge: null },
    { id: 'zero',   username: 'ZER0_COOL',   rank: 12, winRate: 61, badge: null },
    { id: 'raven',  username: 'R4VEN_OPS',   rank: 6, winRate: 73, badge: 'STREAK_MASTER' },
    { id: 'echo',   username: 'ECH0_PRIME',  rank: 3, winRate: 81, badge: 'TOP_TRADER' },
    { id: 'nyx',    username: 'NYX_0X',      rank: 15, winRate: 58, badge: null },
    { id: 'flux',   username: 'FLUX_GHOST',  rank: 8, winRate: 67, badge: null },
  ];

  const ASSETS = [
    { sym: 'XAUUSD', short: 'XAU', name: 'Oro',     tag: 'metallo · il più usato' },
    { sym: 'EURUSD', short: '€',   name: 'Euro/USD', tag: 'forex major' },
    { sym: 'GBPUSD', short: '£',   name: 'Sterlina', tag: 'forex major' },
    { sym: 'BTCUSD', short: '₿',   name: 'Bitcoin',  tag: 'crypto · alta volatilità' },
    { sym: 'US30',   short: 'US30',name: 'Dow Jones',tag: 'indice' },
    { sym: 'USOIL',  short: 'OIL', name: 'Petrolio', tag: 'commodity' },
  ];

  const DURATIONS = [
    { id: '1h',  label: '1 ORA',     secs: 3600,        tag: 'sprint' },
    { id: '6h',  label: '6 ORE',     secs: 6 * 3600,    tag: 'intraday' },
    { id: '24h', label: '24 ORE',    secs: 24 * 3600,   tag: 'la più scelta' },
    { id: '3d',  label: '3 GIORNI',  secs: 3 * 86400,   tag: 'swing' },
    { id: '7d',  label: '7 GIORNI',  secs: 7 * 86400,   tag: 'maratona' },
  ];

  function trader(id) { return id === 'me' ? ME : TRADERS.find(t => t.id === id); }
  function leader() { return TRADERS.slice().sort((a, b) => a.rank - b.rank)[0]; }
  function initials(name) { return (name || '?').replace(/[^A-Za-zØ0-9]/g, '').slice(0, 1).toUpperCase(); }

  /* ---- mock challenges per la hub ---- */
  function seedChallenges() {
    const now = Date.now();
    return [
      // ATTIVE
      { id: 'c1', state: 'active', type: '1v1', opp: 'neon', asset: 'XAUUSD', durationId: '24h',
        endsAt: now + 1000 * (14 * 3600 + 23 * 60), mePips: 312.4, oppPips: 286.1, dir: 'me' },
      { id: 'c2', state: 'active', type: '1v1', opp: 'glitch', asset: 'BTCUSD', durationId: '6h',
        endsAt: now + 1000 * (2 * 3600 + 8 * 60), mePips: 148.0, oppPips: 173.6, dir: 'opp' },
      // IN ATTESA (ricevute)
      { id: 'c3', state: 'incoming', type: '1v1', opp: 'raven', asset: 'EURUSD', durationId: '24h' },
      // IN ATTESA (inviate)
      { id: 'c4', state: 'outgoing', type: '1v1', opp: 'echo', asset: 'XAUUSD', durationId: '6h' },
      // STORICO
      { id: 'c5', state: 'done', type: '1v1', opp: 'void', asset: 'XAUUSD', durationId: '24h', won: true,  mePips: 204.8, oppPips: 161.2 },
      { id: 'c6', state: 'done', type: '1v1', opp: 'zero', asset: 'GBPUSD', durationId: '1h',  won: false, mePips: 42.1, oppPips: 56.3 },
      { id: 'c7', state: 'done', type: '1v1', opp: 'nyx',  asset: 'BTCUSD', durationId: '6h',  won: true,  mePips: 389.5, oppPips: 312.0 },
    ];
  }

  /* ============================================================
     >>> PUNTO DI INNESTO API REALE <<<
     Questa è l'UNICA funzione da rimpiazzare con i dati veri
     AvaTrade (conto demo via MT5/REST). Riceve lo stato corrente
     e restituisce il delta pips per entrambi + un'eventuale esecuzione.
     Ora: simulazione plausibile (random walk non lineare).
     ============================================================ */
  function fetchTick(live) {
    // delta non lineari, leggermente positivi di media (mercato demo attivo)
    function delta() {
      const r = Math.random();
      if (r < 0.10) return (Math.random() * 6 + 2);      // spike+
      if (r < 0.22) return -(Math.random() * 4 + 1.5);   // drawdown
      return (Math.random() - 0.42) * 2.4;               // micro-drift
    }
    const dMe = delta(), dOp = delta();
    // esecuzione occasionale per il feed
    let exec = null;
    if (Math.random() > 0.45) {
      const whoMe = Math.random() > 0.5;
      const who = whoMe ? live.me : live.opp;
      const win = Math.random() > 0.34;
      const amt = Math.random() * 4.5 + 0.6;
      exec = {
        who: who.username,
        side: Math.random() > 0.5 ? 'BUY' : 'SELL',
        asset: live.assetSym,
        pips: win ? amt : -amt * 0.5,
        win,
      };
    }
    return { dMe, dOp, exec };
  }

  /* ---- crea lo stato live di una sfida ---- */
  function makeLive(meTrader, oppTrader, assetSym, mePips, oppPips) {
    return {
      me: meTrader, opp: oppTrader, assetSym,
      mePips: mePips != null ? mePips : 0,
      oppPips: oppPips != null ? oppPips : 0,
      meDisp: mePips != null ? mePips : 0,
      oppDisp: oppPips != null ? oppPips : 0,
      feed: [],
    };
  }

  function fmtClock(s) {
    if (s < 0) s = 0;
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    const p = n => (n < 10 ? '0' : '') + n;
    if (d > 0) return d + 'g ' + p(h) + ':' + p(m);
    return p(h) + ':' + p(m) + ':' + p(ss);
  }

  window.challengeData = {
    ME, TRADERS, ASSETS, DURATIONS,
    trader, leader, initials, seedChallenges,
    fetchTick, makeLive, fmtClock,
    asset: sym => ASSETS.find(a => a.sym === sym),
    duration: id => DURATIONS.find(d => d.id === id),
  };
  window.CD = window.challengeData; // alias globale per tutti i moduli babel
})();
