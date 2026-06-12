/* ============================================================
   HTT — SEGNALI (feed + filtri + card + dettaglio + creazione)
   ============================================================ */

function fmtNum(n) {
  if (typeof n !== 'number') return n;
  if (n >= 1000) return n.toLocaleString('it-IT', { maximumFractionDigits: 2 });
  return n.toString();
}

/* ---------- SIGNAL CARD (riusata in feed, preview, dettaglio) ---------- */
function SignalCard({ sig, onOpen, onAuthor, preview }) {
  const author = PD.trader(sig.authorId) || { username: 'TU', rank: PD.trader(PD.ME_ID) ? PD.trader(PD.ME_ID).rank : '—' };
  const top = author.rank && author.rank <= 5;
  const dirCls = sig.dir === 'BUY' ? 'buy' : 'sell';
  return (
    <div className={'sigcard' + (top ? ' toptrader' : '')} onClick={onOpen}>
      <div className="sig-h">
        <div className="sig-av" onClick={e => { if (onAuthor) { e.stopPropagation(); onAuthor(author.id); } }}>{PD.initials(author.username)}</div>
        <div className="sig-author">
          <div className="an">{author.username}</div>
          <div className="ar">#{author.rank} {top ? '· TOP TRADER' : ''}</div>
        </div>
        {!preview && <span className="sig-time">{PD.relTime(sig.createdAt)}</span>}
        <span className={'sig-status ' + sig.status}>{sig.status === 'open' ? 'OPEN' : sig.status === 'win' ? 'WIN' : sig.status === 'loss' ? 'LOSS' : 'CANCEL'}</span>
      </div>
      <div className="sig-body">
        <div className="sig-row1">
          <span className="sig-asset">{sig.asset}</span>
          <span className={'sig-dir ' + dirCls}>{sig.dir === 'BUY' ? '▲ BUY' : '▼ SELL'} · {sig.tf}</span>
        </div>
        <div className="sig-grid">
          <span className="k">ENTRY</span><span className="v">{fmtNum(sig.entryMin)} — {fmtNum(sig.entryMax)}</span>
          <span className="k">TP</span>
          <span className="v"><span className="sig-tps">{sig.tps.map((tp, i) => <span key={i} className={'tp' + (tp === 'OPEN' ? ' open' : '')}>{tp === 'OPEN' ? 'TP' + (i + 1) + ' ·' : fmtNum(tp)}</span>)}</span></span>
          <span className="k">SL</span><span className="v"><span className="sl-chip">{fmtNum(sig.sl)}</span></span>
        </div>
      </div>
      {(sig.status === 'win' || sig.status === 'loss') && !preview && (
        <div className="sig-foot">
          <span className={'res ' + sig.status}>{sig.status === 'win' ? '✓ chiuso +' + sig.resultPips + ' pips' : '✕ chiuso ' + sig.resultPips + ' pips'}</span>
          <span className="ver">✓ TRACKING VERIFICATO</span>
        </div>
      )}
    </div>
  );
}

/* ---------- FEED ---------- */
function Segnali({ onTrader, onNew, onOpenSignal }) {
  const [fState, setFState] = React.useState('all');
  const [fAsset, setFAsset] = React.useState('all');
  const [topOnly, setTopOnly] = React.useState(false);
  let list = PD.fetchSignals();
  if (fState === 'open') list = list.filter(s => s.status === 'open');
  if (fState === 'closed') list = list.filter(s => s.status === 'win' || s.status === 'loss' || s.status === 'cancelled');
  if (fAsset !== 'all') list = list.filter(s => s.asset === fAsset);
  if (topOnly) list = list.filter(s => { const a = PD.trader(s.authorId); return a && a.rank <= 10; });

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <StatusBar />
      <div className="ob-content">
        <div className="pg-top"><div className="pg-title">SEGNALI</div><span className="pill live"><span className="ld" /> {PD.fetchSignals().filter(s => s.status === 'open').length} OPEN</span></div>
        <button className="sig-newbtn" onClick={onNew}>+ nuovo segnale</button>

        <div className="sig-filters">
          {[['all', 'TUTTI'], ['open', 'OPEN'], ['closed', 'CHIUSI']].map(([k, l]) => (
            <button key={k} className={'fchip' + (fState === k ? ' on' : '')} onClick={() => setFState(k)}>{l}</button>
          ))}
          <span style={{ width: 1, background: 'var(--border)', margin: '2px 2px' }} />
          <button className={'fchip' + (topOnly ? ' on' : '')} onClick={() => setTopOnly(v => !v)}>★ SOLO TOP 10</button>
        </div>
        <div className="sig-filters" style={{ marginTop: 6 }}>
          {['all', ...PD.ASSETS].map(a => (
            <button key={a} className={'fchip' + (fAsset === a ? ' on' : '')} onClick={() => setFAsset(a)}>{a === 'all' ? 'OGNI ASSET' : a}</button>
          ))}
        </div>

        {list.length === 0
          ? <div className="empty-sig"><div className="g">⌁</div><div style={{ marginTop: 12 }}>&gt; nessun segnale con questi filtri.</div></div>
          : <div className="sig-list">{list.map(s => <SignalCard key={s.id} sig={s} onOpen={() => onOpenSignal(s.id)} onAuthor={onTrader} />)}</div>}

        <div className="disclaimer">contenuto educativo · le decisioni operative sono dell'utente</div>
      </div>
      <BottomNav active="signal" />
    </div>
  );
}

