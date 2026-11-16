// Dobra "Traders Zero7 recebendo em Dólar": monta as molduras dos comprovantes.
// Para trocar as imagens, edite só a lista abaixo (arquivos em assets/comprovantes/, ver o LEIA-ME de lá).

const VERSAO = '202611160750'; // cache busting das imagens (atualizado por scripts/versao.mjs)

/**
 * Fileira de cima em retrato (altura 372 px no desktop), de baixo em paisagem (300 px); a largura acompanha a imagem.
 * Um item por imagem, na ordem da tela. largura/altura = tamanho real do arquivo, em px (evita salto de layout).
 * Exemplo: { arquivo: '01.webp', largura: 720, altura: 1280 }
 * Enquanto a lista estiver vazia, a dobra mostra molduras vazias (pendência 3 do CLAUDE.md).
 */
export const COMPROVANTES = [];

const ALT = 'Comprovante de pagamento a trader Zero7'; // docs/copy.md, "Textos que a copy não traz"
const PASTA = 'assets/comprovantes/';
const VAZIAS_POR_FILEIRA = 8;
const MINIMO_POR_GRUPO = 8; // abaixo disso a fileira repete a lista, para a esteira não abrir buraco em 1920 px

const raiz = document.querySelector('[data-comprovantes]');
if (raiz) {
  const calmo = window.matchMedia('(prefers-reduced-motion: reduce)');
  montar(raiz, calmo.matches);
  calmo.addEventListener('change', (e) => montar(raiz, e.matches));
  pausaNoToque(raiz);
}

function moldura(item) {
  // .moldura desenha a borda em degradê (padding de 2 px); .moldura__dentro é o miolo escuro com a imagem
  const div = document.createElement('div');
  div.className = 'moldura';
  const dentro = document.createElement('div');
  dentro.className = 'moldura__dentro';
  div.appendChild(dentro);
  if (!item) {
    div.classList.add('moldura--vazia');
    return div;
  }
  const img = document.createElement('img');
  img.src = `${PASTA}${item.arquivo}?v=${VERSAO}`;
  img.alt = ALT;
  img.width = item.largura;
  img.height = item.altura;
  img.loading = 'lazy';
  img.decoding = 'async';
  dentro.appendChild(img);
  return div;
}

function grupo(itens, copia) {
  const g = document.createElement('div');
  g.className = 'esteira__grupo';
  if (copia) g.setAttribute('aria-hidden', 'true');
  for (const item of itens) g.appendChild(moldura(item));
  return g;
}

function completar(itens) {
  if (itens.length === 0) return itens;
  const saida = [...itens];
  while (saida.length < MINIMO_POR_GRUPO) saida.push(...itens);
  return saida;
}

function fileira(itens, direcao, parado) {
  const f = document.createElement('div');
  f.className = `esteira__fileira esteira__fileira--${direcao}`;
  const trilho = document.createElement('div');
  trilho.className = 'esteira__trilho';
  trilho.appendChild(grupo(parado ? itens : completar(itens), false));
  // segundo grupo idêntico fecha o laço da animação; leitor de tela ignora
  if (!parado) trilho.appendChild(grupo(completar(itens), true));
  f.appendChild(trilho);
  return f;
}

function montar(raiz, parado) {
  const titulo = raiz.getAttribute('aria-labelledby');
  raiz.replaceChildren();

  const vazio = COMPROVANTES.length === 0;
  const lista = vazio ? Array(VAZIAS_POR_FILEIRA * 2).fill(null) : COMPROVANTES;

  // molduras vazias são só decoração
  if (vazio) raiz.setAttribute('aria-hidden', 'true');
  else raiz.removeAttribute('aria-hidden');

  if (parado) {
    // reduced motion: uma fileira parada com rolagem horizontal (teclado incluso)
    const f = fileira(vazio ? lista.slice(0, VAZIAS_POR_FILEIRA) : lista, 'esq', true);
    if (!vazio) {
      f.tabIndex = 0;
      f.setAttribute('role', 'region');
      if (titulo) f.setAttribute('aria-labelledby', titulo);
    }
    raiz.appendChild(f);
    return;
  }

  // duas fileiras, uma para cada lado: itens alternados (1, 3, 5... em cima; 2, 4, 6... embaixo)
  const cima = vazio ? lista.slice(0, VAZIAS_POR_FILEIRA) : lista.filter((_, i) => i % 2 === 0);
  const baixo = vazio ? lista.slice(VAZIAS_POR_FILEIRA) : lista.filter((_, i) => i % 2 === 1);
  raiz.appendChild(fileira(cima, 'esq', false));
  raiz.appendChild(fileira(baixo.length ? baixo : cima, 'dir', false));
}

// Pausa enquanto o dedo estiver na esteira (no mouse, o :hover do CSS já pausa)
function pausaNoToque(raiz) {
  const pausar = (e) => { if (e.pointerType !== 'mouse') raiz.classList.add('is-pausada'); };
  const soltar = () => raiz.classList.remove('is-pausada');
  raiz.addEventListener('pointerdown', pausar);
  raiz.addEventListener('pointerup', soltar);
  raiz.addEventListener('pointercancel', soltar);
  raiz.addEventListener('pointerleave', soltar);
}
