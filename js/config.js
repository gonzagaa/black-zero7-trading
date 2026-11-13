// Configuração da página. Ver docs/rdstation.md.

export const RD = {
  modo: 'simulado',            // 'simulado' | 'real'
  chavePublica: '',            // TODO: confirmar na conta (pendência 1 do CLAUDE.md)
  identificador: 'black-zero7-trading-2026', // TODO: confirmar com o marketing

  // Só para revisar o estado de erro em modo simulado: true faz o envio simulado falhar. Deixe false.
  simularFalha: false,
};

// Para onde o formulário vai depois do sucesso (relativo à página)
export const PAGINA_OBRIGADO = 'obrigado/';
