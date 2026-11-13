# RD Station — envio do formulário

**Estado em 13/11/2026: pendente.** A RD Station estava fora do ar quando esta pasta foi montada, então a conta ainda não foi conferida. Nada aqui é definitivo até a seção "A confirmar na conta" ser preenchida.

Na Fase 1 o formulário roda em **modo simulado** (ver abaixo). A integração real é a Fase 2.

## Como o envio vai funcionar (plano)

O formulário é nosso (HTML próprio, para manter o visual). O envio usa a **API de Conversões da RD Station Marketing**, que é a rota oficial para formulário próprio:

```
POST https://api.rd.services/platform/conversions?api_key=<CHAVE PÚBLICA DA CONTA>
Content-Type: application/json

{
  "event_type": "CONVERSION",
  "event_family": "CDP",
  "payload": {
    "conversion_identifier": "black-zero7-trading-2026",
    "name": "<nome>",
    "email": "<e-mail>",
    "traffic_source": "<utm_source>",
    "traffic_medium": "<utm_medium>",
    "traffic_campaign": "<utm_campaign>",
    "traffic_value": "<utm_term>"
  }
}
```

Confira esse formato na documentação oficial (developers.rdstation.com) antes de implementar: ele foi escrito de memória, sem acesso à conta.

Alternativa, se a conta não liberar chave de API: o **script de monitoramento** da RD (Lead Tracking), que captura o envio de formulários da página. Só usar se a rota acima não for possível.

## Regras de implementação

1. Tudo que é da RD fica em **um módulo**, `js/rdstation.js`, que expõe uma função `enviarLead({ nome, email })` e devolve uma Promise. O resto da página não sabe que a RD existe.
2. Configuração em `js/config.js`:
   ```js
   export const RD = {
     modo: 'simulado',            // 'simulado' | 'real'
     chavePublica: '',            // TODO: confirmar na conta
     identificador: 'black-zero7-trading-2026', // TODO: confirmar com o marketing
   };
   ```
3. **Modo simulado:** não chama a RD; espera ~600 ms, escreve o payload no console e resolve. Serve para aprovar o visual e o fluxo.
4. **Um lead nunca se perde em silêncio.** Em modo real, só redirecione para `obrigado/` depois da resposta de sucesso da RD. Se falhar (rede, 4xx, 5xx), mostre o erro de envio da copy e deixe o formulário preenchido para nova tentativa.
5. Se `modo` for `'real'` e `chavePublica` estiver vazia, o envio falha com erro no console. Nunca caia para o simulado em produção.
6. As UTMs da URL de entrada são guardadas em `sessionStorage` e enviadas junto (mesma ideia do `js/utmForward.js` do site).
7. Só chave **pública** no front. Token privado, `client_secret` ou qualquer credencial de OAuth nunca entram neste repositório. Se a conta exigir autenticação privada, o envio passa por um endpoint de servidor (o site já tem um em `../Zero7-Internacional/backend/`, na Vercel) e isso vira pergunta para o Gustavo.
8. Proteção contra robô: um campo-isca escondido (honeypot). Se vier preenchido, finja sucesso e não envie.

## A confirmar na conta (preencher quando a RD voltar)

- [ ] A conta certa: a Zero7 Internacional tem conta própria na RD ou usa a da Zero7 nacional?
- [ ] A chave pública de API (Conta → Integrações → Chaves de API).
- [ ] O identificador da conversão que o marketing quer ver (sugestão: `black-zero7-trading-2026`).
- [ ] Se o marketing precisa de mais algum campo (ver a pendência do WhatsApp em `CLAUDE.md`).
- [ ] O fluxo que dispara depois da conversão (e-mail de confirmação de `contact@zero7trading.com`) é montado pelo marketing dentro da RD, não pela página.
- [ ] Teste de ponta a ponta: enviar um lead de teste e ver ele aparecer na base com a conversão e as UTMs.
