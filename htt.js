/* ============================================================
   HACK_THE_TRADING — runtime
   matrix rain · typewriter · count-up · simulazione SFIDA LIVE
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- MATRIX RAIN ---------------- */
  function matrix(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var fs = opts.fontSize || 14, speed = opts.speed || 1, drops = [], cols = 0, W, H;
    var glyphs = 'アカサタナ0123456789ABCDEF<>{}[]/$#*+=HTT'.split('');
    function size() {
      var r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, r.width);
      H = canvas.height = Math.max(1, r.height);
      cols = Math.floor(W / fs);
      drops = [];
      for (var i = 0; i < cols; i++) drops[i] = Math.random() * -40;
    }
    size();
    window.addEventListener('resize', size);
    function draw() {
      ctx.fillStyle = 'rgba(13,13,13,0.16)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = fs + 'px JetBrains Mono, monospace';
      for (var i = 0; i < cols; i++) {
        var ch = glyphs[(Math.random() * glyphs.length) | 0];
        var x = i * fs, y = drops[i] * fs;
        ctx.fillStyle = Math.random() > 0.97 ? '#aaffcc' : '#00FF41';
        ctx.fillText(ch, x, y);
        if (y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += speed * (0.5 + Math.random() * 0.5);
      }
    }
    if (reduce) { draw(); return; }
    (function loop(){ draw(); setTimeout(function(){ requestAnimationFrame(loop); }, 55); })();
  }

  /* ---------------- TYPEWRITER ---------------- */
  function typeLines(el, lines, done) {
    if (reduce) {
      el.innerHTML = lines.map(function (l) { return l.html; }).join('<br>');
      if (done) done(); return;
    }
    var li = 0;
    function nextLine() {
      if (li >= lines.length) { if (done) done(); return; }
      var line = lines[li], span = document.createElement('div'), i = 0;
      el.appendChild(span);
      var plain = line.text;
      (function tick() {
        if (i <= plain.length) {
          span.innerHTML = esc(plain.slice(0, i)) + '<span class="cursor"></span>';
          i++;
          setTimeout(tick, line.speed || 18);
        } else {
          span.innerHTML = line.html;      // swap in styled final
          li++;
          setTimeout(nextLine, line.pause || 180);
        }
      })();
    }
    nextLine();
  }
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  /* ---------------- COUNT-UP (one-shot) ---------------- */
  function countUp(el, to, opts) {
    opts = opts || {}; var dur = opts.dur || 1100, dec = opts.dec != null ? opts.dec : 1;
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    var start = performance.now(), from = parseFloat(el.textContent) || 0;
    function step(now) {
      var t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
      el.textContent = (from + (to - from) * e).toFixed(dec);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------------- SFIDA LIVE simulation ---------------- */
  // Stato condiviso, renderizzato su DESKTOP + MOBILE in sync.
  var state = {
    a: { name: 'NEØN_WOLF', pips: 312.4, disp: 312.4 },
    b: { name: 'V0ID_RUNNER', pips: 286.1, disp: 286.1 },
    remaining: 14 * 3600 + 23 * 60 + 41   // secondi
  };

  function $all(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function setText(role, txt){ $all('[data-role="'+role+'"]').forEach(function(n){ n.textContent = txt; }); }

  function render() {
    setText('pips-a', state.a.disp.toFixed(1));
    setText('pips-b', state.b.disp.toFixed(1));
    var total = state.a.disp + state.b.disp;
    var ra = total ? state.a.disp / total : 0.5;
    $all('[data-role="bar-a"]').forEach(function(n){ n.style.width = (ra*100).toFixed(1)+'%'; });
    $all('[data-role="bar-b"]').forEach(function(n){ n.style.width = ((1-ra)*100).toFixed(1)+'%'; });
    setText('pct-a', (ra*100).toFixed(0)+'%');
    setText('pct-b', ((1-ra)*100).toFixed(0)+'%');
    // role colors are static (A=leader/green, B=challenger/amber).
    // The live "IN TESTA" flag moves to whoever is currently ahead.
    var aLead = state.a.disp >= state.b.disp;
    $all('[data-role="flag-a"]').forEach(function(n){ n.classList.toggle('on', aLead); });
    $all('[data-role="flag-b"]').forEach(function(n){ n.classList.toggle('on', !aLead); });
  }

  function fmtClock(s){
    var h = Math.floor(s/3600), m = Math.floor((s%3600)/60), ss = s%60;
    function p(n){ return (n<10?'0':'')+n; }
    return p(h)+':'+p(m)+':'+p(ss);
  }

  var feeds = [];
  function pushTick(html){
    feeds.forEach(function(feed){
      var d = document.createElement('div'); d.innerHTML = html;
      feed.insertBefore(d, feed.firstChild);
      while (feed.children.length > 6) feed.removeChild(feed.lastChild);
    });
  }
  var assets = ['XAU/USD'];
  function tickEvent(){
    var who = Math.random() > 0.5 ? state.a : state.b;
    var win = Math.random() > 0.36;
    var d = (Math.random()*4.5 + 0.6);
    if (who === state.a) state.a.pips += win ? d : -d*0.5;
    else state.b.pips += win ? d : -d*0.5;
    var dir = Math.random() > 0.5 ? 'BUY' : 'SELL';
    var t = fmtClock(state.remaining).slice(0,5);
    pushTick('<span class="t">'+t+'</span>  '+who.name+'  '+dir+' XAU/USD  ' +
      (win ? '<b class="gn">+'+d.toFixed(1)+'</b>' : '<b class="rd">-'+(d*0.5).toFixed(1)+'</b>')+' pips');
  }

  function startSim() {
    render();
    if (reduce) return;
    // smoothing dei numeri verso il valore reale (count-up continuo)
    setInterval(function(){
      state.a.disp += (state.a.pips - state.a.disp) * 0.12;
      state.b.disp += (state.b.pips - state.b.disp) * 0.12;
      render();
    }, 60);
    // eventi di trading
    setInterval(tickEvent, 2300);
    // micro-drift continuo per "vivacità"
    setInterval(function(){
      state.a.pips += (Math.random()-0.42)*0.8;
      state.b.pips += (Math.random()-0.42)*0.8;
    }, 900);
    // countdown
    setInterval(function(){
      if (state.remaining > 0) state.remaining--;
      setText('clock', fmtClock(state.remaining));
    }, 1000);
    setText('clock', fmtClock(state.remaining));
    // primi tick di esempio
    tickEvent(); tickEvent(); tickEvent();
  }

  /* ---------------- BOOT ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var gm = document.getElementById('matrix');
    if (gm) matrix(gm, { fontSize: 15, speed: 1 });
    $all('.rain-bg').forEach(function(c){ matrix(c, { fontSize: 13, speed: 0.9 }); });

    var boot = document.getElementById('bootlines');
    if (boot) {
      typeLines(boot, [
        { text: '> init htt.core --module=design-system', html: '<span class="dim">&gt; init htt.core --module=design-system</span>' },
        { text: '> connessione neurale .......... OK', html: '<span class="dim">&gt; connessione neurale ..........</span> <b class="ok">OK</b>', pause: 90 },
        { text: '> palette / type / motion ...... LOCKED', html: '<span class="dim">&gt; palette / type / motion ......</span> <b class="ok">LOCKED</b>', pause: 90 },
        { text: '> sistema online. decode the market.', html: '<b>&gt; sistema online.</b> <span class="dim">decode the market.</span>' }
      ]);
    }

    // count-up dei numeri statici al primo caricamento
    $all('[data-countup]').forEach(function(el){
      var to = parseFloat(el.getAttribute('data-countup'));
      var dec = parseInt(el.getAttribute('data-dec')||'0',10);
      setTimeout(function(){ countUp(el, to, { dec: dec, dur: 1200 }); }, 400);
    });

    feeds = $all('[data-role="feed"]');
    startSim();
  });
})();
