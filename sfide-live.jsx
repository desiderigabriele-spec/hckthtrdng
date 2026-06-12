/* ============================================================
   HTT — Sfide · LIVE duel + RESULT + ACCEPT countdown
   Riusa le classi m-card / m-cmp / m-feed dello Step 01.
   ============================================================ */

/* ---------- LIVE ---------- */
function Live({ challenge, onExit, onEnd }) {
  const me = CD.ME;
  const opp = CD.trader(challenge.opp) || CD.leader();
  const asset = CD.asset(challenge.asset);
  const dur = CD.duration(challenge.durationId);

  const liveRef = React.useRef(CD.makeLive(me, opp, asset.sym, challenge.mePips || 180.0, challenge.oppPips || 165.0));
  const [, render] = React.useState(0);
  const [feed, setFeed] = React.useState([]);
  const startRemaining = challenge.endsAt
    ? Math.floor((challenge.endsAt - Date.now()) / 1000)
    : (dur ? dur.secs : 3600);
  const [remaining, setRemaining] = React.useState(startRemaining);
  const remRef = React.useRef(startRemaining);
  const endedRef = React.useRef(false);

  function finish() {
    if (endedRef.current) return;
    endedRef.current = true;
    const L = liveRef.current;
    onEnd({ mePips: L.meDisp, oppPips: L.oppDisp, won: L.meDisp >= L.oppDisp, opp: opp.id, asset: challenge.asset });
  }

  React.useEffect(() => {
    if (PREFERS_REDUCED) { render(x => x + 1); return; }
    const L = liveRef.current;
    const tickI = setInterval(() => {
      const { dMe, dOp, exec } = CD.fetchTick(L);
      L.mePips += dMe; L.oppPips += dOp;
      if (exec) {
        setFeed(f => [exec, ...f].slice(0, 6));
      }
    }, 1500);
    const smoothI = setInterval(() => {
      L.meDisp += (L.mePips - L.meDisp) * 0.14;
      L.oppDisp += (L.oppPips - L.oppDisp) * 0.14;
      render(x => x + 1);
    }, 60);
    const clockI = setInterval(() => {
      remRef.current -= 1;
      setRemaining(remRef.current);
      if (remRef.current <= 0) { clearInterval(clockI); finish(); }
    }, 1000);
    return () => { clearInterval(tickI); clearInterval(smoothI); clearInterval(clockI); };
  }, []);

  const L = liveRef.current;
  const meLead = L.meDisp >= L.oppDisp;
  const tot = L.meDisp + L.oppDisp || 1;
  const ra = (L.meDisp / tot) * 100;

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content" style={{ paddingTop: 12 }}>
        <div className="live-head">
          <button className="wz-back" style={{ fontSize: 16 }} onClick={onExit}>‹ sfide</button>
          <span className="live-asset">{asset.sym} · 1v1</span>
          <span className="live-clock"><b>{CD.fmtClock(remaining)}</b></span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <span className="pill live"><span className="ld" /> LIVE · VERIFICATO AVATRADE</span>
        </div>

        {/* ME */}
        <div className={'m-card' + (meLead ? ' leader' : ' challenger')} style={{ marginTop: 14 }}>
          <div className="row1">
            <div className={'av ' + (meLead ? 'green' : 'amber')}><span className="g">{CD.initials(me.username)}</span></div>
            <div>
              <div className="un">{me.username}</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: meLead ? 'var(--terminal-green)' : 'var(--text-faint)', letterSpacing: '.1em' }}>
                {meLead ? '▲ IN TESTA' : 'TU · #' + me.rank}
              </div>
            </div>
            <div className="bp">{L.meDisp.toFixed(1)}</div>
          </div>
        </div>

        <div className="live-mid">VS</div>

        {/* OPP */}
        <div className={'m-card' + (!meLead ? ' leader' : ' challenger')}>
          <div className="row1">
            <div className={'av ' + (!meLead ? 'green' : 'amber')}><span className="g">{CD.initials(opp.username)}</span></div>
            <div>
              <div className="un">{opp.username}</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: !meLead ? 'var(--terminal-green)' : 'var(--text-faint)', letterSpacing: '.1em' }}>
                {!meLead ? '▲ IN TESTA' : '#' + opp.rank + ' · WR ' + opp.winRate + '%'}
              </div>
            </div>
            <div className="bp">{L.oppDisp.toFixed(1)}</div>
          </div>
        </div>

        {/* bar */}
        <div className="m-cmp" style={{ marginTop: 14 }}>
          <div className="bar"><span className="a" style={{ width: ra + '%' }} /><span className="b" style={{ width: (100 - ra) + '%' }} /></div>
        </div>

        {/* feed */}
        <div className="m-feed" style={{ marginTop: 14 }}>
          <div className="lh"><span>// live feed · esecuzioni demo</span><span className="live-dot" /></div>
          <div className="feed">
            {feed.map((e, i) => (
              <div key={i}>
                <span className="t">{CD.fmtClock(remaining).slice(0, 5)}</span>{'  '}{e.who} {e.side} {asset.short}{'  '}
                {e.win ? <b className="gn">+{e.pips.toFixed(1)}</b> : <b className="rd">{e.pips.toFixed(1)}</b>} pips
              </div>
            ))}
            {feed.length === 0 && <div style={{ color: 'var(--text-faint)' }}>&gt; in attesa di esecuzioni…</div>}
          </div>
        </div>

        <button className="dur-btn" style={{ marginTop: 12, justifyContent: 'center', color: 'var(--text-faint)', fontSize: 11, letterSpacing: '.1em' }} onClick={finish}>
          ⏩ FINE SFIDA (demo)
        </button>
      </div>
      <BottomNav active="sfide" />
    </div>
  );
}

