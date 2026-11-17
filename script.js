(function () {
  var html = document.documentElement, btn = document.getElementById('lang');
  function set(l) {
    html.lang = l === 'en' ? 'en' : 'zh-Hant';
    btn.textContent = l === 'en' ? '中文' : 'EN';
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  set(saved === 'en' ? 'en' : 'zh');
  btn.addEventListener('click', function () { set(html.lang === 'en' ? 'zh' : 'en'); });
})();
