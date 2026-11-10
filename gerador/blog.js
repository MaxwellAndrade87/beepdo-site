// Gerador do BLOG do BeepDo (beepdo.app/blog) em formato de portal.
// Lê gerador/posts.js e escreve, na raiz do site:
//   blog/index.html (portal), blog/categoria/*.html, blog/<slug>.html,
//   blog/feed.xml e a parte do blog no sitemap.xml.
// Não mexe em nenhuma outra página do site (início, admin, legais...).
//
// Uso: node gerador/blog.js            (raiz do site = pasta acima de gerador/)
//
// Campos de cada post (posts.js): slug, titulo, resumo, data (AAAA-MM-DD),
// categoria, leitura (min), corpo (HTML), capa {emoji, de, para} e, opcionais:
//   imagem      caminho da foto de capa (ex.: /blog/img/slug.webp)
//   imagemAlt   descrição da foto (acessibilidade e Google)
//   imagemPrompt  pedido usado pra gerar a foto (a automação usa)
//   creditoImagem texto de crédito (ex.: "Imagem gerada por IA")
//   fontes      [{ nome, url }] quando o post comenta uma notícia

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const POSTS = require('./todos.js')().slice().sort((a, b) => (b.data + (b.hora || '')).localeCompare(a.data + (a.hora || '')));
// Foto de capa: se existir blog/img/<slug>.webp (gerada pela automação), ela entra no lugar do emoji.
POSTS.forEach(p => {
  const arq = path.join(RAIZ, 'blog/img', p.slug + '.webp');
  // ?v= muda quando a foto é refeita, pra ninguém ficar vendo a antiga em cache.
  if (!p.imagem && fs.existsSync(arq)) p.imagem = `/blog/img/${p.slug}.webp?v=${fs.statSync(arq).size.toString(36)}`;
  if (p.imagem && !p.imagemAlt) p.imagemAlt = `Foto ilustrativa: ${p.titulo}`;
  if (p.imagem && !p.creditoImagem) p.creditoImagem = 'Imagem ilustrativa';
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dataPost = iso => { const [a, m, d] = iso.split('-').map(Number); return `${d} de ${MESES[m - 1]} de ${a}`; };
const slugCat = c => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ORDEM_CATS = ['Brasil', 'Mundo', 'Economia', 'Tecnologia', 'Trabalho', 'Dia a dia', 'Produtividade', 'Dicas do app'];
const CATS = [...new Set([...ORDEM_CATS, ...POSTS.map(p => p.categoria)])].filter(c => POSTS.some(p => p.categoria === c));
const hojeBR = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const ehNovo = p => p.data >= new Date(Date.now() - 3 * 3600e3 - 2 * 86400e3).toISOString().slice(0, 10);

// ---------- pedaços visuais ----------
const imgPost = (p, cls = '') => p.imagem
  ? `<img class="foto ${cls}" src="${esc(p.imagem)}" alt="${esc(p.imagemAlt || '')}" loading="lazy" decoding="async" width="1200" height="675">`
  : `<div class="foto foto-capa ${cls}" style="background:linear-gradient(135deg,${p.capa.de},${p.capa.para})" aria-hidden="true"><span>${p.capa.emoji}</span></div>`;
const etq = p => `<span class="etq">${ehNovo(p) ? '<b class="novo">Novo</b>' : ''}${esc(p.categoria)}</span>`;
const isoPost = p => `${p.data}T${p.hora || '09:00'}:00-03:00`;
const quando = p => `<time datetime="${isoPost(p)}" data-rel>${dataPost(p.data)}</time>`;
const meta = p => `<span class="meta">${quando(p)} · ${p.leitura} min</span>`;
// Troca a data por "há 2 h", "ontem"... na hora em que a página abre (o HTML é estático).
const TEMPO_JS = `<script>
(function(){
  var M=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  document.querySelectorAll('time[data-rel]').forEach(function(t){
    var d=new Date(t.getAttribute('datetime')), s=(Date.now()-d)/1000;
    if (isNaN(s) || s < 0) return;
    var txt = s<3600 ? 'há '+Math.max(1,Math.round(s/60))+' min'
      : s<86400 ? 'há '+Math.round(s/3600)+' h'
      : s<172800 ? 'ontem'
      : s<604800 ? 'há '+Math.floor(s/86400)+' dias'
      : d.getDate()+' '+M[d.getMonth()]+(d.getFullYear()!==new Date().getFullYear()?' '+d.getFullYear():'');
    t.title=t.textContent; t.textContent=txt;
  });
})();
</script>`;

const card = p => `<a class="pc" href="/blog/${p.slug}">
  <div class="pc-img">${imgPost(p)}</div>
  ${etq(p)}
  <h3>${esc(p.titulo)}</h3>
  ${meta(p)}
</a>`;
const cardRapido = p => `<a class="pr" href="/blog/${p.slug}">
  <div class="pr-img">${imgPost(p)}</div>
  <div><h3>${esc(p.titulo)}</h3>${meta(p)}</div>
</a>`;
const itemLista = p => `<a class="pl" href="/blog/${p.slug}">
  <div class="pl-img">${imgPost(p)}</div>
  <div>${etq(p)}<h3>${esc(p.titulo)}</h3><p>${esc(p.resumo)}</p>${meta(p)}</div>
</a>`;

const newsletterBox = (origem, titulo = 'Receba as matérias no seu e-mail') => `<div class="news news-mini" id="newsletter">
  <div class="news-txt">
    <h2>${titulo}</h2>
    <p>Um resumo de vez em quando, com as melhores matérias e as novidades do BeepDo. Sem spam.</p>
  </div>
  <form class="news-form" data-origem="${origem}" novalidate>
    <div class="news-campos">
      <input type="text" name="nome" placeholder="Nome (opcional)" autocomplete="given-name" maxlength="80">
      <input type="email" name="email" placeholder="Seu melhor e-mail" autocomplete="email" required maxlength="254">
      <button class="btn btn-p" type="submit">Quero receber</button>
    </div>
    <label class="news-ok"><input type="checkbox" name="aceite" required><span>Aceito receber e-mails do BeepDo e li a <a href="/privacidade">Política de Privacidade</a>.</span></label>
    <p class="news-msg" role="status" aria-live="polite"></p>
  </form>
</div>`;

const editorias = ativa => `<nav class="editorias" aria-label="Editorias"><div class="wrap">
  <a class="ed${ativa ? '' : ' ativa'}" href="/blog/"><span class="pulso"></span>Últimas</a>
  ${CATS.map(c => `<a class="ed${ativa === c ? ' ativa' : ''}" href="/blog/categoria/${slugCat(c)}">${esc(c)}</a>`).join('\n  ')}
</div></nav>`;

const letreiro = () => `<div class="letreiro" aria-label="Últimas matérias"><div class="wrap">
  <span class="letreiro-rot">Agora</span>
  <div class="letreiro-trilho"><div class="letreiro-fita">
    ${[...POSTS.slice(0, 6), ...POSTS.slice(0, 6)].map((p, i) => `<a href="/blog/${p.slug}"${i >= 6 ? ' aria-hidden="true" tabindex="-1"' : ''}>${esc(p.titulo)}</a>`).join('\n    ')}
  </div></div>
</div></div>`;

const cardApp = () => `<aside class="card-app">
  <img src="/logo.svg" alt="" width="48" height="48">
  <h2>Organize o dia com o BeepDo</h2>
  <p>Tarefas com alarme que toca de verdade, rotina no automático e o seu dia numa linha do tempo.</p>
  <a class="btn btn-p" href="https://play.google.com/store/apps/details?id=com.beepdo.app">Baixar grátis</a>
  <a class="card-app-mais" href="/#recursos">Conhecer os recursos ›</a>
</aside>`;

// Carrossel que gira sozinho (destaque), com bolinhas e arrastar.
const giratorio = lista => `<div class="gira" data-gira aria-roledescription="carrossel" aria-label="Mais destaques">
  <div class="gira-trilho">
    ${lista.map((p, i) => `<a class="gira-item" href="/blog/${p.slug}" aria-label="${i + 1} de ${lista.length}: ${esc(p.titulo)}">
      <div class="pc-img">${imgPost(p)}</div>
      ${etq(p)}
      <h3>${esc(p.titulo)}</h3>
    </a>`).join('\n    ')}
  </div>
  <div class="gira-pontos">${lista.map((_, i) => `<button type="button" aria-label="Ir para o destaque ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>
</div>`;

// Recursos do BeepDo: rolagem lateral com setas (não gira sozinho).
const RECURSOS = [
  ['⏰', 'Alarme de verdade', 'Toca em tela cheia até você parar, mesmo com o celular bloqueado.'],
  ['🕒', 'Meu dia por horário', 'O dia num eixo de horas, com a hora atual e a agenda do celular.'],
  ['✍️', 'Crie escrevendo', '"Pagar luz dia 10 às 9h": o BeepDo entende data, hora e repetição.'],
  ['📷', 'Fotos na tarefa', 'Anexe fotos, até sem internet. Elas sobem sozinhas depois.'],
  ['🔁', 'Rotina no automático', 'Tarefas que se repetem todo dia, na semana ou por regra.'],
  ['📁', 'Projetos e espaços', 'Separe Trabalho e Casa e acompanhe o progresso de cada projeto.'],
  ['🧑‍💼', 'Área do Gestor', 'Escala da equipe, banco de horas e reuniões, no Premium.'],
];
const faixaRecursos = () => `<section class="sec"><div class="wrap">
  <div class="sec-topo"><h2>Recursos do BeepDo</h2>
    <div class="setas"><button type="button" data-rola="-1" aria-label="Anterior">‹</button><button type="button" data-rola="1" aria-label="Próximo">›</button></div>
  </div>
  <div class="rola" data-rola-alvo>
    ${RECURSOS.map(([e, t, d]) => `<a class="rec" href="/#recursos"><span class="rec-ico">${e}</span><b>${t}</b><span>${d}</span></a>`).join('\n    ')}
  </div>
</div></section>`;

const JS = `<script>
(function(){
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-gira]').forEach(function(g){
    var trilho = g.querySelector('.gira-trilho'), pontos = g.querySelectorAll('.gira-pontos button'), n = pontos.length, i = 0, t;
    function vai(k){ i = (k + n) % n; trilho.scrollTo({left: trilho.clientWidth * i, behavior: reduz ? 'auto' : 'smooth'}); marca(); }
    function marca(){ pontos.forEach(function(b, j){ if (j === i) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current'); }); }
    function liga(){ if (reduz) return; para(); t = setInterval(function(){ vai(i + 1); }, 5000); }
    function para(){ if (t) clearInterval(t); }
    pontos.forEach(function(b, j){ b.addEventListener('click', function(){ vai(j); liga(); }); });
    trilho.addEventListener('scroll', function(){ var k = Math.round(trilho.scrollLeft / trilho.clientWidth); if (k !== i) { i = k; marca(); } }, {passive:true});
    g.addEventListener('mouseenter', para); g.addEventListener('mouseleave', liga);
    g.addEventListener('touchstart', para, {passive:true}); g.addEventListener('focusin', para);
    liga();
  });
  document.querySelectorAll('[data-rola]').forEach(function(b){
    b.addEventListener('click', function(){
      var alvo = b.closest('.sec').querySelector('[data-rola-alvo]');
      alvo.scrollBy({left: Number(b.dataset.rola) * alvo.clientWidth * 0.8, behavior: reduz ? 'auto' : 'smooth'});
    });
  });
})();
</script>`;
const NEWS_JS = '<script src="/newsletter.js" defer></script>';

// ---------- molde da página (mesmo topo e rodapé do site) ----------
function pagina({ arquivo, titulo, descricao, corpo, head = '', tipo = 'website', imagem }) {
  const caminho = arquivo.replace(/(^|\/)index$/, '$1');
  const og = imagem ? `https://beepdo.app${imagem}` : 'https://beepdo.app/favicon.png';
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="https://beepdo.app/${caminho}">
<link rel="alternate" type="application/rss+xml" title="Blog do BeepDo" href="https://beepdo.app/blog/feed.xml">
<meta name="theme-color" content="#6D4AE0">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:type" content="${tipo}">
<meta property="og:url" content="https://beepdo.app/${caminho}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="${imagem ? 'summary_large_image' : 'summary'}">${head}
<link rel="icon" href="/logo.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/blog/portal.css">
</head>
<body class="portal">
<header class="topo"><div class="wrap">
  <a class="marca" href="/"><img src="/logo.svg" alt="">BeepDo</a>
  <nav class="menu">
    <a href="/#recursos">Recursos</a>
    <a href="/#premium">Premium</a>
    <a href="/blog/">Blog</a>
    <a href="/faq">Dúvidas</a>
    <a class="cta" href="/#premium">Ver planos</a>
  </nav>
</div></header>
<main>
${corpo}
</main>
<footer class="rodape"><div class="wrap">
  <div>
    <a class="marca" href="/"><img src="/logo.svg" alt="">BeepDo</a>
    <p style="margin:0 0 6px">Um app da Norte Max · CNPJ 65.855.690/0001-06</p>
    <p style="margin:0 0 6px">Barra do Piraí, RJ</p>
    <p style="margin:0">Suporte: <a style="display:inline" href="mailto:suporte@beepdo.app">suporte@beepdo.app</a></p>
  </div>
  <div>
    <h4>App</h4>
    <a href="/#recursos">Recursos</a>
    <a href="/#premium">Premium</a>
    <a href="/faq">Perguntas frequentes</a>
    <a href="/blog/">Blog</a>
    <a href="/#newsletter">Newsletter</a>
  </div>
  <div>
    <h4>Legal</h4>
    <a href="/privacidade">Política de Privacidade</a>
    <a href="/termos">Termos de Uso</a>
    <a href="/cancelamento">Cancelamento e reembolso</a>
    <a href="/excluir-conta">Excluir conta</a>
  </div>
</div></footer>
${TEMPO_JS}
</body>
</html>
`;
  const destino = path.join(RAIZ, `${arquivo}.html`);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
}

// ---------- PORTAL (blog/index) ----------
const [manchete, ...resto] = POSTS;
const relacionados = p => POSTS.filter(x => x.slug !== p.slug && x.categoria === p.categoria).slice(0, 2);
const destaques = resto.slice(0, 3);
const giro = resto.slice(3, 8).length ? resto.slice(3, 8) : resto.slice(0, 5);
const rapidas = resto.slice(8, 16);
const usados = new Set([manchete, ...destaques, ...giro, ...rapidas].map(p => p.slug));

const blocoEditoria = c => {
  const l = POSTS.filter(p => p.categoria === c);
  if (!l.length) return '';
  const [g, ...p] = l;
  if (!p.length) return `<section class="sec ed-bloco"><div class="wrap">
  <div class="sec-topo"><h2><a href="/blog/categoria/${slugCat(c)}">${esc(c)} ›</a></h2></div>
  <div class="lista">${itemLista(g)}</div>
</div></section>`;
  return `<section class="sec ed-bloco"><div class="wrap">
  <div class="sec-topo"><h2><a href="/blog/categoria/${slugCat(c)}">${esc(c)} ›</a></h2></div>
  <div class="ed-grade">
    <a class="ed-grande" href="/blog/${g.slug}"><div class="pc-img">${imgPost(g)}</div>${etq(g)}<h3>${esc(g.titulo)}</h3><p>${esc(g.resumo)}</p>${meta(g)}</a>
    <div class="ed-lista">${p.slice(0, 3).map(cardRapido).join('\n')}</div>
  </div>
</div></section>`;
};

pagina({
  arquivo: 'blog/index',
  titulo: 'Blog do BeepDo · Trabalho, rotina e prazos',
  descricao: 'Matérias práticas sobre trabalho, rotina, prazos e organização do dia a dia, e como o BeepDo ajuda.',
  imagem: manchete.imagem,
  corpo: `${editorias()}
${letreiro()}
<section class="abre"><div class="wrap">
  <div class="manchete">
    <a class="manchete-img" href="/blog/${manchete.slug}" tabindex="-1" aria-hidden="true">${imgPost(manchete, 'grande')}</a>
    <div class="manchete-txt">
      ${etq(manchete)}
      <h1><a href="/blog/${manchete.slug}">${esc(manchete.titulo)}</a></h1>
      <p class="linha-fina">${esc(manchete.resumo)}</p>
      ${meta(manchete)}
      ${relacionados(manchete).map(r => `<a class="rel" href="/blog/${r.slug}">${esc(r.titulo)}</a>`).join('\n      ')}
    </div>
  </div>
  ${cardApp()}
</div></section>
<section class="sec"><div class="wrap">
  <div class="destaques">
    ${destaques.map(p => `<div>${card(p)}${relacionados(p).slice(0, 1).map(r => `<a class="rel" href="/blog/${r.slug}">${esc(r.titulo)}</a>`).join('')}</div>`).join('\n    ')}
    ${giratorio(giro)}
  </div>
</div></section>
${rapidas.length ? `<section class="sec sec-cinza"><div class="wrap">
  <div class="sec-topo"><h2>Dicas rápidas</h2></div>
  <div class="rapidas">${rapidas.map(cardRapido).join('\n')}</div>
</div></section>` : ''}
${faixaRecursos()}
${CATS.map(blocoEditoria).join('\n')}
<section class="sec"><div class="wrap">
  <div class="lista-col">
    <div>
      <div class="sec-topo"><h2>Todas as matérias</h2></div>
      <div class="lista">${POSTS.map(itemLista).join('\n')}</div>
    </div>
    <div class="lateral">${newsletterBox('blog')}</div>
  </div>
</div></section>
${JS}
${NEWS_JS}`,
});

// ---------- editorias ----------
CATS.forEach(c => {
  const l = POSTS.filter(p => p.categoria === c);
  pagina({
    arquivo: `blog/categoria/${slugCat(c)}`,
    titulo: `${c} · Blog do BeepDo`,
    descricao: `Matérias sobre ${c.toLowerCase()} no blog do BeepDo: ideias práticas para organizar tarefas, rotina e prazos.`,
    imagem: l[0].imagem,
    corpo: `${editorias(c)}
<section class="sec"><div class="wrap">
  <div class="migalha"><a href="/">Início</a> › <a href="/blog/">Blog</a> › ${esc(c)}</div>
  <h1 class="ed-titulo">${esc(c)}</h1>
  <div class="lista-col">
    <div class="lista">${l.map(itemLista).join('\n')}</div>
    <div class="lateral">${cardApp()}${newsletterBox('blog:' + slugCat(c))}</div>
  </div>
</div></section>
${NEWS_JS}`,
  });
});

// ---------- matérias ----------
POSTS.forEach(p => {
  const outros = [...POSTS.filter(x => x.slug !== p.slug && x.categoria === p.categoria), ...POSTS.filter(x => x.slug !== p.slug && x.categoria !== p.categoria)].slice(0, 3);
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: p.titulo, description: p.resumo, datePublished: p.data, dateModified: p.atualizado || p.data,
    inLanguage: 'pt-BR', mainEntityOfPage: `https://beepdo.app/blog/${p.slug}`,
    ...(p.imagem ? { image: `https://beepdo.app${p.imagem}` } : {}),
    author: { '@type': 'Organization', name: 'BeepDo' },
    publisher: { '@type': 'Organization', name: 'BeepDo', logo: { '@type': 'ImageObject', url: 'https://beepdo.app/favicon.png' } },
  };
  const fontes = (p.fontes || []).length
    ? (() => {
      const l = p.fontes.filter((f, i, a) => a.findIndex(x => x.nome === f.nome) === i)
        .map(f => `<a href="${esc(f.url)}" rel="noopener" target="_blank">${esc(f.nome)}</a>`);
      return `<p class="fontes">Com informações de ${l.length > 1 ? l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1] : l[0]}.</p>`;
    })() : '';
  pagina({
    arquivo: `blog/${p.slug}`,
    titulo: `${p.titulo} · Blog do BeepDo`,
    descricao: p.resumo,
    tipo: 'article',
    imagem: p.imagem,
    head: `\n<meta property="article:published_time" content="${p.data}">\n<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    corpo: `${editorias(p.categoria)}
<article class="materia"><div class="wrap estreito">
  <div class="migalha"><a href="/">Início</a> › <a href="/blog/">Blog</a> › <a href="/blog/categoria/${slugCat(p.categoria)}">${esc(p.categoria)}</a></div>
  ${etq(p)}
  <h1>${esc(p.titulo)}</h1>
  <p class="linha-fina">${esc(p.resumo)}</p>
  <p class="assinatura">Por Redação BeepDo · ${quando(p)} · ${p.leitura} min de leitura</p>
  <figure class="materia-capa">${imgPost(p, 'grande')}${p.imagem && p.creditoImagem ? `<figcaption>${esc(p.creditoImagem)}</figcaption>` : ''}</figure>
  <div class="post-corpo">${p.corpo}</div>
  ${fontes}
  <div class="caixa post-cta"><b>Experimente o BeepDo.</b> Tarefas com alarme que toca de verdade, projetos, recorrências e widgets. Grátis para começar. <a href="https://play.google.com/store/apps/details?id=com.beepdo.app">Baixar na Play Store ›</a></div>
  <div class="compartilhar">Compartilhar:
    <a href="https://wa.me/?text=${encodeURIComponent(p.titulo + ' https://beepdo.app/blog/' + p.slug)}" target="_blank" rel="noopener">WhatsApp</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://beepdo.app/blog/' + p.slug)}" target="_blank" rel="noopener">Facebook</a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://beepdo.app/blog/' + p.slug)}" target="_blank" rel="noopener">LinkedIn</a>
  </div>
  <div style="margin-top:36px">${newsletterBox('post:' + p.slug, 'Gostou? Receba as próximas matérias')}</div>
  ${outros.length ? `<h2 class="leia">Leia também</h2><div class="destaques tres">${outros.map(card).join('\n')}</div>` : ''}
</div></article>
${NEWS_JS}`,
  });
});

// ---------- feed e sitemap ----------
const xml = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
fs.writeFileSync(path.join(RAIZ, 'blog/feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Blog do BeepDo</title>
<link>https://beepdo.app/blog/</link>
<atom:link href="https://beepdo.app/blog/feed.xml" rel="self" type="application/rss+xml"/>
<description>Trabalho, rotina, prazos e organização do dia a dia.</description>
<language>pt-BR</language>
${POSTS.map(p => `<item>
<title>${xml(p.titulo)}</title>
<link>https://beepdo.app/blog/${p.slug}</link>
<guid>https://beepdo.app/blog/${p.slug}</guid>
<pubDate>${new Date(p.data + 'T09:00:00-03:00').toUTCString()}</pubDate>
<category>${xml(p.categoria)}</category>
<description>${xml(p.resumo)}</description>${p.imagem ? `\n<enclosure url="https://beepdo.app${p.imagem}" type="image/webp" length="0"/>` : ''}
</item>`).join('\n')}
</channel>
</rss>
`);

const SITEMAP = path.join(RAIZ, 'sitemap.xml');
const antigos = fs.existsSync(SITEMAP)
  ? [...fs.readFileSync(SITEMAP, 'utf8').matchAll(/<loc>https:\/\/beepdo\.app\/([^<]*)<\/loc>/g)].map(m => m[1]).filter(u => !u.startsWith('blog/'))
  : [''];
const urls = [...antigos, 'blog/', ...CATS.map(c => 'blog/categoria/' + slugCat(c)), ...POSTS.map(p => 'blog/' + p.slug)];
fs.writeFileSync(SITEMAP, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>https://beepdo.app/${u}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`Blog gerado: ${POSTS.length} matérias, ${CATS.length} editorias. Hoje: ${hojeBR}.`);
