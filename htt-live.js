/* ============================================================
   HTT — LIVE runtime (Moduli A + B)
   gating pubblico/affiliato · sim sfida · feed · chat · reazioni
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* ---------------- GATING (Modulo B) ---------------- */
  var MODE_KEY = 'htt-live-mode';
  var mode = localStorage.getItem(MODE_KEY) || 'public';

  function setMode(m) {
    mode = m;
    localStorage.setItem(MODE_KEY, m);
    document.body.classList.toggle('mode-public', m === 'public');
    document.body.classList.toggle('mode-affiliate', m === 'affiliate');
    $all('.lv-mode button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-mode') === m);
    });
    var lvl = $('#gate-lvl'), desc = $('#gate-desc');
    if (m === 'affiliate') {
      lvl.textContent = 'LIVELLO: AFFILIATO';
      desc.textContent = 'conto verificato col link HTT — accesso live generale: tutte le dirette, in tempo reale.';
    } else {
      lvl.textContent = 'LIVELLO: PUBBLICO';
      desc.textContent = 'vedi profili, classifiche e operazioni CHIUSE (in ritardo). Le live in tempo reale sono per gli affiliati.';
    }
  }

  /* ---------------- SIM SFIDA (Modulo A) ---------------- */
  var st = {
    a: { name: 'NEØN_WOLF', pips: 312.4, disp: 312.4 },
    b: { name: 'V0ID_RUNNER', pips: 286.1, disp: 286.1 },
    remaining: 14 * 3600 + 23 * 60 + 41,
    viewers: 1284
  };

  function fmtClock(s) {
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return p(h) + ':' + p(m) + ':' + p(ss);
  }

  function render() {
    $('#pips-a').textContent = st.a.disp.toFixed(1);
    $('#pips-b').textContent = st.b.disp.toFixed(1);
    var tot = st.a.disp + st.b.disp, ra = tot ? st.a.disp / tot : 0.5;
    $('#bar-a').style.width = (ra * 100).toFixed(1) + '%';
    $('#pct-a').textContent = st.a.name + ' · ' + (ra * 100).toFixed(0) + '%';
    $('#pct-b').textContent = ((1 - ra) * 100).toFixed(0) + '% · ' + st.b.name;
    var aLead = st.a.disp >= st.b.disp;
    $('#flag-a').classList.toggle('on', aLead);
    $('#flag-b').classList.toggle('on', !aLead);
  }

  /* ---------------- FEED operazioni ---------------- */
  var feedLiveQueue = [];   // le operazioni live confluiscono qui; il pubblico le vede "chiuse, in ritardo"

  function pushRow(feed, html, max) {
    var d = document.createElement('div');
    d.innerHTML = html;
    feed.insertBefore(d, feed.firstChild);
    while (feed.children.length > (max || 7)) feed.removeChild(feed.lastChild);
  }

  function nowLabel(offsetMin) {
    var t = st.remaining - (offsetMin || 0) * 60;
    return fmtClock(Math.max(0, t)).slice(0, 5);
  }

  function tickEvent() {
    var who = Math.random() > 0.5 ? st.a : st.b;
    var win = Math.random() > 0.36;
    var d = Math.random() * 4.5 + 0.6;
    if (who === st.a) st.a.pips += win ? d : -d * 0.5; else st.b.pips += win ? d : -d * 0.5;
    var dir = Math.random() > 0.5 ? 'BUY' : 'SELL';
    var res = win ? '<b class="gn">+' + d.toFixed(1) + '</b>' : '<b class="rd">-' + (d * 0.5).toFixed(1) + '</b>';
    var live = '<span class="t">' + nowLabel(0) + '</span>  ' + who.name + '  ' + dir + ' XAU/USD  ' + res + ' pips';
    var feedLive = $('#feed-live');
    if (feedLive) pushRow(feedLive, live);
    // il pubblico vede la stessa operazione, ma chiusa e in ritardo
    feedLiveQueue.push('<span class="t">' + nowLabel(15) + '</span>  ' + who.name + '  ' + dir + ' XAU/USD  ' + res + ' pips <span class="late">CHIUSA · −15 MIN</span>');
  }

  function tickDelayed() {
    var feedPub = $('#feed-public');
    if (feedPub && feedLiveQueue.length) pushRow(feedPub, feedLiveQueue.shift());
  }

  /* ---------------- CHAT spettatori ---------------- */
  var chatUsers = [
    ['gold_digger_88', 'c1'], ['pipmaster', 'c2'], ['lucia.fx', 'c3'],
    ['mrk_scalper', 'c4'], ['0xfede', 'c5'], ['trader_anna', 'c1'],
    ['wolf_pack_it', 'c5'], ['santino_m', 'c3'], ['kry_pto', 'c4']
  ];
  var chatLines = [
    'che entrata su XAU 🔥', 'sta gestendo il drawdown benissimo',
    'forza wolf!!', 'V0ID sta rimontando occhio',
    'qualcuno ha visto lo stop? strettissimo', 'sto imparando più qui che in 3 corsi',
    'sl sempre piazzato, questo è il modo', 'GG comunque vada',
    'che sangue freddo madonna', 'la equity curve di wolf è una riga dritta',
    '+12 in 20 minuti...', 'rispetto per come è uscito in pari',
    'mod: ricordate, niente spam di link', 'il timing sulle news è chirurgico'
  ];
  function pushChat(html) {
    var feed = $('#chatfeed');
    var d = document.createElement('div');
    d.className = 'm'; d.innerHTML = html;
    feed.appendChild(d);
    while (feed.children.length > 14) feed.removeChild(feed.firstChild);
  }
  function chatTick() {
    if (Math.random() < 0.12) {
      pushChat('<span class="sys">&gt; <b>htt.mod</b> moderazione AI attiva · rispetta le regole della chat</span>');
      return;
    }
    var u = chatUsers[(Math.random() * chatUsers.length) | 0];
    var l = chatLines[(Math.random() * chatLines.length) | 0];
    pushChat('<span class="u ' + u[1] + '">' + u[0] + '</span> <span class="txt">' + l + '</span>');
  }

  function sendChat() {
    if (mode !== 'affiliate') return;
    var f = $('#chat-field');
    var v = (f.value || '').trim();
    if (!v) return;
    var esc = v.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    pushChat('<span class="u c5">tu</span> <span class="txt">' + esc + '</span>');
    f.value = '';
  }

  /* ---------------- REAZIONI volanti ---------------- */
  function fly(emoji) {
    if (mode !== 'affiliate') return;
    st.viewers += 1;
    var zone = $('#flyzone');
    var s = document.createElement('span');
    s.className = 'fly';
    s.textContent = emoji;
    s.style.left = (12 + Math.random() * 70) + '%';
    s.style.setProperty('--dx', ((Math.random() - 0.5) * 50).toFixed(0) + 'px');
    zone.appendChild(s);
    setTimeout(function () { s.remove(); }, 2700);
  }

  /* ---------------- BOOT ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    setMode(mode);
    $all('.lv-mode button').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });
    var cta = $('#gate-cta');
    if (cta) cta.addEventListener('click', function () { setMode('affiliate'); });
    var lockCta = $('#lock-cta');
    if (lockCta) lockCta.addEventListener('click', function () { setMode('affiliate'); });

    $all('.react-row [data-emoji]').forEach(function (b) {
      b.addEventListener('click', function () { fly(b.getAttribute('data-emoji')); });
    });
    var supp = $('#supp-btn');
    if (supp) supp.addEventListener('click', function () {
      fly('💚');
      pushChat('<span class="sys">&gt; <b>tu</b> hai supportato NEØN_WOLF</span>');
    });
    $('#chat-send').addEventListener('click', sendChat);
    $('#chat-field').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendChat(); });

    // primi contenuti
    render();
    tickEvent(); tickEvent(); tickEvent();
    tickDelayed(); tickDelayed();
    chatTick(); chatTick(); chatTick(); chatTick(); chatTick();
    $('#clock').textContent = fmtClock(st.remaining);
    $('#viewers').textContent = st.viewers.toLocaleString('it-IT');

    if (reduce) return;
    setInterval(function () {
      st.a.disp += (st.a.pips - st.a.disp) * 0.12;
      st.b.disp += (st.b.pips - st.b.disp) * 0.12;
      render();
    }, 60);
    setInterval(tickEvent, 2600);
    setInterval(tickDelayed, 3400);
    setInterval(chatTick, 2100);
    setInterval(function () {
      st.a.pips += (Math.random() - 0.42) * 0.8;
      st.b.pips += (Math.random() - 0.42) * 0.8;
    }, 900);
    setInterval(function () {
      if (st.remaining > 0) st.remaining--;
      $('#clock').textContent = fmtClock(st.remaining);
      if (Math.random() < 0.3) {
        st.viewers += (Math.random() < 0.62 ? 1 : -1) * ((Math.random() * 4) | 0);
        $('#viewers').textContent = st.viewers.toLocaleString('it-IT');
      }
    }, 1000);
  });
})();
