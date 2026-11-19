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

// Meta (Pixel + API de Conversões). Ver docs/meta.md. Nenhum token aqui: o token só existe na Vercel.
export const META = {
  pixelId: '1380055004077990',
  pageview: true,              // PageView no navegador e na /api/capi, ao abrir a LP e o obrigado (aprovado em 18/11)

  // Rota que já existe no backend do site e recebe o PageView do lado do servidor
  urlCapi: 'https://zero7-internacional-backend.vercel.app/api/capi',
};

// Para onde o formulário vai depois do sucesso (relativo à página)
export const PAGINA_OBRIGADO = 'obrigado/';
