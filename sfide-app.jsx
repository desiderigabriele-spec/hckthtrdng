/* ============================================================
   HTT — Sfide · App shell + state machine
   screen: hub | wizard | accept | live | result
   ============================================================ */
/* BottomNav statica per la versione standalone (HTT-Sfide.html).
   Nell'app unificata viene sovrascritta dal router di htt-app.jsx. */
function BottomNav({ active }) {
  const items = [['chat', 'Chat'], ['sfide', 'Sfide'], ['rank', 'Class.'], ['signal', 'Segnali'], ['user', 'Profilo']];
  return (
    <nav className="ob-bnav">
      {items.map(([ic, lb]) => (
        <div key={ic} className={'it' + (active === ic ? ' active' : '')}><Icon name={ic} /> {lb}</div>
      ))}
    </nav>
  );
}
window.BottomNav = BottomNav;

function SfideApp() {
  const [challenges, setChallenges] = React.useState(() => CD.seedChallenges());
  const [tournaments, setTournaments] = React.useState(() => (typeof TN !== 'undefined' ? [TN.seedTournament()] : []));
  const [activeTournament, setActiveTournament] = React.useState(null);
  const [tnResult, setTnResult] = React.useState(null);
  const [screen, setScreen] = React.useState('hub');
  const [activeChallenge, setActiveChallenge] = React.useState(null);
  const [result, setResult] = React.useState(null);

  function openLive(ch) { setActiveChallenge(ch); setScreen('live'); }
  function launchNew(data) {
    if (data.type === 'torneo') {
      const tn = TN.createTournament({ asset: data.asset, durationId: data.durationId, size: data.size });
      setTournaments(p => [tn, ...p]); setActiveTournament(tn); setScreen('torneo-live'); return;
    }
    const dur = CD.duration(data.durationId);
    const ch = {
      id: 'new_' + Date.now(), state: 'active', type: '1v1',
      opp: data.opp || CD.leader().id, asset: data.asset, durationId: data.durationId,
      endsAt: Date.now() + dur.secs * 1000, mePips: 0, oppPips: 0,
    };
    setChallenges(prev => [ch, ...prev]);
    setActiveChallenge(ch);
    setScreen('live');
  }
  function openTorneo(tn) { setActiveTournament(tn); setScreen('torneo-live'); }
  function endTorneo(res) { setTnResult(res); setScreen('torneo-result'); }
  function rematchTorneo() {
    const base = activeTournament;
    const tn = TN.createTournament({ asset: base.asset, durationId: base.durationId, size: base.size });
    setTournaments(p => [tn, ...p]); setActiveTournament(tn); setScreen('torneo-live');
  }
  function acceptChallenge(ch) { setActiveChallenge(ch); setScreen('accept'); }
  function rejectChallenge(id) { setChallenges(prev => prev.filter(c => c.id !== id)); }

  function endLive(res) {
    setResult(res);
    // sposta la sfida nello storico
    setChallenges(prev => prev.map(c => c.id === (activeChallenge && activeChallenge.id)
      ? { ...c, state: 'done', won: res.won, mePips: res.mePips, oppPips: res.oppPips } : c));
    setScreen('result');
  }
  function rematch(res) {
    const base = activeChallenge || {};
    const ch = { ...base, id: 'rem_' + Date.now(), state: 'active', mePips: 0, oppPips: 0,
      endsAt: Date.now() + (CD.duration(base.durationId || '1h').secs) * 1000 };
    setActiveChallenge(ch);
    setChallenges(prev => [ch, ...prev]);
    setScreen('live');
  }

  let body;
  if (screen === 'hub') body = <Hub challenges={challenges} tournaments={tournaments} onNew={() => setScreen('wizard')} onOpen={openLive} onOpenTorneo={openTorneo} onAccept={acceptChallenge} onReject={rejectChallenge} />;
  else if (screen === 'wizard') body = <Wizard onCancel={() => setScreen('hub')} onLaunch={launchNew} />;
  else if (screen === 'live') body = <Live challenge={activeChallenge} onExit={() => setScreen('hub')} onEnd={endLive} />;
  else if (screen === 'result') body = <Result result={result} onRematch={rematch} onBack={() => { setResult(null); setScreen('hub'); }} />;
  else if (screen === 'torneo-live') body = <TorneoLive tn={activeTournament} onExit={() => setScreen('hub')} onEnd={endTorneo} />;
  else if (screen === 'torneo-result') body = <TorneoResult result={tnResult} onRematch={rematchTorneo} onBack={() => { setTnResult(null); setScreen('hub'); }} />;

  // accept countdown wrapper
  const [accepted, setAccepted] = React.useState(false);
  React.useEffect(() => { if (screen !== 'accept') setAccepted(false); }, [screen]);

  return (
    <div className="proto">
      <div className="proto-bar">
        <span className="brand">H<span className="v">A</span>CK<span className="sep">_</span>T<span className="v">E</span>RM</span>
        <span className="dim mono" style={{ fontSize: 11 }}>step 03 · sfide</span>
        <button className="abtn" onClick={() => { setChallenges(CD.seedChallenges()); setScreen('hub'); setResult(null); }}>↻ reset</button>
      </div>
      <div className="proto-hint">
        Tocca <b>+ nuova sfida</b> per il flusso completo (5 step → live → risultato). Le card <b>ATTIVE</b> aprono il duello live; in <b>IN ATTESA</b> puoi accettare la sfida di R4VEN_OPS.
      </div>
      <Phone>
        {screen === 'accept'
          ? (accepted
              ? <Live challenge={activeChallenge} onExit={() => setScreen('hub')} onEnd={endLive} />
              : <div className="ob-screen"><MatrixRain className="ob-rain" /><AcceptCountdown onStart={() => setAccepted(true)} /></div>)
          : body}
      </Phone>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SfideApp />);
