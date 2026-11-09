const L = require('./legal.js');
const fs = require('fs');
const OUT = process.argv[2] || 'out';
fs.mkdirSync(OUT, { recursive: true });
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const E = L.EMPRESA;

const ICO = {
  alarme:'<path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 9v4l2.5 1.5"/><path d="M5 3 2 6M19 3l3 3"/>',
  offline:'<path d="M2 12a10 10 0 0 1 20 0"/><path d="M6 12a6 6 0 0 1 12 0"/><path d="M12 12v8"/><path d="M9 17l3 3 3-3"/>',
  widget:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/>',
  repetir:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  pasta:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  sync:'<path d="M20 11a8 8 0 0 0-14.9-3.5M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.9 3.5M20 20v-4h-4"/>',
};
const ico = k => `<div class="ico"><svg viewBox="0 0 24 24">${ICO[k]}</svg></div>`;

function pagina({ arquivo, titulo, descricao, corpo, head = '', tipo = 'website', url }) {
  const caminho = url ?? (arquivo === 'index' ? '' : arquivo.replace(/(^|\/)index$/, '$1'));
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<meta name="description" content="${descricao}">${['admin','confirmar','redefinir-senha','newsletter-cancelar'].includes(arquivo) ? '\n<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="https://beepdo.app/${caminho}">
<link rel="alternate" type="application/rss+xml" title="Blog do BeepDo" href="https://beepdo.app/blog/feed.xml">
<meta name="theme-color" content="#6D4AE0">
<meta property="og:title" content="${titulo}">
<meta property="og:description" content="${descricao}">
<meta property="og:type" content="${tipo}">
<meta property="og:url" content="https://beepdo.app/${caminho}">
<meta property="og:image" content="https://beepdo.app/favicon.png">
<meta property="og:locale" content="pt_BR">${head}
<link rel="icon" href="/logo.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
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
    <p style="margin:0 0 6px">Um app da ${E.nomeFantasia} · CNPJ ${E.cnpj}</p>
    <p style="margin:0 0 6px">${E.endereco}</p>
    <p style="margin:0">Suporte: <a style="display:inline" href="mailto:${E.email}">${E.email}</a></p>
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
</body>
</html>
`;
  const destino = `${OUT}/${arquivo}.html`;
  fs.mkdirSync(require('path').dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
}

// ---------- blocos de texto ----------
function par(lista) {
  let out = '', emLista = false;
  for (const t of lista) {
    if (t.startsWith('• ')) { if (!emLista) { out += '<ul>'; emLista = true; } out += `<li>${esc(t.slice(2))}</li>`; }
    else { if (emLista) { out += '</ul>'; emLista = false; } out += `<p>${esc(t)}</p>`; }
  }
  if (emLista) out += '</ul>';
  return out;
}
function documento(d, migalha) {
  return `<div class="doc"><div class="wrap estreito">
<div class="migalha"><a href="/">Início</a> › ${migalha}</div>
<h1>${esc(d.titulo)}</h1>
<p class="data">Última atualização: ${L.ATUALIZADO_EM}</p>
${par(d.intro)}
${d.secoes.map(s => `<h2>${esc(s.titulo)}</h2>\n${par(s.texto)}`).join('\n')}
<div class="caixa">Dúvidas? Fale com a gente: <a href="mailto:${E.email}">${E.email}</a>${E.telefone ? ` · WhatsApp ${E.telefone}` : ''}</div>
</div></div>`;
}

// ---------- FAQ ----------
const FAQ = [
  ['O app', [
    ['O que é o BeepDo?', `<p>Um app de tarefas para Android com foco em lembrar você na hora certa: cada tarefa pode ter horário, alarme e avisos antecipados, além de projetos, tarefas recorrentes e widgets na tela inicial.</p>`],
    ['Funciona sem internet?', `<p>Sim. Tudo é salvo primeiro no celular. Quando a internet volta, o BeepDo sincroniza sozinho com a sua conta.</p>`],
    ['Tem para iPhone?', `<p>Por enquanto, só Android. Avisaremos por aqui quando houver novidades.</p>`],
    ['Tem anúncios?', `<p>Não. O BeepDo não mostra anúncios e não vende seus dados.</p>`],
  ]],
  ['Premium e pagamento', [
    ['O que o plano grátis inclui?', `<p>Tarefas ilimitadas, até 3 projetos, 4 temas e o widget Hoje. Sem prazo para acabar.</p>`],
    ['O que o Premium libera?', `<p>Projetos ilimitados, recorrência por regras, modo alarme em tela cheia, widget de Projeto, opacidade dos widgets e 4 temas extras.</p>`],
    ['Como funciona o teste grátis?', `<p>No plano anual, quem nunca assinou tem 7 dias grátis. Se cancelar antes do fim do teste, nada é cobrado. Se não cancelar, a assinatura começa automaticamente.</p>`],
    ['Como pago?', `<p>Pelo Google Play, com a forma de pagamento da sua conta Google (cartão, Pix, saldo etc.). Nós não recebemos os dados do seu cartão.</p>`],
    ['Troquei de celular. Perco o Premium?', `<p>Não. Entre com a mesma conta do BeepDo e, se precisar, toque em <b>Restaurar compra</b> na tela do Premium.</p>`],
  ]],
  ['Cancelamento', [
    ['Como cancelo?', `<p>No Google Play › Pagamentos e assinaturas › Assinaturas › BeepDo › Cancelar. Ou no app: Perfil › Gerenciar assinatura. <a href="/cancelamento">Veja o passo a passo</a>.</p>`],
    ['Tenho direito a reembolso?', `<p>Sim, em até 7 dias da contratação (ou da primeira cobrança depois do teste), pelo direito de arrependimento do Código de Defesa do Consumidor. <a href="/cancelamento#reembolso">Saiba como pedir</a>.</p>`],
    ['O que acontece com meus dados se eu cancelar?', `<p>Nada é apagado. Os recursos Premium ficam travados: projetos acima de 3 continuam editáveis, o alarme volta a ser notificação comum e o tema volta ao padrão.</p>`],
  ]],
  ['Alarmes e notificações', [
    ['O alarme não tocou. E agora?', `<ul><li>Confira se as notificações do BeepDo estão ligadas no Android e no Perfil do app.</li><li>Desative a economia de bateria para o BeepDo (Configurações › Apps › BeepDo › Bateria › Sem restrições).</li><li>No modo alarme, permita "Alarmes e lembretes" e "Tela cheia" quando o app pedir.</li></ul>`],
    ['O que é o modo alarme?', `<p>Recurso Premium: na hora do alarme, o celular toca como despertador (mesmo no silencioso) e abre uma tela cheia com Concluir, Adiar 10 min e Parar.</p>`],
    ['Adiar muda o horário da tarefa?', `<p>Não. Adiar só faz o aviso tocar de novo mais tarde. O horário da tarefa continua o que você programou, a menos que você edite a tarefa.</p>`],
  ]],
  ['Conta e privacidade', [
    ['Como excluo minha conta?', `<p>No app: Perfil › Excluir conta. Sem o app: <a href="/excluir-conta">veja como pedir por e-mail</a>.</p>`],
    ['Quais dados vocês guardam?', `<p>Só o necessário para o app funcionar: e-mail, nome, suas tarefas e projetos, preferências e o status da assinatura. <a href="/privacidade">Leia a Política de Privacidade</a>.</p>`],
  ]],
];
const faqHtml = (grupos) => grupos.map(([g, itens]) => `<h2 style="font-size:20px;margin:32px 0 12px">${g}</h2>` + itens.map(([p, r]) => `<details><summary>${p}</summary>${r}</details>`).join('')).join('');

// ---------- BLOG ----------
const POSTS = require('./posts.js').slice().sort((a, b) => b.data.localeCompare(a.data));
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const dataPost = iso => { const [a, m, d] = iso.split('-').map(Number); return `${d} de ${MESES[m - 1]} de ${a}`; };
const capaPost = (p, grande) => `<div class="capa${grande ? ' grande' : ''}" style="background:linear-gradient(135deg,${p.capa.de},${p.capa.para})" aria-hidden="true"><span>${p.capa.emoji}</span></div>`;
const cartaoPost = p => `<a class="post-card" href="/blog/${p.slug}">
  ${capaPost(p)}
  <div class="post-info">
    <span class="post-cat">${esc(p.categoria)}</span>
    <h3>${esc(p.titulo)}</h3>
    <p>${esc(p.resumo)}</p>
    <span class="post-meta">${dataPost(p.data)} · ${p.leitura} min de leitura</span>
  </div>
</a>`;

// Caixa de inscrição na newsletter (o envio é feito por /newsletter.js)
const newsletterBox = (origem, titulo = 'Receba dicas e novidades do BeepDo') => `<div class="news" id="newsletter">
  <div class="news-txt">
    <h2>${titulo}</h2>
    <p>Um e-mail de vez em quando, com dicas de organização e as novidades do app. Sem spam, e dá pra sair quando quiser.</p>
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
const NEWS_JS = '<script src="/newsletter.js" defer></script>';
const slugCat = c => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ORDEM_CATS = ['Trabalho', 'Dia a dia', 'Produtividade', 'Dicas do app'];
const CATS = [...new Set([...ORDEM_CATS, ...POSTS.map(p => p.categoria)])].filter(c => POSTS.some(p => p.categoria === c));
const chipsCats = ativa => `<nav class="blog-cats" aria-label="Categorias do blog">
  <a class="chip${ativa ? '' : ' ativo'}" href="/blog/">Todos (${POSTS.length})</a>
  ${CATS.map(c => `<a class="chip${ativa === c ? ' ativo' : ''}" href="/blog/categoria/${slugCat(c)}">${esc(c)} (${POSTS.filter(p => p.categoria === c).length})</a>`).join('\n  ')}
</nav>`;
const destaquePost = p => `<a class="post-destaque" href="/blog/${p.slug}">
  ${capaPost(p)}
  <div class="post-info">
    <span class="post-cat">${esc(p.categoria)}</span>
    <h2>${esc(p.titulo)}</h2>
    <p>${esc(p.resumo)}</p>
    <span class="post-meta">${dataPost(p.data)} · ${p.leitura} min de leitura</span>
  </div>
</a>`;

// ---------- INÍCIO ----------
pagina({
  arquivo: 'index',
  titulo: 'BeepDo · Tarefas com alarme que toca de verdade',
  descricao: 'Organize tarefas, projetos e lembretes com alarmes que tocam na hora certa, mesmo sem internet. App para Android.',
  corpo: `
<section class="hero"><div class="wrap">
  <div>
    <span class="selo">● Em breve no Google Play</span>
    <h1>Suas tarefas com <em>alarme que toca</em> de verdade.</h1>
    <p class="lead">O BeepDo organiza o seu dia e avisa na hora certa, com alarme, avisos antecipados e widgets na tela inicial. Funciona até sem internet.</p>
    <div class="botoes" id="baixar">
      <a class="btn btn-p" href="#premium">Conhecer os planos</a>
      <a class="btn btn-s" href="/faq">Tirar dúvidas</a>
    </div>
    <p class="nota">Grátis para começar. Sem anúncios.</p>
  </div>
  <div class="vitrine">
    <img class="w1" src="/widget-hoje.png" alt="Widget Hoje do BeepDo mostrando a próxima tarefa e as tarefas do dia" width="640" height="500">
    <img class="w2" src="/widget-projeto.png" alt="Widget de Projeto do BeepDo" width="640" height="300">
  </div>
</div></section>

<section class="alt" id="recursos"><div class="wrap">
  <h2>Feito pra você não esquecer</h2>
  <p class="sub">Menos app pra gerenciar, mais coisa feita.</p>
  <div class="grade">
    <div class="card">${ico('alarme')}<h3>Alarme e avisos antecipados</h3><p>Toque na hora, minutos antes ou dias antes. Adiar não bagunça o horário da tarefa.</p></div>
    <div class="card">${ico('widget')}<h3>Widgets na tela inicial</h3><p>Veja a próxima tarefa e conclua direto do widget, sem abrir o app.</p></div>
    <div class="card">${ico('offline')}<h3>Funciona sem internet</h3><p>Tudo fica salvo no celular e sincroniza sozinho quando a conexão volta.</p></div>
    <div class="card">${ico('repetir')}<h3>Tarefas recorrentes</h3><p>Repita por dias da semana ou a cada N dias. A próxima já nasce quando você conclui.</p></div>
    <div class="card">${ico('pasta')}<h3>Projetos</h3><p>Agrupe tarefas por assunto, com cor, ícone e prazo.</p></div>
    <div class="card">${ico('sync')}<h3>Sua conta em qualquer aparelho</h3><p>Entre com seu e-mail e encontre tudo no celular novo.</p></div>
  </div>
</div></section>

<section id="premium"><div class="wrap">
  <h2>Grátis pra sempre. Premium quando quiser mais.</h2>
  <p class="sub">Assinatura pelo Google Play. Cancele quando quiser.</p>
  <div class="planos">
    <div class="card plano">
      <h3 style="color:var(--t)">Grátis</h3>
      <div class="preco">R$ 0</div>
      <div style="color:var(--mut);font-size:14px">sem prazo</div>
      <ul>
        <li>Tarefas ilimitadas, com alarme e avisos</li>
        <li>Até 3 projetos</li>
        <li>Tarefas recorrentes</li>
        <li>4 temas</li>
        <li>Widget Hoje</li>
      </ul>
    </div>
    <div class="card plano premium">
      <span class="etq">7 dias grátis no anual</span>
      <h3 style="color:var(--t)">Premium</h3>
      <div class="preco">a partir de R$ 9,49<span style="font-size:16px;font-weight:600;color:var(--mut)">/mês</span></div>
      <div style="color:var(--mut);font-size:14px">no plano anual</div>
      <ul>
        <li>Tudo do Grátis</li>
        <li>Projetos ilimitados</li>
        <li>Modo alarme em tela cheia, toca até no silencioso</li>
        <li>Recorrência por regras</li>
        <li>Widget de Projeto e opacidade dos widgets</li>
        <li>Temas Grafite, Lavanda, Floresta e Âmbar</li>
      </ul>
      <div class="tabelinha">
        <div>Mensal<b>R$ 11,90</b>por mês</div>
        <div class="dest">Anual<b>R$ 113,90</b>por ano</div>
        <div>Semestral<b>R$ 59,90</b>a cada 6 meses</div>
      </div>
      <p class="nota" style="margin-bottom:0">Os preços finais aparecem no Google Play antes da compra.</p>
    </div>
  </div>
</div></section>

<section class="blog-home"><div class="wrap">
  <div class="blog-topo">
    <div><h2>Do blog</h2><p class="sub" style="margin:0">Dicas para organizar a rotina e tirar o máximo do BeepDo.</p></div>
    <div class="carrossel-nav">
      <button type="button" class="seta" data-car="-1" aria-label="Posts anteriores"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <button type="button" class="seta" data-car="1" aria-label="Próximos posts"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>
  </div>
  <div class="carrossel" id="carrossel" tabindex="0" aria-label="Posts recentes do blog">
    ${POSTS.slice(0, 8).map(cartaoPost).join('\n')}
  </div>
  <p style="margin:18px 0 0"><a href="/blog/">Ver todos os posts ›</a></p>
</div></section>

<section><div class="wrap">
  ${newsletterBox('home')}
</div></section>

<section class="alt"><div class="wrap estreito">
  <h2>Perguntas frequentes</h2>
  <p class="sub">As dúvidas mais comuns. <a href="/faq">Ver todas</a>.</p>
  ${faqHtml([['', [FAQ[0][1][1], FAQ[1][1][2], FAQ[2][1][0], FAQ[2][1][2], FAQ[3][1][0]]]]).replace('<h2 style="font-size:20px;margin:32px 0 12px"></h2>','')}
</div></section>
<script>
(() => {
  const c = document.getElementById('carrossel'); if (!c) return;
  const passo = () => { const card = c.querySelector('.post-card'); return card ? card.getBoundingClientRect().width + 18 : 300; };
  for (const b of document.querySelectorAll('[data-car]')) b.addEventListener('click', () => c.scrollBy({ left: passo() * Number(b.dataset.car), behavior: 'smooth' }));
  // Passa sozinho a cada 6 s (para quando a pessoa interage ou prefere menos movimento)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let parado = false; const parar = () => { parado = true; };
  ['pointerdown','wheel','touchstart','focusin','keydown'].forEach(e => c.addEventListener(e, parar, { passive: true }));
  setInterval(() => {
    if (parado || document.hidden) return;
    const fim = c.scrollLeft + c.clientWidth >= c.scrollWidth - 8;
    c.scrollTo({ left: fim ? 0 : c.scrollLeft + passo(), behavior: 'smooth' });
  }, 6000);
})();
</script>
${NEWS_JS}
`,
});

// ---------- FAQ ----------
pagina({
  arquivo: 'faq',
  titulo: 'Perguntas frequentes · BeepDo',
  descricao: 'Dúvidas sobre o BeepDo: plano grátis, Premium, teste grátis, cancelamento, reembolso, alarmes e conta.',
  corpo: `<div class="doc"><div class="wrap estreito">
<div class="migalha"><a href="/">Início</a> › Perguntas frequentes</div>
<h1>Perguntas frequentes</h1>
<p class="data">Não achou o que procurava? Escreva para <a href="mailto:${E.email}">${E.email}</a>.</p>
${faqHtml(FAQ)}
</div></div>`,
});

// ---------- CANCELAMENTO ----------
pagina({
  arquivo: 'cancelamento',
  titulo: 'Cancelamento e reembolso · BeepDo',
  descricao: 'Como cancelar a assinatura BeepDo Premium e pedir reembolso em até 7 dias.',
  corpo: `<div class="doc"><div class="wrap estreito">
<div class="migalha"><a href="/">Início</a> › Cancelamento e reembolso</div>
<h1>Cancelamento e reembolso</h1>
<p class="data">Última atualização: ${L.ATUALIZADO_EM}</p>
<p>A assinatura do BeepDo Premium é feita e cobrada pelo Google Play. Você pode cancelar a qualquer momento, sem multa.</p>

<h2>Como cancelar</h2>
<ol class="passos">
  <li>Abra o <b>Google Play</b> no celular e toque na sua foto, no canto de cima.</li>
  <li>Entre em <b>Pagamentos e assinaturas › Assinaturas</b>.</li>
  <li>Escolha <b>BeepDo</b> e toque em <b>Cancelar assinatura</b>.</li>
</ol>
<p>Atalho pelo app: <b>Perfil › Gerenciar assinatura</b> abre direto essa tela. Pelo computador: <a href="https://play.google.com/store/account/subscriptions" rel="noopener">play.google.com/store/account/subscriptions</a>.</p>
<div class="caixa">Cancelar não apaga nada. O Premium continua até o fim do período já pago e, depois disso, os recursos Premium ficam travados, mas todos os seus dados continuam lá.</div>

<h2>Teste grátis</h2>
<p>Se você está no teste grátis de 7 dias, cancele antes do fim do teste e nada será cobrado.</p>

<h2 id="reembolso">Reembolso (direito de arrependimento)</h2>
<p>Pelo art. 49 do Código de Defesa do Consumidor, você pode desistir da compra em até <b>7 dias</b> da contratação, ou da primeira cobrança depois do teste grátis, e receber o valor integral de volta.</p>
<ol class="passos">
  <li>Pelo Google Play: em <a href="https://play.google.com/store/account/orderhistory" rel="noopener">Histórico de pedidos</a>, escolha a compra do BeepDo e toque em <b>Solicitar reembolso</b>.</li>
  <li>Ou por e-mail: escreva para <a href="mailto:${E.email}?subject=Reembolso%20BeepDo">${E.email}</a> com o assunto "Reembolso BeepDo", informando o e-mail da conta e o número do pedido do Google Play (começa com GPA.). Respondemos em até 5 dias úteis.</li>
</ol>
<p>Depois de 7 dias, os reembolsos seguem a política do Google Play.</p>

<h2>O que acontece quando o Premium acaba</h2>
<ul>
  <li>Projetos acima de 3 continuam lá e editáveis; só não dá para criar novos.</li>
  <li>Recorrências por regras deixam de gerar novas ocorrências (você é avisado).</li>
  <li>O modo alarme volta a ser notificação comum.</li>
  <li>O tema volta para o Escuro e o widget de Projeto fica travado.</li>
</ul>

<h2>Excluir a conta</h2>
<p>Excluir a conta <b>não</b> cancela a cobrança no Google Play. Cancele a assinatura antes e depois <a href="/excluir-conta">exclua a conta</a>.</p>
</div></div>`,
});

// ---------- LEGAIS ----------
pagina({ arquivo:'privacidade', titulo:'Política de Privacidade · BeepDo', descricao:'Como o BeepDo trata os seus dados pessoais, conforme a LGPD.', corpo: documento(L.PRIVACIDADE,'Política de Privacidade') });
pagina({ arquivo:'termos', titulo:'Termos de Uso · BeepDo', descricao:'Termos de Uso do aplicativo BeepDo.', corpo: documento(L.TERMOS,'Termos de Uso') });

pagina({
  arquivo: 'excluir-conta',
  titulo: 'Excluir conta · BeepDo',
  descricao: 'Como excluir sua conta do BeepDo e os dados ligados a ela.',
  corpo: `<div class="doc"><div class="wrap estreito">
<div class="migalha"><a href="/">Início</a> › Excluir conta</div>
<h1>Excluir conta do BeepDo</h1>
<p class="data">Você pode excluir sua conta e todos os dados ligados a ela quando quiser, sem custo.</p>
<h2>Pelo app (na hora)</h2>
<ol class="passos">
  <li>Abra o BeepDo e vá em <b>Perfil › Excluir conta</b>.</li>
  <li>Digite <b>EXCLUIR</b> para confirmar e toque em <b>Excluir minha conta</b>. É preciso estar com internet.</li>
</ol>
<h2>Sem o app (por e-mail)</h2>
<p>Envie um e-mail para <a href="mailto:${E.email}?subject=Excluir%20conta%20BeepDo">${E.email}</a> a partir do e-mail da sua conta, com o assunto <b>"Excluir conta BeepDo"</b>. Confirmamos o pedido e excluímos a conta em até 15 dias.</p>
<h2>O que é apagado</h2>
<ul><li>Tarefas, projetos, descrições, alarmes e etiquetas.</li><li>Perfil, nome de usuário, preferências e o login (e-mail e senha).</li></ul>
<h2>O que fica guardado por um tempo</h2>
<ul><li>Registros de acesso (IP, data e hora): 6 meses, como exige o art. 15 do Marco Civil da Internet.</li><li>Dados de compra da assinatura: pelo prazo exigido pela legislação fiscal e de defesa do consumidor.</li></ul>
<div class="caixa">Tem Premium? Excluir a conta não cancela a cobrança. <a href="/cancelamento">Cancele a assinatura</a> antes.</div>
</div></div>`,
});


// ---------- conta: confirmar e-mail e nova senha ----------
// Links dos e-mails do Supabase (templates usam token_hash). No celular com o
// app instalado, o Android abre o app direto (App Links); aqui é o caminho
// pelo navegador (computador ou sem o app).
const SB = `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.50.0/dist/umd/supabase.js"></script>
<script>
  const SB_URL = '__SB_URL__';
  const SB_KEY = '__SB_KEY__';
  const sb = supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const q = new URLSearchParams(location.search);
  const $ = id => document.getElementById(id);
  const mostrar = id => { for (const e of document.querySelectorAll('[data-etapa]')) e.hidden = e.dataset.etapa !== id; };
  function traduz(msg) {
    const m = (msg || '').toLowerCase();
    if (m.includes('should be different') || m.includes('same password')) return 'A nova senha precisa ser diferente da atual.';
    if (m.includes('at least') || m.includes('weak')) return 'Senha fraca. Use pelo menos 6 caracteres.';
    if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas seguidas. Aguarde alguns minutos.';
    if (m.includes('expired') || m.includes('invalid')) return 'Esse link expirou ou já foi usado. Peça um novo no app.';
    if (m.includes('fetch') || m.includes('network')) return 'Sem conexão. Verifique a internet e tente de novo.';
    return 'Não deu certo. Tente de novo.';
  }
</script>`;
const ICO_OK = '<div class="icone ok"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>';
const ICO_ERRO = '<div class="icone erro"><svg viewBox="0 0 24 24"><path d="M9 9l6 6M15 9l-6 6"/><circle cx="12" cy="12" r="9"/></svg></div>';
const OLHO_ABERTO = '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
const OLHO_FECHADO = '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>';
const campoSenha = (id, rotulo, auto) => `<label for="${id}">${rotulo}</label>
<div class="campo"><input id="${id}" type="password" autocomplete="${auto}" minlength="6" required>
<button type="button" class="olho" data-alvo="${id}" aria-label="Mostrar senha"><svg viewBox="0 0 24 24">${OLHO_FECHADO}</svg></button></div>`;

pagina({
  arquivo: 'confirmar',
  titulo: 'Confirmar e-mail · BeepDo',
  descricao: 'Confirmação do e-mail da sua conta BeepDo.',
  corpo: `<div class="conta"><div class="wrap"><div class="painel">
<img class="logo" src="/logo.svg" alt="">
<div data-etapa="validando"><h1>Confirmando seu e-mail</h1><div class="carregando"></div></div>
<div data-etapa="ok" hidden>${ICO_OK}<h1>E-mail confirmado!</h1><p>Sua conta está liberada. Abra o BeepDo e entre com seu e-mail e senha.</p>
<a class="btn btn-p" href="beepdo://login">Abrir o BeepDo</a><p class="dica" style="margin-top:12px">Está no computador? É só abrir o app no celular.</p></div>
<div data-etapa="erro" hidden>${ICO_ERRO}<h1>Link expirado ou já usado</h1><p>Se você já confirmou antes, é só entrar no app. Se não, na tela de entrada do BeepDo toque em <b>Reenviar e-mail de confirmação</b>.</p>
<a class="btn btn-s" href="beepdo://login">Abrir o BeepDo</a></div>
</div></div></div>
${SB}
<script>
(async () => {
  const token = q.get('token_hash');
  const tipo = q.get('type') === 'email_change' ? 'email_change' : 'email';
  if (!token) return mostrar('erro');
  try {
    const { error } = await sb.auth.verifyOtp({ token_hash: token, type: tipo });
    mostrar(error ? 'erro' : 'ok');
    if (!error) sb.auth.signOut({ scope: 'local' }).catch(() => {});
  } catch { mostrar('erro'); }
})();
</script>`,
});

pagina({
  arquivo: 'redefinir-senha',
  titulo: 'Nova senha · BeepDo',
  descricao: 'Crie uma nova senha para a sua conta BeepDo.',
  corpo: `<div class="conta"><div class="wrap"><div class="painel">
<img class="logo" src="/logo.svg" alt="">
<div data-etapa="validando"><h1>Validando o link</h1><div class="carregando"></div></div>
<div data-etapa="form" hidden><h1>Criar nova senha</h1><p>Digite a nova senha duas vezes.</p>
<form id="form" novalidate>
${campoSenha('senha','Nova senha','new-password')}
<p class="dica">Pelo menos 6 caracteres.</p>
${campoSenha('confirma','Confirmar nova senha','new-password')}
<p class="msg-erro" id="erro" role="alert"></p>
<button class="btn btn-p" id="salvar" type="submit">Salvar nova senha</button>
</form></div>
<div data-etapa="ok" hidden>${ICO_OK}<h1>Senha alterada!</h1><p>Agora é só abrir o BeepDo e entrar com a nova senha.</p>
<a class="btn btn-p" href="beepdo://login">Abrir o BeepDo</a></div>
<div data-etapa="erro" hidden>${ICO_ERRO}<h1>Link expirado ou já usado</h1><p>Peça um novo link no app: na tela de entrada, digite seu e-mail e toque em <b>Esqueci minha senha</b>.</p>
<a class="btn btn-s" href="beepdo://login">Abrir o BeepDo</a></div>
</div></div></div>
${SB}
<script>
for (const b of document.querySelectorAll('.olho')) b.addEventListener('click', () => {
  const i = $(b.dataset.alvo); const ver = i.type === 'password';
  i.type = ver ? 'text' : 'password';
  b.setAttribute('aria-label', ver ? 'Esconder senha' : 'Mostrar senha');
  b.querySelector('svg').innerHTML = ver ? '${OLHO_ABERTO}' : '${OLHO_FECHADO}';
});
$('confirma').addEventListener('input', () => { $('erro').textContent = $('confirma').value && $('confirma').value !== $('senha').value ? 'As senhas não são iguais.' : ''; });
(async () => {
  const token = q.get('token_hash');
  if (!token) return mostrar('erro');
  try {
    const { error } = await sb.auth.verifyOtp({ token_hash: token, type: 'recovery' });
    mostrar(error ? 'erro' : 'form');
    if (!error) setTimeout(() => $('senha').focus(), 50);
  } catch { mostrar('erro'); }
})();
$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const s1 = $('senha').value, s2 = $('confirma').value;
  if (s1.length < 6) { $('erro').textContent = 'A senha deve ter pelo menos 6 caracteres.'; return; }
  if (s1 !== s2) { $('erro').textContent = 'As senhas não são iguais.'; return; }
  $('erro').textContent = ''; $('salvar').disabled = true; $('salvar').textContent = 'Salvando…';
  try {
    const { error } = await sb.auth.updateUser({ password: s1 });
    if (error) { $('erro').textContent = traduz(error.message); return; }
    mostrar('ok'); sb.auth.signOut({ scope: 'local' }).catch(() => {});
  } catch (err) { $('erro').textContent = traduz(err && err.message); }
  finally { $('salvar').disabled = false; $('salvar').textContent = 'Salvar nova senha'; }
});
</script>`,
});


// ---------- painel do suporte (só administradores; o banco garante) ----------
pagina({
  arquivo: 'admin',
  titulo: 'Painel do suporte · BeepDo',
  descricao: 'Área restrita da equipe BeepDo.',
  corpo: `<div class="conta adm"><div class="wrap">
<div data-etapa="entrar" hidden><div class="painel">
<img class="logo" src="/logo.svg" alt=""><h1>Painel do suporte</h1><p>Área restrita da equipe BeepDo.</p>
<form id="fEntrar" novalidate>
<label for="email">E-mail</label><div class="campo"><input id="email" type="email" autocomplete="username" required></div>
${campoSenha('senha','Senha','current-password')}
<p class="msg-erro" id="erroEntrar" role="alert"></p>
<button class="btn btn-p" id="bEntrar" type="submit">Entrar</button>
</form></div></div>
<div data-etapa="negado" hidden><div class="painel">${ICO_ERRO}<h1>Sem acesso</h1><p>Esta conta não é da equipe do BeepDo.</p><button class="btn btn-s" data-sair type="button">Sair</button></div></div>
<div data-etapa="validando"><div class="painel"><div class="carregando"></div></div></div>
<div data-etapa="painel" hidden>
<div class="adm-topo"><div><h1>Painel do suporte</h1><p class="dica" id="quem"></p></div>
<div class="adm-acoes"><button class="btn btn-s" id="bAtualizar" type="button">Atualizar</button><button class="btn btn-s" data-sair type="button">Sair</button></div></div>
<div class="adm-abas"><button type="button" class="adm-aba ativa" data-aba="msg">Mensagens</button><button type="button" class="adm-aba" data-aba="usu">Usuários</button><button type="button" class="adm-aba" data-aba="news">Newsletter</button></div>
<div id="abaMsg">
<div class="adm-filtros" id="fStatus"></div>
<div class="adm-filtros" id="fTipo"></div>
<div id="lista" class="adm-lista"></div>
</div>
<div id="abaUsu" hidden>
<div class="adm-card adm-usu" style="cursor:default;margin-bottom:10px"><div class="adm-card-topo"><b>Limites dos recursos</b><span><button type="button" class="chip ativo" id="bLimEsp" hidden>Salvar</button></span></div><div id="limLista"></div><p class="dica" id="limEspTxt">Grátis e Premium. Projetos Premium: ∞ = sem limite. Cortesias somam extras por pessoa.</p></div>
<div class="campo"><input id="busca" type="search" placeholder="Buscar por nome ou e-mail" autocomplete="off"></div>
<div id="usuarios" class="adm-lista"></div>
</div>
<div id="abaNews" hidden>
<div class="adm-topo" style="margin:0 0 10px"><p class="dica" id="newsResumo" style="margin:0"></p><div class="adm-acoes"><button class="btn btn-s" id="bNewsCsv" type="button">Exportar CSV</button></div></div>
<div class="campo" style="margin-bottom:10px"><input id="buscaNews" type="search" placeholder="Buscar por nome ou e-mail" autocomplete="off"></div>
<div id="newsLista" class="adm-lista"></div>
</div>
</div>
<dialog id="ficha" class="adm-ficha"><form method="dialog" id="fFicha" novalidate>
<div class="adm-ficha-topo"><div><h2 id="fNome"></h2><p class="dica" id="fInfo"></p></div><button class="chip" value="cancel" type="submit" aria-label="Fechar">Fechar</button></div>
<div id="fAdmin"></div>
<h3>Cortesia</h3>
<p class="dica">O sistema continua valendo: grátis ou assinatura. A cortesia só soma por cima.</p>
<label class="adm-sw"><input type="checkbox" id="cPremium"> <span><b>Premium completo</b><br><small>Libera tudo, como a assinatura.</small></span></label>
<div id="avulsos">
<label class="adm-linha">Projetos extras <span class="adm-step"><button type="button" class="chip" data-passo="-1">−</button><b id="cExtra">0</b><button type="button" class="chip" data-passo="1">+</button></span></label>
<p class="dica" id="cLimite"></p>
<label class="adm-linha">Espaços extras <span class="adm-step"><button type="button" class="chip" data-passo-esp="-1">−</button><b id="cExtraEsp">0</b><button type="button" class="chip" data-passo-esp="1">+</button></span></label>
<label class="adm-sw"><input type="checkbox" id="c_temas"> <span>Temas premium</span></label>
<label class="adm-sw"><input type="checkbox" id="c_recorrencia"> <span>Recorrência por regras</span></label>
<label class="adm-sw"><input type="checkbox" id="c_modo_alarme"> <span>Modo alarme</span></label>
<label class="adm-sw"><input type="checkbox" id="c_widget_projeto"> <span>Widget de Projeto</span></label>
<label class="adm-sw"><input type="checkbox" id="c_espacos"> <span>Espaços do Premium</span></label>
<label class="adm-sw"><input type="checkbox" id="c_troca_automatica"> <span>Troca automática de espaço</span></label>
</div>
<h3>Validade</h3>
<div class="adm-filtros" id="cPrazos"></div>
<input id="cData" type="date" hidden>
<p class="dica" id="cPrazoTxt"></p>
<label for="cObs">Observação (só a equipe vê)</label><div class="campo"><input id="cObs" maxlength="500" placeholder="Ex.: parceiro, sorteio, compensação por erro"></div>
<p class="msg-erro" id="fErro" role="alert"></p>
<div class="adm-acoes"><button class="btn btn-p" id="fSalvar" type="button">Salvar</button><button class="btn btn-s" id="fRetirar" type="button">Retirar cortesia</button></div>
</form></dialog>
</div></div>
${SB.replace("persistSession: false, autoRefreshToken: false", "persistSession: true, autoRefreshToken: true, storageKey: 'beepdo-admin'")}
<script>
const TIPOS = { sugestao: 'Sugestão', problema: 'Problema', elogio: 'Elogio' };
const STATUS = { nova: 'Nova', em_analise: 'Em análise', resolvida: 'Resolvida' };
let itens = [], fStatus = 'aguardando', fTipo = 'todos';
const abertas = new Set(), conversas = {};
const aguardando = i => i.status !== 'resolvida' && (i.ultimo_autor || 'usuario') === 'usuario';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
for (const b of document.querySelectorAll('.olho')) b.addEventListener('click', () => {
  const i = $(b.dataset.alvo); const ver = i.type === 'password'; i.type = ver ? 'text' : 'password';
  b.querySelector('svg').innerHTML = ver ? '${OLHO_ABERTO}' : '${OLHO_FECHADO}';
});
for (const b of document.querySelectorAll('[data-sair]')) b.addEventListener('click', async () => { await sb.auth.signOut(); mostrar('entrar'); });
$('bAtualizar').addEventListener('click', () => carregar());
$('fEntrar').addEventListener('submit', async e => {
  e.preventDefault(); $('erroEntrar').textContent = ''; $('bEntrar').disabled = true;
  const { error } = await sb.auth.signInWithPassword({ email: $('email').value.trim().toLowerCase(), password: $('senha').value });
  $('bEntrar').disabled = false;
  if (error) { $('erroEntrar').textContent = /invalid/i.test(error.message) ? 'E-mail ou senha incorretos.' : traduz(error.message); return; }
  iniciar();
});
async function iniciar() {
  mostrar('validando');
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return mostrar('entrar');
  const { data: ok } = await sb.rpc('eh_admin');
  if (!ok) return mostrar('negado');
  $('quem').textContent = 'Conectado como ' + session.user.email;
  mostrar('painel'); carregar();
}
async function carregar() {
  const { data, error } = await sb.from('sugestoes').select('*').order('ultima_atividade', { ascending: false }).limit(1000);
  if (error) { $('lista').innerHTML = '<p class="msg-erro">Não foi possível carregar.</p>'; return; }
  itens = data || []; desenhar();
}
function chip(ativo, texto, attr) { return '<button type="button" class="chip' + (ativo ? ' ativo' : '') + '" ' + attr + '>' + esc(texto) + '</button>'; }
function desenhar() {
  const n = { aguardando: 0, todas: itens.length, nova: 0, em_analise: 0, resolvida: 0 }; for (const i of itens) { n[i.status]++; if (aguardando(i)) n.aguardando++; }
  $('fStatus').innerHTML = ['aguardando','nova','em_analise','resolvida','todas'].map(s => chip(fStatus === s, (s === 'todas' ? 'Todas' : s === 'aguardando' ? 'Aguardando resposta' : STATUS[s]) + ' (' + n[s] + ')', 'data-fs="' + s + '"')).join('');
  $('fTipo').innerHTML = chip(fTipo === 'todos', 'Todos os tipos', 'data-ft="todos"') + Object.entries(TIPOS).map(([k, v]) => chip(fTipo === k, v, 'data-ft="' + k + '"')).join('');
  const lista = itens.filter(i => (fStatus === 'todas' || (fStatus === 'aguardando' ? aguardando(i) : i.status === fStatus)) && (fTipo === 'todos' || i.tipo === fTipo));
  $('lista').innerHTML = lista.length ? lista.map(i => {
    const quando = new Date(i.ultima_atividade || i.criado_em).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const assunto = encodeURIComponent('Re: ' + (TIPOS[i.tipo] || 'Mensagem') + ' no BeepDo');
    const corpo = encodeURIComponent('Olá' + (i.nome ? ', ' + i.nome : '') + '!\\n\\n\\n\\n---\\nSua mensagem:\\n' + i.mensagem);
    return '<article class="adm-card st-' + i.status + '">' +
      '<div class="adm-card-topo"><b>' + esc(TIPOS[i.tipo]) + (aguardando(i) ? ' <span class="adm-selo s-venc">Aguardando resposta</span>' : '') + '</b><span>' + esc(quando) + '</span></div>' +
      '<p class="adm-msg">' + esc(i.mensagem) + '</p>' +
      '<p class="dica">' + esc(i.nome || 'Sem nome') + ' · ' + esc(i.email || 'sem e-mail') + '<br>App ' + esc(i.versao_app || '?') + ' · ' + esc(i.dispositivo || '?') + '</p>' +
      '<div class="adm-card-acoes">' + ['nova','em_analise','resolvida'].map(s => chip(i.status === s, STATUS[s], 'data-id="' + i.id + '" data-st="' + s + '"')).join('') +
      '<button type="button" class="chip resp" data-conv="' + i.id + '">' + (abertas.has(i.id) ? 'Fechar conversa' : 'Conversa (' + (i.respostas || 0) + ')') + '</button>' +
      (i.email ? '<a class="chip" href="mailto:' + esc(i.email) + '?subject=' + assunto + '&body=' + corpo + '">E-mail</a>' : '') + '</div>' +
      (abertas.has(i.id) ? desenharConversa(i) : '') + '</article>';
  }).join('') : '<p class="dica" style="text-align:center;padding:40px 0">Nenhuma mensagem aqui.</p>';
}
document.addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.fs) { fStatus = b.dataset.fs; desenhar(); }
  else if (b.dataset.ft) { fTipo = b.dataset.ft; desenhar(); }
  else if (b.dataset.conv) { const id = b.dataset.conv; if (abertas.has(id)) abertas.delete(id); else { abertas.add(id); carregarConversa(id); } desenhar(); }
  else if (b.dataset.enviar) { enviarResposta(b.dataset.enviar, b); }
  else if (b.dataset.st) {
    const it = itens.find(x => x.id === b.dataset.id); if (!it || it.status === b.dataset.st) return;
    const antes = it.status; it.status = b.dataset.st; desenhar();
    const { error } = await sb.from('sugestoes').update({ status: it.status }).eq('id', it.id);
    if (error) { it.status = antes; desenhar(); alert('Não deu pra mudar o status.'); }
  }
});
// ---------- Conversa (histórico e resposta pelo painel) ----------
function desenharConversa(i) {
  const rs = conversas[i.id];
  const balao = (quem, texto, quando, equipe) => '<div class="adm-balao' + (equipe ? ' eq' : '') + '"><b>' + esc(quem) + '</b><p>' + esc(texto) + '</p><small>' + esc(new Date(quando).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })) + '</small></div>';
  let h = '<div class="adm-conversa">';
  if (!rs) h += '<div class="carregando"></div>';
  else {
    h += rs.length ? rs.map(r => balao(r.da_equipe ? (r.autor_nome || 'Equipe') : (i.nome || 'Usuário'), r.mensagem, r.criado_em, r.da_equipe)).join('') : '<p class="dica">Ainda sem respostas. A mensagem original está acima.</p>';
  }
  h += '<textarea id="resp-' + i.id + '" rows="3" maxlength="2000" placeholder="Responder como equipe BeepDo (o usuário recebe no app)"></textarea>' +
    '<div class="adm-card-acoes"><button type="button" class="btn btn-p adm-enviar" data-enviar="' + i.id + '">Enviar resposta</button></div></div>';
  return h;
}
async function carregarConversa(id) {
  const { data, error } = await sb.from('sugestoes_respostas').select('*').eq('sugestao_id', id).order('criado_em', { ascending: true });
  conversas[id] = error ? [] : (data || []);
  desenhar();
}
async function enviarResposta(id, botao) {
  const campo = $('resp-' + id); const msg = (campo && campo.value || '').trim();
  if (!msg) { campo && campo.focus(); return; }
  const { data: { session } } = await sb.auth.getSession(); if (!session) return mostrar('entrar');
  botao.disabled = true; botao.textContent = 'Enviando…';
  const { error } = await sb.from('sugestoes_respostas').insert({ sugestao_id: id, autor_id: session.user.id, autor_nome: 'Equipe BeepDo', da_equipe: true, mensagem: msg });
  if (error) { botao.disabled = false; botao.textContent = 'Enviar resposta'; alert('Não deu pra enviar: ' + error.message); return; }
  await carregar(); await carregarConversa(id);
}
// ---------- Usuários e cortesias ----------
const RECS = ['temas', 'recorrencia', 'modo_alarme', 'widget_projeto', 'espacos', 'troca_automatica'];
const LIMITE_GRATIS = 3;
let usuarios = [], souDono = false, atual = null, extra = 0, extraEsp = 0, prazo = 'sem', tBusca = null;
const dataBR = iso => iso ? new Date(iso).toLocaleDateString('pt-BR') : '';
const temAlgo = c => !!c && (c.premium || c.projetos_extra > 0 || c.espacos_extra > 0 || RECS.some(r => c[r]));
const vencida = c => !!(c && c.expira_em) && new Date(c.expira_em).getTime() <= Date.now();
for (const b of document.querySelectorAll('.adm-aba')) b.addEventListener('click', () => {
  for (const x of document.querySelectorAll('.adm-aba')) x.classList.toggle('ativa', x === b);
  $('abaMsg').hidden = b.dataset.aba !== 'msg'; $('abaUsu').hidden = b.dataset.aba !== 'usu'; $('abaNews').hidden = b.dataset.aba !== 'news';
  if (b.dataset.aba === 'usu' && !usuarios.length) carregarUsuarios();
if (b.dataset.aba === 'usu' && limEsp === null) carregarLimite();
});
// ---------- Newsletter: inscritos ----------
let inscritos = null;
async function carregarNews() {
  $('newsLista').innerHTML = '<div class="carregando"></div>';
  const { data, error } = await sb.rpc('newsletter_listar');
  if (error) { $('newsLista').innerHTML = '<p class="msg-erro">Não foi possível carregar os inscritos.</p>'; return; }
  inscritos = data || []; desenharNews();
}
function desenharNews() {
  const termo = $('buscaNews').value.trim().toLowerCase();
  const ativos = inscritos.filter(i => !i.cancelado_em).length;
  $('newsResumo').textContent = ativos + ' inscritos ativos · ' + (inscritos.length - ativos) + ' cancelados';
  const lista = inscritos.filter(i => !termo || (i.email + ' ' + (i.nome || '')).toLowerCase().includes(termo));
  $('newsLista').innerHTML = lista.length ? lista.map(i => '<div class="adm-card adm-usu" style="cursor:default' + (i.cancelado_em ? ';opacity:.55' : '') + '"><div class="adm-card-topo"><b>' + esc(i.email) + '</b><span>' + esc(new Date(i.criado_em).toLocaleDateString('pt-BR')) + '</span></div><p class="dica">' + esc(i.nome || 'Sem nome') + ' · origem: ' + esc(i.origem || 'site') + (i.cancelado_em ? ' · cancelou em ' + esc(new Date(i.cancelado_em).toLocaleDateString('pt-BR')) : '') + '</p></div>').join('') : '<p class="dica" style="text-align:center;padding:40px 0">Ninguém inscrito ainda.</p>';
}
$('buscaNews').addEventListener('input', () => inscritos && desenharNews());
$('bNewsCsv').addEventListener('click', () => {
  if (!inscritos) return;
  const cel = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const linhas = [['email','nome','origem','inscrito_em','cancelado_em'].join(';')].concat(inscritos.filter(i => !i.cancelado_em).map(i => [i.email, i.nome, i.origem, i.criado_em, i.cancelado_em].map(cel).join(';')));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\\ufeff' + linhas.join('\\r\\n')], { type: 'text/csv;charset=utf-8' }));
  a.download = 'newsletter-beepdo.csv'; a.click();
});
for (const b of document.querySelectorAll('.adm-aba[data-aba="news"]')) b.addEventListener('click', () => { if (!inscritos) carregarNews(); });
$('busca').addEventListener('input', () => { clearTimeout(tBusca); tBusca = setTimeout(carregarUsuarios, 400); });
async function carregarUsuarios() {
  $('usuarios').innerHTML = '<div class="carregando"></div>';
  const [{ data, error }, { data: dono }] = await Promise.all([sb.rpc('admin_usuarios', { p_busca: $('busca').value.trim() }), sb.rpc('eh_dono')]);
  souDono = !!dono;
  if (error) { $('usuarios').innerHTML = '<p class="msg-erro">Não foi possível carregar os usuários.</p>'; return; }
  usuarios = data || []; desenharUsuarios();
}
function selo(t, cls) { return '<span class="adm-selo ' + cls + '">' + esc(t) + '</span>'; }
function desenharUsuarios() {
  $('usuarios').innerHTML = usuarios.length ? usuarios.map(u => {
    const c = u.cortesia;
    const selos = (u.dono ? selo('Dono', 's-dono') : u.admin ? selo('Admin', 's-admin') : '') +
      (temAlgo(c) ? selo(vencida(c) ? 'Cortesia vencida' : c.premium ? 'Premium cortesia' : 'Cortesia', vencida(c) ? 's-venc' : 's-cort') : '');
    return '<button type="button" class="adm-card adm-usu" data-u="' + u.id + '"><div class="adm-card-topo"><b>' + esc(u.nome || 'Sem nome') + '</b><span>' + selos + '</span></div>' +
      '<p class="dica">' + esc(u.email) + '<br>' + u.projetos + ' projetos · ' + u.tarefas + ' tarefas · desde ' + dataBR(u.criado_em) + (u.ultimo_acesso ? ' · último acesso ' + dataBR(u.ultimo_acesso) : '') + '</p></button>';
  }).join('') : '<p class="dica" style="text-align:center;padding:40px 0">Nenhum usuário encontrado.</p>';
}
function abrirFicha(u) {
  atual = u; const c = u.cortesia || {};
  $('fNome').textContent = u.nome || 'Sem nome';
  $('fInfo').textContent = u.email + ' · ' + u.projetos + ' projetos · ' + u.tarefas + ' tarefas';
  $('fErro').textContent = '';
  if (u.dono) $('fAdmin').innerHTML = '<p class="adm-aviso">Conta do dono: tem tudo liberado e ninguém pode alterar.</p>';
  else if (souDono) $('fAdmin').innerHTML = '<label class="adm-sw"><input type="checkbox" id="cAdmin"' + (u.admin ? ' checked' : '') + '> <span><b>Administrador</b><br><small>Vê o painel do suporte e dá cortesias. Só você muda isso.</small></span></label>';
  else $('fAdmin').innerHTML = u.admin ? '<p class="adm-aviso">Administrador: já tem tudo liberado.</p>' : '';
  const bloqueado = !!u.dono;
  $('cPremium').checked = !!c.premium; extra = c.projetos_extra || 0; extraEsp = c.espacos_extra || 0;
  for (const r of RECS) $('c_' + r).checked = !!c[r];
  $('cObs').value = c.observacao || '';
  prazo = c.expira_em ? 'data' : 'sem'; $('cData').value = c.expira_em ? c.expira_em.slice(0, 10) : '';
  for (const el of $('fFicha').querySelectorAll('input, #fSalvar, #fRetirar, [data-passo], [data-prazo]')) if (el.id !== 'cAdmin') el.disabled = bloqueado;
  $('fRetirar').hidden = !temAlgo(u.cortesia);
  atualizarFicha(); $('ficha').showModal();
}
function atualizarFicha() {
  const prem = $('cPremium').checked;
  $('avulsos').style.opacity = prem ? .45 : 1;
  for (const el of $('avulsos').querySelectorAll('input, button')) el.disabled = prem || !!(atual && atual.dono);
  $('cExtra').textContent = extra; $('cExtraEsp').textContent = extraEsp;
  $('cLimite').textContent = 'Limite de projetos: ' + (LIMITE_GRATIS + extra) + ' (grátis ' + LIMITE_GRATIS + ' + ' + extra + ')';
  $('cPrazos').innerHTML = [['sem', 'Sem prazo'], ['7', '7 dias'], ['30', '30 dias'], ['365', '1 ano'], ['data', 'Escolher data']].map(([k, v]) => chip(prazo === k, v, 'data-prazo="' + k + '"')).join('');
  $('cData').hidden = prazo !== 'data';
  const exp = expiraEm();
  $('cPrazoTxt').textContent = exp ? 'Vale até ' + dataBR(exp) + ' (fim do dia).' : prazo === 'data' ? 'Escolha a data.' : 'Vale até você retirar.';
}
function expiraEm() {
  if (prazo === 'sem') return null;
  let d;
  if (prazo === 'data') { if (!$('cData').value) return null; const p = $('cData').value.split('-'); d = new Date(+p[0], +p[1] - 1, +p[2]); }
  else { d = new Date(); d.setDate(d.getDate() + Number(prazo)); }
  d.setHours(23, 59, 59, 0); return d.toISOString();
}
$('cPremium').addEventListener('change', atualizarFicha);
$('cData').addEventListener('change', atualizarFicha);
$('fFicha').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.passoEsp) { extraEsp = Math.max(0, Math.min(100, extraEsp + Number(b.dataset.passoEsp))); atualizarFicha(); }
else if (b.dataset.passo) { extra = Math.max(0, Math.min(1000, extra + Number(b.dataset.passo))); atualizarFicha(); }
  else if (b.dataset.prazo) { prazo = b.dataset.prazo; atualizarFicha(); }
});
$('fSalvar').addEventListener('click', async () => {
  const u = atual; if (!u || u.dono) return;
  $('fErro').textContent = '';
  if (prazo === 'data' && !$('cData').value) { $('fErro').textContent = 'Escolha a data de validade.'; return; }
  const exp = expiraEm();
  if (exp && new Date(exp).getTime() <= Date.now()) { $('fErro').textContent = 'A data precisa ser no futuro.'; return; }
  $('fSalvar').disabled = true;
  try {
    const cA = $('cAdmin');
    if (souDono && cA && cA.checked !== !!u.admin) {
      const { error } = await sb.rpc('definir_admin', { p_user: u.id, p_admin: cA.checked });
      if (error) throw error;
    }
    const prem = $('cPremium').checked;
    const c = { user_id: u.id, premium: prem, projetos_extra: prem ? 0 : extra, espacos_extra: prem ? 0 : extraEsp, expira_em: exp, observacao: $('cObs').value.trim() || null };
    for (const r of RECS) c[r] = !prem && $('c_' + r).checked;
    if (temAlgo(c)) { const { error } = await sb.from('cortesias').upsert(c, { onConflict: 'user_id' }); if (error) throw error; }
    else if (u.cortesia) { const { error } = await sb.from('cortesias').delete().eq('user_id', u.id); if (error) throw error; }
    $('ficha').close(); carregarUsuarios();
  } catch (err) { $('fErro').textContent = 'Não deu pra salvar: ' + ((err && err.message) || 'erro'); }
  finally { $('fSalvar').disabled = false; }
});
$('fRetirar').addEventListener('click', async () => {
  const u = atual; if (!u || u.dono || !confirm('Retirar a cortesia de ' + (u.nome || u.email) + '?')) return;
  const { error } = await sb.from('cortesias').delete().eq('user_id', u.id);
  if (error) { $('fErro').textContent = 'Não deu pra retirar.'; return; }
  $('ficha').close(); carregarUsuarios();
});
// ---------- Limites dos recursos ----------
const LIMS = [['projetos_gratis', 'Projetos · grátis', 1], ['projetos_premium', 'Projetos · Premium', 0], ['espacos_gratis', 'Espaços · grátis', 1], ['espacos_premium', 'Espaços · Premium', 2], ['horarios_espaco', 'Horários por espaço', 1]];
let limEsp = null, limSalvo = null;
async function carregarLimite() { const { data } = await sb.rpc('limites_app'); if (data) { limEsp = Object.assign({}, data); limSalvo = Object.assign({}, data); desenharLimite(); } }
function desenharLimite() {
$('limLista').innerHTML = LIMS.map(([k, r]) => '<div class="adm-linha">' + esc(r) + ' <span class="adm-step"><button type="button" class="chip" data-lim="-1" data-k="' + k + '">−</button><b>' + (k === 'projetos_premium' && limEsp[k] === 0 ? '∞' : limEsp[k]) + '</b><button type="button" class="chip" data-lim="1" data-k="' + k + '">+</button></span></div>').join('');
$('bLimEsp').hidden = LIMS.every(([k]) => limEsp[k] === limSalvo[k]);
}
$('abaUsu').addEventListener('click', async e => {
const b = e.target.closest('button'); if (!b) return;
if (b.dataset.lim && limEsp) { const d = LIMS.find(x => x[0] === b.dataset.k); limEsp[d[0]] = Math.max(d[2], Math.min(1000, limEsp[d[0]] + Number(b.dataset.lim))); desenharLimite(); }
else if (b.id === 'bLimEsp') {
b.disabled = true;
for (const [k] of LIMS) {
if (limEsp[k] === limSalvo[k]) continue;
const { data, error } = await sb.rpc('admin_definir_limite', { p_limite: k, p_valor: limEsp[k] });
if (error) { b.disabled = false; alert('Não deu pra salvar: ' + error.message); return; }
limSalvo = Object.assign({}, data);
}
b.disabled = false; limEsp = Object.assign({}, limSalvo); desenharLimite(); $('limEspTxt').textContent = 'Limites salvos. Valem quando cada pessoa abrir o app.';
}
});
$('usuarios').addEventListener('click', e => { const b = e.target.closest('[data-u]'); if (b) abrirFicha(usuarios.find(x => x.id === b.dataset.u)); });
iniciar();
</script>`,
});

pagina({
  arquivo: '404',
  titulo: 'Página não encontrada · BeepDo',
  descricao: 'Página não encontrada.',
  corpo: `<div class="doc"><div class="wrap estreito" style="text-align:center;padding:60px 20px"><h1>Página não encontrada</h1><p>O endereço pode ter mudado. <a href="/">Voltar ao início</a> ou veja as <a href="/faq">perguntas frequentes</a>.</p></div></div>`,
});

// ---------- BLOG: lista, posts, feed ----------
pagina({
  arquivo: 'blog/index',
  titulo: 'Blog do BeepDo · Dicas de organização e produtividade',
  descricao: 'Dicas práticas para organizar tarefas, rotina e projetos, e novidades do app BeepDo.',
  corpo: `<div class="doc blog"><div class="wrap">
<div class="migalha"><a href="/">Início</a> › Blog</div>
<h1>Blog do BeepDo</h1>
<p class="sub">Trabalho, rotina e prazos: ideias práticas para dar conta do dia a dia sem deixar nada passar.</p>
${chipsCats()}
${destaquePost(POSTS[0])}
<div class="post-grade">
${POSTS.slice(1).map(cartaoPost).join('\n')}
</div>
<div style="margin-top:48px">${newsletterBox('blog')}</div>
</div></div>
${NEWS_JS}`,
});

CATS.forEach(c => {
  const lista = POSTS.filter(p => p.categoria === c);
  pagina({
    arquivo: `blog/categoria/${slugCat(c)}`,
    titulo: `${c} · Blog do BeepDo`,
    descricao: `Posts sobre ${c.toLowerCase()} no blog do BeepDo: ideias práticas para organizar tarefas, rotina e prazos.`,
    corpo: `<div class="doc blog"><div class="wrap">
<div class="migalha"><a href="/">Início</a> › <a href="/blog/">Blog</a> › ${esc(c)}</div>
<h1>${esc(c)}</h1>
${chipsCats(c)}
<div class="post-grade">
${lista.map(cartaoPost).join('\n')}
</div>
<div style="margin-top:48px">${newsletterBox('blog:' + slugCat(c))}</div>
</div></div>
${NEWS_JS}`,
  });
});

POSTS.forEach((p, i) => {
  const outros = [...POSTS.filter(x => x.slug !== p.slug && x.categoria === p.categoria), ...POSTS.filter(x => x.slug !== p.slug && x.categoria !== p.categoria)].slice(0, 3);
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: p.titulo, description: p.resumo, datePublished: p.data, dateModified: p.data,
    inLanguage: 'pt-BR', mainEntityOfPage: `https://beepdo.app/blog/${p.slug}`,
    author: { '@type': 'Organization', name: 'BeepDo' },
    publisher: { '@type': 'Organization', name: 'BeepDo', logo: { '@type': 'ImageObject', url: 'https://beepdo.app/favicon.png' } },
  };
  pagina({
    arquivo: `blog/${p.slug}`,
    titulo: `${p.titulo} · Blog do BeepDo`,
    descricao: p.resumo,
    tipo: 'article',
    head: `\n<meta property="article:published_time" content="${p.data}">\n<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    corpo: `<article class="doc post"><div class="wrap estreito">
<div class="migalha"><a href="/">Início</a> › <a href="/blog/">Blog</a> › <a href="/blog/categoria/${slugCat(p.categoria)}">${esc(p.categoria)}</a></div>
${capaPost(p, true)}
<span class="post-cat">${esc(p.categoria)}</span>
<h1>${esc(p.titulo)}</h1>
<p class="data">${dataPost(p.data)} · ${p.leitura} min de leitura</p>
<div class="post-corpo">${p.corpo}</div>
<div class="caixa post-cta"><b>Experimente o BeepDo.</b> Tarefas com alarme que toca de verdade, projetos, recorrências e widgets. Grátis para começar. <a href="/#premium">Conhecer os planos ›</a></div>
<div style="margin-top:36px">${newsletterBox('post:' + p.slug, 'Gostou? Receba os próximos posts')}</div>
${outros.length ? `<h2 style="margin-top:48px">Leia também</h2><div class="post-grade mini">${outros.map(cartaoPost).join('\n')}</div>` : ''}
</div></article>
${NEWS_JS}`,
  });
});

const xml = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
fs.writeFileSync(`${OUT}/blog/feed.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Blog do BeepDo</title>
<link>https://beepdo.app/blog/</link>
<atom:link href="https://beepdo.app/blog/feed.xml" rel="self" type="application/rss+xml"/>
<description>Dicas de organização, produtividade e novidades do app BeepDo.</description>
<language>pt-BR</language>
${POSTS.map(p => `<item>
<title>${xml(p.titulo)}</title>
<link>https://beepdo.app/blog/${p.slug}</link>
<guid>https://beepdo.app/blog/${p.slug}</guid>
<pubDate>${new Date(p.data + 'T12:00:00-03:00').toUTCString()}</pubDate>
<category>${xml(p.categoria)}</category>
<description>${xml(p.resumo)}</description>
</item>`).join('\n')}
</channel>
</rss>
`);

// ---------- NEWSLETTER: cancelar inscrição e script do formulário ----------
pagina({
  arquivo: 'newsletter-cancelar',
  titulo: 'Cancelar newsletter · BeepDo',
  descricao: 'Cancelar a inscrição na newsletter do BeepDo.',
  corpo: `<div class="conta"><div class="wrap">
<div data-etapa="validando"><div class="painel"><div class="carregando"></div><p>Cancelando sua inscrição…</p></div></div>
<div data-etapa="ok" hidden><div class="painel">${ICO_OK}<h1>Inscrição cancelada</h1><p>Você não vai mais receber a newsletter do BeepDo. Se mudar de ideia, é só se inscrever de novo no site.</p><a class="btn btn-s" href="/">Voltar ao início</a></div></div>
<div data-etapa="erro" hidden><div class="painel">${ICO_ERRO}<h1>Link inválido</h1><p>Não encontramos essa inscrição, ou ela já foi cancelada. Se continuar recebendo e-mails, fale com <a href="mailto:${E.email}">${E.email}</a>.</p><a class="btn btn-s" href="/">Voltar ao início</a></div></div>
</div></div>
<script src="/newsletter.js"></script>
<script>
(async () => {
  const mostrar = id => { for (const e of document.querySelectorAll('[data-etapa]')) e.hidden = e.dataset.etapa !== id; };
  const t = new URLSearchParams(location.search).get('t') || '';
  if (!/^[0-9a-f-]{36}$/i.test(t)) return mostrar('erro');
  try { mostrar((await window.BeepDoNews.cancelar(t)) ? 'ok' : 'erro'); } catch { mostrar('erro'); }
})();
</script>`,
});

fs.writeFileSync(`${OUT}/newsletter.js`, `// Newsletter do BeepDo: inscrição e cancelamento (funções no Supabase).
(() => {
  const URL_SB = '__SB_URL__', CHAVE = '__SB_KEY__';
  const rpc = async (nome, corpo) => {
    const r = await fetch(URL_SB + '/rest/v1/rpc/' + nome, {
      method: 'POST',
      headers: { apikey: CHAVE, Authorization: 'Bearer ' + CHAVE, 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    const dados = await r.json().catch(() => null);
    if (!r.ok) throw new Error((dados && dados.message) || 'erro');
    return dados;
  };
  window.BeepDoNews = {
    inscrever: (email, nome, origem) => rpc('newsletter_inscrever', { p_email: email, p_nome: nome || null, p_origem: origem || 'site' }),
    cancelar: token => rpc('newsletter_cancelar', { p_token: token }),
  };
  const emailOk = e => /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(e);
  for (const f of document.querySelectorAll('.news-form')) {
    const msg = f.querySelector('.news-msg');
    const botao = f.querySelector('button[type=submit]');
    const aviso = (t, ok) => { msg.textContent = t; msg.className = 'news-msg ' + (ok ? 'ok' : 'erro'); };
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const email = f.email.value.trim().toLowerCase();
      if (!emailOk(email)) return aviso('Confira o e-mail digitado.');
      if (!f.aceite.checked) return aviso('Marque a caixa para aceitar receber os e-mails.');
      botao.disabled = true; const texto = botao.textContent; botao.textContent = 'Enviando…';
      try {
        await window.BeepDoNews.inscrever(email, f.nome.value.trim(), f.dataset.origem);
        f.reset();
        aviso('Pronto! Você está na lista. Obrigado por acompanhar o BeepDo.', true);
      } catch (err) {
        aviso(/inv[aá]lido/i.test(err.message) ? 'Confira o e-mail digitado.' : 'Não deu certo agora. Tente de novo em instantes.');
      } finally { botao.disabled = false; botao.textContent = texto; }
    });
  }
})();
`);

for (const f of ['styles.css','logo.svg','widget-hoje.png','widget-projeto.png']) fs.copyFileSync(f, `${OUT}/${f}`);
fs.copyFileSync('/home/claude/beepdo-assets/favicon.png', `${OUT}/favicon.png`);
fs.writeFileSync(`${OUT}/CNAME`, 'beepdo.app\n');
// GitHub Pages sem Jekyll, senão a pasta .well-known não é publicada.
fs.writeFileSync(`${OUT}/.nojekyll`, '');
// Android App Links: os links de confirmar e-mail e nova senha abrem o app.
// Chaves: assinatura do Google Play e a de upload (builds de teste do EAS).
fs.mkdirSync(`${OUT}/.well-known`, { recursive: true });
fs.writeFileSync(`${OUT}/.well-known/assetlinks.json`, JSON.stringify([{
  relation: ['delegate_permission/common.handle_all_urls'],
  target: { namespace: 'android_app', package_name: 'com.beepdo.app', sha256_cert_fingerprints: [
    '0D:C1:E6:92:F4:40:47:2B:12:A3:41:76:A3:D4:B7:B0:53:B6:17:DB:52:4D:82:4E:BE:74:75:C9:14:68:F7:0F',
    '6A:70:55:7A:A0:49:70:A2:70:F2:0E:83:DE:15:F9:9D:5B:00:BB:E8:D5:AE:6F:43:E0:31:13:16:0A:EE:7A:5E',
  ] },
}], null, 2) + '\n');
fs.writeFileSync(`${OUT}/robots.txt`, 'User-agent: *\nAllow: /\nSitemap: https://beepdo.app/sitemap.xml\n');
fs.writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['','blog/','faq','cancelamento','privacidade','termos','excluir-conta', ...CATS.map(c => 'blog/categoria/' + slugCat(c)), ...POSTS.map(p => 'blog/' + p.slug)].map(p=>`  <url><loc>https://beepdo.app/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('ok', fs.readdirSync(OUT).join(' '));
