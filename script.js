(() => {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EMAIL = 'herbionixofficial@gmail.com';
  const DISCLAIMER = 'These statements have not been evaluated for clinical claims beyond traditional Ayurvedic use. Herbionix products are not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare practitioner before use.';

  const hero = document.getElementById('hero');
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  const body = document.body;
  const ORDER = ['products', 'quality', 'doctors', 'about', 'contact'];
  const LABELS = { products: 'Products', quality: 'Quality & Research', doctors: 'For Doctors', about: 'About', contact: 'Contact' };
  const panelOf = id => document.getElementById('panel-' + id);

  /* ---------- hero headline: letter-by-letter entrance ---------- */
  const h1 = hero.querySelector('h1');
  if (!RM && h1) {
    const text = h1.textContent.trim();
    h1.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = ch;
      h1.appendChild(s);
    });
  }

  /* ---------- panel furniture: progress bar + footer ---------- */
  panels.forEach(p => {
    const id = p.id.replace('panel-', '');
    const bar = document.createElement('div');
    bar.className = 'panel-progress';
    bar.setAttribute('aria-hidden', 'true');
    p.appendChild(bar);
    p._bar = bar;
    p.addEventListener('scroll', () => {
      const max = p.scrollHeight - p.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? p.scrollTop / max : 0) + ')';
    }, { passive: true });

    const inner = p.querySelector('.panel-inner');
    const foot = document.createElement('div');
    foot.className = 'panel-foot';
    const next = ORDER[(ORDER.indexOf(id) + 1) % ORDER.length];
    foot.innerHTML =
      '<div class="foot-actions">' +
        '<button type="button" class="btn btn-filled hover-target" data-open="' + next + '">Next: ' + LABELS[next].replace('&', '&amp;') + ' &rarr;</button>' +
        '<button type="button" class="btn btn-ghost hover-target" data-close>Back to home</button>' +
      '</div>' +
      '<p class="disclaimer">' + DISCLAIMER + '</p>';
    inner.appendChild(foot);
  });

  /* ---------- scroll-reveal inside panels ---------- */
  const REVEAL = '.eyebrow:not(.chapter .eyebrow), .chapter, .rule-flourish, h2, h3, .table-title, .lede, .pull-quote, .p-card, .ing-card, ' +
                 '.flow-mini-step, .value-chip, .founder-row, .tbl-wrap, .panel-inner > .note-box, .divider-block > .note-box, .foot-actions';
  const observers = new Map();
  if (!RM && 'IntersectionObserver' in window) {
    panels.forEach(p => {
      const els = Array.from(p.querySelectorAll(REVEAL)).filter(el => !el.closest('.ing-detail'));
      const counts = new Map();
      els.forEach(el => {
        el.classList.add('rv');
        const par = el.parentElement;
        const n = counts.get(par) || 0;
        counts.set(par, n + 1);
        el.style.setProperty('--d', Math.min(n, 7));
      });
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { root: p, threshold: 0.06, rootMargin: '0px 0px -5% 0px' });
      observers.set(p, { io, els });
    });
  }
  function replay(p) {
    const o = observers.get(p);
    if (!o) return;
    o.els.forEach(el => { el.classList.remove('in'); o.io.unobserve(el); });
    void p.offsetWidth;
    setTimeout(() => o.els.forEach(el => o.io.observe(el)), 180);
  }

  /* ---------- open / close with focus management ---------- */
  let current = null, lastFocus = null, pushed = false;
  panels.forEach(p => { p.inert = true; });

  function openUI(id) {
    const p = panelOf(id);
    if (!p) return;
    if (current === null) lastFocus = document.activeElement;
    panels.forEach(x => { x.inert = x !== p; x.classList.toggle('open', x === p); });
    hero.inert = true;
    body.classList.add('panel-open');
    p.scrollTop = 0;
    p._bar.style.transform = 'scaleX(0)';
    replay(p);
    current = id;
    requestAnimationFrame(() => { const c = p.querySelector('.panel-close'); if (c) c.focus({ preventScroll: true }); });
  }
  function closeUI() {
    panels.forEach(x => { x.classList.remove('open'); x.inert = true; });
    hero.inert = false;
    body.classList.remove('panel-open');
    const wasOpen = current !== null;
    current = null;
    if (wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function setHash(id, push) {
    try {
      if (push) history.pushState({ p: id }, '', '#' + id); else history.replaceState({ p: id }, '', '#' + id);
      return true;
    } catch (_) { return false; }
  }
  function openPanel(id) {
    const wasOpen = current !== null;
    openUI(id);
    const ok = setHash(id, !wasOpen);
    if (!wasOpen && ok) pushed = true;
  }
  function closePanel() {
    if (current === null) return;
    if (pushed) {
      pushed = false;
      try { history.back(); setTimeout(() => { if (current !== null) closeUI(); }, 200); return; } catch (_) {}
    }
    try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {}
    closeUI();
  }
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    if (ORDER.includes(id)) openUI(id); else closeUI();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  /* ---------- delegated clicks ---------- */
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openPanel(opener.getAttribute('data-open')); return; }
    if (e.target.closest('[data-close]')) { e.preventDefault(); closePanel(); return; }

    const tg = e.target.closest('[data-ing-toggle]');
    if (tg) {
      const card = tg.closest('.ing-card');
      const box = card.querySelector('.ing-collapse');
      const willOpen = !card.classList.contains('open');
      card.classList.toggle('open', willOpen);
      box.inert = !willOpen;
      tg.setAttribute('aria-expanded', String(willOpen));
      tg.querySelector('.lbl').textContent = willOpen ? 'Hide Ingredient Science' : 'Explore Ingredient Science';
    }
  });

  /* ---------- contact form: opens a pre-filled email ---------- */
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    const ok = form.querySelector('.form-success');
    const err = form.querySelector('.form-error');
    form.addEventListener('submit', e => {
      e.preventDefault();
      ok.style.display = 'none';
      if (!form.checkValidity()) { err.hidden = false; form.reportValidity(); return; }
      err.hidden = true;
      const f = new FormData(form);
      const name = String(f.get('name')).trim();
      const subject = encodeURIComponent('Website enquiry from ' + name);
      const text = encodeURIComponent('Name: ' + name + '\nEmail: ' + String(f.get('email')).trim() + '\n\n' + String(f.get('message')).trim());
      ok.style.display = 'block';
      window.location.href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + text;
      form.reset();
    });
  });

  /* ---------- cursor + hero parallax (one rAF loop, runs only when needed) ---------- */
  if (!RM && FINE) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let tx = -100, ty = -100, rx = -100, ry = -100, ts = 1, rs = 1, tmx = 0, tmy = 0, mx = 0, my = 0, running = false;
    const INTERACTIVE = '.hover-target, a[href], button, input, textarea, [data-ing-toggle]';

    function frame() {
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2; rs += (ts - rs) * 0.18;
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
      ring.style.setProperty('--x', rx + 'px'); ring.style.setProperty('--y', ry + 'px'); ring.style.setProperty('--s', rs.toFixed(3));
      if (!body.classList.contains('panel-open')) { hero.style.setProperty('--mx', mx.toFixed(3)); hero.style.setProperty('--my', my.toFixed(3)); }
      const settled = Math.abs(tx - rx) < 0.1 && Math.abs(ty - ry) < 0.1 && Math.abs(ts - rs) < 0.005 && Math.abs(tmx - mx) < 0.002 && Math.abs(tmy - my) < 0.002;
      if (settled) { running = false; } else { requestAnimationFrame(frame); }
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      dot.style.setProperty('--x', tx + 'px'); dot.style.setProperty('--y', ty + 'px');
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    }, { passive: true });
    document.addEventListener('mouseover', e => {
      const hit = !!e.target.closest(INTERACTIVE);
      ring.classList.toggle('hover', hit);
      ts = hit ? 1.7 : 1;
      kick();
    });
    document.addEventListener('mouseleave', () => { tx = ty = -100; kick(); });
  }

  /* ---------- deep link on load ---------- */
  const initial = location.hash.slice(1);
  if (ORDER.includes(initial)) openUI(initial);
})();
