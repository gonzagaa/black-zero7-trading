# Fase 2: Campo Telefone, RD Station, medição e preparo da publicação

## O que foi feito

1. **Campo Telefone** depois do E-mail, com o rótulo "Telefone:" e o erro "Digite um telefone válido.".
   - Atributos: `type="tel"`, `inputmode="tel"`, `autocomplete="tel"`, `maxlength="25"`, sem máscara.
   - Válido: de 10 a 15 dígitos depois de tirar espaços, parênteses, hífen e `+`.
   - Ao enviar, a página valida os três campos de uma vez e põe o foco no primeiro inválido.
2. **Função `/api/lead`** escrita e testada conforme `docs/rdstation.md`. **Ainda não está em `../Zero7-Internacional/backend/`:** a gravação fora desta pasta foi negada pela permissão automática do Claude Code. Ver "Perguntas / pendências", item 1. Os três arquivos prontos estão em:
   - `C:\Users\gusta\AppData\Local\Temp\claude\5016f12d40593327\e0795400-98ca-4459-af01-7af65da88d47\scratchpad\backend\api\lead.js`
   - `C:\Users\gusta\AppData\Local\Temp\claude\5016f12d40593327\e0795400-98ca-4459-af01-7af65da88d47\scratchpad\backend\README.md`
   - `C:\Users\gusta\AppData\Local\Temp\claude\5016f12d40593327\e0795400-98ca-4459-af01-7af65da88d47\scratchpad\backend\.env.example`

   Mudanças no README: rota nova na lista e na estrutura, as duas variáveis no passo 3 do deploy, e a seção "Rota /api/lead" com entrada, respostas, logs e um `curl` de teste. No `.env.example`, só nomes: `RD_API_KEY=` e `RD_BASE_LEGAL=`, mais um aviso de que `localhost` só entra em `ALLOWED_ORIGINS` de Preview/Development. `capi.js`, `vercel.json` e `package.json` não foram tocados.
3. **Front em modo real.** `js/config.js` tem `modo: 'real'`, `urlFuncao: 'https://zero7-internacional-backend.vercel.app/api/lead'` (URL confirmada por você) e `tempoLimite: 15000`. `chavePublica` e `identificador` saíram: o identificador agora é fixo na função.
   - `js/rdstation.js` manda `{ nome, email, telefone, utm_* }` por `POST`, sem cookies.
   - Só resolve com `200` e `{ "success": true }`. Qualquer outra resposta, falha de rede ou espera acima de 15 s rejeita, e a página mostra o erro de envio com os campos preenchidos.
   - No modo real, nada vai para o console além do status (ex.: "[RD] função respondeu 502").
   - O modo simulado continua para desenvolvimento.
   - Para navegadores sem `AbortSignal.timeout` (Safari < 16) há um tempo-limite equivalente. Sem ele, todo envio falharia nesses aparelhos.
4. **Medição.**
   - GTM `GTM-NLVJR569` (o trecho do site) no `<head>` das duas páginas, com o `noscript` como primeiro elemento do `<body>`.
   - No sucesso, antes de redirecionar: `dataLayer.push({ event: 'lead_black_trading' })`, sem nenhum dado pessoal.
   - Hotjar e Zendesk não entraram.
5. **Selo do Reclame Aqui** no `#ra-verified-seal` das duas páginas. É o script de `docs/fases.md`, dentro do `div`, como no site.
6. **Endereço e compartilhamento** (só na LP; o obrigado continua `noindex`):
   - `canonical` e `og:url`: `https://zero7trading.com/black-2026/`;
   - `og:image` e `twitter:image`: `https://zero7trading.com/black-2026/assets/og/black-2026.jpg`, com `og:image:width/height/type/alt`;
   - `twitter:card` como `summary_large_image`, e `og:site_name` como "Zero7 Trading";
   - título e descrição com o texto da hero.
7. **Imagem de compartilhamento**, gerada a partir da hero aprovada: as mesmas camadas do fundo, a logo, "Black Zero7 Trading" e a pílula da data, sem formulário. 1200 × 630, JPG, 63 KB, em `assets/og/black-2026.jpg`. Foi renderizada com o próprio CSS da página.

   ![Imagem de compartilhamento](../assets/og/black-2026.jpg)

Versão de cache: `?v=202611160812`.

## Arquivos criados/alterados