/* ---------- DETTAGLIO ---------- */
function SignalDetail({ sig, onBack, onTrader }) {
  const author = PD.trader(sig.authorId) || PD.trader(PD.ME_ID);
  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <div className="cs-h"><button className="cs-back" onClick={onBack}>‹</button><div className="cs-title">DETTAGLIO SEGNALE</div></div>
      <div className="ob-content" style={{ paddingTop: 12 }}>
        <SignalCard sig={sig} preview onOpen={() => {}} />

        <div className="cs-label">// autore</div>
        <div className="lb-row" onClick={() => onTrader(author.id)} style={{ cursor: 'pointer' }}>
          <div className="lb-av">{PD.initials(author.username)}</div>
          <div className="lb-info">
            <div className="lb-name">{author.username}</div>
            <div className="lb-sub"><span>#{author.rank} in classifica</span><span>segnali {author.signalsWin}/{author.signalsTotal} vinti</span></div>
          </div>
          <span className="lb-move eq">›</span>
        </div>

        <div className="cs-label">// storico stato</div>
        <div className="recap">
          {sig.history.map((h, i) => (
            <div className="row" key={i}><span className="k">{h[0]}</span><span className="val">{PD.relTime(h[1])}</span></div>
          ))}
        </div>

        <div className="disclaimer">contenuto educativo · le decisioni operative sono dell'utente</div>
      </div>
    </div>
  );
}

