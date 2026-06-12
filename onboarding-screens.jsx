/* ============================================================
   HTT — Onboarding user-flow screens
   ============================================================ */
const { useState: uS, useEffect: uE, useRef: uR } = React;

const WORDMARK = (
  <>H<span className="v">A</span>CK<span className="sep">_</span>TH<span className="v">E</span><span className="sep">_</span>TR<span className="v">A</span>D<span className="v">I</span>NG</>
);
const LOGO_SM = (
  <>H<span className="v">A</span>CK<span className="sep">_</span>T<span className="v">E</span>RM</>
);
const AVATRADE_AFFILIATE_LINK = '#avatrade-affiliate'; // placeholder per il dev

/* ---------- 1 · BOOT ---------- */
function BootScreen({ onDone }) {
  const [phase, setPhase] = uS('typing'); // typing -> word -> done
  const lines = [
    { plain: '> inizializzazione HTT_NET...', html: '<span class="dim">&gt; inizializzazione HTT_NET...</span>', pause: 90 },
    { plain: '> connessione neurale: OK', html: '<span class="dim">&gt; connessione neurale:</span> <span class="ok">OK</span>', pause: 80 },
    { plain: '> feed di mercato: OK', html: '<span class="dim">&gt; feed di mercato:</span> <span class="ok">OK</span>', pause: 80 },
    { plain: '> moduli AI: OK', html: '<span class="dim">&gt; moduli AI:</span> <span class="ok">OK</span>', pause: 80 },
    { plain: '> sistema online.', html: '<span class="ln"><b>&gt; sistema online.</b></span>', pause: 120 },
  ];
  uE(() => {
    if (phase === 'word') { const t = setTimeout(() => { setPhase('done'); onDone(); }, 1100); return () => clearTimeout(t); }
  }, [phase]);
  return (
    <div className="ob-screen boot-screen ob-content center" onClick={onDone} style={{ cursor: 'pointer' }}>
      <TypeLines lines={lines} speed={15} className="boot-lines" onDone={() => setPhase('word')} />
      <div className={'boot-word' + (phase !== 'typing' ? ' show' : '')}>{WORDMARK}</div>
      <div className={'boot-tag' + (phase !== 'typing' ? ' show' : '')}>&gt; decode the market.</div>
      <button className="boot-skip" onClick={onDone}>tap per saltare ▸</button>
    </div>
  );
}

/* ---------- 2 · REGISTER ---------- */
function RegisterScreen({ onSubmit }) {
  const [email, setEmail] = uS('');
  const [user, setUser] = uS('');
  const [touched, setTouched] = uS(false);
  const emailErr = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '> errore: email non valida' : '';
  const userErr = touched && user.trim().length < 3 ? '> errore: username troppo corto (min 3)' : '';
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && user.trim().length >= 3;
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <div className="ob-logo">{LOGO_SM}</div>
        <div className="ob-eyebrow" style={{ marginTop: 18 }}>// nuovo accesso</div>
        <h1 className="ob-h">CREA IL TUO ALIAS</h1>
        <div className="ob-sub">Scegli un'identità per la rete. La useranno gli altri trader nelle sfide e in classifica.</div>
        <TField label="> email_" prompt="@" value={email} onChange={v => setEmail(v)}
          placeholder="tu@dominio.com" error={emailErr} type="email" autoFocus />
        <TField label="> username_" prompt=">" value={user} onChange={v => setUser(v.replace(/\s/g, '_'))}
          placeholder="NULL_MASK" error={userErr} ok={!userErr && user.length >= 3 ? '> alias disponibile' : ''} />
        <BigBtn icon="bolt" disabled={false}
          onClick={() => { setTouched(true); if (valid) onSubmit({ email, username: user.trim() }); }}>
          inizializza accesso
        </BigBtn>
        <div className="linkline"><a>Ho già un account · accedi</a></div>
      </div>
    </div>
  );
}

