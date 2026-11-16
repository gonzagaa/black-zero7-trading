# Fase 2 (ajuste)

## O que foi feito

1. **Backend copiado.** Os 3 arquivos do scratchpad foram para `../Zero7-Internacional/backend/`:
   - `api/lead.js` (novo);
   - `README.md` e `.env.example`, só com as linhas novas no diff (os dois mantêm o CRLF do repositório).
2. **`phone` além de `mobile_phone`.** A função manda o telefone nos dois campos, com o mesmo valor. Os testes da tabela da Fase 2 rodaram de novo, todos com o mesmo resultado (abaixo).
3. **Commit no Zero7-Internacional:** `393b7e4`, no `master`. Usei `git add -- backend/api/lead.js backend/README.md backend/.env.example` e nada mais daquele repositório. **Sem push.** O diff completo está no fim deste relatório.
4. **Telefone na página igual à função.** Tira tudo que não é dígito e aceita de 10 a 15 dígitos; o `+` do começo continua valendo, e a função o mantém. Qualquer letra deixa o valor inválido. `62.99999.0000` agora é válido.
5. **`dataLayer` com callback.** No sucesso, a página faz `dataLayer.push({ event: 'lead_black_trading', eventCallback, eventTimeout: 2000 })`. O redirecionamento está dentro do callback, com uma trava para não acontecer duas vezes. Um `setTimeout` de 2 s cobre o caso de o GTM não carregar: aí ninguém chama o callback, e o `eventTimeout` também não age. O objeto não leva nenhum dado pessoal.
6. **Botão em 390 × 844:** aceito como está. Nada mudou.
7. **Selo do Reclame Aqui:** você conferiu num navegador normal que o selo do site aparece certo. Os 3 erros de console por página vêm do teste automatizado (a API da RA recusa o Chromium automatizado) e **não bloqueiam**. Fica registrado.

Versão de cache: `?v=202611160834`.

## Arquivos alterados

```
js/formulario.js          telefone igual à função; dataLayer com eventCallback/eventTimeout, trava e reserva de 2 s
css/*, js/*, *.html       ?v=202611160834
relatorios/fase-2-ajuste.md

../Zero7-Internacional (commit 393b7e4, sem push):
backend/api/lead.js       novo (com phone + mobile_phone)
backend/README.md         rota /api/lead
backend/.env.example      RD_API_KEY, RD_BASE_LEGAL (só nomes)
```

## Capturas (shots/fase-2-ajuste/)

`lp-390.png` e `obrigado-390.png`. O visual não mudou em relação à Fase 2.

## Testes da função com a RD falsa (de novo, com `phone`)

Mesmo método e mesmos comandos da Fase 2: servidor local que imita a Vercel, chave falsa `chave-falsa-de-teste` e RD falsa. Nada foi enviado à RD de verdade.

| # | Caso | Resposta |
|---|---|---|
| 1 | origem não autorizada | `403 {"error":"origin not allowed"}` |
| 1b | preflight de origem não autorizada | `403` |
| 1c | sem Origin | `403 {"error":"origin not allowed"}` |
| 2 | preflight de origem autorizada | `204`, `Access-Control-Allow-Origin: https://zero7trading.com` |
| 3 / 3b | GET / PUT | `405 {"error":"method not allowed"}`, `Allow: POST, OPTIONS` |
| 4 a 4j | corpo vazio, JSON quebrado, nome com 1 letra, e-mail inválido, telefone com 9 e com 16 dígitos, sem telefone, UTM com 201 caracteres, corpo > 4 KB, array | `400 {"error":"invalid input"}` nos 10 |
| 5 | lead válido sem `RD_API_KEY` | `500 {"error":"server misconfigured"}` |
| 6 | RD falsa responde 200 | `200 {"success":true}` |
| 6b | com `RD_BASE_LEGAL=legitimate_interest` | `200 {"success":true}` |
| 7 | RD falsa responde 400 | `502 {"error":"upstream error"}` |
| 8 | RD falsa não responde | `502 {"error":"upstream error"}` em 8,0 s |

