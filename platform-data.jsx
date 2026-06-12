/* ============================================================
   HTT — platformData (Classifica + Segnali)
   Estende il modello trader con stats sfide + segnali + posizione.
   >>> PUNTI DI INNESTO API REALE <<<
     - fetchLeaderboard()  → sostituire con dati AvaTrade (pips conto demo)
     - fetchSignals()      → sostituire con tracking prezzi reale
   Tutto il resto (UI) resta invariato.
   ============================================================ */
(function () {
  // me
  const ME_ID = 'me';

  // 20 trader + me. pips = all-time; week/month derivati per il filtro temporale.
  const RAW = [
    ['neon',  'NEØN_WOLF',   9840, 87, 142, 21, 12, ['TOP_TRADER']],
    ['echo',  'ECH0_PRIME',  9120, 81, 130, 30, 7,  ['SHARP']],
    ['raven', 'R4VEN_OPS',   8730, 73, 155, 57, 9,  ['STREAK_MASTER']],
    ['void',  'V0ID_RUNNER', 8210, 79, 121, 32, 6,  ['RISING_STAR']],
    ['cipher','C1PHER_X',    7980, 76, 118, 37, 5,  []],
    ['flux',  'FLUX_GHOST',  7440, 67, 134, 66, 4,  []],
    ['me',    'NULL_MASK',   7180, 71, 99,  40, 3,  []],
    ['nyx',   'NYX_0X',      6890, 58, 145, 105, 2, []],
    ['glitch','GL1TCH_KID',  6510, 64, 88,  49, 4,  []],
    ['hex',   'HEX_DRIVER',  6240, 69, 77,  34, 3,  []],
    ['zero',  'ZER0_COOL',   5980, 61, 92,  59, 2,  []],
    ['byte',  'BYTE_REAPER', 5610, 66, 70,  36, 5,  []],
    ['kilo',  'K1LO_SIGMA',  5320, 63, 81,  47, 1,  []],
    ['mort',  'M0RT_PROTO',  4980, 59, 66,  46, 2,  []],
    ['axon',  'AX0N_NULL',   4670, 70, 54,  23, 4,  []],
    ['delta', 'DELT4_RUN',   4350, 62, 63,  39, 1,  []],
    ['sable', 'S4BLE_VOID',  4020, 57, 71,  54, 2,  []],
    ['orbit', '0RB1T_HACK',  3760, 65, 48,  26, 3,  []],
    ['pyre',  'PYRE_NODE',   3410, 60, 52,  35, 1,  []],
    ['quark', 'QU4RK_DEC',   3180, 56, 59,  46, 2,  []],
    ['vex',   'VEX_TERM',    2890, 61, 41,  26, 1,  []],
  ];

  // prevRank per movimento (mock plausibile)
  const PREV = { neon:1, echo:3, raven:3, void:6, cipher:5, flux:9, me:9, nyx:7, glitch:8, hex:11, zero:11, byte:14, kilo:12, mort:13, axon:19, delta:15, sable:16, orbit:21, pyre:18, quark:20, vex:20 };

  function buildTraders() {
    const list = RAW.map((r, i) => {
      const [id, username, pips, winRate, wins, losses, streak, badges] = r;
      return {
        id, username, pips, winRate, wins, losses, streak,
        pipsMonth: Math.round(pips * 0.42),
        pipsWeek: Math.round(pips * 0.13),
        winsMonth: Math.round(wins * 0.4),
        streakBest: streak,
        badges: badges.slice(),
        verified: true,
        signalsWin: Math.max(0, Math.round(wins * 0.35) - (i % 3)),
        signalsTotal: Math.round(wins * 0.5) + 4,
        rank: i + 1, prevRank: 0,
      };
    });
    // assegna badge automatici
    return list;
  }

  let TRADERS = buildTraders();

  // ---- API point #1: classifica ----
  // metric: 'pips'|'winRate'|'wins'|'streak' ; period: 'week'|'month'|'all'
  function fetchLeaderboard(metric, period) {
    metric = metric || 'pips'; period = period || 'all';
    const pipsKey = period === 'week' ? 'pipsWeek' : period === 'month' ? 'pipsMonth' : 'pips';
    const winsKey = period === 'month' ? 'winsMonth' : 'wins';
    const sorted = TRADERS.slice().sort((a, b) => {
      if (metric === 'winRate') return b.winRate - a.winRate;
      if (metric === 'wins') return b[winsKey] - a[winsKey];
      if (metric === 'streak') return b.streak - a.streak;
      return b[pipsKey] - a[pipsKey];
    });
    sorted.forEach((t, i) => { t.rank = i + 1; t.prevRank = PREV[t.id] || i + 1; });
    // badge dinamici sul dataset corrente
    sorted.forEach(t => {
      t.dynBadges = t.badges.slice();
      if (!t.dynBadges.includes('VERIFIED')) t.dynBadges.push('VERIFIED');
    });
    if (sorted[0] && !sorted[0].dynBadges.includes('TOP_TRADER')) sorted[0].dynBadges.unshift('TOP_TRADER');
    return { rows: sorted, metricKey: metric === 'pips' ? pipsKey : metric === 'wins' ? winsKey : metric };
  }

  function metricValue(t, metric, period) {
    const pipsKey = period === 'week' ? 'pipsWeek' : period === 'month' ? 'pipsMonth' : 'pips';
    const winsKey = period === 'month' ? 'winsMonth' : 'wins';
    if (metric === 'winRate') return t.winRate;
    if (metric === 'wins') return t[winsKey];
    if (metric === 'streak') return t.streak;
    return t[pipsKey];
  }

  function trader(id) { return TRADERS.find(t => t.id === id); }
  function initials(name) { return (name || '?').replace(/[^A-Za-zØ0-9]/g, '').slice(0, 1).toUpperCase(); }

  // ---- SEGNALI ----
  const ASSETS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'US30', 'USOIL'];
  const TFS = ['M15', 'H1', 'H4', 'D1'];
  const now = Date.now();
  // ---- API point #2: segnali ----
  let SIGNALS = [
    { id: 's1', authorId: 'neon', asset: 'XAUUSD', dir: 'BUY', tf: 'H4', entryMin: 2338, entryMax: 2342,
      tps: [2351, 2360, 2374, 'OPEN'], sl: 2329, status: 'win', createdAt: now - 1000*60*60*2, resultPips: 186,
      history: [['aperto', now-1000*60*60*2], ['TP1 raggiunto', now-1000*60*80], ['TP2 raggiunto', now-1000*60*35]] },
    { id: 's2', authorId: 'echo', asset: 'BTCUSD', dir: 'SELL', tf: 'H1', entryMin: 68900, entryMax: 69200,
      tps: [68200, 67500, 66800, 65900], sl: 69800, status: 'open', createdAt: now - 1000*60*42,
      history: [['aperto', now-1000*60*42]] },
    { id: 's3', authorId: 'raven', asset: 'EURUSD', dir: 'BUY', tf: 'H1', entryMin: 1.0842, entryMax: 1.0848,
      tps: [1.0865, 1.0882, 'OPEN', 'OPEN'], sl: 1.0828, status: 'open', createdAt: now - 1000*60*60*5,
      history: [['aperto', now-1000*60*60*5], ['TP1 raggiunto', now-1000*60*60*1]] },
    { id: 's4', authorId: 'void', asset: 'GBPUSD', dir: 'SELL', tf: 'H4', entryMin: 1.2710, entryMax: 1.2725,
      tps: [1.2680, 1.2650, 1.2610, 1.2560], sl: 1.2760, status: 'loss', createdAt: now - 1000*60*60*9, resultPips: -50,
      history: [['aperto', now-1000*60*60*9], ['SL colpito', now-1000*60*60*6]] },
    { id: 's5', authorId: 'cipher', asset: 'US30', dir: 'BUY', tf: 'M15', entryMin: 39120, entryMax: 39180,
      tps: [39320, 39480, 'OPEN', 'OPEN'], sl: 38950, status: 'win', createdAt: now - 1000*60*60*26, resultPips: 142,
      history: [['aperto', now-1000*60*60*26], ['TP1 raggiunto', now-1000*60*60*22], ['TP2 raggiunto', now-1000*60*60*20]] },
    { id: 's6', authorId: 'flux', asset: 'XAUUSD', dir: 'SELL', tf: 'D1', entryMin: 2360, entryMax: 2366,
      tps: [2348, 2335, 2318, 'OPEN'], sl: 2378, status: 'open', createdAt: now - 1000*60*18,
      history: [['aperto', now-1000*60*18]] },
    { id: 's7', authorId: 'nyx', asset: 'USOIL', dir: 'BUY', tf: 'H1', entryMin: 78.20, entryMax: 78.60,
      tps: [79.40, 80.20, 81.00, 'OPEN'], sl: 77.40, status: 'cancelled', createdAt: now - 1000*60*60*30,
      history: [['aperto', now-1000*60*60*30], ['annullato dall\'autore', now-1000*60*60*29]] },
    { id: 's8', authorId: 'glitch', asset: 'BTCUSD', dir: 'BUY', tf: 'H4', entryMin: 67200, entryMax: 67600,
      tps: [68400, 69200, 70500, 72000], sl: 66200, status: 'win', createdAt: now - 1000*60*60*48, resultPips: 320,
      history: [['aperto', now-1000*60*60*48], ['TP1', now-1000*60*60*40], ['TP2', now-1000*60*60*30], ['TP3', now-1000*60*60*12]] },
  ];

  function fetchSignals() { return SIGNALS.slice().sort((a, b) => b.createdAt - a.createdAt); }
  function addSignal(sig) {
    const s = Object.assign({ id: 'sig_' + Date.now(), authorId: ME_ID, status: 'open', createdAt: Date.now(),
      history: [['aperto', Date.now()]] }, sig);
    SIGNALS = [s, ...SIGNALS];
    return s;
  }

  function relTime(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'ora';
    const m = Math.floor(s / 60); if (m < 60) return m + 'm fa';
    const h = Math.floor(m / 60); if (h < 24) return h + 'h fa';
    const d = Math.floor(h / 24); return d + 'g fa';
  }

  window.platformData = {
    ME_ID, ASSETS, TFS,
    fetchLeaderboard, metricValue, trader, initials,
    fetchSignals, addSignal, relTime,
    allTraders: () => TRADERS.slice(),
  };
  window.PD = window.platformData;
})();
