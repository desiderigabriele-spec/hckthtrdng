/* ============================================================
   HTT — Admin panel (role-gated, terminal table)
   ============================================================ */
function AdminPanel({ users, onVerify, onReject, currentUserId }) {
  const total = users.length;
  const verified = users.filter(u => u.status === 'verified').length;
  const pending = users.filter(u => u.status === 'pending').length;

  function fmt(d) {
    try {
      return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
        ' ' + new Date(d).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return '—'; }
  }

  return (
    <div className="admin-win">
      <div className="admin-bar">
        <div className="dot-row"><span className="dot r" /><span className="dot a" /><span className="dot g" /></div>
        <div className="url">htt://<b>admin/verifiche</b></div>
        <span className="role"><Icon name="shield" width="13" height="13" /> ruolo: admin</span>
      </div>
      <div className="admin-body">
        <div className="admin-head">
          <div>
            <h2>Pannello Verifiche</h2>
            <div className="sub">// approva i nuovi accessi · conferma deposito AvaTrade</div>
          </div>
          <span className="pill live"><span className="ld" /> RLS ATTIVO</span>
        </div>

        <div className="counters">
          <div className="counter"><div className="v">{total}</div><div className="k">utenti totali</div></div>
          <div className="counter green"><div className="v">{verified}</div><div className="k">verificati</div></div>
          <div className="counter amber"><div className="v">{pending}</div><div className="k">in attesa</div></div>
        </div>

        <div className="tbl">
          <div className="thead">
            <span>username</span><span>email</span><span>avatrade_id</span><span>registrazione</span><span>stato</span><span>azioni</span>
          </div>
          {users.length === 0 && <div className="admin-empty">nessun utente in coda</div>}
          {users.map(u => (
            <div className="trow" key={u.id}>
              <span className="u">
                {u.id === currentUserId ? <span className="me">▸ </span> : ''}{u.username}
              </span>
              <span>{u.email}</span>
              <span className="id">{u.avatrade_id}</span>
              <span>{fmt(u.createdAt)}</span>
              <span>
                {u.status === 'verified'
                  ? <span className="st verified"><span className="d" /> verificato</span>
                  : <span className="st pending"><span className="d" /> in attesa</span>}
              </span>
              <span className="acts">
                {u.status === 'verified'
                  ? <button className="abtn done">✓ confermato</button>
                  : <>
                      <button className="abtn verify" onClick={() => onVerify(u.id)}>verifica</button>
                      <button className="abtn reject" onClick={() => onReject(u.id)}>rifiuta</button>
                    </>}
              </span>
            </div>
          ))}
        </div>

        <div className="gate">
          <Icon name="lock" width="11" height="11" style={{ verticalAlign: '-1px', marginRight: 5 }} />
          Rotta protetta · accessibile solo con <b>ruolo = 'admin'</b>. La verifica imposta
          <b> avatrade_verified = true</b> e <b> deposito_confermato_at = now()</b>. Un utente non verificato
          non vede chat, sfide o segnali (RLS lato Supabase + guard lato frontend).
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminPanel });
