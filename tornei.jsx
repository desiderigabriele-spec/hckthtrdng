/* ============================================================
   HTT — TORNEO (multi-trader, stesso asset/periodo)
   Riusa CD (challengeData) per asset/durate/fmtClock.
   Punto API: tickPips() — come fetchTick, da rimpiazzare coi dati reali.
   ============================================================ */
(function () {
  const CD = window.challengeData;
  const NAMES = ['NEØN_WOLF','V0ID_RUNNER','GL1TCH_KID','ZER0_COOL','R4VEN_OPS','ECH0_PRIME','NYX_0X','FLUX_GHOST',
    'C1PHER_X','HEX_DRIVER','BYTE_REAPER','K1LO_SIGMA','M0RT_PROTO','AX0N_NULL','DELT4_RUN','S4BLE_VOID',
    '0RB1T_HACK','PYRE_NODE','QU4RK_DEC','VEX_TERM','SH4DE_RUN','KR0N_BIT','LUMA_VOID','N1GHT_PROXY',
    'OBSC_RA','TR4CE_0','VANT_4','W1SP_HEX','XEN0_RUN','YOTT4_BIT','ZETA_GH0ST','PH4SE_NULL'];

  function delta() {
    const r = Math.random();
    if (r < 0.10) return (Math.random() * 6 + 2);
    if (r < 0.22) return -(Math.random() * 4 + 1.5);
    return (Math.random() - 0.42) * 2.4;
  }

  function createTournament({ asset, durationId, size }) {
    const dur = CD.duration(durationId);
    const parts = [];
    parts.push({ id: 'me', username: 'NULL_MASK', me: true, pips: 0, disp: 0 });
    for (let i = 0; i < size - 1; i++) {
      const base = 30 + Math.random() * 90;
      parts.push({ id: 't' + i, username: NAMES[i % NAMES.length], pips: base, disp: base });
    }
    return {
      id: 'tn_' + Date.now(), asset, durationId, size, state: 'active',
      endsAt: Date.now() + dur.secs * 1000, parts,
    };
  }

  // mock torneo già in corso per la hub
  function seedTournament() {
    const t = createTournament({ asset: 'XAUUSD', durationId: '24h', size: 16 });
    t.parts.forEach(p => { if (!p.me) { p.pips = 40 + Math.random() * 160; p.disp = p.pips; } else { p.pips = 128; p.disp = 128; } });
    t.endsAt = Date.now() + (18 * 3600 + 42 * 60) * 1000;
    return t;
  }

  function tickPips(parts) { parts.forEach(p => { p.pips += delta(); }); }   // <<< punto API
  function ranked(parts) { return parts.slice().sort((a, b) => b.disp - a.disp); }

  window.torneoData = { NAMES, createTournament, seedTournament, tickPips, ranked };
  window.TN = window.torneoData;
})();

/* ---------------- HUB CARD ---------------- */
function TorneoCard({ tn, onOpen }) {
  const CD = window.challengeData;
  const [, force] = React.useState(0);
  React.useEffect(() => { const i = setInterval(() => force(x => x + 1), 1000); return () => clearInterval(i); }, []);
  const sorted = TN.ranked(tn.parts);
  const myPos = sorted.findIndex(p => p.me) + 1;
  return (
    <div className="tcard-tn" onClick={() => onOpen(tn)}>
      <div className="tn-head">
        <div className="tn-ico"><Icon name="trophy" /></div>
        <div className="tn-info">
          <div className="tn-name">TORNEO {CD.asset(tn.asset).short}</div>
          <div className="tn-sub">{tn.size} trader · stesso asset · conto demo</div>
        </div>
        <span className="tn-tag"><span className="d" /> LIVE</span>
      </div>
      <div className="tn-meta">
        <span className="it"><Icon name="target" /> <b>{CD.asset(tn.asset).short}</b></span>
        <span className="it"><Icon name="clock" /> {CD.duration(tn.durationId).label}</span>
        <span className="it"><Icon name="users" /> {tn.size}</span>
      </div>
      <div className="tn-foot">
        <span className="pos">posizione: <b>#{myPos}</b> / {tn.size}</span>
        <span className="ver">tempo {CD.fmtClock(Math.floor((tn.endsAt - Date.now()) / 1000))}</span>
      </div>
    </div>
  );
}

