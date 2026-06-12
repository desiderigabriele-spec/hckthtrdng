/* ============================================================
   HTT — APP UNIFICATA · router unico con bottom-nav
   tab: sfide | classifica | segnali | chat | profilo
   Sovrascrive la BottomNav globale: tutti i moduli la condividono.
   ============================================================ */
const NavCtx = React.createContext({ goTab: () => {}, openProfile: () => {} });

/* bottom nav unificata (cliccabile) — usata da TUTTI i moduli */
function BottomNav({ active }) {
  const ctx = React.useContext(NavCtx);
  const items = [['chat', 'Chat', 'chat'], ['sfide', 'Sfide', 'sfide'], ['rank', 'Class.', 'classifica'], ['signal', 'Segnali', 'segnali'], ['user', 'Profilo', 'profilo']];
  return (
    <nav className="ob-bnav">
      {items.map(([ic, lb, tab]) => (
        <div key={ic} className={'it' + (active === ic ? ' active' : '')} style={{ cursor: 'pointer' }} onClick={() => ctx.goTab(tab)}>
          <Icon name={ic} /> {lb}
        </div>
      ))}
    </nav>
  );
}
window.BottomNav = BottomNav;

/* schermata PROFILO (utente) */
function ProfileScreen({ onTrader }) {
  const t = PD.trader(PD.ME_ID);
  const badges = (t.badges && t.badges.length ? t.badges : []).concat('VERIFIED');
  const recent = CD.seedChallenges().filter(c => c.state === 'done').slice(0, 3);
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <div className="pg-top"><div className="pg-title">PROFILO</div><span className="pill" style={{ color: 'var(--green-dim)', borderColor: 'var(--border-green)', background: 'rgba(0,255,65,.05)', whiteSpace: 'nowrap', flexShrink: 0 }}>✓ AVATRADE</span></div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <div className="prof-av" style={{ margin: '0 auto' }}><span className="g">{PD.initials(t.username)}</span></div>
          <div className="prof-name" style={{ marginTop: 12 }}>{t.username}</div>
          <div className="prof-rank">#{t.rank} in classifica · conto demo verificato</div>
          <div className="prof-badges">{badges.map((b, i) => badgeEl(b, i))}</div>
        </div>

        <div className="prof-stats" style={{ marginTop: 18, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div className="prof-stat"><div className="v g">{t.pips.toLocaleString('it-IT')}</div><div className="k">pips totali</div></div>
          <div className="prof-stat"><div className="v">{t.winRate}%</div><div className="k">win rate</div></div>
          <div className="prof-stat"><div className="v">{t.wins} <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>/ {t.losses}</span></div><div className="k">sfide V / P</div></div>
          <div className="prof-stat"><div className="v">W{t.streak}</div><div className="k">streak</div></div>
          <div className="prof-stat"><div className="v">{t.signalsWin}/{t.signalsTotal}</div><div className="k">segnali vinti</div></div>
          <div className="prof-stat"><div className="v g">✓</div><div className="k">verificato</div></div>
        </div>

        <div className="cs-label">// ultime sfide</div>
        <div className="clist">
          {recent.map(ch => {
            const opp = CD.trader(ch.opp);
            return (
              <div className="ccard" key={ch.id} style={{ cursor: 'pointer' }} onClick={() => opp && onTrader(opp.id)}>
                <div className="ccard-head">
                  <div className={'cav' + (ch.won ? '' : ' amber')}>{CD.initials(opp.username)}</div>
                  <div className="cinfo"><div className="cuname">{opp.username}</div><div className="crank">{CD.asset(ch.asset).short} · {CD.duration(ch.durationId).label}</div></div>
                  <span className={'cstatus ' + (ch.won ? 'win' : 'lose')}>{ch.won ? 'VINTA' : 'PERSA'}</span>
                </div>
                <div className="cresult"><span className={'fp ' + (ch.won ? 'win' : 'lose')}>{ch.won ? '+' : ''}{(ch.mePips - ch.oppPips).toFixed(1)} pips</span><span className="verbadge">✓ AVATRADE</span></div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav active="user" />
    </div>
  );
}

function HTTApp() {
  const [tab, setTab] = React.useState('sfide');
  // sfide sub-flow
  const [challenges, setChallenges] = React.useState(() => CD.seedChallenges());
  const [tournaments, setTournaments] = React.useState(() => (typeof TN !== 'undefined' ? [TN.seedTournament()] : []));
  const [activeTournament, setActiveTournament] = React.useState(null);
  const [tnResult, setTnResult] = React.useState(null);
  const [sfScreen, setSfScreen] = React.useState('hub');
  const [activeChallenge, setActiveChallenge] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const [accepted, setAccepted] = React.useState(false);
  // overlay (profile / signal detail / create)
  const [overlay, setOverlay] = React.useState(null);
  const [, bump] = React.useState(0);

  const ctx = {
    goTab: t => { setOverlay(null); setTab(t); },
    openProfile: id => setOverlay({ type: 'profile', id }),
  };

  /* --- sfide handlers --- */
  function openLive(ch) { setActiveChallenge(ch); setSfScreen('live'); }
  function launchNew(data) {
    if (data.type === 'torneo') {
      const tn = TN.createTournament({ asset: data.asset, durationId: data.durationId, size: data.size });
      setTournaments(p => [tn, ...p]); setActiveTournament(tn); setSfScreen('torneo-live'); return;
    }
    const dur = CD.duration(data.durationId);
    const ch = { id: 'new_' + Date.now(), state: 'active', type: '1v1', opp: data.opp || CD.leader().id, asset: data.asset, durationId: data.durationId, endsAt: Date.now() + dur.secs * 1000, mePips: 0, oppPips: 0 };
    setChallenges(p => [ch, ...p]); setActiveChallenge(ch); setSfScreen('live');
  }
  function openTorneo(tn) { setActiveTournament(tn); setSfScreen('torneo-live'); }
  function endTorneo(res) { setTnResult(res); setSfScreen('torneo-result'); }
  function rematchTorneo() {
    const base = activeTournament;
    const tn = TN.createTournament({ asset: base.asset, durationId: base.durationId, size: base.size });
    setTournaments(p => [tn, ...p]); setActiveTournament(tn); setSfScreen('torneo-live');
  }
  function acceptChallenge(ch) { setActiveChallenge(ch); setAccepted(false); setSfScreen('accept'); }
  function rejectChallenge(id) { setChallenges(p => p.filter(c => c.id !== id)); }
  function endLive(res) {
    setResult(res);
    setChallenges(p => p.map(c => c.id === (activeChallenge && activeChallenge.id) ? { ...c, state: 'done', won: res.won, mePips: res.mePips, oppPips: res.oppPips } : c));
    setSfScreen('result');
  }
  function rematch() {
    const base = activeChallenge || {};
    const ch = { ...base, id: 'rem_' + Date.now(), state: 'active', mePips: 0, oppPips: 0, endsAt: Date.now() + CD.duration(base.durationId || '1h').secs * 1000 };
    setActiveChallenge(ch); setChallenges(p => [ch, ...p]); setSfScreen('live');
  }
  function startSfidaVs(id) {
    const ch = { id: 'pv_' + Date.now(), state: 'active', type: '1v1', opp: id, asset: 'XAUUSD', durationId: '1h', endsAt: Date.now() + 3600000, mePips: 0, oppPips: 0 };
    setOverlay(null); setActiveChallenge(ch); setChallenges(p => [ch, ...p]); setTab('sfide'); setSfScreen('live');
  }

  /* --- segnali handlers --- */
  function openSignal(id) { setOverlay({ type: 'signal', id }); }
  function publish(sig) { PD.addSignal(sig); setOverlay(null); setTab('segnali'); bump(x => x + 1); }
  const signal = overlay && overlay.type === 'signal' ? PD.fetchSignals().find(s => s.id === overlay.id) : null;

  /* --- render tab --- */
  let screen;
  if (tab === 'sfide') {
    if (sfScreen === 'hub') screen = <Hub challenges={challenges} tournaments={tournaments} onNew={() => setSfScreen('wizard')} onOpen={openLive} onOpenTorneo={openTorneo} onAccept={acceptChallenge} onReject={rejectChallenge} />;
    else if (sfScreen === 'wizard') screen = <Wizard onCancel={() => setSfScreen('hub')} onLaunch={launchNew} />;
    else if (sfScreen === 'torneo-live') screen = <TorneoLive tn={activeTournament} onExit={() => setSfScreen('hub')} onEnd={endTorneo} />;
    else if (sfScreen === 'torneo-result') screen = <TorneoResult result={tnResult} onRematch={rematchTorneo} onBack={() => { setTnResult(null); setSfScreen('hub'); }} />;
    else if (sfScreen === 'accept') screen = accepted ? <Live challenge={activeChallenge} onExit={() => setSfScreen('hub')} onEnd={endLive} /> : <div className="ob-screen"><MatrixRain className="ob-rain" /><AcceptCountdown onStart={() => setAccepted(true)} /></div>;
    else if (sfScreen === 'live') screen = <Live challenge={activeChallenge} onExit={() => setSfScreen('hub')} onEnd={endLive} />;
    else if (sfScreen === 'result') screen = <Result result={result} onRematch={rematch} onBack={() => { setResult(null); setSfScreen('hub'); }} />;
  } else if (tab === 'classifica') screen = <Classifica onTrader={ctx.openProfile} />;
  else if (tab === 'segnali') screen = <Segnali onTrader={ctx.openProfile} onNew={() => setOverlay({ type: 'create' })} onOpenSignal={openSignal} />;
  else if (tab === 'chat') screen = <ChatApp />;
  else if (tab === 'profilo') screen = <ProfileScreen onTrader={ctx.openProfile} />;

  return (
    <NavCtx.Provider value={ctx}>
      <div className="proto">
        <div className="proto-bar">
          <span className="brand">H<span className="v">A</span>CK<span className="sep">_</span>T<span className="v">E</span>RM</span>
          <span className="dim mono" style={{ fontSize: 11 }}>piattaforma · app unificata</span>
        </div>
        <div className="proto-hint">
          Un'unica app: usa la <b>bottom-nav</b> per muoverti tra <b>Sfide · Classifica · Segnali · Chat · Profilo</b>.
          Tocca un trader per il profilo → <b>SFIDA</b> lo porta diretto al duello live.
        </div>
        <Phone>
          {screen}
          {overlay && overlay.type === 'profile' &&
            <TraderProfile traderId={overlay.id} onClose={() => setOverlay(null)} onSfida={e => { e.preventDefault(); startSfidaVs(overlay.id); }} />}
          {overlay && overlay.type === 'signal' && signal &&
            <div className="prof-overlay" style={{ background: 'var(--bg-primary)', backdropFilter: 'none' }}>
              <SignalDetail sig={signal} onBack={() => setOverlay(null)} onTrader={ctx.openProfile} />
            </div>}
          {overlay && overlay.type === 'create' &&
            <div className="prof-overlay" style={{ background: 'var(--bg-primary)', backdropFilter: 'none' }}>
              <SignalCreate onCancel={() => setOverlay(null)} onPublish={publish} />
            </div>}
        </Phone>
      </div>
    </NavCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HTTApp />);
