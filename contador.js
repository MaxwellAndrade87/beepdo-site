// Contador de visitas do beepdo.app: sem cookies, sem guardar IP. Os números aparecem só no painel admin.
(function () {
  try {
    if (localStorage.getItem('bd_nao_contar') === '1') return; // admin logado no painel
  } catch (e) {}
  var ua = navigator.userAgent || '';
  if (navigator.webdriver || /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom/i.test(ua)) return;
  if (/^\/(admin|confirmar|redefinir-senha|newsletter-cancelar)/.test(location.pathname)) return;

  var API = 'https://kbbclredwktimecdqtwq.supabase.co/rest/v1/rpc/';
  var KEY = 'sb_publishable_vuSQaDWky4xRYPwCPvbr8g_5AUFizC5';
  var H = { apikey: KEY, 'Content-Type': 'application/json' };
  var sessao = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, function () { return (Math.random() * 16 | 0).toString(16); });

  function origem() {
    var q = new URLSearchParams(location.search), u = (q.get('utm_source') || '').toLowerCase();
    var mapa = [[/google/, 'Google'], [/bing/, 'Bing'], [/duckduckgo/, 'DuckDuckGo'], [/yahoo/, 'Yahoo'], [/whatsapp|wa\.me/, 'WhatsApp'],
      [/instagram/, 'Instagram'], [/facebook|fb\.|^fb$/, 'Facebook'], [/t\.co$|twitter|x\.com/, 'X'], [/linkedin|lnkd/, 'LinkedIn'],
      [/pinterest/, 'Pinterest'], [/tiktok/, 'TikTok'], [/youtube/, 'YouTube'], [/play\.google|android-app/, 'Google Play'], [/news\.google/, 'Google Notícias']];
    var achar = function (t) { for (var i = 0; i < mapa.length; i++) if (mapa[i][0].test(t)) return mapa[i][1]; return null; };
    if (u) return achar(u) || u.slice(0, 40);
    if (!document.referrer) return /WhatsApp/i.test(ua) ? 'WhatsApp' : 'Direto';
    var host = '';
    try { host = new URL(document.referrer).hostname.replace(/^www\./, ''); } catch (e) {}
    if (!host) return 'Direto';
    if (host === location.hostname.replace(/^www\./, '')) return 'Navegando no site';
    if (/news\.google/.test(host)) return 'Google Notícias';
    return achar(host) || host;
  }
  var dispositivo = /iPad|Tablet/i.test(ua) ? 'Tablet' : (/Mobi|Android|iPhone/i.test(ua) ? 'Celular' : 'Computador');
  var pagina = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
  var titulo = document.title.replace(/\s·\s(Blog do )?BeepDo$/, '');

  // estado/cidade aproximados (guardados só como texto, nunca o IP)
  function local() {
    try { var c = sessionStorage.getItem('bd_local'); if (c) return Promise.resolve(JSON.parse(c)); } catch (e) {}
    var tempo = new Promise(function (ok) { setTimeout(function () { ok({}); }, 2000); });
    var busca = fetch('https://get.geojs.io/v1/ip/geo.json').then(function (r) { return r.json(); }).then(function (j) {
      var l = { estado: j.country_code === 'BR' ? (j.region || '') : (j.country || ''), cidade: j.country_code === 'BR' ? (j.city || '') : '' };
      try { sessionStorage.setItem('bd_local', JSON.stringify(l)); } catch (e) {}
      return l;
    }).catch(function () { return {}; });
    return Promise.race([busca, tempo]);
  }

  var id = null, ativo = 0, desde = document.visibilityState === 'visible' ? Date.now() : 0, rolagem = 0, enviado = 0;
  function medirRolagem() {
    var h = document.documentElement, total = h.scrollHeight - window.innerHeight;
    var p = total > 0 ? Math.round(100 * (window.scrollY || h.scrollTop) / total) : 100;
    if (p > rolagem) rolagem = Math.min(100, p);
  }
  window.addEventListener('scroll', medirRolagem, { passive: true });

  local().then(function (l) {
    return fetch(API + 'registrar_visita', { method: 'POST', headers: H, body: JSON.stringify({
      p_sessao: sessao, p_pagina: pagina, p_titulo: titulo, p_origem: origem(), p_dispositivo: dispositivo,
      p_estado: l.estado || null, p_cidade: l.cidade || null }) });
  }).then(function (r) { return r.json(); }).then(function (v) { if (typeof v === 'number') id = v; }).catch(function () {});

  function enviar() {
    if (!id) return;
    if (desde) { ativo += Date.now() - desde; desde = 0; }
    medirRolagem();
    var seg = Math.round(ativo / 1000);
    if (seg === enviado) return;
    enviado = seg;
    try {
      fetch(API + 'atualizar_visita', { method: 'POST', headers: H, keepalive: true,
        body: JSON.stringify({ p_id: id, p_sessao: sessao, p_tempo: seg, p_rolagem: rolagem }) });
    } catch (e) {}
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') enviar();
    else if (!desde) desde = Date.now();
  });
  window.addEventListener('pagehide', enviar);
  setInterval(function () { if (document.visibilityState === 'visible') { enviar(); desde = Date.now(); } }, 30000);
})();