/* ---------------- LIVE ---------------- */
function TorneoLive({ tn, onExit, onEnd }) {
  const CD = window.challengeData;
  const ref = React.useRef(tn);
  const [, render] = React.useState(0);
  const startRem = Math.floor((tn.endsAt - Date.now()) / 1000);
  const [rem, setRem] = React.useState(startRem);
  const remRef = React.useRef(startRem);
  const ended = React.useRef(false);

  function finish() {
    if (ended.current) return; ended.current = true;
    const sorted = TN.ranked(ref.current.parts);
    const myPos = sorted.findIndex(p => p.me) + 1;
    const me = ref.current.parts.find(p => p.me);
    onEnd({ pos: myPos, size: ref.current.size, pips: me.disp, asset: tn.asset });
  }

  React.useEffect(() => {
    if (PREFERS_REDUCED) { render(x => x + 1); return; }
    const t = ref.current;
    const tickI = setInterval(() => TN.tickPips(t.parts), 1500);
    const smoothI = setInterval(() => { t.parts.forEach(p => { p.disp += (p.pips - p.disp) * 0.14; }); render(x => x + 1); }, 60);
    const clockI = setInterval(() => { remRef.current -= 1; setRem(remRef.current); if (remRef.current <= 0) { clearInterval(clockI); finish(); } }, 1000);
    return () => { clearInterval(tickI); clearInterval(smoothI); clearInterval(clockI); };
  }, []);

  const sorted = TN.ranked(ref.current.parts);
  const top3 = sorted.slice(0, 3);
  const podOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podCls = p => (p === top3[0] ? 'p1' : p === top3[1] ? 'p2' : 'p3');
  const rest = sorted.slice(3);
  const myPos = sorted.findIndex(p => p.me) + 1;
  const inTop = myPos <= 3 || myPos > 3 && myPos <= 9;

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content" style={{ paddingTop: 12 }}>
        <div className="tlive-head">
          <button className="wz-back" style={{ fontSize: 16 }} onClick={onExit}>‹ sfide</button>
          <span className="tlive-asset">{CD.asset(tn.asset).sym}</span>
          <span className="tlive-clock"><b>{CD.fmtClock(rem)}</b></span>
        </div>
        <div className="tlive-banner">
          <div className="tlive-title">TORNEO LIVE</div>
          <div className="tlive-count">{tn.size} trader · stesso asset · VERIFICATO AVATRADE</div>
        </div>

        <div className="tn-podium">
          {podOrder.map(p => (
            <div key={p.id} className={'tn-pod ' + podCls(p)}>
              <div className="rk">#{String(sorted.indexOf(p) + 1).padStart(2, '0')}</div>
              <div className="av">{CD.initials(p.username)}</div>
              <div className={'nm' + (p.me ? ' me' : '')}>{p.username}</div>
              <div className="pp">{p.disp.toFixed(1)}</div>
            </div>
          ))}
        </div>

        <div className="tn-list">
          {rest.map((p, i) => (
            <div key={p.id} className={'tn-row' + (p.me ? ' me' : '')}>
              <span className="pos">#{String(i + 4).padStart(2, '0')}</span>
              <div className="ra">{CD.initials(p.username)}</div>
              <div className="rn">{p.username}{p.me && <span className="you">TU</span>}</div>
              <span className="rp">{p.disp.toFixed(1)}</span>
            </div>
          ))}
        </div>

        {!inTop && (
          <div className="tn-list" style={{ position: 'sticky', bottom: 0, marginTop: 8, paddingTop: 8, background: 'linear-gradient(180deg,rgba(13,13,13,0),rgba(13,13,13,.92) 30%)' }}>
            <div className="tn-row me">
              <span className="pos">#{String(myPos).padStart(2, '0')}</span>
              <div className="ra">{CD.initials('NULL_MASK')}</div>
              <div className="rn">&gt; tu · NULL_MASK<span className="you">TU</span></div>
              <span className="rp">{(sorted.find(p => p.me) || {}).disp.toFixed(1)}</span>
            </div>
          </div>
        )}

        <button className="dur-btn" style={{ marginTop: 12, justifyContent: 'center', color: 'var(--text-faint)', fontSize: 11, letterSpacing: '.1em' }} onClick={finish}>⏩ FINE TORNEO (demo)</button>
      </div>
      <BottomNav active="sfide" />
    </div>
  );
}

/* ---------------- RESULT ---------------- */
function TorneoResult({ result, onRematch, onBack }) {
  const CD = window.challengeData;
  const { pos, size, pips, asset } = result;
  const tier = pos <= 3 ? 'win' : pos <= Math.ceil(size / 2) ? 'mid' : 'low';
  const rankCls = pos <= 3 ? '' : pos <= Math.ceil(size / 2) ? 'mid' : 'low';
  const headline = pos === 1 ? 'CAMPIONE' : pos <= 3 ? 'SUL PODIO' : pos <= Math.ceil(size / 2) ? 'BUONA CORSA' : 'SFIDA CHIUSA';
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content res-screen">
        <div className={'res-ring ' + (tier === 'win' ? 'win' : 'lose')} style={{ marginTop: 10 }}>
          {pos <= 3 ? <Icon name="trophy" width="40" height="40" /> : '#' + pos}
        </div>
        <div className={'res-badge ' + (tier === 'win' ? 'win' : 'lose')} style={{ lineHeight: 1 }}>{headline}</div>
        <div style={{ marginTop: 30 }}>
          <span className={'tn-res-rank ' + rankCls}>#{pos}</span>
          <div className="tn-res-of">su {size} trader · TORNEO {CD.asset(asset).short}</div>
        </div>
        <div className="res-sub" style={{ marginTop: 14 }}>
          {pos <= 3 ? <>chiusura a <b>{pips.toFixed(1)} pips</b> · posizione in classifica in salita</>
            : <>&gt; chiuso a {pips.toFixed(1)} pips. la prossima è tua.</>}
        </div>
        <div className="res-actions" style={{ marginTop: 22 }}>
          <button className="again" onClick={onRematch}><Icon name="rematch" width="14" height="14" style={{ verticalAlign: '-2px', marginRight: 6 }} />nuovo torneo</button>
          <button className="back" onClick={onBack}>torna alle sfide</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TorneoCard, TorneoLive, TorneoResult });
