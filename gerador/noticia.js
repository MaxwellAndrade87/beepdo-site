// Escreve UMA matéria nova sobre um assunto do momento, usando a OpenAI com busca na web.
// Salva em gerador/noticias.json (a mais nova primeiro). Depois o workflow gera a capa,
// refaz as páginas e publica.
//
// Variáveis de ambiente:
//   OPENAI_API_KEY  (obrigatória)
//   MODELO_TEXTO    força um modelo (senão tenta a lista MODELOS abaixo, em ordem)
//   EDITORIA        força a editoria desta matéria (senão escolhe pelo horário)

const fs = require('fs');
const todos = require('./todos.js');

const CHAVE = process.env.OPENAI_API_KEY;
if (!CHAVE) { console.error('Falta OPENAI_API_KEY.'); process.exit(1); }
const MODELOS = process.env.MODELO_TEXTO ? [process.env.MODELO_TEXTO] : ['gpt-6.1-sol', 'gpt-6-astra', 'gpt-5', 'gpt-6-luna'];

const EDITORIAS = ['Brasil', 'Mundo', 'Economia', 'Tecnologia', 'Trabalho', 'Dia a dia', 'Produtividade'];
const CORES = {
  Brasil: ['#1F9D63', '#2BB673'], Mundo: ['#2563EB', '#4F86F7'], Economia: ['#B26A00', '#E59A1A'], Tecnologia: ['#6D4AE0', '#8B7CF6'],
  Trabalho: ['#0E7490', '#14A3C2'], 'Dia a dia': ['#BE185D', '#E5487F'], Produtividade: ['#4338CA', '#6366F1'], 'Dicas do app': ['#6D4AE0', '#B25AE0'],
};

// Horário de Brasília
const agora = new Date(Date.now() - 3 * 3600e3);
const data = agora.toISOString().slice(0, 10);
const hora = agora.toISOString().slice(11, 16);
const turno = agora.getUTCHours() < 11 ? 'manhã' : agora.getUTCHours() < 16 ? 'tarde' : 'noite';
// Gira as editorias pra não ficar tudo no mesmo assunto: muda por dia e por turno.
const dia = Math.floor(agora / 86400e3);
const sugestao = process.env.EDITORIA || EDITORIAS[(dia * 3 + ['manhã', 'tarde', 'noite'].indexOf(turno)) % EDITORIAS.length];

const recentes = todos().slice().sort((a, b) => (b.data + (b.hora || '')).localeCompare(a.data + (a.hora || ''))).slice(0, 40);

