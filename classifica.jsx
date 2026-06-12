/* ============================================================
   HTT — CLASSIFICA (podium + lista + controlli + riga utente)
   ============================================================ */

/* count-up numerico (riavvia quando 'to' cambia) */
function CountUp({ to, dec = 0, dur = 900, className }) {
  const [val, setVal] = React.useState(to);
  const prev = React.useRef(to);
  React.useEffect(() => {
    if (PREFERS_REDUCED) { setVal(to); prev.current = to; return; }
    const from = prev.current, start = performance.now();
    let raf;
    const step = now => {
      const t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
      setVal(from + (to - from) * e);
      if (t < 1) raf = requestAnimationFrame(step); else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  const s = dec ? val.toFixed(dec) : Math.round(val).toLocaleString('it-IT');
  return <span className={className}>{s}</span>;
}

function badgeEl(b, key) {
  const map = { TOP_TRADER: ['top', '★ TOP'], RISING_STAR: ['rise', '↑ RISING'], STREAK_MASTER: ['streak', '⚡ STREAK'], SHARP: ['sharp', '◆ SHARP'], VERIFIED: ['ver', '✓ VER'] };
  const [cls, lbl] = map[b] || ['', b];
  return <span key={key} className={'bdg ' + cls}>{lbl}</span>;
}

const METRIC_LABEL = { pips: 'pips tot', winRate: 'win rate', wins: 'vittorie', streak: 'streak' };
function metricDisplay(t, metric, period) {
  const v = PD.metricValue(t, metric, period);
  if (metric === 'winRate') return <><CountUp to={v} className="mv" />%</>;
  if (metric === 'streak') return <span className="mv">W{v}</span>;
  return <CountUp to={v} className="mv" />;
}

function Classifica({ onTrader }) {
  const [metric, setMetric] = React.useState('pips');
  const [period, setPeriod] = React.useState('all');
  const { rows } = PD.fetchLeaderboard(metric, period);
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const me = rows.find(r => r.id === PD.ME_ID);

  // ordine podio visivo: 2 - 1 - 3
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podClass = t => (t === top3[0] ? 'p1' : t === top3[1] ? 'p2' : 'p3');

  function Move({ t }) {
    const m = t.prevRank - t.rank;
    if (m > 0) return <span className="lb-move up">▲{m}</span>;
    if (m < 0) return <span className="lb-move dn">▼{-m}</span>;
    return <span className="lb-move eq">=</span>;
  }

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <div className="pg-top">
          <div className="pg-title">CLASSIFICA</div>
          <span className="pill" style={{ color: 'var(--green-dim)', borderColor: 'var(--border-green)', background: 'rgba(0,255,65,.05)', whiteSpace: 'nowrap', flexShrink: 0 }}>✓ AVATRADE</span>
        </div>

        {/* controlli */}
        <div className="segctl" style={{ marginTop: 14 }}>
          {['week', 'month', 'all'].map(p => (
            <button key={p} className={period === p ? 'on' : ''} onClick={() => setPeriod(p)}>{p === 'week' ? 'Settimana' : p === 'month' ? 'Mese' : 'All time'}</button>
          ))}
        </div>
        <div className="segctl" style={{ marginTop: 8 }}>
          {['pips', 'winRate', 'wins', 'streak'].map(m => (
            <button key={m} className={metric === m ? 'on' : ''} onClick={() => setMetric(m)}>{METRIC_LABEL[m]}</button>
          ))}
        </div>

        {/* podio */}
        <div className="podium">
          {podiumOrder.map(t => (
            <div key={t.id} className={'pod ' + podClass(t)} onClick={() => onTrader(t.id)}>
              {t === top3[0] && <span className="crown">[ #01 ]</span>}
              <div className="rk">#{String(t.rank).padStart(2, '0')}</div>
              <div className="pav">{PD.initials(t.username)}</div>
              <div className="pname">{t.username}</div>
              <div className="ppips">{metricDisplay(t, metric, period)}</div>
              <div className="pwr">WR {t.winRate}%</div>
            </div>
          ))}
        </div>

        {/* lista */}
        <div className="lb-list">
          {rest.map((t, i) => (
            <div key={t.id} className={'lb-row' + (t.id === PD.ME_ID ? ' me' : '')} onClick={() => onTrader(t.id)}
              style={PREFERS_REDUCED ? null : { animation: `reveal .4s ease ${Math.min(i * 0.035, 0.5)}s both` }}>
              <span className="lb-pos">#{String(t.rank).padStart(2, '0')}</span>
              <div className="lb-av">{PD.initials(t.username)}</div>
              <div className="lb-info">
                <div className="lb-name">{t.username}{t.id === PD.ME_ID && <span className="you">TU</span>}</div>
                <div className="lb-sub">
                  <span>WR {t.winRate}%</span><span>W{t.streak}</span>
                  <span className="lb-badges">{t.dynBadges.filter(b => b !== 'VERIFIED').slice(0, 2).map((b, j) => badgeEl(b, j))}</span>
                </div>
              </div>
              <div className="lb-metric"><div>{metricDisplay(t, metric, period)}</div><div className="mk">{METRIC_LABEL[metric]}</div></div>
              <Move t={t} />
            </div>
          ))}
        </div>

        {/* riga utente ancorata */}
        {me && me.rank > 6 && (
          <div className="lb-sticky">
            <div className="lb-row me">
              <span className="lb-pos">#{String(me.rank).padStart(2, '0')}</span>
              <div className="lb-av">{PD.initials(me.username)}</div>
              <div className="lb-info">
                <div className="lb-name">&gt; tu · {me.username}<span className="you">TU</span></div>
                <div className="lb-sub"><span>WR {me.winRate}%</span><span>W{me.streak}</span></div>
              </div>
              <div className="lb-metric"><div>{metricDisplay(me, metric, period)}</div><div className="mk">{METRIC_LABEL[metric]}</div></div>
              <Move t={me} />
            </div>
          </div>
        )}
      </div>
      <BottomNav active="rank" onNav={null} />
    </div>
  );
}

Object.assign(window, { Classifica, CountUp, badgeEl });
