# RD Station — envio do formulário

**Estado em 16/11/2026: decidido.** A conta foi conferida pelo Claude (claude.ai) no Chrome do Gustavo, e as decisões abaixo são dele. Este documento substitui a versão de 13/11.

## O que a conta mostrou

| Item | Resultado |
|---|---|
| Conta | Só existe uma: **`www.zero7.com.br`** (ID 935691). A Zero7 Internacional usa a mesma conta da nacional. Os leads desta LP se separam pelo identificador da conversão |
| Identificador da conversão | **`black-zero7-trading-2026`** (decisão do Gustavo; segue o padrão minúsculo com hífen da conta) |
| Domínio de e-mail | **`contact.zero7trading.com` validado** (11/11/2026). O e-mail de `contact@zero7trading.com` que a página de obrigado promete pode sair desta conta |
| Proteção de dados | Nada na tela de privacidade exige base legal nas conversões. Ver "Base legal" abaixo |

## Por que o envio passa por um servidor

A documentação atual da RD ("Segurança da API Key", developers.rdstation.com) diz que a Chave de API de conversão dá **acesso total à conta** e deve ser protegida como senha, sem nunca ficar exposta. Então ela não pode ir no código da página.

O token público antigo (Integrações → Dados de integração) não é usado: a RD não documenta mais o uso dele nesse endpoint e ninguém testou se ainda funciona.

**Decisão do Gustavo (16/11):** uma rota nova, `/api/lead`, no backend da Vercel que o site internacional já usa para o Pixel (`../Zero7-Internacional/backend/`). É a única alteração permitida naquele repositório.

## Fluxo

```
Página (js/rdstation.js)
  → POST https://<backend>/api/lead   { nome, email, telefone, utm_* }
      → função valida, monta o evento e chama
        POST https://api.rd.services/platform/conversions?api_key=<RD_API_KEY>
      ← 200 { "success": true }   ou erro
  ← só com 200 a página vai para obrigado/
```

A URL do backend em produção está no README dele (`https://zero7-internacional-backend.vercel.app`); confirme com o Gustavo se ainda é essa antes de gravar em `js/config.js`.

## Especificação de `backend/api/lead.js`

Siga o padrão de `api/capi.js`: Node nativo, sem dependências, mesmo tratamento de CORS.

**Entrada**
- Só `POST`; `OPTIONS` responde ao preflight; outro método → `405`.
- `Origin` validado contra a variável que já existe, `ALLOWED_ORIGINS`. Origem fora da lista → `403`, sem `*`.
- Corpo JSON, até 4 KB:
  - `nome`: obrigatório, 2 a 120 caracteres depois de `trim`.
  - `email`: obrigatório, formato de e-mail, até 254 caracteres.
  - `telefone`: obrigatório, de 10 a 15 dígitos depois de tirar tudo que não é dígito (guarde só os dígitos, com `+` na frente se veio com `+`).
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`: opcionais, até 200 caracteres cada.
  - Qualquer falha → `400 { "error": "invalid input" }`, sem dizer qual campo nem ecoar valores.
- O campo-isca (honeypot) é tratado só na página e não chega à função.

**Saída para a RD**
- `POST https://api.rd.services/platform/conversions?api_key=${RD_API_KEY}`, `Content-Type: application/json`, tempo-limite de 8 s.
- Corpo:
  ```json
  {
    "event_type": "CONVERSION",
    "event_family": "CDP",
    "payload": {
      "conversion_identifier": "black-zero7-trading-2026",
      "name": "...",
      "email": "...",
      "mobile_phone": "...",
      "traffic_source": "<utm_source>",
      "traffic_medium": "<utm_medium>",
      "traffic_campaign": "<utm_campaign>",
      "traffic_value": "<utm_term>"
    }
  }
  ```
- O identificador é **fixo na função**, nunca vem da página (impede que alguém use a rota para gravar outras conversões na conta).
- Campos de UTM vazios não vão no payload.
- **Antes de implementar, confirme os nomes dos campos do `payload`** (`name`, `email`, `mobile_phone`, `traffic_*`, `legal_bases`) na referência oficial da RD (`developers.rdstation.com`, página "Conversão via API Key"; o índice `developers.rdstation.com/llms.txt` ajuda). O formato acima foi confirmado só até `event_type`, `event_family` e `payload`; os campos internos vieram de memória.

