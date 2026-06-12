/* ============================================================
   HTT — Piattaforma · App shell (Classifica + Segnali + Profilo)
   Bottom nav funzionante; i moduli si parlano (classifica↔profilo↔sfide↔segnali)
   ============================================================ */

/* bottom nav cliccabile (sostituisce quella statica) */
function BottomNav({ active }) {
  const ctx = React.useContext(NavCtx);
  const items = [['chat', 'Chat', 'HTT-Chat.html'], ['sfide', 'Sfide', 'HTT-Sfide.html'], ['rank', 'Class.', 'rank'], ['signal', 'Segnali', 'signal'], ['user', 'Profilo', 'user']];
  return (
    <nav className="ob-bnav">
      {items.map(([ic, lb, target]) => {
        const isActive = active === ic;
        const onClick = () => {
          if (!target) return;
          if (target === 'rank') ctx.go('classifica');
          else if (target === 'signal') ctx.go('segnali');
          else if (target === 'user') ctx.openProfile(PD.ME_ID);
          else window.location.href = target;
        };
        return <div key={ic} className={'it' + (isActive ? ' active' : '')} onClick={onClick} style={{ cursor: target ? 'pointer' : 'default' }}><Icon name={ic} /> {lb}</div>;
      })}
    </nav>
  );
}
const NavCtx = React.createContext({ go: () => {}, openProfile: () => {} });
window.BottomNav = BottomNav;

function PlatformApp() {
  const [tab, setTab] = React.useState('classifica');   // classifica | segnali
  const [overlay, setOverlay] = React.useState(null);   // {type:'profile',id} | {type:'signal',id} | {type:'create'}
  const [, bump] = React.useState(0);

  const ctx = {
    go: t => { setOverlay(null); setTab(t); },
    openProfile: id => setOverlay({ type: 'profile', id }),
  };

  function openSignal(id) { setOverlay({ type: 'signal', id }); }
  function publish(sig) { PD.addSignal(sig); setOverlay(null); setTab('segnali'); bump(x => x + 1); }

  const signal = overlay && overlay.type === 'signal' ? PD.fetchSignals().find(s => s.id === overlay.id) : null;

  return (
    <NavCtx.Provider value={ctx}>
      <div className="proto">
        <div className="proto-bar">
          <span className="brand">H<span className="v">A</span>CK<span className="sep">_</span>T<span className="v">E</span>RM</span>
          <span className="dim mono" style={{ fontSize: 11 }}>step 04/05 · classifica + segnali</span>
          <div className="seg">
            <button className={tab === 'classifica' ? 'on' : ''} onClick={() => ctx.go('classifica')}>classifica</button>
            <button className={tab === 'segnali' ? 'on' : ''} onClick={() => ctx.go('segnali')}>segnali</button>
          </div>
        </div>
        <div className="proto-hint">
          Tocca un <b>trader</b> (podio o riga) per il profilo → <b>SFIDA</b>. In <b>segnali</b>: filtri per stato/asset/top-trader, apri una card per il dettaglio, o <b>+ nuovo segnale</b> con anteprima live.
        </div>

        <Phone>
          {tab === 'classifica'
            ? <Classifica onTrader={ctx.openProfile} />
            : <Segnali onTrader={ctx.openProfile} onNew={() => setOverlay({ type: 'create' })} onOpenSignal={openSignal} />}

          {overlay && overlay.type === 'profile' &&
            <TraderProfile traderId={overlay.id} onClose={() => setOverlay(null)} onSfida={() => {}} />}
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

ReactDOM.createRoot(document.getElementById('root')).render(<PlatformApp />);