O que a RD falsa recebeu no caso 6 (chave mascarada):

```
POST https://api.rd.services/platform/conversions?api_key=***
{"event_type":"CONVERSION","event_family":"CDP","payload":{"conversion_identifier":"black-zero7-trading-2026",
 "name":"Lead Teste","email":"teste@exemplo.com","mobile_phone":"+5562999990000","phone":"+5562999990000",
 "traffic_source":"instagram","traffic_medium":"bio","traffic_campaign":"black-2026"}}
```

Todos os logs da função nos 21 casos:

```
[lead] RD_API_KEY ausente
[lead] rd ok { status: 200, ms: 9 }
[lead] rd ok { status: 200, ms: 4 }
[lead] rd erro { status: 400, ms: 3 }
[lead] rd falhou { codigo: 'timeout', ms: 8005 }
```

Procurei nos logs por "Lead Teste", "teste@exemplo.com", "99999", "chave-falsa", "api_key" e "instagram": 0 ocorrências de cada.

## Testes da página

Função interceptada. O GTM foi bloqueado, servido vazio ou trocado por um GTM falso que chama o `eventCallback` como o real.

| Caso | Resultado |
|---|---|
| Telefone | válidos: `62 99999-0000`, `(62) 99999-0000`, `+55 62 99999-0000`, `+1 (415) 555-0100`, **`62.99999.0000`**, `62/99999/0000`, `6299999000`. Inválidos: `629999900` (9 dígitos), `+55 62 99999-0000 1234` (17), `abc`, `62 99999-0000 ramal`, `62999990000a`, `tel 62999990000` |
| GTM bloqueado (não carrega) | redireciona aos 2 s (obrigado carregado em 2,45 s); **1** navegação |
| GTM carrega sem tags | redireciona aos 2 s (2,33 s); 1 navegação |
| GTM chama o callback em 150 ms | obrigado em 0,43 s; 1 navegação; o `setTimeout` de 2 s não gera outra |
| GTM chama o callback **2 vezes** | obrigado em 0,46 s; **1** navegação (trava) |
| GTM chama o callback em 1,9 s | obrigado em 2,15 s; 1 navegação |
| Objeto empurrado (todos os casos) | `{"event":"lead_black_trading","eventCallback":[função],"eventTimeout":2000}` |
| Dado pessoal no objeto, na URL ou no console | nenhum |
| Função devolve 502 | fica em `/` depois de 2,5 s; "Não foi possível enviar agora. Tente de novo."; campos preenchidos; nenhum `lead_black_trading` |
| 7 larguras × 2 páginas | nenhuma rolagem horizontal; nenhum erro de console fora dos 3 do selo da RA; nenhuma resposta ≥ 400 |

## Conferência da copy

```
index.html: OK (Black Zero7 Trading … Nome: / E-mail: / Telefone: / QUERO RECEBER A OFERTA / Traders Zero7 recebendo em Dólar)
obrigado/index.html: OK (6 textos)
js/: OK  Preencha este campo. / Digite um e-mail válido. / Digite um telefone válido. /
         Não foi possível enviar agora. Tente de novo. / ENVIANDO... / Comprovante de pagamento a trader Zero7
RESULTADO: copy confere, nenhum texto a mais.
```

## Observações

- Com o GTM fora do ar, ou sem tag que chame o callback, quem se cadastra espera **2 s** com "ENVIANDO..." antes de ir para o obrigado. É o custo do `eventTimeout: 2000` pedido. Com o GTM no ar, o próprio GTM chama o callback assim que as tags do evento terminam.
- O commit `393b7e4` está no `master` local do Zero7-Internacional. Se a Vercel publica a partir do `master`, o push publica a rota. Push e deploy continuam com você.

## Pendências (sem mudança)

