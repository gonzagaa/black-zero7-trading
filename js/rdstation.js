// Tudo o que é da RD Station fica aqui. O resto da página só conhece enviarLead(). Ver docs/rdstation.md.
//
// A página não fala com a RD: manda o lead para a função /api/lead (Vercel), que guarda a chave e registra a conversão.

import { RD } from './config.js?v=202611161651';
import { lerUtms } from './utm.js?v=202611161651';

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

// AbortSignal.timeout não existe em navegadores mais antigos (Safari < 16): lá o tempo-limite vem do AbortController
function sinalComTempo(ms) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  if (typeof AbortController === 'undefined') return undefined;
  const controle = new AbortController();
  setTimeout(() => controle.abort(new DOMException('tempo esgotado', 'TimeoutError')), ms);
  return controle.signal;
}

function montarCorpo({ nome, email, telefone }) {
  const utm = lerUtms();
  const corpo = { nome, email, telefone };
  for (const campo of UTMS) if (typeof utm[campo] === 'string' && utm[campo]) corpo[campo] = utm[campo];
  return corpo;
}

/**
 * Envia o lead. Resolve só quando a função respondeu 200 { success: true }; rejeita em qualquer outro caso.
 * @param {{ nome: string, email: string, telefone: string }} lead
 * @returns {Promise<void>}
 */
export async function enviarLead(lead) {
  const corpo = montarCorpo(lead);

  if (RD.modo === 'simulado') {
    await esperar(600);
    if (RD.simularFalha) throw new Error('[RD simulado] falha simulada (config.js: simularFalha)');
    // Só no modo simulado o corpo vai para o console. No modo real, nunca.
    console.info('[RD simulado] corpo que seria enviado à função:', corpo);
    return;
  }

  if (RD.modo === 'real') {
    // Nunca cai para o simulado. Mensagens de erro sem dado pessoal.
    if (!RD.urlFuncao) throw new Error('[RD] modo real sem urlFuncao em js/config.js');

    let resposta;
    try {
      resposta = await fetch(RD.urlFuncao, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
        credentials: 'omit',
        cache: 'no-store',
        signal: sinalComTempo(RD.tempoLimite),
      });
    } catch (erro) {
      throw new Error(`[RD] função fora do alcance (${erro && erro.name === 'TimeoutError' ? 'tempo esgotado' : 'rede'})`);
    }

    let dados = null;
    try { dados = await resposta.json(); } catch { /* corpo não é JSON */ }
    if (resposta.status === 200 && dados && dados.success === true) return;
    throw new Error(`[RD] função respondeu ${resposta.status}`);
  }

  throw new Error(`[RD] modo desconhecido em js/config.js: "${RD.modo}"`);
}