```
index.html             campo Telefone; GTM + noscript; selo RA; canonical, og:* e twitter:*
obrigado/index.html    GTM + noscript; selo RA
js/config.js           modo real, urlFuncao, tempoLimite; sem chavePublica nem identificador
js/rdstation.js        envio para /api/lead (reescrito)
js/formulario.js       telefone, foco no primeiro inválido, dataLayer no sucesso
assets/og/black-2026.jpg   novo
css/*, js/*, *.html    ?v=202611160812
relatorios/fase-2.md
```

Também entram neste commit as edições que você fez hoje em `CLAUDE.md`, `docs/copy.md`, `docs/fases.md` e `docs/rdstation.md`. A pasta `.vscode/` fica fora.

Fora deste repositório, aguardando sua permissão: `backend/api/lead.js` (novo), `backend/README.md` e `backend/.env.example`.

## Capturas (shots/fase-2/)

- **Página inteira:** `lp-{360,390,768,1024,1280,1440,1920}.png` e `obrigado-{360,390,768,1024,1280,1440,1920}.png`.
- **Estados em 390 px:**
  - `estado-erros-390.png`: os três campos vazios;
  - `estado-falha-envio-390.png`: a função devolveu 502.

## Conferência da copy (resultado do script)

```
=== index.html
<title>: OK   Black Zero7 Trading
Copy (docs/copy.md) → página:
  OK   Black Zero7 Trading
  OK   Uma oferta imperdível para você testar e operar Day Trade no mercado americano de futuros.
  OK   Oferta revelada ao vivo - 27/11 às 12h
  OK   Cadastre-se para receber a oferta.
  OK   Nome:
  OK   E-mail:
  OK   Telefone:
  OK   QUERO RECEBER A OFERTA
  OK   Traders Zero7 recebendo em Dólar
Textos visíveis fora da copy, do rodapé do site e da tabela técnica:
  nenhum
Textos técnicos no HTML: Black Zero7 Trading
Atributos com texto (alt/aria-label/title/placeholder): Zero7 | Zero7 | Instagram | TikTok | Facebook
Escondidos do leitor de tela (aria-hidden): nenhum

=== obrigado/index.html
<title>: OK   Obrigado! — Black Zero7 Trading
Copy (docs/copy.md) → página:
  OK   Obrigado!
  OK   Cadastro feito com sucesso!
  OK   Para não perder sua oferta e os detalhes dela fique atento a esses dois canais:
  OK   Te esperamos ao vivo no dia 27/11 às 12h.
  OK   Sua caixa de e-mail e marque como confiável: contact@zero7trading.com
  OK   Seu WhatsApp de cadastro (Atenção: A Zero7 não solicita nenhum pagamento, PIX ou transferência por meio do WhatsApp - esse é um canal apenas para notificações)
Textos visíveis fora da copy, do rodapé do site e da tabela técnica:
  nenhum
Textos técnicos no HTML: nenhum (os de validação/envio são do JS)
Atributos com texto (alt/aria-label/title/placeholder): Zero7 | Zero7 | Instagram | TikTok | Facebook
Escondidos do leitor de tela (aria-hidden): nenhum

=== js/ (textos que o JS põe na tela)
  OK   js/formulario.js: Preencha este campo.
  OK   js/formulario.js: Digite um e-mail válido.
  OK   js/formulario.js: Digite um telefone válido.
  OK   js/formulario.js: Não foi possível enviar agora. Tente de novo.
  OK   js/formulario.js: ENVIANDO...
  OK   js/comprovantes.js: Comprovante de pagamento a trader Zero7

RESULTADO: copy confere, nenhum texto a mais.
```

## Checagens rodadas

### Função `/api/lead`: testes sem a chave real (item 7)

Rodei a função num servidor local que imita a Vercel (`res.status().json()`), com `ALLOWED_ORIGINS=https://zero7trading.com,https://www.zero7trading.com`.

- **Sem `RD_API_KEY`:** casos 1 a 5.
- **Com uma chave falsa** (`chave-falsa-de-teste`) **e uma RD falsa** que só registra o que receberia: casos 6 a 8. Nada foi enviado à RD de verdade.
- **Abreviações:** `<lead válido>` = `{"nome":"Lead Teste","email":"teste@exemplo.com","telefone":"+55 (62) 99999-0000","utm_source":"instagram","utm_medium":"bio","utm_campaign":"black-2026","utm_term":"","utm_content":"story"}`, `$U` = `http://localhost:3999/api/lead`, `$OK` = `Origin: https://zero7trading.com`, `$J` = `Content-Type: application/json`.

