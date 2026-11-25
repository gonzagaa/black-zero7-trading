// Obrigado: CompleteRegistration pelo navegador (o lado do servidor já saiu da /api/lead). Ver docs/meta.md.
//
// Só dispara se a LP gravou z7_meta_cr no sucesso do envio. A chave é apagada na leitura: recarregar o obrigado
// ou abri-lo direto não dispara nada. O meta.js (importado aqui) cuida dos cookies e do PageView.

import { iniciarPixel } from './meta.js?v=202611250810';

const CHAVE = 'z7_meta_cr';

let registro = null;
try {
  const bruto = sessionStorage.getItem(CHAVE);
  sessionStorage.removeItem(CHAVE);
  if (bruto) registro = JSON.parse(bruto);
} catch (_) { /* sessionStorage bloqueado ou valor estragado: não dispara */ }

const eventId = registro && registro.cadastro === true && typeof registro.event_id === 'string' ? registro.event_id : null;

if (eventId && iniciarPixel()) {
  try {
    window.fbq('track', 'CompleteRegistration', { content_name: 'LP Black Zero7 Trading 2026' }, { eventID: eventId });
  } catch (_) { /* nada */ }
}
