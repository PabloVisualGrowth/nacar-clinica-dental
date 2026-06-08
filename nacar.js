/* ============================================================
   NÁCAR · Clínica Dental — Interacción 2026
   ============================================================ */
(function () {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch   = matchMedia('(hover:none),(pointer:coarse)').matches;

  /* ---------- Marca: creciente de nácar ---------- */
  let markCount = 0;
  function paintMark(el) {
    const id = 'nm' + (markCount++);
    el.innerHTML =
      '<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#1E6B5E"/>' +
          '<stop offset="1" stop-color="#0F4D45"/>' +
        '</linearGradient>' +
        '<mask id="' + id + 'm">' +
          '<rect width="100" height="100" fill="#fff"/>' +
          '<circle cx="50" cy="33" r="41" fill="#000"/>' +
        '</mask>' +
      '</defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#' + id + 'g)" mask="url(#' + id + 'm)"/>' +
      '<path d="M14 62 A40 40 0 0 0 86 62" fill="none" stroke="#C7A56A" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>' +
      '</svg>';
  }
  document.querySelectorAll('.mark').forEach(paintMark);

  /* ---------- Tratamientos ---------- */
  const services = [
    ['Odontología general', 'Revisiones, limpiezas y empastes. La base de una boca sana, sin dramatismos.', 'Revisión gratuita'],
    ['Estética dental & carillas', 'Diseño de sonrisa y carillas que parecen tuyas de toda la vida. Natural, nunca de anuncio.', 'Diseño en 3D'],
    ['Ortodoncia invisible', 'Alineadores transparentes que casi nadie nota. Endereza tu sonrisa sin que se entere el mundo.', 'Desde 49 €/mes'],
    ['Implantes', 'Reponemos dientes con cirugía guiada por ordenador. Comer y reír como antes, con total seguridad.', 'Cirugía guiada'],
    ['Endodoncia microscópica', 'Tratamos el nervio con aumento real al microscopio. Más precisión, menos molestias, sin repeticiones.', 'Microscopio 20×'],
    ['Periodoncia', 'Cuidamos lo que no se ve: las encías. Frenamos la enfermedad antes de que cueste un diente.', 'Sin cirugía siempre que se pueda'],
    ['Odontopediatría', 'Primeras visitas que no dan miedo. Que tus hijos crezcan sin asociar el dentista al susto.', 'Sala pensada para peques'],
    ['Blanqueamiento', 'Recupera el blanco natural de tu esmalte. Sin agresiones y con resultados visibles desde la primera sesión.', 'Resultado visible']
  ];
  const list = document.getElementById('servList');
  if (list) {
    services.forEach(function (s, i) {
      const row = document.createElement('div');
      row.className = 'serv-row reveal';
      row.innerHTML =
        '<span class="idx">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div class="main"><h3>' + s[0] + '</h3><div class="desc">' + s[1] + '</div></div>' +
        '<span class="meta">' + s[2] + '</span>';
      list.appendChild(row);
    });
  }

  /* ---------- LOADER ---------- */
  const preload = document.getElementById('preload');
  if (preload && !reduced) {
    const fill = preload.querySelector('.pbar i');
    const pct  = preload.querySelector('.pct');
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + (8 + Math.random() * 14));
      if (fill) fill.style.width = p + '%';
      if (pct) pct.textContent = String(Math.floor(p)).padStart(3, '0');
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => preload.classList.add('done'), 280);
      }
    }, 110);
  } else if (preload) {
    preload.classList.add('done');
  }

  /* ---------- WORD STAGGER on big titles ---------- */
  // Walks child nodes so inline tags (<span class="it">) and <br> are preserved.
  function makeWord(content, isEl) {
    const outer = document.createElement('span');
    outer.className = 'split-word';
    const inner = document.createElement('span');
    inner.className = 'w';
    if (isEl) inner.appendChild(content); else inner.textContent = content;
    outer.appendChild(inner);
    return outer;
  }
  function splitWords(el) {
    if (el.dataset.split === '1') return;
    el.dataset.split = '1';
    const nodes = Array.prototype.slice.call(el.childNodes);
    const frag = document.createDocumentFragment();
    nodes.forEach(node => {
      if (node.nodeType === 3) {                 // text node → split into words
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach(tok => {
          if (tok === '') return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          frag.appendChild(makeWord(tok, false));
        });
      } else if (node.nodeName === 'BR') {        // keep line breaks
        frag.appendChild(node.cloneNode());
      } else {                                    // inline element → animate as one unit, keep styling
        frag.appendChild(makeWord(node.cloneNode(true), true));
      }
    });
    el.innerHTML = '';
    el.appendChild(frag);
    el.classList.add('split-host');
  }
  if (!reduced) {
    document.querySelectorAll('.display, .h-xl, .hero h1, .chero h1').forEach(splitWords);
  }

  /* ---------- REVEAL on scroll (IntersectionObserver) ---------- */
  const revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .reveal-img, .split-host'));
  function fireReveal(el) {
    el.classList.add('in');
    if (el.classList.contains('split-host')) {
      el.querySelectorAll('.split-word').forEach((w, i) => {
        w.style.transitionDelay = (40 + i * 55) + 'ms';
        w.classList.add('in');
      });
    }
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { fireReveal(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(fireReveal);
  }
  // failsafe
  setTimeout(() => revealEls.forEach(el => { if (!el.classList.contains('in')) fireReveal(el); }), 3200);

  /* ---------- LENIS smooth scroll ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // anchor smoothing
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -40, duration: 1.4 });
        }
      });
    });
  }

  /* ---------- SECTION TICK list (build before onScroll) ---------- */
  const sectionTick = document.querySelector('.section-tick');
  let lastTickLabel = '';
  const sectionList = [];
  if (sectionTick) {
    document.querySelectorAll('[data-tick]').forEach(s => {
      sectionList.push({ el: s, label: s.dataset.tick, dark: s.dataset.tickDark === '1' });
    });
  }

  /* ---------- NAV state + scroll progress + parallax ---------- */
  const nav = document.getElementById('nav');
  const prog = document.querySelector('.sc-prog i');
  const parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (nav) {
      if (y > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    }
    if (prog) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.12)';
    });
    // section tick: which beat are we on
    if (sectionTick && sectionList.length) {
      let current = sectionList[0];
      for (const s of sectionList) {
        if (s.el.getBoundingClientRect().top < window.innerHeight * 0.55) current = s;
      }
      if (current && current.label !== lastTickLabel) {
        sectionTick.querySelector('.lbl').textContent = current.label;
        sectionTick.classList.toggle('dark', !!current.dark);
        lastTickLabel = current.label;
      }
    }
  }
  function loop() {
    onScroll();
    if (!reduced) requestAnimationFrame(loop);
  }
  if (lenis) {
    lenis.on('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } });
  } else {
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
    }, { passive: true });
  }
  onScroll();

  /* ---------- CUSTOM CURSOR (dot + ring) ---------- */
  if (!touch && !reduced) {
    const cursor = document.createElement('div'); cursor.className = 'cursor';
    const ring   = document.createElement('div'); ring.className = 'cursor-ring';
    ring.innerHTML = '<span class="lbl">VER</span>';
    document.body.appendChild(cursor); document.body.appendChild(ring);
    document.documentElement.classList.add('cursor-on');
    let mx=0,my=0,rx=0,ry=0;
    window.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cursor.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      cursor.classList.add('on'); ring.classList.add('on');
    });
    // ring follows with easing
    function follow(){
      rx += (mx-rx) * .18;
      ry += (my-ry) * .18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    }
    follow();
    window.addEventListener('mouseleave', () => { cursor.classList.remove('on'); ring.classList.remove('on'); });
    // hover targets
    const hovTargets = 'a,button,.btn,.serv-row,.cmat-row,.tcard,.value,.cell,[data-cursor]';
    document.querySelectorAll(hovTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('hover');
        if (el.dataset.cursor) { ring.classList.add('label'); ring.querySelector('.lbl').textContent = el.dataset.cursor; }
      });
      el.addEventListener('mouseleave', () => { ring.classList.remove('hover','label'); });
    });
    // dark sections → invert cursor
    const darkObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) cursor.classList.toggle('dark', en.target.dataset.cursorDark === '1');
      });
    }, { threshold: .4 });
    document.querySelectorAll('[data-cursor-dark]').forEach(el => darkObs.observe(el));
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!touch && !reduced) {
    document.querySelectorAll('.btn, .mag').forEach(el => {
      el.classList.add('mag');
      let rect;
      el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', e => {
        if (!rect) rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width/2);
        const dy = e.clientY - (rect.top  + rect.height/2);
        el.style.transform = 'translate(' + (dx*.18).toFixed(1) + 'px,' + (dy*.28).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; rect = null; });
    });
  }

  /* ---------- Fullscreen burger menu ---------- */
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('menu');
  let menuOpen = false;
  function setMenu(open) {
    if (!menu || !burger) return;
    menuOpen = open;
    menu.classList.toggle('open', open);
    burger.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    const lbl = burger.querySelector('.burger-label');
    if (lbl) lbl.textContent = open ? 'Cerrar' : 'Menú';
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  }
  if (burger) burger.addEventListener('click', () => setMenu(!menuOpen));
  if (menu) menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) setMenu(false); });

  /* ---------- Form ---------- */
  const form = document.getElementById('bookForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = (form.querySelector('#f-name').value || '').trim();
      const phone = (form.querySelector('#f-phone').value || '').trim();
      const email = (form.querySelector('#f-email').value || '').trim();
      const serv  = form.querySelector('#f-serv').value;
      let ok = true;
      [['#f-name', name], ['#f-phone', phone], ['#f-email', email]].forEach(p => {
        const f = form.querySelector(p[0]);
        if (!p[1]) { f.style.borderColor = '#C77'; ok = false; } else { f.style.borderColor = ''; }
      });
      if (!serv) { form.querySelector('#f-serv').style.borderColor = '#C77'; ok = false; }
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { form.querySelector('#f-email').style.borderColor = '#C77'; ok = false; }
      if (!ok) return;
      const first = name.split(' ')[0] || 'gracias';
      const sname = document.getElementById('successName'); if (sname) sname.textContent = first;
      form.classList.add('sent');
      document.getElementById('formSuccess').classList.add('show');
    });
  }
  /* ---- Modal: aviso web ficticia + promo V&G ---- */
  (function () {
    const KEY     = 'nacar_disclaimer_v2';
    const overlay = document.getElementById('disc-overlay');
    if (!overlay) return;

    if (localStorage.getItem(KEY)) { overlay.classList.add('hidden'); return; }

    function close() {
      localStorage.setItem(KEY, '1');
      overlay.classList.add('hidden');
    }

    // Botón cerrar
    overlay.querySelectorAll('.disc-close').forEach(function(btn){
      btn.addEventListener('click', close);
    });

    // Clic en el fondo oscuro cierra también
    overlay.addEventListener('click', function(e){
      if (e.target === overlay) close();
    });

    // Escape cierra
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') close();
    });
  }());

})();
