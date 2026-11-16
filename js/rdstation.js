// Tudo o que é da RD Station fica aqui. O resto da página só conhece enviarLead(). Ver docs/rdstation.md.
//
// Fase 1: só o modo simulado. O modo real (API de Conversões) entra na Fase 2.

import { RD } from './config.js?v=202611160750';
import { lerUtms } from './utm.js?v=202611160750';

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function montarPayload({ nome, email }) {
  const utm = lerUtms();
  const payload = {
    conversion_identifier: RD.identificador,
    name: nome,
    email,
  };
  if (utm.utm_source) payload.traffic_source = utm.utm_source;
  if (utm.utm_medium) payload.traffic_medium = utm.utm_medium;
  if (utm.utm_campaign) payload.traffic_campaign = utm.utm_campaign;
  if (utm.utm_term) payload.traffic_value = utm.utm_term;
  return {
    event_type: 'CONVERSION',
    event_family: 'CDP',
    payload,
  };
}

/**
 * Envia o lead. Resolve só quando o envio deu certo; rejeita em qualquer falha.
 * @param {{ nome: string, email: string }} lead
 * @returns {Promise<void>}
 */
export async function enviarLead(lead) {
  const corpo = montarPayload(lead);

  if (RD.modo === 'simulado') {
    await esperar(600);
    if (RD.simularFalha) throw new Error('[RD simulado] falha simulada (config.js: simularFalha)');
    // Só no modo simulado o payload vai para o console (docs/rdstation.md). No modo real, nunca.
    console.info('[RD simulado] payload que seria enviado:', corpo);
    return;
  }

  if (RD.modo === 'real') {
    // Nunca cai para o simulado: sem chave, falha (docs/rdstation.md, regra 5). Sem dado pessoal no console.
    if (!RD.chavePublica) throw new Error('[RD] modo real sem chave pública em js/config.js');
    throw new Error('[RD] modo real ainda não implementado (Fase 2)');
  }

  throw new Error(`[RD] modo desconhecido em js/config.js: "${RD.modo}"`);
}
