/* ============================================================
   HTT — TRADER PROFILE overlay (collega classifica ↔ sfide ↔ segnali)
   ============================================================ */
function TraderProfile({ traderId, onClose, onSfida }) {
  const t = PD.trader(traderId);
  if (!t) return null;
  const isMe = t.id === PD.ME_ID;
  const move = t.prevRank - t.rank;
  const badges = (t.dynBadges && t.dynBadges.length ? t.dynBadges : [...t.badges, 'VERIFIED']);

  return (
    <div className="prof-overlay" onClick={onClose}>
      <div className="prof-card" onClick={e => e.stopPropagation()}>
        <button className="prof-x" onClick={onClose}>✕</button>
        <div className="prof-top">
          <div className="prof-av">{PD.initials(t.username)}</div>
          <div className="prof-name">{t.username}</div>
          <div className="prof-rank">
            #{t.rank} in classifica · {move > 0 ? '▲ +' + move : move < 0 ? '▼ ' + move : '= '} nel periodo
          </div>
          <div className="prof-badges">{badges.map((b, i) => badgeEl(b, i))}</div>
        </div>

        <div className="prof-stats">
          <div className="prof-stat"><div className="v g">{t.pips.toLocaleString('it-IT')}</div><div className="k">pips totali</div></div>
          <div className="prof-stat"><div className="v">{t.winRate}%</div><div className="k">win rate</div></div>
          <div className="prof-stat"><div className="v">{t.wins}<span style={{ color: 'var(--text-faint)', fontSize: 13 }}> / {t.losses}</span></div><div className="k">sfide V / P</div></div>
          <div className="prof-stat"><div className="v">W{t.streak}</div><div className="k">streak attuale</div></div>
          <div className="prof-stat"><div className="v">{t.signalsWin}/{t.signalsTotal}</div><div className="k">segnali vinti</div></div>
          <div className="prof-stat"><div className="v g">✓</div><div className="k">conto verificato</div></div>
        </div>

        <div className="prof-actions">
          {isMe
            ? <div className="prof-sfida" style={{ opacity: .55, boxShadow: 'none', borderColor: 'var(--border)', color: 'var(--text-dim)', cursor: 'default' }}>il tuo profilo</div>
            : <a className="prof-sfida" href={'HTT-Sfide.html'} onClick={onSfida}><Icon name="swords" width="16" height="16" /> sfida {t.username}</a>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TraderProfile });
