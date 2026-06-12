/* ============================================================
   HTT — Sfide · HUB (Attive / In attesa / Storico)
   CD = window.challengeData (alias globale impostato in sfide-data)
   ============================================================ */

function MiniBar({ a, b }) {
  const tot = a + b || 1;
  const ra = Math.max(0, Math.min(100, (a / tot) * 100));
  return (
    <div className="cbar"><span className="a" style={{ width: ra + '%' }} /><span className="b" style={{ width: (100 - ra) + '%' }} /></div>
  );
}

function ChallengeCard({ ch, onOpen, onAccept, onReject }) {
  const opp = CD.trader(ch.opp);
  const asset = CD.asset(ch.asset);
  const dur = CD.duration(ch.durationId);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    if (ch.state !== 'active') return;
    const t = setInterval(() => force(x => x + 1), 1000);
    return () => clearInterval(t);
  }, [ch.state]);

  const head = (
    <div className="ccard-head">
      <div className={'cav' + (ch.dir === 'opp' || ch.state === 'incoming' ? ' amber' : '')}>{CD.initials(opp.username)}</div>
      <div className="cinfo">
        <div className="cuname">{opp.username}</div>
        <div className="crank">#{opp.rank} · WR {opp.winRate}% {opp.badge ? '· ★ ' + opp.badge : ''}</div>
      </div>
      {ch.state === 'active' && <span className="cstatus live"><span className="d" /> LIVE</span>}
      {ch.state === 'incoming' && <span className="cstatus wait">ti sfida</span>}
      {ch.state === 'outgoing' && <span className="cstatus wait">in attesa</span>}
      {ch.state === 'done' && <span className={'cstatus ' + (ch.won ? 'win' : 'lose')}>{ch.won ? 'VINTA' : 'PERSA'}</span>}
    </div>
  );

  const meta = (
    <div className="cmeta">
      <span className="it"><Icon name="target" /> <b>{asset.short}</b></span>
      <span className="it"><Icon name="clock" /> {dur.label}</span>
      <span className="it"><Icon name="swords" /> 1v1</span>
    </div>
  );

  return (
    <div className={'ccard' + (ch.state === 'active' ? ' active-c tap' : '')} onClick={ch.state === 'active' ? () => onOpen(ch) : undefined}>
      {head}
      {meta}
      {ch.state === 'active' && (
        <div className="cduel">
          <div className="cduel-row">
            <span className="me">NULL_MASK <span className="p">{ch.mePips.toFixed(1)}</span></span>
            <span className="op"><span className="p">{ch.oppPips.toFixed(1)}</span> {opp.username}</span>
          </div>
          <MiniBar a={ch.mePips} b={ch.oppPips} />
          <div className="ctime">tempo rimasto <b>{CD.fmtClock(Math.floor((ch.endsAt - Date.now()) / 1000))}</b> · VERIFICATO AVATRADE</div>
        </div>
      )}
      {ch.state === 'incoming' && (
        <div className="caccept">
          <button className="btn-accept" onClick={() => onAccept(ch)}>accetta</button>
          <button className="btn-reject" onClick={() => onReject(ch.id)}>rifiuta</button>
        </div>
      )}
      {ch.state === 'outgoing' && (
        <div className="csent">&gt; sfida inviata a {opp.username}. in attesa di risposta…</div>
      )}
      {ch.state === 'done' && (
        <div className="cresult">
          <span className={'fp ' + (ch.won ? 'win' : 'lose')}>
            {ch.won ? '+' : ''}{(ch.mePips - ch.oppPips).toFixed(1)} pips · tu {ch.mePips.toFixed(1)} / {ch.oppPips.toFixed(1)}
          </span>
          <span className="verbadge">✓ AVATRADE</span>
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab, onNew }) {
  const msg = {
    active: '> nessuna sfida attiva. lancia la prima.',
    incoming: '> nessuna sfida in attesa. tutto tranquillo.',
    done: '> nessuna sfida conclusa. la storia inizia ora.',
  }[tab];
  return (
    <div className="empty">
      <div className="glyph">⌁</div>
      <div className="msg" dangerouslySetInnerHTML={{ __html: msg.replace('>', '&gt;') }} />
      {tab === 'active' && <button className="newbtn" style={{ marginTop: 18 }} onClick={onNew}><span className="plus">+</span> nuova sfida</button>}
    </div>
  );
}

function Hub({ challenges, tournaments, onNew, onOpen, onOpenTorneo, onAccept, onReject }) {
  const [tab, setTab] = React.useState('active');
  const tns = tournaments || [];
  const counts = {
    active: challenges.filter(c => c.state === 'active').length + tns.length,
    waiting: challenges.filter(c => c.state === 'incoming' || c.state === 'outgoing').length,
    done: challenges.filter(c => c.state === 'done').length,
  };
  const list = tab === 'active' ? challenges.filter(c => c.state === 'active')
    : tab === 'waiting' ? challenges.filter(c => c.state === 'incoming' || c.state === 'outgoing')
    : challenges.filter(c => c.state === 'done');
  const emptyTab = tab === 'waiting' ? 'incoming' : tab;
  const showTns = tab === 'active' && tns.length > 0 && typeof TorneoCard !== 'undefined';

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <div className="hub-top">
          <div className="hub-title">SFIDE</div>
          <span className="pill live"><span className="ld" /> {counts.active} LIVE</span>
        </div>
        <button className="newbtn" onClick={onNew}><span className="plus">+</span> nuova sfida</button>

        <div className="tabs">
          <button className={'tab' + (tab === 'active' ? ' on' : '')} onClick={() => setTab('active')}>Attive <span className="cnt">{counts.active}</span></button>
          <button className={'tab' + (tab === 'waiting' ? ' on' : '')} onClick={() => setTab('waiting')}>In attesa <span className="cnt">{counts.waiting}</span></button>
          <button className={'tab' + (tab === 'done' ? ' on' : '')} onClick={() => setTab('done')}>Storico <span className="cnt">{counts.done}</span></button>
        </div>

        {list.length === 0 && !showTns
          ? <EmptyState tab={emptyTab} onNew={onNew} />
          : <div className="clist">
              {showTns && tns.map(tn => <TorneoCard key={tn.id} tn={tn} onOpen={onOpenTorneo} />)}
              {list.map(ch => (
                <ChallengeCard key={ch.id} ch={ch} onOpen={onOpen} onAccept={onAccept} onReject={onReject} />
              ))}
            </div>}
      </div>
      <BottomNav active="sfide" />
    </div>
  );
}

Object.assign(window, { Hub, ChallengeCard, MiniBar });
