// Diagnóstico temporário (25/11/2026): só carrega com ?diag=1 (ou ?diag=2) na URL. Não muda nada para quem não usa o parâmetro.
// Mostra, numa caixa fixa embaixo da tela, as medidas que explicam a página "cortada em cima" no navegador do
// Instagram no iPhone. Nada sai da página: só aparece na tela, para print.

// ?diag=2: liga também o viewport-fit=cover, para ver se o navegador informa a área coberta pela barra
if (/[?&]diag=2\b/.test(location.search)) {
  const vp = document.querySelector('meta[name=viewport]');
  if (vp && !/viewport-fit/.test(vp.content)) vp.content += ', viewport-fit=cover';
}

const caixa = document.createElement('pre');
caixa.setAttribute('aria-hidden', 'true');
caixa.style.cssText = [
  'position:fixed', 'left:6px', 'right:6px', 'bottom:6px', 'z-index:2147483647', 'margin:0', 'padding:8px 10px',
  'font:11px/1.35 ui-monospace,Menlo,monospace', 'color:#7CFFB2', 'background:rgba(0,0,0,.88)',
  'border:1px solid #7CFFB2', 'border-radius:8px', 'white-space:pre-wrap', 'word-break:break-all', 'pointer-events:none',
].join(';');

// env(safe-area-inset-*) medido por um elemento de prova
const prova = document.createElement('div');
prova.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;' +
  'padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';

const inicio = performance.now();
const historico = [];
let ultimo = '';

function medir() {
  const vv = window.visualViewport;
  const cs = getComputedStyle(prova);
  const h1 = document.querySelector('h1');
  const topo = document.querySelector('.topo');
  const r = (el) => (el ? Math.round(el.getBoundingClientRect().top) : '-');
  const ua = navigator.userAgent;
  const linhas = [
    `t=${Math.round(performance.now() - inicio)}ms  ${/Instagram/.test(ua) ? 'INSTAGRAM' : /FBAN|FBAV/.test(ua) ? 'FACEBOOK' : 'outro'}  ${(ua.match(/OS (\d+[_\d]*)/) || [])[1] || ''}`,
    `inner ${innerWidth}x${innerHeight}  screen ${screen.width}x${screen.height}  outerH ${outerHeight}`,
    `docEl.clientH ${document.documentElement.clientHeight}  scrollY ${Math.round(scrollY)}`,
    vv ? `vv ${Math.round(vv.width)}x${Math.round(vv.height)} offTop ${Math.round(vv.offsetTop)} pageTop ${Math.round(vv.pageTop)} scale ${vv.scale.toFixed(2)}` : 'vv -',
    `safe T${cs.paddingTop} B${cs.paddingBottom}`,
    `topo(logo).top ${r(topo)}  h1.top ${r(h1)}`,
  ];
  const chave = `${innerHeight}|${vv ? Math.round(vv.height) : ''}|${cs.paddingTop}`;
  if (chave !== ultimo) {
    historico.push(`${Math.round(performance.now() - inicio)}ms: innerH ${innerHeight} vvH ${vv ? Math.round(vv.height) : '-'} safeT ${cs.paddingTop}`);
    if (historico.length > 6) historico.shift();
    ultimo = chave;
  }
  caixa.textContent = linhas.join('\n') + '\nmudanças:\n' + historico.join('\n');
}

function ligar() {
  document.body.appendChild(prova);
  document.body.appendChild(caixa);
  medir();
  addEventListener('resize', medir);
  addEventListener('scroll', medir, { passive: true });
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', medir);
    visualViewport.addEventListener('scroll', medir);
  }
  // primeiros 6 s: mede a cada 250 ms (o Instagram pode ajustar a tela depois de abrir)
  const timer = setInterval(medir, 250);
  setTimeout(() => clearInterval(timer), 6000);
}

if (document.body) ligar();
else addEventListener('DOMContentLoaded', ligar);