**Respostas da função**
- RD respondeu 2xx → `200 { "success": true }`.
- RD respondeu erro ou estourou o tempo → `502 { "error": "upstream error" }`.
- `RD_API_KEY` ausente → `500 { "error": "server misconfigured" }`.

**Logs**
- Nunca logue o corpo recebido, nome, e-mail, telefone, a URL com `api_key` nem a resposta completa da RD.
- Pode logar: status da RD, duração e um código de erro genérico.

**Variáveis de ambiente**
- `RD_API_KEY`: nova. Só o Gustavo coloca o valor, direto na Vercel.
- `ALLOWED_ORIGINS`: já existe. Para testar a partir de `http://localhost:5503`, ele precisa estar na lista **só** dos ambientes Preview/Development, nunca em Production.
- `RD_BASE_LEGAL`: opcional (ver abaixo).

## Base legal (LGPD)

A conversão pode levar `legal_bases` (categoria `communications`; tipos como `consent` ou `legitimate_interest`; status `granted`). A conta não exige, e a copy não tem caixa de consentimento.

- A função só manda `legal_bases` se `RD_BASE_LEGAL` estiver definida (valor = o tipo, por exemplo `legitimate_interest`), com `category: "communications"` e `status: "granted"`.
- **Qual tipo usar é decisão do marketing/jurídico da Zero7**, de preferência o mesmo dos outros formulários da conta. Isso não trava a Fase 2.

## Regras da página (continuam valendo)

1. Tudo que é da RD fica em `js/rdstation.js`, que expõe `enviarLead({ nome, email, telefone })` e devolve uma Promise. O resto da página não sabe que a RD existe.
2. `js/config.js` guarda o modo (`'simulado'` | `'real'`) e a URL da função. Nenhuma chave.
3. **Um lead nunca se perde em silêncio.** Só redirecione para `obrigado/` depois do `200` da função. Em qualquer falha, mostre o erro de envio da copy e deixe o formulário preenchido.
4. Em modo real, nunca caia para o simulado.
5. As UTMs da URL de entrada vão junto (já guardadas em `sessionStorage` por `js/utm.js`).
6. O campo-isca continua: se vier preenchido, finja sucesso e não chame a função.

## Para o Gustavo: criar a chave

Ninguém além de você vê o valor da chave: nem o Claude, nem o Claude Code. Não cole a chave em chat.

1. Entre no App Publisher da RD (`appstore.rdstation.com/en/publisher`) com um usuário de perfil **Gestor** ou **Dono**.
2. Clique em **Gerar chave de API** e dê o nome **LP Black Zero7 Trading 2026** (a RD recomenda uma chave por integração, para poder desativar só esta depois).
3. Deixe a chave ativa e copie o valor.
4. Na Vercel, no projeto do backend do site internacional: **Settings → Environment Variables → `RD_API_KEY`**, em Production e Preview. Cole o valor e salve.
5. Faça o redeploy e avise o Claude Code que a chave está lá, para ele rodar o teste de ponta a ponta.
6. Depois da Black, se a página sair do ar, desative essa chave na RD.

## Checklist

- [x] Conta certa: `www.zero7.com.br` (única).
- [x] Rota de envio: backend da Vercel do site internacional.
- [x] Identificador: `black-zero7-trading-2026`.
- [x] Campos: Nome, E-mail e Telefone (copy de 16/11).
- [x] Domínio do remetente `contact.zero7trading.com` validado na conta.
- [ ] Chave de API criada e colocada na Vercel (Gustavo).
- [ ] Base legal definida (marketing/jurídico). Não trava a publicação.
- [ ] Fluxo de e-mail de confirmação montado pelo marketing na RD, disparado pela conversão `black-zero7-trading-2026`.
- [ ] Teste de ponta a ponta: lead de teste aparece na base com a conversão, o telefone e as UTMs.
