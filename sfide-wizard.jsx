/* ============================================================
   HTT — Sfide · WIZARD creazione (1v1 e TORNEO, step dinamici)
   1v1   : tipo · avversario · asset · durata · conferma
   torneo: tipo · dimensione · asset · durata · conferma
   ============================================================ */
const STEPS_1V1 = ['tipo', 'avversario', 'asset', 'durata', 'conferma'];
const STEPS_TN = ['tipo', 'dimensione', 'asset', 'durata', 'conferma'];
const TN_SIZES = [8, 16, 32];

function Wizard({ onCancel, onLaunch }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ type: '1v1', oppMode: null, opp: null, asset: 'XAUUSD', durationId: '24h', size: 16 });
  const [query, setQuery] = React.useState('');
  const [launching, setLaunching] = React.useState(false);

  const steps = data.type === 'torneo' ? STEPS_TN : STEPS_1V1;
  const cur = steps[step];
  const set = patch => setData(d => ({ ...d, ...patch }));
  const next = () => setStep(s => Math.min(steps.length - 1, s + 1));
  const back = () => (step === 0 ? onCancel() : setStep(s => s - 1));

  const valid = {
    tipo: !!data.type,
    avversario: data.oppMode === 'open' || !!data.opp || data.oppMode === 'leader',
    dimensione: !!data.size,
    asset: !!data.asset,
    durata: !!data.durationId,
    conferma: true,
  }[cur];

  function launch() {
    setLaunching(true);
    const oppId = data.oppMode === 'leader' ? CD.leader().id : data.oppMode === 'open' ? null : data.opp;
    setTimeout(() => onLaunch({ ...data, opp: oppId }), PREFERS_REDUCED ? 200 : 2200);
  }

  const leaderT = CD.leader();
  const filtered = CD.TRADERS.filter(t => t.username.toLowerCase().includes(query.toLowerCase()));
  const isTorneo = data.type === 'torneo';

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <div className="wz-bar">
        <button className="wz-back" onClick={back}>‹</button>
        <div className="wz-dots">{steps.map((_, i) => <div key={i} className={'wz-dot' + (i <= step ? ' on' : '')} />)}</div>
        <span className="wz-step-lbl">{step + 1}/{steps.length}</span>
      </div>

      <div className="ob-content">
        {/* TIPO */}
        {cur === 'tipo' && (
          <>
            <div className="ob-eyebrow">// step 01 · formato</div>
            <h1 className="ob-h sm">CHE TIPO DI<br />SFIDA?</h1>
            <div className="choice-grid">
              <button className={'choice-card' + (data.type === '1v1' ? ' sel' : '')} onClick={() => set({ type: '1v1' })}>
                <div className="choice-ico"><Icon name="swords" /></div>
                <div><div className="choice-t">1 VS 1</div><div className="choice-d">Tu contro un altro trader. Chi fa più pips vince.</div></div>
              </button>
              <button className={'choice-card' + (data.type === 'torneo' ? ' sel' : '')} onClick={() => set({ type: 'torneo' })}>
                <div className="choice-ico"><Icon name="trophy" /></div>
                <div><div className="choice-t">TORNEO</div><div className="choice-d">Più trader sullo stesso asset. Vince chi fa più pips.</div></div>
              </button>
            </div>
          </>
        )}

        {/* AVVERSARIO (1v1) */}
        {cur === 'avversario' && (
          <>
            <div className="ob-eyebrow">// step 02 · avversario</div>
            <h1 className="ob-h sm">CHI VUOI<br />SFIDARE?</h1>
            <div className="choice-grid" style={{ marginTop: 14 }}>
              <button className={'choice-card' + (data.oppMode === 'open' ? ' sel' : '')} onClick={() => set({ oppMode: 'open', opp: null })}>
                <div className="choice-ico"><Icon name="users" /></div>
                <div><div className="choice-t" style={{ fontSize: 18 }}>SFIDA APERTA</div><div className="choice-d">Chiunque può accettarla dalla bacheca.</div></div>
              </button>
              <button className={'choice-card' + (data.oppMode === 'leader' ? ' sel' : '')} onClick={() => set({ oppMode: 'leader', opp: leaderT.id })}>
                <div className="choice-ico"><Icon name="trophy" /></div>
                <div><div className="choice-t" style={{ fontSize: 18 }}>SFIDA IL LEADER</div><div className="choice-d">{leaderT.username} · #1 in classifica · WR {leaderT.winRate}%</div></div>
              </button>
            </div>
            <div className="ob-eyebrow" style={{ marginTop: 18 }}>// oppure scegli dalla community</div>
            <div className="search"><Icon name="search" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="cerca username…" spellCheck={false} /></div>
            <div className="opp-list">
              {filtered.map(t => (
                <button key={t.id} className={'opp-row' + (data.oppMode === 'pick' && data.opp === t.id ? ' sel' : '')} onClick={() => set({ oppMode: 'pick', opp: t.id })}>
                  <div className="opp-av">{CD.initials(t.username)}</div>
                  <div className="opp-info"><div className="opp-name">{t.username}</div><div className="opp-sub">WR {t.winRate}% {t.badge ? '· ★ ' + t.badge : ''}</div></div>
                  <div className="opp-rank">#{t.rank}</div>
                </button>
              ))}
              {filtered.length === 0 && <div className="csent" style={{ padding: '12px 2px' }}>&gt; nessun trader trovato.</div>}
            </div>
          </>
        )}

        {/* DIMENSIONE (torneo) */}
        {cur === 'dimensione' && (
          <>
            <div className="ob-eyebrow">// step 02 · dimensione</div>
            <h1 className="ob-h sm">QUANTI<br />TRADER?</h1>
            <div className="ob-sub">Tutti competono sullo stesso asset nello stesso periodo. Vince chi totalizza più pips.</div>
            <div className="size-grid">
              {TN_SIZES.map(n => (
                <button key={n} className={'size-card' + (data.size === n ? ' sel' : '')} onClick={() => set({ size: n })}>
                  <div className="n">{n}</div><div className="l">trader</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ASSET */}
        {cur === 'asset' && (
          <>
            <div className="ob-eyebrow">// step 03 · asset</div>
            <h1 className="ob-h sm">SU QUALE<br />MERCATO?</h1>
            <div className="asset-grid">
              {CD.ASSETS.map(a => (
                <button key={a.sym} className={'asset-card' + (data.asset === a.sym ? ' sel' : '')} onClick={() => set({ asset: a.sym })}>
                  <div className="asset-sym">{a.short}</div>
                  <div><div className="asset-name">{a.sym}</div><div className="asset-tag">{a.name}</div></div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* DURATA */}
        {cur === 'durata' && (
          <>
            <div className="ob-eyebrow">// step 04 · durata</div>
            <h1 className="ob-h sm">PER QUANTO<br />TEMPO?</h1>
            <div className="dur-grid">
              {CD.DURATIONS.map(d => (
                <button key={d.id} className={'dur-btn' + (data.durationId === d.id ? ' sel' : '')} onClick={() => set({ durationId: d.id })}>
                  <span className="dl">{d.label}</span><span className="dr">{d.tag}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* CONFERMA */}
        {cur === 'conferma' && (() => {
          const a = CD.asset(data.asset), d = CD.duration(data.durationId);
          const oppLabel = data.oppMode === 'open' ? 'Sfida aperta'
            : data.oppMode === 'leader' ? CD.leader().username + ' · #1'
            : CD.trader(data.opp) ? CD.trader(data.opp).username + ' · #' + CD.trader(data.opp).rank : '—';
          return (
            <>
              <div className="ob-eyebrow">// step 05 · conferma</div>
              <h1 className="ob-h sm">PRONTO A<br />LANCIARE?</h1>
              <div className="summary">
                <div className="sum-row"><span className="k">tipo</span><span className="v">{isTorneo ? 'TORNEO' : '1 VS 1'}</span></div>
                {isTorneo
                  ? <div className="sum-row"><span className="k">trader</span><span className="v">{data.size} partecipanti</span></div>
                  : <div className="sum-row"><span className="k">avversario</span><span className="v">{oppLabel}</span></div>}
                <div className="sum-row"><span className="k">asset</span><span className="v"><span className="av-mini">{a.short}</span>{a.sym}</span></div>
                <div className="sum-row"><span className="k">durata</span><span className="v">{d.label}</span></div>
              </div>
              <div className="reassure" style={{ marginTop: 16 }}>{isTorneo ? <>Torneo su <b>conto demo verificato AvaTrade</b>. Classifica live, vince chi fa più pips.</> : <>Sfida su <b>conto demo verificato AvaTrade</b>. Vince chi totalizza più pips nel periodo.</>}</div>
            </>
          );
        })()}
      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px 22px' }}>
        {step < steps.length - 1
          ? <BigBtn disabled={!valid} onClick={next}>continua</BigBtn>
          : <BigBtn icon="bolt" onClick={launch}>{isTorneo ? 'lancia torneo' : 'lancia sfida'}</BigBtn>}
      </div>

      {launching && (
        <div className="launch">
          <div className="launch-glyph">⟁</div>
          <TypeLines speed={16} className="launch-lines" lines={[
            { plain: '> compilazione...', html: '<span class="dim">&gt; compilazione ' + (isTorneo ? 'torneo' : 'sfida') + '...</span>', pause: 160 },
            { plain: '> firma conto demo: OK', html: '<span class="dim">&gt; firma conto demo:</span> <b>OK</b>', pause: 160 },
            { plain: '> trasmesso alla rete.', html: '<b>&gt; ' + (isTorneo ? 'torneo aperto' : 'sfida trasmessa') + ' alla rete.</b>', pause: 120 },
          ]} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Wizard });
