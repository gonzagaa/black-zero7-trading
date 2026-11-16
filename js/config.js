// Configuração da página. Ver docs/rdstation.md. Nenhuma chave aqui: a chave da RD só existe na Vercel.

export const RD = {
  modo: 'real',                // 'real' (envia para a função) | 'simulado' (só desenvolvimento, não envia nada)

  // Função que recebe o lead e registra a conversão na RD (backend da Vercel do site internacional)
  urlFuncao: 'https://zero7-internacional-backend.vercel.app/api/lead',

  // Tempo máximo de espera pela função antes de mostrar o erro de envio (ms)
  tempoLimite: 15000,

  // Só para revisar o estado de erro em modo simulado: true faz o envio simulado falhar. Deixe false.
  simularFalha: false,
};

// Para onde o formulário vai depois do sucesso (relativo à página)
export const PAGINA_OBRIGADO = 'obrigado/';