const PEDIDO = `Você é editor do blog/portal do BeepDo (beepdo.app/blog), um app brasileiro de tarefas com alarme.
Hoje é ${data}, ${hora} no horário de Brasília (${turno}).

TAREFA: pesquise na web as notícias mais relevantes das últimas 24 horas e escreva UMA matéria original em português do Brasil.
Editoria preferida desta vez: "${sugestao}". Se não houver nada bom nela, use outra desta lista: ${EDITORIAS.join(', ')}.

O assunto NÃO pode repetir nenhum destes títulos recentes:
${recentes.map(p => '- ' + p.titulo).join('\n')}

REGRAS:
- Só fatos confirmados por fontes confiáveis (agências, jornais e portais conhecidos, órgãos oficiais). Nada de boato.
- Texto escrito do zero, com as suas palavras. Não copie frases das fontes. Não invente citações nem números.
- Linguagem simples e direta, tom de portal de notícia. Entre 500 e 900 palavras.
- Use pelo menos 2 fontes de veículos DIFERENTES e cruze as informações. Nunca reescreva uma matéria só.
- Explique o que aconteceu e por que importa. OBRIGATÓRIO: uma seção própria com um <h2> que comece com "O que isso muda" ou "O que fazer agora", com análise e dicas práticas do BeepDo para o leitor (prazos, contas, rotina, trabalho). É a parte que faz a matéria ser nossa e não só um resumo.

SEO (Google):
- Escolha uma palavra-chave principal: o termo que as pessoas digitariam no Google sobre esse assunto (ex.: "ata do Copom", "Selic", "prova do Enem 2026").
- Título com até 65 caracteres, com a palavra-chave no começo, claro e sem sensacionalismo.
- Resumo entre 130 e 155 caracteres, com a palavra-chave, convidando a ler.
- Slug com 3 a 7 palavras, contendo a palavra-chave, sem datas e sem palavras vazias (de, da, o, a).
- A palavra-chave aparece no primeiro parágrafo, que já responde o essencial (o quê, quem, quando).
- 3 a 5 subtítulos <h2> descritivos, de preferência como as perguntas que as pessoas fazem ("Quando sai...", "Quem tem direito...").
- Parágrafos curtos (2 a 4 frases). Use listas quando ajudar.
- Pode citar o BeepDo no máximo uma vez, de leve, só se combinar com o assunto (prazos, rotina, lembretes). Em tragédias, crimes, mortes ou temas sensíveis, NÃO cite o BeepDo.
- Nunca use travessão (— ou –). Use hífen, vírgula ou ponto.
- Não coloque links, citações entre parênteses nem nomes de sites no meio do texto. As fontes vão só no campo "fontes".
- O corpo é HTML simples: só <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>. Sem links no corpo (as fontes vão separadas). Não repita o título no corpo.
- imagemPrompt: descreva em português uma cena fotográfica ILUSTRATIVA ligada ao tema, com pessoas comuns e lugares genéricos. Proibido: pessoas famosas ou reais, políticos, logotipos, marcas, bandeiras de partido, texto, cenas violentas ou de tragédia.

Responda SOMENTE com um JSON válido, sem nada antes ou depois, neste formato:
{"palavraChave":"termo principal","tags":["3 a 5 termos relacionados"],"titulo":"até 65 caracteres","resumo":"130 a 155 caracteres","categoria":"uma das editorias","slug":"so-letras-minusculas-e-hifens","corpo":"<p>...</p>","fontes":[{"nome":"só o nome curto do veículo ou órgão, ex.: AFP, Le Monde, Agência Brasil, IBGE","url":"https://..."}],"imagemPrompt":"...","emoji":"um emoji"}`;

