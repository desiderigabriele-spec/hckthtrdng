/* ============================================================
   HTT — Onboarding core atoms (shared via window)
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;
const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons ---------- */
function Icon({ name, ...p }) {
  const paths = {
    chat: <path d="M3 4h18v12H8l-4 4V4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>,
    sfide: <path d="M4 4l9 9M14 4h6v6M20 4l-7 7M4 16l5 5M9 16l-5 5M14 20h6v-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    rank: <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M5 20V11M12 20V5M19 20v-6"/><path d="M3 20h18"/></g>,
    signal: <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M7.5 7.5a6 6 0 000 9M16.5 7.5a6 6 0 010 9M4.7 4.7a10 10 0 000 14.6M19.3 4.7a10 10 0 010 14.6"/></g>,
    user: <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0114 0"/></g>,
    lock: <g fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="11" width="14" height="9" rx="1.6"/><path d="M8 11V8a4 4 0 018 0v3"/></g>,
    check: <path d="M5 12l4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>,
    shield: <path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>,
    link: <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M9 15l6-6"/><path d="M10.5 6.5l1.5-1.5a3.5 3.5 0 015 5l-2 2"/><path d="M13.5 17.5L12 19a3.5 3.5 0 01-5-5l2-2"/></g>,
    bolt: <path d="M13 2L5 13h5l-1 9 8-12h-5l1-8z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
    clock: <g fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5" strokeLinecap="round"/></g>,
    search: <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></g>,
    trophy: <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3" strokeLinecap="round"/><path d="M10 16h4M9 20h6M12 16v4"/></g>,
    target: <g fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></g>,
    users: <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0112 0"/><path d="M16 6a3 3 0 010 6M18 19a6 6 0 00-3-5.2"/></g>,
    swords: <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 3H19v4.5L9 17.5 6.5 15 14.5 3z"/><path d="M9.5 3H5v4.5l10 10L17.5 15 9.5 3z" opacity=".55"/><path d="M5 17l2 2M19 17l-2 2"/></g>,
    rematch: <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 0114-5.3L20 8M20 4v4h-4"/><path d="M20 12a8 8 0 01-14 5.3L4 16M4 20v-4h4"/></g>,
  };
  return <svg viewBox="0 0 24 24" {...p}>{paths[name]}</svg>;
}

/* ---------- matrix rain (canvas) ---------- */
function MatrixRain({ className, fontSize = 13, speed = 0.9 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const glyphs = 'アカサタナ0123456789ABCDEF<>{}[]/$#*+=HTT'.split('');
    let drops = [], cols = 0, W = 0, H = 0, raf = 0, killed = false;
    function size() {
      const r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, r.width); H = canvas.height = Math.max(1, r.height);
      cols = Math.floor(W / fontSize); drops = [];
      for (let i = 0; i < cols; i++) drops[i] = Math.random() * -40;
    }
    size(); window.addEventListener('resize', size);
    function draw() {
      ctx.fillStyle = 'rgba(13,13,13,0.16)'; ctx.fillRect(0, 0, W, H);
      ctx.font = fontSize + 'px JetBrains Mono, monospace';
      for (let i = 0; i < cols; i++) {
        const ch = glyphs[(Math.random() * glyphs.length) | 0];
        ctx.fillStyle = Math.random() > 0.97 ? '#aaffcc' : '#00FF41';
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += speed * (0.5 + Math.random() * 0.5);
      }
    }
    if (PREFERS_REDUCED) { draw(); }
    else { const loop = () => { if (killed) return; draw(); setTimeout(() => { raf = requestAnimationFrame(loop); }, 55); }; loop(); }
    return () => { killed = true; cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, [fontSize, speed]);
  return <canvas ref={ref} className={className} />;
}

/* ---------- block cursor ---------- */
function Cursor() { return <span className="cursor" style={{ display: 'inline-block', width: '0.6ch' }} />; }

/* ---------- typewriter for a set of terminal lines ----------
   lines: [{ html, plain, pause }]  -> calls onDone when finished      */
function TypeLines({ lines, speed = 16, onDone, className }) {
  const [done, setDone] = useState([]);      // finished line html
  const [cur, setCur] = useState({ i: 0, text: '' });
  const doneRef = useRef(onDone); doneRef.current = onDone;
  useEffect(() => {
    if (PREFERS_REDUCED) { setDone(lines.map(l => l.html)); doneRef.current && doneRef.current(); return; }
    let li = 0, ci = 0, t1 = 0, t2 = 0, killed = false;
    function typeChar() {
      if (killed) return;
      const line = lines[li]; const plain = line.plain;
      if (ci <= plain.length) { setCur({ i: li, text: plain.slice(0, ci) }); ci++; t1 = setTimeout(typeChar, speed); }
      else {
        setDone(d => { const n = d.slice(); n[li] = line.html; return n; });
        setCur({ i: li + 1, text: '' });
        li++; ci = 0;
        if (li < lines.length) t2 = setTimeout(typeChar, line.pause || 160);
        else doneRef.current && doneRef.current();
      }
    }
    typeChar();
    return () => { killed = true; clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className={className}>
      {lines.map((l, i) => {
        if (done[i] !== undefined) return <div className="ln" key={i} dangerouslySetInnerHTML={{ __html: done[i] }} />;
        if (i === cur.i) return <div className="ln" key={i}>{cur.text}<Cursor /></div>;
        return null;
      })}
    </div>
  );
}

/* ---------- phone frame ---------- */
function Phone({ children }) {
  return (
    <div className="phone">
      <div className="screen">
        <div className="notch" />
        {children}
      </div>
    </div>
  );
}
function StatusBar() {
  return (
    <div className="ob-statusbar">
      <span>9:41</span>
      <span className="r"><span className="green">●</span> HTT_NET</span>
    </div>
  );
}

/* ---------- terminal field ---------- */
function TField({ label, prompt, value, onChange, placeholder, error, ok, type = 'text', autoFocus }) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="tfield">
      <div className="lab">{label}</div>
      <div className={'box' + (focus ? ' focus' : '') + (error ? ' err' : '')}>
        <span className="pr">{prompt}</span>
        <input
          type={type} value={value} placeholder={placeholder} autoFocus={autoFocus}
          onChange={e => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          spellCheck={false} autoComplete="off"
        />
        {focus && !value ? <Cursor /> : null}
      </div>
      <div className={'msg' + (error ? ' err' : ok ? ' ok' : '')}>{error || ok || ''}</div>
    </div>
  );
}

/* ---------- big button ---------- */
function BigBtn({ children, onClick, disabled, ghost, icon }) {
  return (
    <button className={'bigbtn' + (ghost ? ' ghost' : '')} onClick={onClick} disabled={disabled}>
      {icon ? <Icon name={icon} width="17" height="17" /> : null}{children}
    </button>
  );
}

Object.assign(window, { Icon, MatrixRain, Cursor, TypeLines, Phone, StatusBar, TField, BigBtn, PREFERS_REDUCED });
