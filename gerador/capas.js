// Gera as fotos de capa realistas do blog com a API da OpenAI.
// Para cada post de gerador/posts.js sem blog/img/<slug>.webp, pede uma foto e salva.
//
// Variáveis de ambiente:
//   OPENAI_API_KEY  (obrigatória; no GitHub vem do segredo do repositório)
//   MODELO          modelo de imagem (padrão: tenta gpt-image-2, depois gpt-image-1.5, depois gpt-image-1-mini)
//   QUALIDADE       low | medium | high (padrão medium)
//   MAXIMO          máximo de capas por execução (padrão 20, pra controlar custo)
//   SO_SLUG         gera só a capa desse post (refaz mesmo se já existir)
//   TESTE=1         só testa a chave: gera 1 imagem pequena e não salva nada no site

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const PASTA = path.join(RAIZ, 'blog/img');
const CHAVE = process.env.OPENAI_API_KEY;
const MODELOS = process.env.MODELO ? [process.env.MODELO] : ['gpt-image-2', 'gpt-image-1.5', 'gpt-image-1-mini'];
let MODELO = MODELOS[0];
const QUALIDADE = process.env.QUALIDADE || 'medium';
const MAXIMO = Number(process.env.MAXIMO || 20);
const SO_SLUG = (process.env.SO_SLUG || '').trim();
const TESTE = process.env.TESTE === '1';

if (!CHAVE) { console.error('Falta OPENAI_API_KEY.'); process.exit(1); }

const ESTILO = [
  'Fotografia editorial realista, como foto de matéria de portal de notícias brasileiro.',
  'Cena do cotidiano no Brasil, pessoas brasileiras comuns e naturais, ambientes reais (casa, escritório, fábrica, rua, transporte).',
  'Luz natural, cores suaves, profundidade de campo, enquadramento horizontal 3:2, sem pose de banco de imagem.',
  'Proibido: texto, letras, números legíveis, logotipos, marcas, telas com interface legível, marca d\'água, aparência de ilustração ou 3D.',
].join(' ');

const promptDo = p => p.imagemPrompt
  ? `${p.imagemPrompt} ${ESTILO}`
  : `Foto que ilustre a matéria "${p.titulo}". Assunto: ${p.resumo} ${ESTILO}`;

// Tenta o modelo atual; se a OpenAI disser que ele não existe ou foi desligado, passa pro próximo da lista.
async function gerar(prompt, opcoes = {}) {
  while (true) {
    try { return await gerarCom(MODELO, prompt, opcoes); }
    catch (e) {
      const prox = MODELOS[MODELOS.indexOf(MODELO) + 1];
      if (prox && /model|does not exist|not found|deprecated|shut down|not supported|access/i.test(e.message)) {
        console.log(`  modelo ${MODELO} indisponível (${e.message.slice(0, 120)}). Tentando ${prox}.`);
        MODELO = prox; continue;
      }
      throw e;
    }
  }
}

async function gerarCom(modelo, prompt, { tamanho = '1536x1024', qualidade = QUALIDADE } = {}) {
  const r = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelo, prompt, size: tamanho, quality: qualidade, n: 1, output_format: 'webp', output_compression: 78 }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${j.error?.message || JSON.stringify(j).slice(0, 300)}`);
  const b64 = j.data?.[0]?.b64_json;
  if (!b64) throw new Error('Resposta sem imagem.');
  return Buffer.from(b64, 'base64');
}

(async () => {
  if (TESTE) {
    try {
      const img = await gerar('Uma xícara de café sobre uma mesa de madeira perto da janela, foto realista.', { tamanho: '1024x1024', qualidade: 'low' });
      console.log(`OK: a OpenAI respondeu e gerou uma imagem de teste (${Math.round(img.length / 1024)} KB) com o modelo ${MODELO}.`);
    } catch (e) { console.error('FALHOU:', e.message); process.exit(1); }
    return;
  }

  fs.mkdirSync(PASTA, { recursive: true });
  const posts = require('./posts.js').slice().sort((a, b) => b.data.localeCompare(a.data));
  const fila = SO_SLUG
    ? posts.filter(p => p.slug === SO_SLUG)
    : posts.filter(p => !p.imagem && !fs.existsSync(path.join(PASTA, p.slug + '.webp')));
  if (SO_SLUG && !fila.length) { console.error(`Post "${SO_SLUG}" não existe em posts.js.`); process.exit(1); }

  const lote = fila.slice(0, MAXIMO);
  console.log(`${fila.length} post(s) sem capa. Gerando ${lote.length} agora (modelo ${MODELOS.join(' > ')}, qualidade ${QUALIDADE}).`);
  let ok = 0, erros = 0;
  for (const p of lote) {
    try {
      const img = await gerar(promptDo(p));
      fs.writeFileSync(path.join(PASTA, p.slug + '.webp'), img);
      ok++; console.log(`  ok  ${p.slug} (${Math.round(img.length / 1024)} KB)`);
    } catch (e) {
      erros++; console.error(`  erro ${p.slug}: ${e.message}`);
      if (/billing|quota|insufficient|verify|verified|organization must be/i.test(e.message)) { console.error('Parando: problema de crédito ou verificação na OpenAI.'); break; }
    }
  }
  console.log(`Fim: ${ok} capa(s) nova(s), ${erros} erro(s). Modelo usado: ${MODELO}.`);
  if (!ok && erros) process.exit(1);
})();