/* ---------- 3 · AVATRADE INTRO ---------- */
function AvatradeScreen({ onOpen, onHasAccount }) {
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <div className="ob-eyebrow">// ultimo step</div>
        <h1 className="ob-h sm">ULTIMO STEP PER<br />ACCEDERE ALLE SFIDE</h1>
        <div className="steps">
          <div className="step"><div className="num">1</div><div className="t">Apri il tuo <b>conto AvaTrade gratuito</b> <span>(deposito 250€, resta tuo)</span></div></div>
          <div className="step"><div className="num">2</div><div className="t">Il tuo <b>conto demo</b> viene collegato e <span>verificato dal team</span></div></div>
          <div className="step"><div className="num">3</div><div className="t">Accedi a <b>sfide, classifica e community</b></div></div>
        </div>
        <div className="reassure">Il deposito resta sul tuo conto di trading. <b>Noi non tocchiamo mai i tuoi soldi.</b></div>
        <BigBtn icon="link" onClick={onOpen}>apri conto avatrade</BigBtn>
        <div className="linkline"><a onClick={onHasAccount}>Ho già un conto AvaTrade</a></div>
      </div>
    </div>
  );
}

/* ---------- 4 · AVATRADE ID ---------- */
function AvatradeIdScreen({ onSubmit }) {
  const [id, setId] = uS('');
  const [touched, setTouched] = uS(false);
  const err = touched && id.trim().length < 5 ? '> errore: ID conto non valido' : '';
  const valid = id.trim().length >= 5;
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <div className="ob-eyebrow">// collega conto</div>
        <h1 className="ob-h sm">INSERISCI IL TUO<br />ID AVATRADE</h1>
        <div className="ob-sub">Lo trovi nella tua area cliente AvaTrade, sotto “Conti”. Serve per collegare il tuo conto demo alla rete HTT.</div>
        <TField label="> avatrade_account_id_" prompt="#" value={id}
          onChange={v => setId(v.replace(/\s/g, ''))} placeholder="AVA-000000" error={err} autoFocus />
        <BigBtn icon="shield" onClick={() => { setTouched(true); if (valid) onSubmit(id.trim()); }}>collega e verifica</BigBtn>
        <div className="lockmsg" style={{ marginTop: 18 }}>
          <Icon name="lock" width="12" height="12" style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Connessione cifrata · i tuoi dati non vengono mai condivisi con terzi.
        </div>
      </div>
    </div>
  );
}

/* ---------- 5 · VERIFYING ---------- */
function VerifyingScreen({ onDone }) {
  uE(() => { const t = setTimeout(onDone, PREFERS_REDUCED ? 300 : 2600); return () => clearTimeout(t); }, []);
  const lines = [
    { plain: '> verifica conto in corso...', html: '<span class="dim">&gt; verifica conto in corso...</span>', pause: 240 },
    { plain: '> lettura ID AvaTrade...', html: '<span class="dim">&gt; lettura ID AvaTrade...</span> <b>OK</b>', pause: 240 },
    { plain: '> in attesa di conferma deposito...', html: '<span class="dim">&gt; in attesa di conferma deposito...</span>', pause: 240 },
  ];
  return (
    <div className="ob-screen scan-screen ob-content center">
      <MatrixRain className="ob-rain" />
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div className="scan-ring"><div className="core">⌬</div></div>
        <TypeLines lines={lines} speed={14} className="scan-lines" />
        <div className="scan-bar"><i /></div>
      </div>
    </div>
  );
}

