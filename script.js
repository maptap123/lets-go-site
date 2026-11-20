(function () {
  var html = document.documentElement;
  html.classList.add('js');

  /* language toggle */
  var btn = document.getElementById('lang');
  function setLang(l) {
    html.lang = l === 'en' ? 'en' : 'zh-Hant';
    btn.textContent = l === 'en' ? '中文' : 'EN';
    try { localStorage.setItem('lang', l); } catch (e) {}
    countdown();
  }
  btn.addEventListener('click', function () { setLang(html.lang === 'en' ? 'zh' : 'en'); });

  /* header turns solid after scrolling */
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* scroll reveal */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* countdown to the next winter camp start */
  function countdown() {
    var el = document.getElementById('countdown');
    var now = new Date(), next = null;
    document.querySelectorAll('[data-start]').forEach(function (c) {
      var d = new Date(c.getAttribute('data-start') + 'T09:00:00+08:00');
      if (d > now && (!next || d < next)) next = d;
    });
    if (!next) { el.hidden = true; return; }
    var days = Math.ceil((next - now) / 864e5);
    el.innerHTML = html.lang === 'en'
      ? '<strong>' + days + '</strong> days until the first camp begins'
      : '距離第一梯次開營還有 <strong>' + days + '</strong> 天';
    el.hidden = false;
  }

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'zh');
})();

/* Meta Pixel events — does not alter navigation */
(function () {
  function track(name) {
    try {
      if (typeof window.fbq === 'function') window.fbq('track', name);
    } catch (e) {}
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (!t) return;
    if (t.nodeType !== 1) t = t.parentElement;
    if (!t || !t.closest) return;
    var el = t.closest('a, button');
    if (!el) return;

    var href = (el.getAttribute('href') || '').toLowerCase();
    var text = (el.textContent || '');
    var lead = href.indexOf('forms.gle') !== -1
      || href.indexOf('docs.google.com/forms') !== -1
      || text.indexOf('報名') !== -1;
    var contact = href.indexOf('line.me') !== -1
      || href.indexOf('lin.ee') !== -1
      || href.indexOf('@130scmma') !== -1
      || text.toLowerCase().indexOf('@130scmma') !== -1;

    if (lead) track('Lead');
    if (contact) track('Contact');
  });

  var camps = document.getElementById('camps');
  if (!camps || !('IntersectionObserver' in window)) return;
  var seen = false;
  var io = new IntersectionObserver(function (entries) {
    if (seen) return;
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      seen = true;
      track('ViewContent');
      io.disconnect();
      break;
    }
  }, { threshold: 0 });
  io.observe(camps);
})();
