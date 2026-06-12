/* ============================================================
   HTT — Chat screen (per l'app unificata)
   Stessa ChatApp dello standalone, ma senza shell/render/BottomNav:
   usa la BottomNav globale del router.
   ============================================================ */
(function () {
  const { useState: cS, useEffect: cE, useRef: cR } = React;

  function highlight(text) {
    const parts = [];
    const re = /(@[A-Za-z0-9_Ø]+|\b(?:XAUUSD|EURUSD|GBPUSD|BTCUSD|US30|USOIL)\b)/g;
    let last = 0, mtc;
    while ((mtc = re.exec(text)) !== null) {
      if (mtc.index > last) parts.push(text.slice(last, mtc.index));
      const tok = mtc[0];
      parts.push(React.createElement('span', { key: mtc.index, className: tok[0] === '@' ? 'mention' : 'ticker' }, tok));
      last = mtc.index + tok.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  function Message({ msg }) {
    if (msg.system) {
      return (
        <div className={'cmsg system' + (msg.warn ? ' warn' : '')}>
          <div className="sys-h">{msg.warn ? '⚠ moderazione ai' : '› system'}</div>
          <div className="txt">{msg.text}</div>
        </div>
      );
    }
    const a = CHAT.authorMeta(msg.author);
    const isMe = msg.author === CHAT.ME;
    const top = !!(a.rank && a.rank <= 5);
    return (
      <div className={'cmsg' + (isMe ? ' me' : '')}>
        <div className="meta">
          <span className="t">{CHAT.relTime(msg.at)}</span>
          <span className={'un' + (isMe ? ' me' : '')} style={!isMe ? { color: top ? 'var(--amber)' : 'var(--text-primary)' } : null}>{a.username}</span>
          {top && <span className="rkbadge top">#{a.rank}</span>}
          {!top && a.rank <= 12 && <span className="rkbadge">#{a.rank}</span>}
        </div>
        <div className="txt">{highlight(msg.text)}</div>
      </div>
    );
  }

  function ChatApp() {
    const [chan, setChan] = cS('general');
    const [msgsByChan, setMsgs] = cS(() => { const o = {}; CHAT.CHANNELS.forEach(c => { o[c.id] = CHAT.seedFor(c.id); }); return o; });
    const [text, setText] = cS('');
    const [flag, setFlag] = cS(null);
    const [focus, setFocus] = cS(false);
    const [typer, setTyper] = cS(null);
    const feedRef = cR(null);
    const incomingIdx = cR({});
    const msgs = msgsByChan[chan] || [];

    cE(() => { const el = feedRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs.length, chan, typer]);

    cE(() => {
      if (PREFERS_REDUCED) return;
      let alive = true;
      function loop() {
        if (!alive) return;
        const pool = CHAT.incomingFor(chan);
        if (pool.length) {
          const i = (incomingIdx.current[chan] || 0) % pool.length;
          incomingIdx.current[chan] = i + 1;
          const who = CHAT.authorMeta(pool[i][0]).username;
          setTyper(who);
          setTimeout(() => {
            if (!alive) return;
            setTyper(null);
            const [auth, body] = pool[i];
            setMsgs(prev => ({ ...prev, [chan]: [...prev[chan], { id: 'in_' + Date.now(), author: auth, text: body, at: Date.now() }] }));
          }, 1500);
        }
      }
      const iv = setInterval(loop, 6500);
      return () => { alive = false; clearInterval(iv); };
    }, [chan]);

    function send() {
      const t = text.trim();
      if (!t) return;
      const verdict = CHAT.moderate(t);
      if (!verdict.ok) {
        setFlag(verdict.reason);
        setMsgs(prev => ({ ...prev, [chan]: [...prev[chan], { id: 'mod_' + Date.now(), system: true, warn: true, text: 'messaggio trattenuto — ' + verdict.reason, at: Date.now() }] }));
        setText(''); return;
      }
      setFlag(null);
      setMsgs(prev => ({ ...prev, [chan]: [...prev[chan], { id: 'me_' + Date.now(), author: CHAT.ME, text: t, at: Date.now() }] }));
      setText('');
    }

    return (
      <div className="ob-screen">
        <StatusBar />
        <div className="chat-screen">
          <div className="chat-head">
            <div className="row1">
              <span className="chat-title">COMMUNITY</span>
              <span className="ai-pill"><span className="d" /> AI_MOD online</span>
            </div>
            <div className="channels">
              {CHAT.CHANNELS.map(c => (
                <button key={c.id} className={'chan' + (chan === c.id ? ' on' : '')} onClick={() => { setChan(c.id); setFlag(null); }}>{c.name}</button>
              ))}
            </div>
          </div>
          <div className="chat-feed" ref={feedRef}>
            {msgs.map(msg => <Message key={msg.id} msg={msg} />)}
          </div>
          <div className="typing">{typer ? <><b>{typer}</b> sta scrivendo<span className="dots"><span>.</span><span>.</span><span>.</span></span></> : ''}</div>
          <div className="chat-input">
            {flag && <div className="chat-flag"><Icon name="bolt" width="14" height="14" /><span>&gt; moderazione AI: {flag}</span></div>}
            <div className={'chat-inrow' + (focus ? ' focus' : '')}>
              <span className="pr">&gt;</span>
              <input value={text} placeholder={'scrivi in ' + (CHAT.CHANNELS.find(c => c.id === chan) || {}).name + '…'}
                onChange={e => setText(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                onKeyDown={e => { if (e.key === 'Enter') send(); }} spellCheck={false} />
              <button className="chat-send" disabled={!text.trim()} onClick={send}><Icon name="bolt" /></button>
            </div>
            <div className="chat-rules">moderazione AI attiva · niente garanzie di profitto, spam o link esterni</div>
          </div>
        </div>
        <BottomNav active="chat" />
      </div>
    );
  }

  window.ChatApp = ChatApp;
})();
