/* ============================================================
   HTT — Onboarding app shell + state machine
   ============================================================ */
const { useState: aS, useEffect: aE } = React;

const now = Date.now();
const SEED_USERS = [
  { id: 'u_glitch', username: 'GL1TCH_KID',  email: 'glitch@proton.me',    avatrade_id: 'AVA-204881', createdAt: now - 1000 * 60 * 22,  status: 'pending' },
  { id: 'u_zero',   username: 'ZER0_COOL',   email: 'z.cool@tuta.io',      avatrade_id: 'AVA-198330', createdAt: now - 1000 * 60 * 64,  status: 'pending' },
  { id: 'u_echo',   username: 'ECH0_PRIME',  email: 'echo.p@gmail.com',    avatrade_id: 'AVA-200145', createdAt: now - 1000 * 60 * 140, status: 'verified' },
  { id: 'u_raven',  username: 'R4VEN_OPS',   email: 'raven@protonmail.com',avatrade_id: 'AVA-211904', createdAt: now - 1000 * 60 * 8,   status: 'pending' },
  { id: 'u_neon',   username: 'NEØN_WOLF',   email: 'neon@hackthe.trade',  avatrade_id: 'AVA-100002', createdAt: now - 1000 * 60 * 600, status: 'verified' },
];

function App() {
  const booted = sessionStorage.getItem('htt_booted') === '1';
  const [view, setView] = aS('user');                 // user | admin
  const [screen, setScreen] = aS(booted ? 'register' : 'boot');
  const [users, setUsers] = aS(SEED_USERS);
  const [currentUserId, setCurrentUserId] = aS(null);

  const currentUser = users.find(u => u.id === currentUserId) || null;
  const currentVerified = currentUser && currentUser.status === 'verified';

  function finishBoot() { sessionStorage.setItem('htt_booted', '1'); setScreen('register'); }

  function register({ email, username }) {
    const id = 'u_me_' + Math.random().toString(36).slice(2, 7);
    setUsers(prev => [{ id, username, email, avatrade_id: '—', createdAt: Date.now(), status: 'pending' }, ...prev]);
    setCurrentUserId(id);
    setScreen('avatrade');
  }
  function setAvatradeId(avatrade_id) {
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, avatrade_id } : u));
    setScreen('verifying');
  }
  function verifyUser(id) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'verified', depositoAt: Date.now() } : u));
  }
  function rejectUser(id) { setUsers(prev => prev.filter(u => u.id !== id)); }

  function restart() {
    sessionStorage.removeItem('htt_booted');
    setUsers(SEED_USERS); setCurrentUserId(null); setView('user'); setScreen('boot');
  }

  function renderScreen() {
    switch (screen) {
      case 'boot':       return <BootScreen onDone={finishBoot} />;
      case 'register':   return <RegisterScreen onSubmit={register} />;
      case 'avatrade':   return <AvatradeScreen onOpen={() => { window.open(AVATRADE_AFFILIATE_LINK, '_blank'); setScreen('avatradeId'); }} onHasAccount={() => setScreen('avatradeId')} />;
      case 'avatradeId': return <AvatradeIdScreen onSubmit={setAvatradeId} />;
      case 'verifying':  return <VerifyingScreen onDone={() => setScreen('pending')} />;
      case 'pending':    return <PendingScreen user={currentUser} verified={currentVerified} onEnter={() => setScreen('granted')} onGotoAdmin={() => setView('admin')} />;
      case 'granted':    return <GrantedScreen onEnter={() => setScreen('platform')} />;
      case 'platform':   return <PlatformScreen user={currentUser} />;
      default:           return null;
    }
  }

  const flowSteps = ['boot', 'register', 'avatrade', 'avatradeId', 'verifying', 'pending', 'granted', 'platform'];
  const stepIdx = flowSteps.indexOf(screen);

  return (
    <div className="proto">
      <div className="proto-bar">
        <span className="brand">H<span className="v">A</span>CK<span className="sep">_</span>T<span className="v">E</span>RM</span>
        <span className="dim mono" style={{ fontSize: 11 }}>step 02 · onboarding</span>
        <div className="seg">
          <button className={view === 'user' ? 'on' : ''} onClick={() => setView('user')}>user_flow</button>
          <button className={view === 'admin' ? 'on' : ''} onClick={() => setView('admin')}>admin_panel</button>
        </div>
        <button className="abtn" onClick={restart}>↻ restart</button>
      </div>

      <div className="proto-hint">
        {view === 'user'
          ? <>Flusso <b>{stepIdx + 1}/{flowSteps.length}</b> · {screen}. Compila i campi, apri AvaTrade, inserisci l'ID. Su <b>“in verifica”</b> passa al pannello admin per sbloccare <b>ACCESS GRANTED</b>.</>
          : <>Verifica l'utente con <b>▸</b> (quello appena registrato) per sbloccare il suo accesso, poi torna a <b>user_flow</b>.</>}
      </div>

      {view === 'user'
        ? <Phone>{renderScreen()}</Phone>
        : <AdminPanel users={users} onVerify={verifyUser} onReject={rejectUser} currentUserId={currentUserId} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