| # | Comando | Resposta |
|---|---|---|
| 1 | `curl -X POST $U -H 'Origin: https://site-nao-autorizado.com' -H $J --data <lead válido>` | `403 {"error":"origin not allowed"}` |
| 1b | `curl -X OPTIONS $U -H 'Origin: https://site-nao-autorizado.com' -H 'Access-Control-Request-Method: POST'` | `403` |
| 1c | `curl -X POST $U -H $J --data <lead válido>` (sem Origin) | `403 {"error":"origin not allowed"}` |
| 2 | `curl -X OPTIONS $U -H $OK -H 'Access-Control-Request-Method: POST'` | `204`, `Access-Control-Allow-Origin: https://zero7trading.com` |
| 3 | `curl -X GET $U -H $OK` | `405 {"error":"method not allowed"}`, `Allow: POST, OPTIONS` |
| 3b | `curl -X PUT $U -H $OK -H $J --data <lead válido>` | `405 {"error":"method not allowed"}` |
| 4 | `curl -X POST $U -H $OK -H $J` (corpo vazio) | `400 {"error":"invalid input"}` |
| 4b | `... --data '{"nome":'` (JSON quebrado) | `400 {"error":"invalid input"}` |
| 4c | `... --data '{"nome":"A","email":"a@b.com","telefone":"62999990000"}'` | `400 {"error":"invalid input"}` |
| 4d | `... --data '{"nome":"Lead","email":"a@b","telefone":"62999990000"}'` | `400 {"error":"invalid input"}` |
| 4e | `... "telefone":"999990000"` (9 dígitos) | `400 {"error":"invalid input"}` |
| 4f | `... "telefone":"1234567890123456"` (16 dígitos) | `400 {"error":"invalid input"}` |
| 4g | `... '{"nome":"Lead","email":"a@b.com"}'` (sem telefone) | `400 {"error":"invalid input"}` |
| 4h | `... "utm_source":"xxx…"` (201 caracteres) | `400 {"error":"invalid input"}` |
| 4i | corpo com mais de 4 KB | `400 {"error":"invalid input"}` |
| 4j | `... --data '[1]'` | `400 {"error":"invalid input"}` |
| 5 | `curl -X POST $U -H $OK -H $J --data <lead válido>`, sem `RD_API_KEY` | `500 {"error":"server misconfigured"}` |
| 6 | o mesmo, RD falsa responde 200 | `200 {"success":true}` |
| 6b | o mesmo, com `RD_BASE_LEGAL=legitimate_interest` | `200 {"success":true}` |
| 7 | o mesmo, RD falsa responde 400 | `502 {"error":"upstream error"}` |
| 8 | o mesmo, RD falsa não responde | `502 {"error":"upstream error"}` em 8,0 s |

**O que a RD falsa recebeu** no caso 6 (chave mascarada):

```
POST https://api.rd.services/platform/conversions?api_key=***
{"event_type":"CONVERSION","event_family":"CDP","payload":{"conversion_identifier":"black-zero7-trading-2026",
 "name":"Lead Teste","email":"teste@exemplo.com","mobile_phone":"+5562999990000",
 "traffic_source":"instagram","traffic_medium":"bio","traffic_campaign":"black-2026"}}
```

O `utm_term` vazio não foi, e o `utm_content` não tem campo na RD. No caso 6b, foi também `"legal_bases":[{"category":"communications","type":"legitimate_interest","status":"granted"}]`.

**Todos os logs que a função escreveu nos 21 casos:**

```
[lead] RD_API_KEY ausente
[lead] rd ok { status: 200, ms: 2 }
[lead] rd ok { status: 200, ms: 5 }
[lead] rd erro { status: 400, ms: 1 }
[lead] rd falhou { codigo: 'timeout', ms: 8003 }
```

Procurei nos logs por "Lead Teste", "teste@exemplo.com", "99999", "chave-falsa", "api_key" e "instagram": 0 ocorrências de cada.

**Campos conferidos na referência oficial** (`developers.rdstation.com/reference/conversao.md`, atualizada em 13/07/2026):
- Confirmados: o endpoint e `api_key` na query; `event_type: "CONVERSION"` e `event_family: "CDP"`; `conversion_identifier`, `name`, `email`, `mobile_phone` ("Celular do contato") e `traffic_source/medium/campaign/value` (`traffic_value` = UTM term); `legal_bases` com `category: "communications"` e os seis tipos aceitos.
- `RD_BASE_LEGAL` com valor fora desses tipos é ignorada, com aviso no log: um valor errado faria a RD recusar todos os leads.
- **Diferença:** a RD também tem um campo `phone` ("Telefone do contato"), e o esquema dela lista `email` e `phone` como obrigatórios, enquanto o texto diz "obrigatório se o outro não vier". Segui o `rdstation.md` (`mobile_phone`) e sempre mando o e-mail. Ver "Perguntas / pendências", item 3.