/* ---------- 6 · PENDING ---------- */
function PendingScreen({ user, verified, onEnter, onGotoAdmin }) {
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <span className="pend-badge"><span className="d" />in verifica</span>
        <h1 className="ob-h sm" style={{ marginTop: 16 }}>QUASI DENTRO.</h1>
        <div className="ob-sub">Il team sta verificando il tuo accesso e la conferma del deposito. Riceverai una notifica a breve.</div>
        <div className="recap">
          <div className="row"><span className="k">username</span><span className="val green">{user.username}</span></div>
          <div className="row"><span className="k">email</span><span className="val">{user.email}</span></div>
          <div className="row"><span className="k">avatrade_id</span><span className="val amber">{user.avatrade_id}</span></div>
          <div className="row"><span className="k">stato</span><span className="val" style={{ color: verified ? 'var(--terminal-green)' : 'var(--amber)' }}>{verified ? 'verificato ✓' : 'in attesa…'}</span></div>
        </div>
        {verified
          ? <div className="lockmsg"><b style={{ color: 'var(--terminal-green)' }}>Accesso sbloccato.</b> Conto verificato dal team — sei pronto a entrare nella rete.</div>
          : <div className="lockmsg"><b>Accesso bloccato.</b> Chat, sfide e segnali restano off-limits finché un admin non conferma il tuo conto.</div>}
        {verified
          ? <BigBtn icon="check" onClick={onEnter}>accedi alla piattaforma</BigBtn>
          : <BigBtn ghost disabled>in attesa di verifica…</BigBtn>}
        {!verified && (
          <div className="linkline"><a onClick={onGotoAdmin}>▸ prototipo: apri il pannello admin per verificare</a></div>
        )}
      </div>
    </div>
  );
}

/* ---------- 7 · ACCESS GRANTED ---------- */
function GrantedScreen({ onEnter }) {
  uE(() => { const t = setTimeout(onEnter, PREFERS_REDUCED ? 300 : 2200); return () => clearTimeout(t); }, []);
  return (
    <div className="ob-screen granted-screen ob-content center">
      <MatrixRain className="ob-rain" />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="granted-check"><Icon name="check" width="46" height="46" /></div>
        <div className="granted-badge">ACCESS<br />GRANTED</div>
        <div className="granted-sub">conto verificato · <b>benvenuto nella rete</b></div>
      </div>
    </div>
  );
}

/* ---------- 8 · PLATFORM STUB ---------- */
function PlatformScreen({ user }) {
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="ob-logo">{LOGO_SM}</div>
          <span className="pill live"><span className="ld" /> ONLINE</span>
        </div>
        <div className="ob-eyebrow" style={{ marginTop: 18 }}>// home · {user.username}</div>
        <h1 className="ob-h sm">SISTEMA ONLINE.</h1>
        <div className="ob-sub">Sei dentro. Ecco cosa ti aspetta nella rete HTT.</div>
        <a className="home-card" href="HTT-Platform.html" style={{ display: 'block', textDecoration: 'none' }}>
          <div className="hl">modulo 03 · in evidenza</div>
          <div className="ht">SFIDA LIVE 1v1 →</div>
          <div className="ob-sub" style={{ marginTop: 6 }}>Affronta un altro trader in tempo reale sul conto demo.</div>
        </a>
        <div className="steps" style={{ marginTop: 14 }}>
          <div className="step"><div className="num"><Icon name="rank" width="16" height="16" /></div><div className="t">Classifica globale <span>· scala le posizioni</span></div></div>
          <div className="step"><div className="num"><Icon name="signal" width="16" height="16" /></div><div className="t">Segnali AI <span>· decodifica il mercato</span></div></div>
        </div>
      </div>
      <nav className="ob-bnav">
        <div className="it"><Icon name="chat" /> Chat</div>
        <div className="it active"><Icon name="sfide" /> Sfide</div>
        <div className="it"><Icon name="rank" /> Class.</div>
        <div className="it"><Icon name="signal" /> Segnali</div>
        <div className="it"><Icon name="user" /> Profilo</div>
      </nav>
    </div>
  );
}

Object.assign(window, {
  BootScreen, RegisterScreen, AvatradeScreen, AvatradeIdScreen,
  VerifyingScreen, PendingScreen, GrantedScreen, PlatformScreen, AVATRADE_AFFILIATE_LINK,
});