async function pedir(modelo, aviso = '') {
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelo,
      tools: [{ type: 'web_search', user_location: { type: 'approximate', country: 'BR', timezone: 'America/Sao_Paulo' } }],
      input: aviso ? `${PEDIDO}\n\nATENÇÃO, a tentativa anterior foi recusada: ${aviso}` : PEDIDO,
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${j.error?.message || JSON.stringify(j).slice(0, 300)}`);
  const texto = j.output_text ?? (j.output || []).filter(o => o.type === 'message').flatMap(o => o.content || []).map(c => c.text || '').join('\n');
  const citadas = (j.output || []).filter(o => o.type === 'message').flatMap(o => o.content || []).flatMap(c => c.annotations || [])
    .filter(a => a.type === 'url_citation' && a.url).map(a => ({ nome: '', url: a.url }));
  return { texto, citadas, uso: j.usage };
}

// Nome bonito da fonte: "AFP" em vez de "swissinfo.ch" ou "AFP, publicada pela SWI...".
const VEICULOS = {
  'agenciabrasil.ebc.com.br': 'Agência Brasil', 'g1.globo.com': 'g1', 'oglobo.globo.com': 'O Globo', 'valor.globo.com': 'Valor Econômico',
  'folha.uol.com.br': 'Folha de S.Paulo', 'www1.folha.uol.com.br': 'Folha de S.Paulo', 'estadao.com.br': 'Estadão', 'cnnbrasil.com.br': 'CNN Brasil',
  'bbc.com': 'BBC', 'reuters.com': 'Reuters', 'apnews.com': 'AP', 'afp.com': 'AFP', 'lemonde.fr': 'Le Monde', 'nytimes.com': 'The New York Times',
  'theguardian.com': 'The Guardian', 'swissinfo.ch': 'Swissinfo', 'dw.com': 'DW', 'infomoney.com.br': 'InfoMoney', 'exame.com': 'Exame',
  'uol.com.br': 'UOL', 'poder360.com.br': 'Poder360', 'metropoles.com': 'Metrópoles', 'bcb.gov.br': 'Banco Central', 'ibge.gov.br': 'IBGE',
  'gov.br': 'Governo Federal', 'globalcarbonbudget.org': 'Global Carbon Project', 'who.int': 'OMS', 'un.org': 'ONU', 'tecmundo.com.br': 'TecMundo',
  'tecnoblog.net': 'Tecnoblog', 'olhardigital.com.br': 'Olhar Digital', 'theverge.com': 'The Verge', 'bloomberg.com': 'Bloomberg', 'ft.com': 'Financial Times',
};
const nomeFonte = (url, sugerido) => {
  const host = new URL(url).hostname.replace(/^www\./, '');
  const achado = Object.keys(VEICULOS).find(d => host === d || host.endsWith('.' + d));
  if (achado) return VEICULOS[achado];
  const s = String(sugerido || '').trim();
  if (s && s.length <= 30 && !/[,(]|publicad|https?:|\.\w{2,3}$/i.test(s)) return s;
  const base = host.split('.').slice(-3).find(x => x.length > 3 && !['com', 'org', 'gov', 'net'].includes(x)) || host;
  return base.charAt(0).toUpperCase() + base.slice(1);
};

const slugar = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '');
const semTravessao = s => String(s).replace(/\s*[—–]\s*/g, ' - ');
const limparHtml = h => semTravessao(h)
  .replace(/\s*\(\s*\[[^\]]*\]\([^)]*\)\s*\)/g, '')   // ([site](url)) que a busca coloca
  .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1')         // [texto](url)
  .replace(/<\s*(script|style|iframe|object|embed|form)[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
  .replace(/<(?!\/?(p|h2|h3|ul|ol|li|strong|em|b|i|blockquote|br)\b)[^>]*>/gi, '')
  .replace(/<(\w+)\s[^>]*>/g, '<$1>')
  .replace(/^\s*<h1>[\s\S]*?<\/h1>/i, '')
  .trim();

// ---------- checagem de cópia ----------
// Baixa as fontes e compara: trechos de 8 palavras seguidas iguais às fontes contam como "parecidos".
const normal = t => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/[^a-z0-9%]+/g, ' ').trim().split(' ').filter(Boolean);
const N = 8;
async function textoDaFonte(url) {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000);
    const r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BeepDoBlog/1.0)', 'Accept-Language': 'pt-BR,pt;q=0.9' } });
    clearTimeout(t);
    if (!r.ok || !/html|text/.test(r.headers.get('content-type') || '')) return null;
    return normal(await r.text());
  } catch { return null; }
}
async function checarCopia(corpo, fontes) {
  const pal = normal(corpo);
  const textos = (await Promise.all(fontes.map(f => textoDaFonte(f.url)))).filter(t => t && t.length > 150);
  if (!textos.length || pal.length < N) return { ok: true, lidas: 0, taxa: 0, trechos: [] };
  const grams = new Set();
  textos.forEach(t => { for (let i = 0; i + N <= t.length; i++) grams.add(t.slice(i, i + N).join(' ')); });
  const marca = new Array(pal.length).fill(false);
  for (let i = 0; i + N <= pal.length; i++) if (grams.has(pal.slice(i, i + N).join(' '))) for (let k = i; k < i + N; k++) marca[k] = true;
  const iguais = marca.filter(Boolean).length;
  const trechos = []; let run = 0, maior = 0;
  for (let i = 0; i <= pal.length; i++) {
    if (marca[i]) { run++; continue; }
    if (run) { maior = Math.max(maior, run); if (trechos.length < 5) trechos.push(pal.slice(i - run, i).join(' ')); }
    run = 0;
  }
  const taxa = iguais / pal.length;
  return { ok: taxa <= 0.06 && maior < 15, lidas: textos.length, taxa, maior, trechos };
}

(async () => {
  let aviso = '';
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    const ok = await tentar(aviso);
    if (ok === true) return;
    aviso = ok;
    console.log(`Tentativa ${tentativa} recusada: ${aviso.slice(0, 300)}`);
  }
  console.error('Nenhuma matéria passou nas checagens. Nada publicado neste horário.');
  process.exit(1);
})();

async function tentar(aviso) {
  let res, modelo;
  for (const m of MODELOS) {
    try { res = await pedir(m, aviso); modelo = m; break; }
    catch (e) {
      console.log(`modelo ${m}: ${e.message.slice(0, 160)}`);
      if (!/model|does not exist|not found|deprecated|shut down|not supported|access|tool/i.test(e.message)) process.exit(1);
    }
  }
  if (!res) { console.error('Nenhum modelo funcionou.'); process.exit(1); }

  const bruto = res.texto.slice(res.texto.indexOf('{'), res.texto.lastIndexOf('}') + 1);
  let m;
  try { m = JSON.parse(bruto); } catch { return 'A resposta não veio em JSON válido. Responda só com o JSON.'; }

  const existentes = new Set(todos().map(p => p.slug));
  let slug = slugar(m.slug || m.titulo || 'materia');
  if (existentes.has(slug)) slug = `${slug}-${data}`;
  const categoria = EDITORIAS.includes(m.categoria) ? m.categoria : sugestao;
  const corpo = limparHtml(m.corpo || '');
  const palavras = corpo.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (palavras < 350 || !m.titulo) return `A matéria ficou curta (${palavras} palavras). Escreva entre 500 e 900 palavras.`;
  if (!/<h2>\s*(o que (isso )?muda|o que fazer)/i.test(corpo)) return 'Faltou a seção própria com <h2> começando com "O que isso muda" ou "O que fazer agora".';

  const fontes = [...(Array.isArray(m.fontes) ? m.fontes : []), ...res.citadas]
    .filter(f => f && /^https?:\/\//.test(f.url || ''))
    .map(f => ({ nome: semTravessao(nomeFonte(f.url, f.nome)), url: f.url.replace(/[?&]utm_[^&]+/g, '') }))
    .filter((f, i, a) => a.findIndex(x => x.nome === f.nome) === i).slice(0, 5);
  if (fontes.length < 2) return 'Use pelo menos 2 fontes de veículos diferentes.';

  const copia = await checarCopia(corpo, fontes);
  console.log(`Checagem de cópia: ${copia.lidas} fonte(s) lida(s), ${(copia.taxa * 100).toFixed(1)}% parecido, maior trecho igual: ${copia.maior || 0} palavras.`);
  if (!copia.ok) return `O texto ficou parecido demais com as fontes (${(copia.taxa * 100).toFixed(0)}%). Reescreva com outras palavras e outra ordem de ideias. Trechos que ficaram iguais: ${copia.trechos.map(t => '"' + t + '"').join('; ')}`;

  const [de, para] = CORES[categoria] || CORES.Tecnologia;
  const chave = semTravessao(m.palavraChave || '').trim();
  const nova = {
    slug, data, hora, categoria,
    titulo: semTravessao(m.titulo).slice(0, 110),
    resumo: semTravessao(m.resumo || '').slice(0, 170),
    leitura: Math.max(2, Math.round(palavras / 200)),
    capa: { emoji: m.emoji || '📰', de, para },
    imagemPrompt: semTravessao(m.imagemPrompt || `Cena ilustrativa sobre: ${m.titulo}`),
    imagemAlt: `Imagem ilustrativa: ${semTravessao(m.titulo)}`,
    palavrasChave: [chave, ...(Array.isArray(m.tags) ? m.tags.map(semTravessao) : [])].filter(Boolean).slice(0, 6),
    fontes,
    copia: Number((copia.taxa * 100).toFixed(1)),
    automatico: true,
    corpo,
  };
  fs.writeFileSync(todos.ARQ, JSON.stringify([nova, ...todos.noticias()], null, 1) + '\n');
  console.log(`Matéria nova (${modelo}, ${palavras} palavras, ${categoria}, palavra-chave "${chave}"): ${nova.titulo}`);
  console.log(`https://beepdo.app/blog/${slug}`);
  if (res.uso) console.log('Tokens:', JSON.stringify(res.uso));
  return true;
}