### Página

Testes no Chromium (Playwright), com a função interceptada: nenhuma chamada saiu para a Vercel. O GTM também foi interceptado: a página pede o `gtm.js`, mas o teste responde vazio, para não gerar visitas no contêiner.

| Caso | Resultado |
|---|---|
| Função fora do ar (rede) | fica em `/`; "Não foi possível enviar agora. Tente de novo."; campos preenchidos; botão volta a "QUERO RECEBER A OFERTA"; sem `lead_black_trading`; console: `[RD] função fora do alcance (rede)` |
| Função devolve 500 / 502 / 400 | idem; console: `[RD] função respondeu 500` (502, 400) |
| Função devolve 200 sem `success` / 200 com HTML | idem; console: `[RD] função respondeu 200` |
| Função não responde | erro de envio depois de 15,1 s, campos preenchidos; console: `[RD] função fora do alcance (tempo esgotado)` |
| Função devolve `200 {"success":true}` | vai para `/obrigado/`; pushes no dataLayer durante o envio: `[{"event":"lead_black_trading"}]` |
| Corpo enviado à função | `{"nome":"Lead Teste","email":"teste@exemplo.com","telefone":"+55 (62) 99999-0000","utm_source":"instagram","utm_medium":"bio","utm_campaign":"black-2026"}`, `Content-Type: application/json`, sem cookie |
| Dado pessoal na URL, no dataLayer ou no console (todos os casos acima) | nenhum |
| Campo-isca preenchido | vai para `obrigado/`; 0 chamadas à função |
| Telefone | válidos: `62 99999-0000`, `(62) 99999-0000`, `+55 62 99999-0000`, `+1 (415) 555-0100`, `+44 20 7946 0958`, `6299999000`. Inválidos ("Digite um telefone válido."): `629999900` (9 dígitos), `+55 62 99999-0000 1234` (17), `62.99999.0000` (ponto), `abc` |
| Enviar vazio | "Preencha este campo." nos três; foco em Nome |
| Só o telefone errado | foco em Telefone, "Digite um telefone válido." |
| Tab | nome → email → telefone → botão |
| Terceiros pedidos | `googletagmanager.com/gtm.js`; o selo: `s3.amazonaws.com/raichu-beta/ra-verified/` (bundle.js, styles.css, logo) e `api.reclameaqui.com.br`. **O script do selo carrega ainda fontes do Google** (`fonts.googleapis.com`, `fonts.gstatic.com`): vem do próprio selo, não da página |
| `noscript` do GTM | primeiro elemento do `<body>` nas duas páginas |
| Rolagem horizontal (7 larguras × 2 páginas) | nenhuma |
| Respostas ≥ 400 (7 × 2) | nenhuma |
| Console (7 × 2) | **3 erros, todos do selo do Reclame Aqui** (ver "O que me incomodou", item 1). Nenhum erro da página |

**Fim do botão com o campo Telefone:**

| Largura × altura | Antes (Fase 1D) | Agora | Passou da dobra |
|---|---|---|---|
| 360 × 844 | 766 px | 860 px | 16 px |
| **390 × 844** | 776 px | **870 px** | **26 px** |
| 768 × 900 | 912 px | 1016 px | 116 px |
| 1024 × 900 | 983 px | 1086 px | 186 px |
| 1280, 1440 × 900 | — | 674 px | não |
| 1920 × 900 | — | 701 px | não |

Não encolhi nada. Em 390 × 844, a borda de cima do botão está em 806 px: ele aparece metade na primeira tela e fica todo visível com 26 px de rolagem. Se quiser que ele caiba, o que menos mexe no desenho é tirar uns 3 px de cada vão do formulário no celular. Mas é decisão sua.

## Roteiro para o Gustavo (item 8)

### a) Criar a Chave de API na RD e colocar na Vercel