Chave da RD na Vercel e deploy (roteiro na Fase 2), depois o teste de ponta a ponta que eu rodo quando você avisar; base legal; fluxo de e-mail na RD; imagens dos comprovantes.

## Diff completo do commit no Zero7-Internacional

````diff
commit 393b7e4510da255e9fc622e390d47390ad46b18a
Author: gonzagaa
Date:   Mon Nov 16 08:33:42 2026 -0300

backend: rota /api/lead (cadastro da LP Black Zero7 Trading 2026 na RD Station)

Nova função api/lead.js: recebe nome, e-mail, telefone e UTMs da LP
zero7trading.com/black-2026/ e registra a conversão black-zero7-trading-2026
na RD Station pela API de conversões. A chave fica só na env RD_API_KEY.
README e .env.example atualizados (só nomes de variáveis, sem valores).

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>


diff --git a/backend/.env.example b/backend/.env.example
index 6edf06a..d32d661 100644
--- a/backend/.env.example
+++ b/backend/.env.example
@@ -15,4 +15,15 @@ META_TEST_EVENT_CODE=
 
 # Lista de origens permitidas (CORS), separadas por virgula. Sem espacos.
 # Exemplo: https://zero7trading.com,https://www.zero7trading.com,http://localhost:5500
+# Origens de localhost (ex.: http://localhost:5503 da LP Black) so em Preview/Development, nunca em Production.
 ALLOWED_ORIGINS=
+
+# RD Station — rota /api/lead (LP Black Zero7 Trading 2026)
+# Chave de API da RD (App Publisher > Gerar chave de API). Da ACESSO TOTAL a conta:
+# so o responsavel cadastra o valor, direto na Vercel. Nunca em arquivo, chat ou log.
+RD_API_KEY=
+
+# OPCIONAL: base legal (LGPD) enviada na conversao, categoria "communications", status "granted".
+# Valor = o tipo: consent, legitimate_interest, pre_existent_contract, judicial_process,
+# vital_interest ou public_interest. Vazio = a conversao vai sem base legal.
+RD_BASE_LEGAL=
diff --git a/backend/README.md b/backend/README.md
index 672fbf4..8236494 100644
--- a/backend/README.md
+++ b/backend/README.md
@@ -6,14 +6,16 @@ navegador.
 
 - **Sem dependências npm.** Só Node nativo (fetch + crypto).
 - **Runtime**: Node 20.x (fixado em `package.json > engines`).
-- **Rota pública**: `POST /api/capi`.
+- **Rotas públicas**: `POST /api/capi` e `POST /api/lead` (cadastro da LP
+  Black Zero7 Trading 2026 na RD Station; ver a seção "Rota /api/lead").
 
 ## Estrutura
 
 ```
 backend/
 ├── api/
-│   └── capi.js       # função serverless (única rota)
+│   ├── capi.js       # Meta Conversions API
+│   └── lead.js       # cadastro da LP Black → RD Station (conversão)
 ├── package.json      # ESM, sem deps
 ├── vercel.json       # limite de execução
 ├── .env.example      # nomes das envs (sem valores)
@@ -30,6 +32,7 @@ backend/
    - `META_ACCESS_TOKEN`
    - `META_TEST_EVENT_CODE` (opcional — deixe vazio em produção)
    - `ALLOWED_ORIGINS` (ex.: `https://zero7trading.com,https://www.zero7trading.com`)
+   - `RD_API_KEY` e `RD_BASE_LEGAL` (opcional), da rota `/api/lead`
 4. Deploy. A URL final será `https://<projeto>.vercel.app/api/capi`.
 
 > **Importante**: se o token da Meta vazar, revogue-o imediatamente no
@@ -107,6 +110,62 @@ curl -i -X POST "https://zero7-internacional-backend.vercel.app/api/capi" \
 
 Esperado: `403`.
 