/* ---------- CREAZIONE ---------- */
function SignalCreate({ onCancel, onPublish }) {
  const [asset, setAsset] = React.useState('XAUUSD');
  const [dir, setDir] = React.useState('BUY');
  const [tf, setTf] = React.useState('H4');
  const [f, setF] = React.useState({ entryMin: '', entryMax: '', tp1: '', tp2: '', tp3: '', tp4: '', sl: '' });
  const [publishing, setPublishing] = React.useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const num = v => (v === '' || isNaN(parseFloat(v)) ? null : parseFloat(v));

  const eMin = num(f.entryMin), eMax = num(f.entryMax), sl = num(f.sl);
  const tps = [f.tp1, f.tp2, f.tp3, f.tp4].map((v, i) => v.toUpperCase() === 'OPEN' ? 'OPEN' : num(v));
  const tpsForPreview = tps.map((t, i) => t === null ? (f['tp' + (i + 1)] ? 'OPEN' : null) : t).filter(t => t !== null);

  // validazione coerenza (warn, non blocco)
  let warn = '';
  const realTps = tps.filter(t => typeof t === 'number');
  if (eMin != null && eMax != null) {
    if (dir === 'BUY') {
      if (realTps.some(t => t <= eMax)) warn = 'per un BUY i TP dovrebbero stare sopra l\'entry.';
      else if (sl != null && sl >= eMin) warn = 'per un BUY lo SL dovrebbe stare sotto l\'entry.';
    } else {
      if (realTps.some(t => t >= eMin)) warn = 'per un SELL i TP dovrebbero stare sotto l\'entry.';
      else if (sl != null && sl <= eMax) warn = 'per un SELL lo SL dovrebbe stare sopra l\'entry.';
    }
  }

  const canPublish = eMin != null && eMax != null && sl != null && tpsForPreview.length >= 1;
  const previewSig = {
    authorId: PD.ME_ID, asset, dir, tf, status: 'open', createdAt: Date.now(),
    entryMin: eMin != null ? eMin : 0, entryMax: eMax != null ? eMax : 0,
    sl: sl != null ? sl : 0, tps: tpsForPreview.length ? tpsForPreview : ['OPEN'],
  };

  function publish() {
    setPublishing(true);
    setTimeout(() => onPublish(previewSig), PREFERS_REDUCED ? 200 : 2000);
  }

  return (
    <div className="ob-screen">
      <MatrixRain className="ob-rain" />
      <div className="cs-h"><button className="cs-back" onClick={onCancel}>‹</button><div className="cs-title">NUOVO SEGNALE</div></div>
      <div className="ob-content" style={{ paddingTop: 10 }}>
        <div className="cs-label">// asset</div>
        <div className="cs-assets">{PD.ASSETS.map(a => <button key={a} className={'cs-pill' + (asset === a ? ' on' : '')} onClick={() => setAsset(a)}>{a}</button>)}</div>

        <div className="cs-label">// direzione</div>
        <div className="cs-dir">
          <button className={'buy' + (dir === 'BUY' ? ' on' : '')} onClick={() => setDir('BUY')}>▲ BUY</button>
          <button className={'sell' + (dir === 'SELL' ? ' on' : '')} onClick={() => setDir('SELL')}>▼ SELL</button>
        </div>

        <div className="cs-label">// timeframe</div>
        <div className="cs-assets">{PD.TFS.map(t => <button key={t} className={'cs-pill' + (tf === t ? ' on' : '')} onClick={() => setTf(t)}>{t}</button>)}</div>

        <div className="cs-label">// entry</div>
        <div className="cs-inputs">
          <div className="cs-field"><label>min</label><input value={f.entryMin} onChange={e => set('entryMin', e.target.value)} placeholder="0.0000" inputMode="decimal" /></div>
          <div className="cs-field"><label>max</label><input value={f.entryMax} onChange={e => set('entryMax', e.target.value)} placeholder="0.0000" inputMode="decimal" /></div>
        </div>

        <div className="cs-label">// take profit <span style={{ color: 'var(--text-faint)', textTransform: 'none', letterSpacing: 0 }}>· scrivi OPEN per aperto</span></div>
        <div className="cs-inputs">
          <div className="cs-field"><label>TP1</label><input value={f.tp1} onChange={e => set('tp1', e.target.value)} placeholder="0.0000" /></div>
          <div className="cs-field"><label>TP2</label><input value={f.tp2} onChange={e => set('tp2', e.target.value)} placeholder="0.0000" /></div>
          <div className="cs-field"><label>TP3</label><input value={f.tp3} onChange={e => set('tp3', e.target.value)} placeholder="0.0000" /></div>
          <div className="cs-field"><label>TP4</label><input value={f.tp4} onChange={e => set('tp4', e.target.value)} placeholder="OPEN" /></div>
        </div>

        <div className="cs-label">// stop loss</div>
        <div className="cs-field"><input value={f.sl} onChange={e => set('sl', e.target.value)} placeholder="0.0000" inputMode="decimal" /></div>

        {warn && <div className="cs-warn"><Icon name="bolt" width="13" height="13" />&gt; attenzione: {warn}</div>}

        <div className="cs-preview-lbl">anteprima live</div>
        <SignalCard sig={previewSig} preview onOpen={() => {}} />

        <div style={{ marginTop: 18 }}>
          <BigBtn icon="signal" disabled={!canPublish} onClick={publish}>pubblica segnale</BigBtn>
        </div>
        <div className="disclaimer">contenuto educativo · le decisioni operative sono dell'utente</div>
      </div>

      {publishing && (
        <div className="sig-launch">
          <div className="g" style={{ color: 'var(--terminal-green)', filter: 'drop-shadow(0 0 12px rgba(0,255,65,.5))' }}><Icon name="signal" width="48" height="48" /></div>
          <TypeLines speed={16} className="lines" lines={[
            { plain: '> firma segnale...', html: '<span class="dim">&gt; firma segnale...</span>', pause: 150 },
            { plain: '> tracking prezzi: attivo', html: '<span class="dim">&gt; tracking prezzi:</span> <b>attivo</b>', pause: 150 },
            { plain: '> segnale trasmesso alla rete.', html: '<b>&gt; segnale trasmesso alla rete.</b>', pause: 120 },
          ]} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Segnali, SignalCard, SignalDetail, SignalCreate });
