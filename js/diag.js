// Diagnóstico temporário (25/11/2026): página "cortada em cima" no navegador do Instagram no iPhone.
// Liga com ?diag=1 (ou ?diag=2, que também liga o viewport-fit=cover) e fica ligado neste navegador nas próximas
// visitas, inclusive as que vêm de anúncio; ?diag=0 desliga (ver js/formulario.js). Nada sai da página: as medidas só
// aparecem numa caixa fixa embaixo da tela, para print.

const modo = (() => { try { return localStorage.getItem('z7_diag'); } catch (_) { return null; } })();
if (modo === '2') {
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

const t = () => Math.round(performance.now()); // ms desde o início da navegação
const visInicial = document.visibilityState;
const nav = (performance.getEntriesByType('navigation')[0] || {}).type || '-';
const veioDeAnuncio = /[?&](utm_|fbclid=)/.test(location.search) ? 'sim' : 'não';
const eventos = [`${t()}ms: carregou ${visInicial}`];
let ultimo = '';

function anotar(texto) {
  eventos.push(`${t()}ms: ${texto}`);
  if (eventos.length > 8) eventos.shift();
}

function medir() {
  const vv = window.visualViewport;
  const cs = getComputedStyle(prova);
  const h1 = document.querySelector('h1');
  const topo = document.querySelector('.topo');
  const r = (el) => (el ? Math.round(el.getBoundingClientRect().top) : '-');
  const ua = navigator.userAgent;
  const chave = `${innerHeight}|${vv ? Math.round(vv.height) : ''}|${vv ? Math.round(vv.offsetTop) : ''}|${cs.paddingTop}|${Math.round(scrollY)}`;
  if (chave !== ultimo) {
    anotar(`innerH ${innerHeight} vvH ${vv ? Math.round(vv.height) : '-'} vvTop ${vv ? Math.round(vv.offsetTop) : '-'} scrollY ${Math.round(scrollY)} safeT ${cs.paddingTop}`);
    ultimo = chave;
  }
  caixa.textContent = [
    `t=${t()}ms ${/Instagram/.test(ua) ? 'INSTAGRAM' : /FBAN|FBAV/.test(ua) ? 'FACEBOOK' : 'outro'} ${(ua.match(/OS (\d+[_\d]*)/) || [])[1] || ''} diag=${modo}`,
    `anúncio ${veioDeAnuncio}  nav ${nav}  abriu ${visInicial}  agora ${document.visibilityState}`,
    `inner ${innerWidth}x${innerHeight}  screen ${screen.width}x${screen.height}  outerH ${outerHeight}`,
    `docEl.clientH ${document.documentElement.clientHeight}  scrollY ${Math.round(scrollY)}`,
    vv ? `vv ${Math.round(vv.width)}x${Math.round(vv.height)} offTop ${Math.round(vv.offsetTop)} pageTop ${Math.round(vv.pageTop)} scale ${vv.scale.toFixed(2)}` : 'vv -',
    `safe T${cs.paddingTop} B${cs.paddingBottom}   topo(logo).top ${r(topo)}  h1.top ${r(h1)}`,
    'linha do tempo:',
    ...eventos,
  ].join('\n');
}

let timer = null;
function medirPorUmTempo() {
  clearInterval(timer);
  timer = setInterval(medir, 250);
  setTimeout(() => clearInterval(timer), 6000);
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
  document.addEventListener('visibilitychange', () => {
    anotar(`ficou ${document.visibilityState} (innerH ${innerHeight})`);
    medir();
    if (document.visibilityState === 'visible') medirPorUmTempo();
  });
  addEventListener('pageshow', (e) => { anotar(`pageshow${e.persisted ? ' (cache)' : ''}`); medir(); });
  // primeiros 6 s, e de novo nos 6 s depois de a página aparecer: mede a cada 250 ms
  medirPorUmTempo();
}

if (document.body) ligar();
else addEventListener('DOMContentLoaded', ligar);