+## Rota /api/lead (RD Station)
+
+Recebe o cadastro da LP Black Zero7 Trading 2026
+(`https://zero7trading.com/black-2026/`) e registra a conversão
+`black-zero7-trading-2026` na RD Station Marketing
+(`POST https://api.rd.services/platform/conversions?api_key=...`).
+
+**Variáveis de ambiente** (ver `.env.example`):
+- `RD_API_KEY`: Chave de API da RD. Dá **acesso total** à conta: só o
+  responsável cadastra o valor, direto na Vercel (Production e Preview).
+  Nunca em arquivo, chat ou log.
+- `RD_BASE_LEGAL` (opcional): tipo da base legal (ex.: `legitimate_interest`).
+  Vazia, a conversão vai sem `legal_bases`. Valor fora da lista da RD é
+  ignorado, com aviso no log.
+- `ALLOWED_ORIGINS`: a mesma da rota `/api/capi`. `http://localhost:5503`
+  (LP em desenvolvimento) só em Preview/Development, nunca em Production.
+
+**Entrada** (JSON, até 4 KB):
+```json
+{
+  "nome": "Nome do lead",
+  "email": "lead@exemplo.com",
+  "telefone": "+55 62 99999-0000",
+  "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_term": "", "utm_content": ""
+}
+```
+- `nome`: 2 a 120 caracteres. `email`: até 254. `telefone`: de 10 a 15 dígitos
+  (vai para a RD só com os dígitos, com `+` na frente se veio com `+`).
+- UTMs opcionais, até 200 caracteres. `utm_source`, `utm_medium`,
+  `utm_campaign` e `utm_term` viram `traffic_source`, `traffic_medium`,
+  `traffic_campaign` e `traffic_value`; `utm_content` não tem campo na API
+  de conversões e não é enviado.
+- O identificador da conversão é fixo na função; a página não escolhe.
+
+**Respostas**
+- `200 { "success": true }`: a RD aceitou (2xx).
+- `400 { "error": "invalid input" }`: qualquer campo inválido (sem dizer qual).
+- `403`: origem fora de `ALLOWED_ORIGINS`. `405`: método diferente de POST/OPTIONS.
+- `500 { "error": "server misconfigured" }`: falta `RD_API_KEY`.
+- `502 { "error": "upstream error" }`: a RD respondeu erro ou passou de 8 s.
+
+**Logs:** só status da RD, duração e código de erro. Nunca o corpo
+recebido, nome, e-mail, telefone, a URL com a chave nem a resposta da RD.
+
+### Teste da rota /api/lead
+
+```bash
+curl -i -X POST "https://zero7-internacional-backend.vercel.app/api/lead" \
+  -H "Origin: https://zero7trading.com" \
+  -H "Content-Type: application/json" \
+  --data '{"nome":"Lead Teste","email":"<e-mail de teste>","telefone":"+5562999990000","utm_source":"teste"}'
+```
+
+Esperado: `200 {"success":true}` e o contato na RD com a conversão
+`black-zero7-trading-2026`. Sem a chave: `500 {"error":"server misconfigured"}`.
+
 ## Rodar local (opcional)
 
 ```bash
diff --git a/backend/api/lead.js b/backend/api/lead.js
new file mode 100644
index 0000000..6883146
--- /dev/null
+++ b/backend/api/lead.js
@@ -0,0 +1,213 @@
+/* =====================================================================
+   LEAD — RD Station (Vercel, Node runtime)
+   -----------------------------------------------------------------------
+   Recebe o cadastro da LP Black Zero7 Trading 2026 (zero7trading.com/black-2026/)
+   e registra uma conversão na RD Station Marketing pela API de conversões
+   (POST https://api.rd.services/platform/conversions?api_key=...).
+
+   Regras que NÃO podem mudar:
+   - A chave (RD_API_KEY) dá acesso total à conta da RD: só existe na env
+     da Vercel. Nunca aparece na resposta nem em log (nem a URL com ela).
+   - Nada de dado pessoal em log: nem o corpo recebido, nem nome, e-mail,
+     telefone, nem a resposta da RD. Só status, duração e código de erro.
+   - O identificador da conversão é fixo aqui; nunca vem da página.
+   ===================================================================== */
+
+const RD_URL = 'https://api.rd.services/platform/conversions';
+const CONVERSAO = 'black-zero7-trading-2026';
+const LIMITE_CORPO = 4096;        // bytes
+const TEMPO_LIMITE_RD = 8000;     // ms
+
+const UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
+const BASES_LEGAIS = [
+  'pre_existent_contract', 'consent', 'legitimate_interest',
+  'judicial_process', 'vital_interest', 'public_interest',
+];
+const RE_EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
+
+/* -----------------------------------------------------------------------
+   Helpers (mesmo padrão de api/capi.js)
+   ----------------------------------------------------------------------- */
+
+function getAllowedOrigins() {
+  const raw = process.env.ALLOWED_ORIGINS || '';
+  return raw.split(',').map((s) => s.trim()).filter(Boolean);
+}
+
+function corsHeaders(origin) {
+  return {
+    'Access-Control-Allow-Origin': origin,
+    'Access-Control-Allow-Methods': 'POST, OPTIONS',
+    'Access-Control-Allow-Headers': 'Content-Type',
+    'Access-Control-Max-Age': '86400',
+    'Vary': 'Origin',
+  };
+}
+
+// Lê o JSON do corpo com limite de tamanho. Devolve null se faltar, passar
+// do limite ou não for JSON. Na Vercel, req.body costuma vir já parseado.
+async function readJsonBody(req) {
+  const declarado = Number(req.headers['content-length'] || 0);
+  if (declarado > LIMITE_CORPO) return null;
+
+  if (req.body !== undefined && req.body !== null && req.body !== '') {
+    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
+      const texto = String(req.body);
+      if (Buffer.byteLength(texto) > LIMITE_CORPO) return null;
+      try { return JSON.parse(texto); } catch (_) { return null; }
+    }
+    if (typeof req.body === 'object') {
+      return Buffer.byteLength(JSON.stringify(req.body)) > LIMITE_CORPO ? null : req.body;
+    }
+    return null;
+  }
+
+  return await new Promise((resolve) => {
+    let bytes = 0;
+    const partes = [];
+    let feito = false;
+    const fim = (v) => { if (!feito) { feito = true; resolve(v); } };
+    req.on('data', (c) => {
+      bytes += c.length;
+      if (bytes > LIMITE_CORPO) { fim(null); return; }
+      partes.push(c);
+    });
+    req.on('end', () => {
+      if (feito) return;
+      if (!partes.length) return fim(null);
+      try { fim(JSON.parse(Buffer.concat(partes).toString('utf8'))); } catch (_) { fim(null); }
+    });
+    req.on('error', () => fim(null));
+  });
+}
+
+// Valida e normaliza a entrada. Devolve null em qualquer falha (sem dizer qual).
+function validar(body) {
+  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
+  const { nome, email, telefone } = body;
+
+  if (typeof nome !== 'string') return null;
+  const n = nome.trim();
+  if (n.length < 2 || n.length > 120) return null;
+
+  if (typeof email !== 'string') return null;
+  const e = email.trim();
+  if (e.length > 254 || !RE_EMAIL.test(e)) return null;
+
+  if (typeof telefone !== 'string') return null;
+  const t = telefone.trim();
+  const digitos = t.replace(/\D/g, '');
+  if (digitos.length < 10 || digitos.length > 15) return null;
+  const tel = (t.startsWith('+') ? '+' : '') + digitos;
+
+  const utm = {};
+  for (const campo of UTMS) {
+    const v = body[campo];
+    if (v === undefined || v === null || v === '') continue;
+    if (typeof v !== 'string' || v.length > 200) return null;
+    const limpo = v.trim();
+    if (limpo) utm[campo] = limpo;
+  }
+
+  return { nome: n, email: e, telefone: tel, utm };
+}
+
+function montarEvento({ nome, email, telefone, utm }) {
+  const payload = {
+    conversion_identifier: CONVERSAO,
+    name: nome,
+    email,
+    // o mesmo número nos dois campos da RD ("Celular" e "Telefone")
+    mobile_phone: telefone,
+    phone: telefone,
+  };
+  // UTM vazia não vai. utm_content não tem campo na API de conversões.
+  if (utm.utm_source) payload.traffic_source = utm.utm_source;
+  if (utm.utm_medium) payload.traffic_medium = utm.utm_medium;
+  if (utm.utm_campaign) payload.traffic_campaign = utm.utm_campaign;
+  if (utm.utm_term) payload.traffic_value = utm.utm_term;
+
+  // Base legal: só com RD_BASE_LEGAL definida e com um tipo aceito pela RD.
+  const base = (process.env.RD_BASE_LEGAL || '').trim();
+  if (base) {
+    if (BASES_LEGAIS.includes(base)) {
+      payload.legal_bases = [{ category: 'communications', type: base, status: 'granted' }];
+    } else {
+      console.warn('[lead] RD_BASE_LEGAL com valor não aceito; enviado sem base legal');
+    }
+  }
+
+  return { event_type: 'CONVERSION', event_family: 'CDP', payload };
+}
+
+/* -----------------------------------------------------------------------
+   Handler
+   ----------------------------------------------------------------------- */
+
+export default async function handler(req, res) {
+  const origin = req.headers.origin || '';
+  const originOk = getAllowedOrigins().includes(origin);
+
+  // Preflight — só responde OK se a origem estiver liberada.
+  if (req.method === 'OPTIONS') {
+    if (!originOk) {
+      res.status(403).end();
+      return;
+    }
+    for (const [k, v] of Object.entries(corsHeaders(origin))) res.setHeader(k, v);
+    res.status(204).end();
+    return;
+  }
+
+  if (!originOk) {
+    res.status(403).json({ error: 'origin not allowed' });
+    return;
+  }
+
+  for (const [k, v] of Object.entries(corsHeaders(origin))) res.setHeader(k, v);
+
+  if (req.method !== 'POST') {
+    res.setHeader('Allow', 'POST, OPTIONS');
+    res.status(405).json({ error: 'method not allowed' });
+    return;
+  }
+
+  const lead = validar(await readJsonBody(req));
+  if (!lead) {
+    res.status(400).json({ error: 'invalid input' });
+    return;
+  }
+
+  const chave = process.env.RD_API_KEY;
+  if (!chave) {
+    console.error('[lead] RD_API_KEY ausente');
+    res.status(500).json({ error: 'server misconfigured' });
+    return;
+  }
+
+  const inicio = Date.now();
+  try {
+    const rd = await fetch(`${RD_URL}?api_key=${encodeURIComponent(chave)}`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify(montarEvento(lead)),
+      signal: AbortSignal.timeout(TEMPO_LIMITE_RD),
+    });
+    const ms = Date.now() - inicio;
+    // Descarta o corpo da RD sem ler nem logar (pode ecoar dados do contato).
+    try { await rd.body?.cancel(); } catch (_) { /* nada */ }
+
+    if (!rd.ok) {
+      console.error('[lead] rd erro', { status: rd.status, ms });
+      res.status(502).json({ error: 'upstream error' });
+      return;
+    }
+
+    console.log('[lead] rd ok', { status: rd.status, ms });
+    res.status(200).json({ success: true });
+  } catch (err) {
+    const codigo = err && err.name === 'TimeoutError' ? 'timeout' : 'fetch_failed';
+    console.error('[lead] rd falhou', { codigo, ms: Date.now() - inicio });
+    res.status(502).json({ error: 'upstream error' });
+  }
+}
````

Aguardando aprovação.
