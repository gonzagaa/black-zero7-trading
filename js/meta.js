// Meta (Pixel + API de Conversões). Ver docs/meta.md.
//
// Ao carregar o módulo (LP e obrigado): garante os cookies _fbp/_fbc e o external_id anônimo, com a mesma lógica do
// js/metaPixel.js do site. Com META.pageview, depois do load da página e de o navegador ficar ocioso (para o Pixel não
// disputar banda nem a primeira pintura com a hero e o LCP), carrega o Pixel e manda o PageView pelo navegador e pela
// /api/capi (o mesmo event_id nos dois).
// Exporta dadosMeta() para o envio do formulário e iniciarPixel() para o obrigado, que o chama na hora.
// Nada aqui pode quebrar a página: tudo em try/catch e falha silenciosa.

import { META } from './config.js?v=202611250900';

const COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 dias, em segundos
const LS_EXT_ID = 'zero7_ext_id';         // a mesma chave do site

// Domínio raiz do cookie (".zero7trading.com"), para valer no site e na LP. Em localhost/IP, sem domínio.
function getRootDomain() {
  const host = window.location.hostname;
  if (!host || host === 'localhost' || /^[\d.]+$/.test(host)) return null;
  const parts = host.split('.');
  if (parts.length <= 2) return '.' + host;
  const tldsCompostos = ['com.br', 'com.mx', 'com.ar', 'co.uk', 'com.au', 'com.co'];
  const last2 = parts.slice(-2).join('.');
  if (tldsCompostos.includes(last2)) return '.' + parts.slice(-3).join('.');
  return '.' + parts.slice(-2).join('.');
}

const ROOT_DOMAIN = getRootDomain();

function getCookie(name) {
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');
  const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, maxAgeSec) {
  let cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAgeSec + '; SameSite=Lax';
  if (ROOT_DOMAIN) cookie += '; domain=' + ROOT_DOMAIN;
  if (window.location.protocol === 'https:') cookie += '; Secure';
  document.cookie = cookie;
}

// _fbp: cria se não existir (fb.1.<ms>.<10 dígitos>)
function ensureFbp() {
  const existente = getCookie('_fbp');
  if (existente) return existente;
  const rand = Math.floor(1000000000 + Math.random() * 9000000000);
  const fbp = 'fb.1.' + Date.now() + '.' + rand;
  setCookie('_fbp', fbp, COOKIE_MAX_AGE);
  return fbp;
}

// _fbc: a partir do fbclid da URL (é o que liga o cadastro ao anúncio)
function ensureFbc() {
  const existente = getCookie('_fbc');
  if (existente) return existente;
  let fbclid = null;
  try { fbclid = new URLSearchParams(window.location.search).get('fbclid'); } catch (_) { /* nada */ }
  if (!fbclid) return null;
  const fbc = 'fb.1.' + Date.now() + '.' + fbclid;
  setCookie('_fbc', fbc, COOKIE_MAX_AGE);
  return fbc;
}

// external_id anônimo, criado uma vez (texto puro; o SHA-256 é feito no backend)
function ensureExternalId() {
  try {
    let id = localStorage.getItem(LS_EXT_ID);
    if (id) return id;
    id = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : ('ext-' + Date.now() + '-' + Math.random().toString(36).slice(2, 12));
    localStorage.setItem(LS_EXT_ID, id);
    return id;
  } catch (_) {
    return null;
  }
}

function newEventId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'evt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 12);
}

// Snippet oficial do Pixel (o mesmo loadPixelBase do site). window.fbq existe logo depois desta chamada.
function loadPixelBase() {
  if (window.fbq) return;
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
}

let iniciado = false;

// Carrega o Pixel e faz o init uma vez por página. Devolve false se não deu.
export function iniciarPixel() {
  if (iniciado) return true;
  try {
    loadPixelBase();
    window.fbq('init', META.pixelId);
    iniciado = true;
    return true;
  } catch (_) {
    return false;
  }
}

// Envio do PageView ao servidor: falha silenciosa e keepalive (como o sendToCapi do site)
function enviarCapi(corpo) {
  if (!META.urlCapi) return;
  try {
    fetch(META.urlCapi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => { /* a CAPI cair não pode quebrar a página */ });
  } catch (_) { /* nada */ }
}

let cookies = { fbp: null, fbc: null, externalId: null };
try {
  cookies = { fbp: ensureFbp(), fbc: ensureFbc(), externalId: ensureExternalId() };
} catch (_) { /* segue sem */ }

// Roda fn depois do load da página (na hora, se o load já passou)
function depoisDoLoad(fn) {
  if (document.readyState === 'complete') fn();
  else window.addEventListener('load', fn, { once: true });
}

// Depois do load, espera o navegador ficar ocioso: no máximo 2 s com requestIdleCallback; onde ele não existe
// (Safari), 1,5 s. Nos dois casos fn roda sempre, uma vez.
function depoisDoLoadOcioso(fn) {
  depoisDoLoad(() => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => fn(), { timeout: 2000 });
    else setTimeout(fn, 1500);
  });
}

function pageView() {
  try {
    // ordem do site: cookies primeiro (já feitos acima), depois o Pixel (que reaproveita o _fbp), depois init/track.
    // No obrigado o init já pode ter saído com o CompleteRegistration: iniciarPixel() devolve true sem repetir.
    const eventId = newEventId();
    if (iniciarPixel()) {
      try { window.fbq('track', 'PageView', {}, { eventID: eventId }); } catch (_) { /* nada */ }
    }
    enviarCapi({
      event_id: eventId,
      event_name: 'PageView',
      event_source_url: window.location.href,
      fbp: cookies.fbp || undefined,
      fbc: cookies.fbc || undefined,
      external_id: cookies.externalId || undefined,
    });
  } catch (_) { /* nada */ }
}

if (META.pageview) depoisDoLoadOcioso(pageView);

// Para o envio do formulário: um event_id novo por tentativa e os identificadores do navegador.
// Nunca lança: sem dados, devolve {} e o lead segue sem Meta.
export function dadosMeta() {
  try {
    const dados = { event_id: newEventId() };
    const fbp = getCookie('_fbp') || cookies.fbp;
    const fbc = getCookie('_fbc') || cookies.fbc;
    if (fbp) dados.fbp = fbp;
    if (fbc) dados.fbc = fbc;
    if (cookies.externalId) dados.external_id = cookies.externalId;
    return dados;
  } catch (_) {
    return {};
  }
}