/* ---------- RESULT ---------- */
function Result({ result, onRematch, onBack }) {
  const opp = CD.trader(result.opp);
  const asset = CD.asset(result.asset);
  const won = result.won;
  const diff = (result.mePips - result.oppPips);
  const rankFrom = CD.ME.rank;
  const rankTo = won ? Math.max(1, rankFrom - 2) : Math.min(20, rankFrom + 1);
  const moved = rankFrom - rankTo;

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content res-screen">
        <div className={'res-ring ' + (won ? 'win' : 'lose')}>{won ? <Icon name="trophy" width="40" height="40" /> : '✕'}</div>
        <div className={'res-badge ' + (won ? 'win' : 'lose')}>{won ? 'WINNER\nDETECTED' : 'SFIDA\nPERSA'}</div>
        <div className="res-sub">
          {won
            ? <>+{diff.toFixed(1)} pips di vantaggio · <b>{asset.sym}</b></>
            : <>&gt; sfida persa. {diff.toFixed(1)} pips. rivincita?</>}
        </div>

        <div className="res-duel">
          <div className={'res-side ' + (won ? 'win' : 'lose')}>
            <div className="rav">{CD.initials(CD.ME.username)}</div>
            <div className="rname">{CD.ME.username}</div>
            <div className="rpips">{result.mePips.toFixed(1)}</div>
          </div>
          <div className="res-vs">VS</div>
          <div className={'res-side ' + (won ? 'lose' : 'win')}>
            <div className="rav">{CD.initials(opp.username)}</div>
            <div className="rname">{opp.username}</div>
            <div className="rpips">{result.oppPips.toFixed(1)}</div>
          </div>
        </div>

        <div className="res-rank">
          <span className="rk-l">classifica</span>
          <span className="rk-v">
            #{rankFrom} → #{rankTo}
            <span className={'rk-move ' + (moved >= 0 ? 'up' : 'dn')}>{moved >= 0 ? '▲ +' + moved : '▼ ' + moved} posiz.</span>
          </span>
        </div>

        {won && (
          <div className="res-unlock">
            <div className="ico"><Icon name="bolt" width="18" height="18" /></div>
            <div><div className="ub">★ badge sbloccato</div><div className="ut">STREAK_MASTER · 3 vittorie di fila</div></div>
          </div>
        )}

        <div className="res-actions">
          <button className="again" onClick={() => onRematch(result)}><Icon name="rematch" width="14" height="14" style={{ verticalAlign: '-2px', marginRight: 6 }} />rivincita</button>
          <button className="back" onClick={onBack}>torna alle sfide</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- ACCEPT countdown ---------- */
function AcceptCountdown({ onStart }) {
  const [n, setN] = React.useState(3);
  const [phase, setPhase] = React.useState('intro'); // intro -> count
  React.useEffect(() => {
    if (PREFERS_REDUCED) { onStart(); return; }
    const t0 = setTimeout(() => setPhase('count'), 900);
    return () => clearTimeout(t0);
  }, []);
  React.useEffect(() => {
    if (phase !== 'count') return;
    if (n <= 0) { onStart(); return; }
    const t = setTimeout(() => setN(x => x - 1), 800);
    return () => clearTimeout(t);
  }, [phase, n]);
  return (
    <div className="accept-overlay">
      <div className="accept-lines">&gt; sfida accettata. <b>inizio tra…</b></div>
      {phase === 'count' && <div className="countdown-big">{n > 0 ? n : 'GO'}</div>}
    </div>
  );
}

Object.assign(window, { Live, Result, AcceptCountdown });
