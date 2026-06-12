/* ============================================================
   HTT — MARKET RAIN (Modulo I)
   Numeri singoli che cadono: ~70% verdi (positivi / cifre alte),
   ~30% rossi col meno. Teste brillanti. Canvas a bassa opacità.
   Uso: <canvas data-market-rain></canvas>  (auto-mount)
   oppure window.HTTMarketRain.mount(canvas, opts)
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mount(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var fs = opts.fontSize || 16;          // dimensione glifo
    var colW = fs * 1.9;                   // i numeri col meno sono larghi
    var speed = opts.speed || 1;
    var drops = [], W, H, cols = 0;

    /* una "goccia" = colonna con testa che cade; ogni cella è un numero */
    function newDrop(i, randomY) {
      var green = Math.random() < 0.7;     // ~70% verde
      return {
        x: i * colW,
        y: randomY ? Math.random() * -60 : Math.random() * -14,
        green: green,
        v: speed * (0.45 + Math.random() * 0.75),
        trail: 6 + ((Math.random() * 10) | 0)
      };
    }

    function size() {
      var r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, r.width || window.innerWidth);
      H = canvas.height = Math.max(1, r.height || window.innerHeight);
      cols = Math.ceil(W / colW);
      drops = [];
      for (var i = 0; i < cols; i++) drops[i] = newDrop(i, true);
    }
    size();
    window.addEventListener('resize', size);

    /* numero per una cella: verde = positivo / cifre alte; rosso = negativo */
    function glyph(green) {
      if (green) {
        // cifre alte più probabili (5-9), a volte con segno +
        var d = Math.random() < 0.72 ? (5 + ((Math.random() * 5) | 0)) : ((Math.random() * 10) | 0);
        return Math.random() < 0.22 ? '+' + d : '' + d;
      }
      return '-' + ((Math.random() * 10) | 0);   // sempre col meno
    }

    function draw() {
      ctx.fillStyle = 'rgba(13,13,13,0.18)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = fs + 'px JetBrains Mono, monospace';
      for (var i = 0; i < cols; i++) {
        var d = drops[i];
        var y = d.y * fs;
        // testa brillante
        ctx.fillStyle = d.green ? '#d8ffe4' : '#ff9eb3';
        ctx.fillText(glyph(d.green), d.x, y);
        // scia (un glifo più tenue subito dietro: il resto resta come persistenza)
        ctx.fillStyle = d.green ? '#00FF41' : '#FF0033';
        ctx.fillText(glyph(d.green), d.x, y - fs);

        if (y > H + d.trail * fs && Math.random() > 0.965) drops[i] = newDrop(i, false);
        else d.y += d.v;
      }
    }

    if (reduce) { draw(); return; }
    (function loop() { draw(); setTimeout(function () { requestAnimationFrame(loop); }, 60); })();
  }

  function boot() {
    var list = document.querySelectorAll('[data-market-rain]');
    for (var i = 0; i < list.length; i++) {
      mount(list[i], {
        fontSize: parseInt(list[i].getAttribute('data-fs') || '16', 10),
        speed: parseFloat(list[i].getAttribute('data-speed') || '1')
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.HTTMarketRain = { mount: mount };
})();
