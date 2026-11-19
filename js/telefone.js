// Campo Telefone: máscara com DDI, validação e E.164. Sem biblioteca. Ver relatorios/telefone.md.
//
// O que a pessoa vê (e o que o bloco da 4Selet lê do #telefone):
//   Brasil:       "+55 (62) 99516-0427" (11 dígitos) ou "+55 (62) 3222-0000" (10 dígitos)
//   outro país:   "+<DDI> <resto>", um espaço depois do DDI e o resto sem agrupamento ("+351 912345678")
// O que vai para a /api/lead: E.164, "+5562995160427".
// Sem "+" no começo, o número é do Brasil. O "+55 " só aparece quando a pessoa entra no campo vazio, e some se ela
// sair sem digitar mais nada (assim a 4Selet não recebe parcial de quem nem preencheu).

const PREFIXO = '+55 ';

// DDDs do Brasil (Anatel)
const DDD = new Set(('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 ' +
  '51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99')
  .split(' '));

// Códigos de país (UIT-T E.164), de 1 a 3 dígitos. Nenhum é prefixo de outro: o primeiro que casar é o DDI.
// Os de 3 dígitos vêm agrupados pelos 2 primeiros: "21:12368" = 211, 212, 213, 216 e 218.
const DDI = new Set([
  '1', '7',
  ...('20 27 30 31 32 33 34 36 39 40 41 43 44 45 46 47 48 49 51 52 53 54 55 56 57 58 ' +
    '60 61 62 63 64 65 66 81 82 84 86 90 91 92 93 94 95 98').split(' '),
  ...('21:12368 22:0123456789 23:0123456789 24:0123456789 25:012345678 26:0123456789 29:01789 ' +
    '35:0123456789 37:0123456789 38:01235679 42:013 50:0123456789 59:0123456789 ' +
    '67:023456789 68:012356789 69:012 85:02356 88:06 96:012345678 97:01234567 99:234568')
    .split(' ').flatMap((grupo) => {
      const [comeco, finais] = grupo.split(':');
      return [...finais].map((d) => comeco + d);
    }),
]);

const temMaisNoComeco = (texto) => /^\s*\+/.test(texto);
const contaDigitos = (texto) => (texto.match(/\d/g) || []).length;

function achaDdi(digitos) {
  for (let n = 1; n <= 3 && n <= digitos.length; n++) {
    if (DDI.has(digitos.slice(0, n))) return digitos.slice(0, n);
  }
  return '';
}

// Brasil: tira o 0 de longa distância ("062...") e o 55 repetido ("+55 5562...")
function nacionalBrasil(digitos) {
  let n = digitos.replace(/^0+/, '');
  if (n.length > 11 && n.startsWith('55')) n = n.slice(2);
  return n;
}

// Lê o campo. Devolve { ddi, nacional } (só dígitos) ou, se o DDI ainda não fecha, { ddi: '', digitos }.
function analisar(valor) {
  const texto = String(valor ?? '');
  const digitos = texto.replace(/\D/g, '');
  if (!temMaisNoComeco(texto)) {
    // sem "+": Brasil (a pessoa apagou o +55 e digitou DDD + número, colou ou o navegador preencheu)
    if (!digitos) return { ddi: '', digitos: '' };
    return { ddi: '55', nacional: nacionalBrasil(digitos) };
  }
  const ddi = achaDdi(digitos);
  if (!ddi) return { ddi: '', digitos };
  const resto = digitos.slice(ddi.length);
  return { ddi, nacional: ddi === '55' ? nacionalBrasil(resto) : resto };
}

