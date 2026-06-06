/* ============================================================
   Brian Selzer — app.js
   Nav behavior · mobile menu · scroll reveals · resonant signal graphic
   No dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Nav: scrolled state ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
    document.querySelectorAll('.nav__menu a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });
  }

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  function reveal(el) {
    if (el.classList.contains('is-in')) return;
    var d = el.getAttribute('data-delay');
    if (d) el.style.transitionDelay = d + 'ms';
    el.classList.add('is-in');
    // Inline styles win over any stylesheet rule (no !important needed).
    el.style.opacity = '1';
    el.style.transform = 'none';
  }
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // Failsafe: never leave content hidden if the observer never fires.
    setTimeout(function () {
      reveals.forEach(reveal);
    }, 1600);
  } else {
    reveals.forEach(reveal);
  }

  /* ---------- Footer year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ============================================================
     Resonant Signal — animated hero graphic
     A Lissajous curve (3:2) inside concentric participation orbits,
     with dots that travel the curve. Teal + coral on navy.
     Renders into <svg id="signal"> if present.
     ============================================================ */
  var svg = document.getElementById('signal');
  if (svg) {
    var SVGNS = 'http://www.w3.org/2000/svg';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var size = 200, c = size / 2, R = 86;

    function el(name, attrs) {
      var n = document.createElementNS(SVGNS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }

    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);

    // concentric orbits
    var orbits = [86, 66, 46, 26];
    orbits.forEach(function (r, i) {
      svg.appendChild(el('circle', {
        cx: c, cy: c, r: r, fill: 'none',
        stroke: '#233a52', 'stroke-width': i === 0 ? 1 : 0.8,
        opacity: 0.85 - i * 0.12
      }));
    });

    // radial tick marks (signal spokes) — 24 ticks
    for (var t = 0; t < 24; t++) {
      var a = (t / 24) * Math.PI * 2;
      var inner = R - 5, outer = R;
      svg.appendChild(el('line', {
        x1: c + Math.cos(a) * inner, y1: c + Math.sin(a) * inner,
        x2: c + Math.cos(a) * outer, y2: c + Math.sin(a) * outer,
        stroke: t % 6 === 0 ? '#1AB5B5' : '#2d4865',
        'stroke-width': t % 6 === 0 ? 1.4 : 0.8
      }));
    }

    // Lissajous path (x: sin(3t+phase), y: sin(2t))
    var A = 62, B = 62, fx = 3, fy = 2;
    function liss(phase, steps) {
      var d = '';
      for (var i = 0; i <= steps; i++) {
        var tt = (i / steps) * Math.PI * 2;
        var x = c + A * Math.sin(fx * tt + phase);
        var y = c + B * Math.sin(fy * tt);
        d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
      }
      return d + 'Z';
    }

    var curve = el('path', {
      d: liss(Math.PI / 2, 240), fill: 'none',
      stroke: '#1AB5B5', 'stroke-width': 1.4, opacity: 0.92,
      'stroke-linejoin': 'round'
    });
    svg.appendChild(curve);

    var curve2 = el('path', {
      d: liss(Math.PI / 2, 240), fill: 'none',
      stroke: '#F4745A', 'stroke-width': 1, opacity: 0.4,
      'stroke-linejoin': 'round'
    });
    svg.appendChild(curve2);

    // center node
    svg.appendChild(el('circle', { cx: c, cy: c, r: 3, fill: '#FAFAF8' }));

    // travelling dots
    var dotTeal = el('circle', { r: 3.4, fill: '#5BD1D1' });
    var dotCoral = el('circle', { r: 2.6, fill: '#F4745A' });
    svg.appendChild(dotTeal); svg.appendChild(dotCoral);

    // orbiting participation dots
    var orbDots = [];
    [[86, '#1AB5B5', 0], [66, '#F4745A', 2], [46, '#5BD1D1', 4]].forEach(function (o) {
      var dot = el('circle', { r: 2.2, fill: o[1] });
      svg.appendChild(dot);
      orbDots.push({ node: dot, r: o[0], off: o[2] });
    });

    function place(node, phase, ampPhase) {
      var x = c + A * Math.sin(fx * phase + (ampPhase || 0));
      var y = c + B * Math.sin(fy * phase);
      node.setAttribute('cx', x.toFixed(2));
      node.setAttribute('cy', y.toFixed(2));
    }

    if (reduce) {
      place(dotTeal, Math.PI * 0.5, Math.PI / 2);
      place(dotCoral, Math.PI * 1.2, Math.PI / 2);
      orbDots.forEach(function (o) {
        o.node.setAttribute('cx', c + Math.cos(o.off) * o.r);
        o.node.setAttribute('cy', c + Math.sin(o.off) * o.r);
      });
    } else {
      var start = null;
      function frame(ts) {
        if (start === null) start = ts;
        var elapsed = (ts - start) / 1000;
        var p1 = (elapsed * 0.34) % 1 * Math.PI * 2;
        var p2 = (elapsed * 0.34 + 0.5) % 1 * Math.PI * 2;
        place(dotTeal, p1, Math.PI / 2);
        place(dotCoral, p2, Math.PI / 2);

        // slowly rotate the coral curve phase for a living "interference" feel
        var ph = Math.PI / 2 + Math.sin(elapsed * 0.18) * 0.5;
        curve2.setAttribute('d', liss(ph, 240));

        orbDots.forEach(function (o, i) {
          var sp = 0.5 - i * 0.12;
          var ang = o.off + elapsed * sp;
          o.node.setAttribute('cx', (c + Math.cos(ang) * o.r).toFixed(2));
          o.node.setAttribute('cy', (c + Math.sin(ang) * o.r).toFixed(2));
        });

        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  }
})();