1. Entre em `appstore.rdstation.com/en/publisher` com um usuário **Gestor** ou **Dono** da conta `www.zero7.com.br`.
2. **Gerar chave de API** com o nome **LP Black Zero7 Trading 2026**. Deixe ativa e copie o valor. Não cole em chat, arquivo ou e-mail.
3. Na Vercel, no projeto do backend (o que responde em `zero7-internacional-backend.vercel.app`): **Settings → Environment Variables → Add**:
   - `RD_API_KEY` = o valor, em **Production** e **Preview**.
   - `RD_BASE_LEGAL`: só quando o marketing/jurídico definir o tipo (ex.: `legitimate_interest`). Pode ficar sem.
4. Confira `ALLOWED_ORIGINS`:
   - em Production, precisa ter `https://zero7trading.com` e `https://www.zero7trading.com`. É a mesma variável do Pixel, então provavelmente já tem;
   - `http://localhost:5503` só se quiser testar a LP local contra um deploy de Preview; nunca em Production.

### b) Deploy do backend

1. A função tem de estar no repositório `Zero7-Internacional`. Primeiro me autorize a gravar os três arquivos (pendência 1), ou copie você mesmo do scratchpad: `lead.js` vai para `backend/api/`, e `README.md` e `.env.example` substituem os de `backend/`.
2. Revise o diff, faça o commit e o push no ramo que a Vercel publica. Se o projeto não publica sozinho, faça **Deployments → Redeploy**. Variável nova só vale depois de um deploy novo.
3. Teste rápido sem dado pessoal (deve dar `400 {"error":"invalid input"}`, o que prova que a rota existe e não grava nada):
   ```bash
   curl -i -X POST "https://zero7-internacional-backend.vercel.app/api/lead" \
     -H "Origin: https://zero7trading.com" -H "Content-Type: application/json" --data '{}'
   ```
4. Confira em **Logs** da Vercel que só aparece `[lead] ...` com status e duração.

### c) Teste de ponta a ponta (eu rodo, depois do seu aviso)

Quando você avisar que a chave está na Vercel e o deploy foi feito:

1. Mando **um** lead de teste pela própria função, com `Origin: https://zero7trading.com`:
   - nome "Teste LP Black 2026";
   - um e-mail de teste que você indicar (de preferência uma caixa da Zero7, para ver o e-mail de confirmação, quando o marketing montar o fluxo);
   - um telefone de teste;
   - `utm_source=teste-e2e`, `utm_medium=teste`, `utm_campaign=black-2026`.
2. Espero `200 {"success":true}`.
3. Você confere na RD, em **Contatos**, o contato com a conversão `black-zero7-trading-2026`, o celular e a origem (`teste-e2e / teste / black-2026`). Se a base legal estiver definida, ela também aparece no contato.
4. Opcional: o mesmo pela LP rodando local. Precisa de `http://localhost:5503` em `ALLOWED_ORIGINS` de um deploy de **Preview**, com `urlFuncao` apontando para esse Preview só durante o teste.
5. Depois, apague o contato de teste na RD (ou marque com uma tag) para não sujar a base.

### d) Subir a LP para `https://zero7trading.com/black-2026/`

**Sobe** (353 KB ao todo), mantendo a estrutura de pastas, para a pasta `black-2026/` do servidor do site:

```
.htaccess
index.html
obrigado/index.html
css/base.css  css/comprovantes.css  css/hero.css  css/obrigado.css  css/rodape.css  css/tokens.css
js/comprovantes.js  js/config.js  js/formulario.js  js/rdstation.js  js/utm.js
assets/apple-touch-icon.png
assets/favicon-32.png
assets/fonts/inter-latin-wght-normal.woff2
assets/fonts/zalando-sans-expanded-latin-wght-normal.woff2
assets/fonts/OFL-inter.txt
assets/fonts/OFL-zalando-sans-expanded.txt
assets/fundo/bg-black.avif
assets/marca/logo-zero7.avif
assets/og/black-2026.jpg
assets/comprovantes/   (as imagens, quando chegarem)
```

**Não sobe:** `_referencia/`, `docs/`, `relatorios/`, `shots/`, `scripts/`, `.vscode/`, `.git/`, `.gitignore`, `CLAUDE.md`, `package.json`, `assets/comprovantes/LEIA-ME.md`. O `.htaccess` devolve 404 para tudo isso, caso algo suba por engano.

**Antes de subir, confira:**
1. `js/config.js` com `modo: 'real'`. É o que está no commit.
2. A função já respondendo 200 no teste do item c.
3. Que a pasta `black-2026/` do servidor aceita `.htaccess` (Apache com `AllowOverride`), como a `lp-black-friday`.

