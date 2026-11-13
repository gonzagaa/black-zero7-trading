// Confere os textos das páginas contra docs/copy.md, palavra por palavra. Sem dependências.
//   node scripts/conferir-copy.mjs
//
// 1. Cada texto da copy tem que aparecer, exato, na sua página.
// 2. Nenhum texto visível pode existir fora de: copy, rodapé do site (_referencia/rodape/rodape.html)
//    e a tabela "Textos que a copy não traz". Entram na conferência também alt, aria-label, title e placeholder.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(import.meta.url), '..', '..');
const ler = (p) => readFileSync(join(RAIZ, p), 'utf8');
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const entidades = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

// ---------- textos da copy ----------
const md = ler('docs/copy.md');
const [mdPrincipal, resto] = md.split('## Página de obrigado');
const [mdObrigado, mdTecnico] = resto.split('## Textos que a copy não traz');

function textosDaCopy(trecho) {
  const out = [];
  const linhas = trecho.split('\n');
  for (let i = 0; i < linhas.length; i++) {
    if (!/^\*\*[^*]+:\*\*\s*$/.test(linhas[i].trim())) continue;
    for (let j = i + 1; j < linhas.length && linhas[j].trim() !== '' && !linhas[j].startsWith('#'); j++) {
      out.push(norm(linhas[j].replace(/^- /, '')));
    }
    // listas logo depois de um parágrafo (os dois canais do obrigado)
  }
  for (const l of linhas) if (/^- /.test(l) && !out.includes(norm(l.slice(2)))) out.push(norm(l.slice(2)));
  return out.filter(Boolean);
}

const copy = {
  'index.html': textosDaCopy(mdPrincipal),
  'obrigado/index.html': textosDaCopy(mdObrigado),
};
const tecnicos = [...mdTecnico.matchAll(/^\| [^|]+ \| ([^|]+) \| [^|]+ \|$/gm)]
  .map((m) => norm(m[1]))
  .filter((t) => t !== 'Texto' && !/^-+$/.test(t));

// ---------- extrair textos de um HTML ----------
const RE_ESCONDIDO = /<span[^>]*aria-hidden="true"[^>]*>((?:[^<]|<span[^>]*>[^<]*<\/span>)*)<\/span>/gi;

function extrair(html) {
  const titulo = norm(entidades((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || ''));
  let h = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|svg|head)\b[\s\S]*?<\/\1>/gi, ' ');
  // atributos com texto
  const atributos = [...h.matchAll(/\b(alt|aria-label|title|placeholder)="([^"]*)"/gi)].map((m) => norm(entidades(m[2]))).filter(Boolean);
  // aria-hidden: fora da conferência de texto visível (seta do botão), mas listado à parte
  const escondidos = [...h.matchAll(RE_ESCONDIDO)].map((m) => norm(m[1].replace(/<[^>]+>/g, ''))).filter(Boolean);
  h = h.replace(RE_ESCONDIDO, '');
  // tags em linha não quebram o bloco de texto
  h = h.replace(/<\/?(span|strong|a|em|b|i)\b[^>]*>/gi, '');
  const blocos = h.split(/<[^>]+>/).map((t) => norm(entidades(t))).filter(Boolean);
  return { blocos, atributos, escondidos, titulo };
}

const rodape = extrair(ler('_referencia/rodape/rodape.html')).blocos;
const permitidos = new Set([...tecnicos, ...rodape]);

let falhas = 0;
const linhasRel = [];
const log = (s) => { linhasRel.push(s); };

for (const [pagina, textos] of Object.entries(copy)) {
  const { blocos, atributos, escondidos, titulo } = extrair(ler(pagina));
  log(`\n=== ${pagina}`);
  const tituloOk = tecnicos.includes(titulo);
  if (!tituloOk) falhas++;
  log(`<title>: ${tituloOk ? 'OK  ' : 'EXTRA'} ${titulo}`);
  log('Copy (docs/copy.md) → página:');
  for (const t of textos) {
    // "Nome:" e "E-mail:" são rótulos; a copy os lista como itens
    const ok = blocos.includes(t);
    if (!ok) falhas++;
    log(`  ${ok ? 'OK  ' : 'FALTA'} ${t}`);
  }
  const daCopy = new Set(textos);
  const extras = blocos.filter((b) => !daCopy.has(b) && !permitidos.has(b));
  log('Textos visíveis fora da copy, do rodapé do site e da tabela técnica:');
  if (extras.length === 0) log('  nenhum');
  for (const e of extras) { falhas++; log(`  EXTRA ${e}`); }
  const usadosTec = blocos.filter((b) => tecnicos.includes(b));
  log(`Textos técnicos no HTML: ${usadosTec.length ? usadosTec.join(' | ') : 'nenhum (os de validação/envio são do JS)'}`);
  log(`Atributos com texto (alt/aria-label/title/placeholder): ${atributos.length ? atributos.join(' | ') : 'nenhum'}`);
  for (const a of atributos) if (!permitidos.has(a) && !daCopy.has(a)) { falhas++; log(`  EXTRA (atributo) ${a}`); }
  log(`Escondidos do leitor de tela (aria-hidden): ${escondidos.length ? escondidos.join(' | ') : 'nenhum'}`);
}

// textos que o JS escreve na tela
log('\n=== js/ (textos que o JS põe na tela)');
for (const arq of ['js/formulario.js', 'js/comprovantes.js']) {
  const js = ler(arq);
  const strings = [...js.matchAll(/^\s*(?:\w+:\s*|const ALT = )'([^']+)'/gm)].map((m) => m[1]).filter((s) => /[A-ZÀ-Ú]/.test(s[0]) && s.includes(' ') || /^[A-Z.]+$/.test(s));
  for (const s of strings) {
    const ok = tecnicos.includes(s);
    if (!ok) falhas++;
    log(`  ${ok ? 'OK  ' : 'EXTRA'} ${arq}: ${s}`);
  }
}

log(`\n${falhas === 0 ? 'RESULTADO: copy confere, nenhum texto a mais.' : `RESULTADO: ${falhas} problema(s).`}`);
console.log(linhasRel.join('\n'));
process.exit(falhas ? 1 : 0);