// (62) 99516-0427 / (62) 3222-0000. Separador só aparece quando já há dígito depois dele.
function formatarBrasil(n) {
  if (n.length <= 2) return n ? `(${n}` : '';
  const ddd = n.slice(0, 2);
  const resto = n.slice(2);
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  const corte = resto.length >= 9 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

export function formatarTelefone(valor) {
  const p = analisar(valor);
  if (!p.ddi) return p.digitos ? `+${p.digitos}` : (temMaisNoComeco(String(valor ?? '')) ? '+' : '');
  if (p.ddi === '55') return PREFIXO + formatarBrasil(p.nacional);
  return `+${p.ddi} ${p.nacional}`;
}

// Só "+55" ou nada: o campo conta como vazio (obrigatório)
export function telefoneVazio(valor) {
  const t = String(valor ?? '').trim();
  return t === '' || t === PREFIXO.trim();
}

// Brasil: DDD da lista e 10 ou 11 dígitos depois do 55 (com 11, começa com 9).
// Outro país: DDI da tabela e de 10 a 15 dígitos no total, contando o DDI (o mínimo da /api/lead e da 4Selet).
export function telefoneValido(valor) {
  if (/\p{L}/u.test(String(valor ?? ''))) return false;
  const p = analisar(valor);
  if (!p.ddi) return false;
  if (p.ddi === '55') {
    const n = p.nacional;
    if (!DDD.has(n.slice(0, 2))) return false;
    return n.length === 10 || (n.length === 11 && n[2] === '9');
  }
  const total = p.ddi.length + p.nacional.length;
  return total >= 10 && total <= 15;
}

// "+5562995160427". Use só depois de telefoneValido().
export function telefoneE164(valor) {
  const p = analisar(valor);
  return p.ddi ? `+${p.ddi}${p.nacional}` : '';
}

// Posição logo depois do k-ésimo dígito (k = 0: logo depois do "+", se houver)
function posicaoDepoisDoDigito(texto, k) {
  if (k <= 0) return texto.startsWith('+') ? 1 : 0;
  let vistos = 0;
  for (let i = 0; i < texto.length; i++) {
    if (/\d/.test(texto[i]) && ++vistos === k) return i + 1;
  }
  return texto.length;
}

// Liga a máscara no campo. Ao digitar, colar e no preenchimento automático (todos passam pelo evento input).
export function ligarMascaraTelefone(campo) {
  let anterior = campo.value;

  function aplicar(valor, cursor) {
    const novo = formatarTelefone(valor);
    // os ajustes do formatador (55 na frente, 0 ou 55 repetido tirados) ficam todos antes do número
    const alvo = Math.max(0, contaDigitos(valor.slice(0, cursor)) + contaDigitos(novo) - contaDigitos(valor));
    const pos = alvo >= contaDigitos(novo) ? novo.length : posicaoDepoisDoDigito(novo, alvo);
    if (campo.value !== novo) campo.value = novo;
    if (document.activeElement === campo) campo.setSelectionRange(pos, pos);
    anterior = novo;
  }

  campo.addEventListener('input', (e) => {
    let valor = campo.value;
    let cursor = campo.selectionStart ?? valor.length;
    const tipo = e.inputType || '';
    const apagouUm = (tipo === 'deleteContentBackward' || tipo === 'deleteContentForward') && anterior.length - valor.length === 1;
    if (apagouUm && contaDigitos(valor) === contaDigitos(anterior) && contaDigitos(valor) > 0) {
      // Backspace/Delete pegou só um separador ou o "+": apaga o dígito do lado (o "+" fica enquanto houver número)
      if (anterior[cursor] === '+') {
        campo.value = anterior;
        campo.setSelectionRange(tipo === 'deleteContentBackward' ? 1 : 0, tipo === 'deleteContentBackward' ? 1 : 0);
        return;
      }
      let i = cursor;
      if (tipo === 'deleteContentBackward') {
        i = cursor - 1;
        while (i >= 0 && !/\d/.test(valor[i])) i--;
      } else {
        while (i < valor.length && !/\d/.test(valor[i])) i++;
      }
      if (i >= 0 && i < valor.length) {
        valor = valor.slice(0, i) + valor.slice(i + 1);
        if (tipo === 'deleteContentBackward') cursor = i;
      }
    }
    aplicar(valor, cursor);
  });

  // Colar um número completo (com "+", ou com o campo só no "+55 ") troca o conteúdo; o resto é colado no cursor
  campo.addEventListener('paste', (e) => {
    const texto = (e.clipboardData && e.clipboardData.getData('text')) || '';
    if (!texto) return;
    const atual = campo.value;
    if (!(temMaisNoComeco(texto) || atual.trim() === '' || telefoneVazio(atual))) return;
    e.preventDefault();
    campo.value = texto;
    campo.setSelectionRange(texto.length, texto.length);
    campo.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Entrar no campo vazio: "+55 ", com o cursor no fim (depois do clique, que posiciona o cursor onde tocou)
  campo.addEventListener('focus', () => {
    if (campo.value.trim() !== '') return;
    campo.value = PREFIXO;
    anterior = PREFIXO;
    campo.setSelectionRange(PREFIXO.length, PREFIXO.length);
    setTimeout(() => {
      if (document.activeElement === campo && campo.value === PREFIXO) campo.setSelectionRange(PREFIXO.length, PREFIXO.length);
    }, 0);
  });

  // Sair só com "+55": o campo volta a ficar vazio. Na captura do formulário, para rodar antes de quem lê o campo
  // no blur/change (a validação e o bloco da 4Selet).
  const limpar = (e) => {
    if (e.target === campo && telefoneVazio(campo.value) && campo.value !== '') {
      campo.value = '';
      anterior = '';
    }
  };
  const raiz = campo.form || document;
  raiz.addEventListener('change', limpar, true);
  raiz.addEventListener('blur', limpar, true);
}
