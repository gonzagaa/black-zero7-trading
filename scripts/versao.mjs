// Cache busting: põe ?v=<versão> em toda referência local das páginas, do CSS e do JS.
//
//   node scripts/versao.mjs              versão nova = data e hora de Brasília (AAAAMMDDHHMM). Rode antes de cada deploy.
//   node scripts/versao.mjs 2026112001   usa esta versão (letras, números, ponto e hífen)
//   node scripts/versao.mjs --conferir   não grava nada: lista referências locais sem ?v= ou com outra versão e sai
//                                        com erro se houver alguma
//
// Onde entra: src/href das páginas (só arquivos estáticos; links de página e endereços externos ficam de fora),
// url() do CSS, import ... from '...' entre módulos JS e a constante VERSAO de js/comprovantes.js (as imagens
// dos comprovantes são montadas em tempo de execução).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(import.meta.url), '..', '..');
const EXT = /\.(css|m?js|png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/i;

const args = process.argv.slice(2);
const conferir = args.includes('--conferir');

function agoraBrasilia() {
  const d = new Date(Date.now() - 3 * 60 * 60 * 1000); // UTC−3
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

const listar = (pasta, re) => readdirSync(join(RAIZ, pasta)).filter((f) => re.test(f)).map((f) => join(pasta, f));
const arquivos = [
  'index.html',
  join('obrigado', 'index.html'),
  ...listar('css', /\.css$/),
  ...listar('js', /\.m?js$/),
];

// versão atual = a mais comum nos arquivos (para o --conferir)
const contagem = {};
for (const a of arquivos) {
  for (const m of readFileSync(join(RAIZ, a), 'utf8').matchAll(/\?v=([\w.-]+)/g)) contagem[m[1]] = (contagem[m[1]] || 0) + 1;
}
const atual = Object.entries(contagem).sort((x, y) => y[1] - x[1])[0]?.[0];

const pedida = args.find((a) => !a.startsWith('--'));
const versao = conferir ? atual : (pedida || agoraBrasilia());
if (!versao || !/^[\w.-]+$/.test(versao)) {
  console.error(`Versão inválida: "${versao}"`);
  process.exit(1);
}

function ehLocalEstatico(url) {
  if (!url || /^(#|data:|mailto:|tel:|javascript:|https?:|\/\/)/i.test(url)) return false;
  const caminho = url.split('#')[0].split('?')[0];
  return EXT.test(caminho);
}

const problemas = [];

function versionar(url, arquivo) {
  if (!ehLocalEstatico(url)) return url;
  const [semFrag, ...frag] = url.split('#');
  const [caminho, query = ''] = semFrag.split('?');
  const vAtual = (query.match(/(?:^|&)v=([^&]*)/) || [])[1];
  if (vAtual !== versao) problemas.push(`${arquivo}: ${url}`);
  const outros = query.split('&').filter((q) => q && !q.startsWith('v='));
  return `${caminho}?${[...outros, `v=${versao}`].join('&')}${frag.length ? '#' + frag.join('#') : ''}`;
}

for (const arquivo of arquivos) {
  const cheio = join(RAIZ, arquivo);
  const antes = readFileSync(cheio, 'utf8');
  let depois = antes;
  const rel = relative(RAIZ, cheio).replaceAll('\\', '/');

  if (arquivo.endsWith('.html')) {
    depois = depois.replace(/\b(src|href)="([^"]*)"/g, (m, attr, url) => `${attr}="${versionar(url, rel)}"`);
  } else if (arquivo.endsWith('.css')) {
    depois = depois.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, url) => `url(${q}${versionar(url, rel)}${q})`);
  } else {
    depois = depois.replace(/(\bfrom\s+|\bimport\s*\(?\s*)(['"])([^'"]+)\2/g, (m, pre, q, url) => `${pre}${q}${versionar(url, rel)}${q}`);
    depois = depois.replace(/(const VERSAO = ')([^']*)(')/, (m, a, v, b) => {
      if (v !== versao) problemas.push(`${rel}: const VERSAO = '${v}'`);
      return `${a}${versao}${b}`;
    });
  }

  if (!conferir && depois !== antes) writeFileSync(cheio, depois);
}

if (conferir) {
  if (problemas.length) {
    console.error(`Referências fora da versão ${versao}:\n  ${problemas.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`OK: todas as referências locais com ?v=${versao}`);
} else {
  console.log(`Versão ${versao} gravada (${problemas.length} referências atualizadas).`);
}
