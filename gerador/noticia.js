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
- Explique o que aconteceu, por que importa e o que muda na vida das pessoas. Se fizer sentido, termine com uma parte prática ("o que fazer agora", prazos, dicas de organização).
- Pode citar o BeepDo no máximo uma vez, de leve, só se combinar com o assunto (prazos, rotina, lembretes). Em tragédias, crimes, mortes ou temas sensíveis, NÃO cite o BeepDo.
- Nunca use travessão (— ou –). Use hífen, vírgula ou ponto.
- O corpo é HTML simples: só <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>. Sem links no corpo (as fontes vão separadas). Não repita o título no corpo.
- imagemPrompt: descreva em português uma cena fotográfica ILUSTRATIVA ligada ao tema, com pessoas comuns e lugares genéricos. Proibido: pessoas famosas ou reais, políticos, logotipos, marcas, bandeiras de partido, texto, cenas violentas ou de tragédia.

Responda SOMENTE com um JSON válido, sem nada antes ou depois, neste formato:
{"titulo":"até 90 caracteres","resumo":"até 160 caracteres","categoria":"uma das editorias","slug":"so-letras-minusculas-e-hifens","corpo":"<p>...</p>","fontes":[{"nome":"Nome do veículo","url":"https://..."}],"imagemPrompt":"...","emoji":"um emoji"}`;

async function pedir(modelo) {
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelo,
      tools: [{ type: 'web_search', user_location: { type: 'approximate', country: 'BR', timezone: 'America/Sao_Paulo' } }],
      input: PEDIDO,
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${j.error?.message || JSON.stringify(j).slice(0, 300)}`);
  const texto = j.output_text ?? (j.output || []).filter(o => o.type === 'message').flatMap(o => o.content || []).map(c => c.text || '').join('\n');
  const citadas = (j.output || []).filter(o => o.type === 'message').flatMap(o => o.content || []).flatMap(c => c.annotations || [])
    .filter(a => a.type === 'url_citation' && a.url).map(a => ({ nome: a.title || new URL(a.url).hostname, url: a.url }));
  return { texto, citadas, uso: j.usage };
}

const slugar = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '');
const semTravessao = s => String(s).replace(/\s*[—–]\s*/g, ' - ');
const limparHtml = h => semTravessao(h)
  .replace(/<\s*(script|style|iframe|object|embed|form)[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
  .replace(/<(?!\/?(p|h2|h3|ul|ol|li|strong|em|b|i|blockquote|br)\b)[^>]*>/gi, '')
  .replace(/<(\w+)\s[^>]*>/g, '<$1>')
  .replace(/^\s*<h1>[\s\S]*?<\/h1>/i, '')
  .trim();

(async () => {
  let res, modelo;
  for (const m of MODELOS) {
    try { res = await pedir(m); modelo = m; break; }
    catch (e) {
      console.log(`modelo ${m}: ${e.message.slice(0, 160)}`);
      if (!/model|does not exist|not found|deprecated|shut down|not supported|access|tool/i.test(e.message)) process.exit(1);
    }
  }
  if (!res) { console.error('Nenhum modelo funcionou.'); process.exit(1); }

  const bruto = res.texto.slice(res.texto.indexOf('{'), res.texto.lastIndexOf('}') + 1);
  let m;
  try { m = JSON.parse(bruto); } catch { console.error('Resposta não veio em JSON:\n' + res.texto.slice(0, 800)); process.exit(1); }

  const existentes = new Set(todos().map(p => p.slug));
  let slug = slugar(m.slug || m.titulo || 'materia');
  if (existentes.has(slug)) slug = `${slug}-${data}`;
  const categoria = EDITORIAS.includes(m.categoria) ? m.categoria : sugestao;
  const corpo = limparHtml(m.corpo || '');
  const palavras = corpo.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (palavras < 250 || !m.titulo) { console.error(`Matéria curta demais (${palavras} palavras) ou sem título. Nada publicado.`); process.exit(1); }

  const fontes = [...(Array.isArray(m.fontes) ? m.fontes : []), ...res.citadas]
    .filter(f => f && /^https?:\/\//.test(f.url || ''))
    .map(f => ({ nome: semTravessao(f.nome || new URL(f.url).hostname).slice(0, 80), url: f.url.replace(/[?&]utm_[^&]+/g, '') }))
    .filter((f, i, a) => a.findIndex(x => x.url === f.url) === i).slice(0, 5);
  if (!fontes.length) { console.error('Matéria sem fontes. Nada publicado.'); process.exit(1); }

  const [de, para] = CORES[categoria] || CORES.Tecnologia;
  const nova = {
    slug, data, hora, categoria,
    titulo: semTravessao(m.titulo).slice(0, 120),
    resumo: semTravessao(m.resumo || '').slice(0, 200),
    leitura: Math.max(2, Math.round(palavras / 200)),
    capa: { emoji: m.emoji || '📰', de, para },
    imagemPrompt: semTravessao(m.imagemPrompt || `Cena ilustrativa sobre: ${m.titulo}`),
    imagemAlt: `Imagem ilustrativa: ${semTravessao(m.titulo)}`,
    fontes,
    automatico: true,
    corpo,
  };
  fs.writeFileSync(todos.ARQ, JSON.stringify([nova, ...todos.noticias()], null, 1) + '\n');
  console.log(`Matéria nova (${modelo}, ${palavras} palavras, ${categoria}): ${nova.titulo}`);
  console.log(`https://beepdo.app/blog/${slug}`);
  if (res.uso) console.log('Tokens:', JSON.stringify(res.uso));
})();
