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