**Depois de subir, confira:**
1. `https://zero7trading.com/black-2026/` e `.../black-2026/obrigado/` abrem.
2. `.../black-2026/docs/copy.md` dá 404.
3. Um lead real chega à RD.
4. O selo do Reclame Aqui aparece com a nota (ver "O que me incomodou", item 1).
5. O depurador de compartilhamento do Facebook (`developers.facebook.com/tools/debug/`) mostra a imagem.

**Depois da Black,** se a página sair do ar, desative a chave "LP Black Zero7 Trading 2026" na RD.

## Textos fora da copy usados nesta fase

- "Digite um telefone válido.": da tabela de `docs/copy.md`, entrou em 16/11.
- `og:image:alt`: "Black Zero7 Trading" (o título da copy).
- `og:site_name`: "Zero7 Trading", como no site.
- O selo do Reclame Aqui escreve o próprio texto ("Procure nossa empresa no" ou a nota). É conteúdo do script de terceiro aprovado, como no site.

Os outros textos técnicos não mudaram.

## O que me incomodou

1. **O selo do Reclame Aqui dá erro de console.** A API da RA (`api.reclameaqui.com.br/embed-raverified/...`) recusa a chamada por CORS. O selo cai no modo reserva, "Procure nossa empresa no [logo do Reclame Aqui]", sem a nota. São 3 erros por página, todos do script da RA.
   - Abri o **site público** (`zero7trading.com/home/`) do mesmo jeito, e lá acontece o mesmo: o mesmo erro e o mesmo selo reserva.
   - Então não é coisa da LP: ou a RA bloqueia navegador automatizado, ou o selo verificado não está funcionando nem no site.
   - Não consigo distinguir daqui. Vale abrir o site num navegador normal e ver se o selo mostra a nota. Se não mostrar, o problema é do cadastro do selo na RA, não destas páginas.
   - O critério "console sem erros" fica cumprido só para o código da página.
2. **O botão passou da dobra no celular** (26 px em 390 × 844), por causa do terceiro campo. Ver a tabela acima.
3. **O `dataLayer.push` e o redirecionamento são imediatos.** Uma tag do GTM ligada a `lead_black_trading` pode não terminar de disparar antes de a página mudar.
   - Segui a especificação ao pé da letra (o push exato, depois o redirecionamento).
   - Se o marketing for medir a conversão por esse evento, convém configurar a tag no GTM para esperar ou usar o carregamento do `obrigado/` como gatilho.
   - Também posso acrescentar `eventCallback` e `eventTimeout` ao push, sem dado pessoal, mas isso muda o objeto que a especificação define.
4. **Telefone com ponto** (`62.99999.0000`) é recusado, porque a regra só tira espaço, parêntese, hífen e `+`. Quem digitar assim vê "Digite um telefone válido.". A função aceitaria, porque tira tudo o que não é dígito.
5. **`vercel.json` só define `maxDuration` para `capi.js`.** A `lead.js` fica com o limite padrão da Vercel, que é maior que os 8 s da espera pela RD. Não mexi, porque o arquivo está fora do que posso alterar.
6. **Com `modo: 'real'`, a LP rodando em `localhost:5503` chama a função de produção.** Ela recusa a origem e a página mostra o erro de envio. Para desenvolver o visual, troque para `'simulado'` localmente e volte antes de subir.

## Perguntas / pendências

1. **Permissão para gravar no backend.** A permissão automática do Claude Code negou a criação de `../Zero7-Internacional/backend/api/lead.js`. O `CLAUDE.md` autoriza essa exceção, mas a ferramenta não deixou, e não tentei contornar. Duas saídas:
   - você aprova a gravação e eu copio os três arquivos do scratchpad para `backend/`, sem commit naquele repositório;
   - ou você copia (caminhos no item 2 de "O que foi feito").
2. **Commit no repositório do site:** depois da cópia, faço o commit em `Zero7-Internacional` ou deixa para você revisar e commitar? Push e deploy são seus.
3. **`mobile_phone` × `phone`:** mantenho `mobile_phone`, como no `rdstation.md`, ou mando também `phone`? Na RD aparecem como campos diferentes ("Celular" e "Telefone").
4. **Selo do Reclame Aqui:** pode conferir num navegador normal se o selo do site mostra a nota (item 1 de "O que me incomodou")?
5. **Botão em 390 × 844:** aceita os 26 px ou quer que eu aperte os vãos do formulário no celular?
6. Continuam abertas: a chave na Vercel, a base legal (marketing/jurídico), o fluxo de e-mail de confirmação na RD e as imagens dos comprovantes.

Aguardando aprovação para a Fase 3.
