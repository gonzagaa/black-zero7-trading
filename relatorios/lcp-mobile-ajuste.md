# LCP mobile (ajuste): reserva da esteira e Pixel no ocioso

Por cima do `023b580`, com as decisões da revisão: reservar a altura da esteira (item 1), adiar mais o Pixel (item 2) e bloquear só os disparos nas rodadas de Lighthouse (item 3).

Nada mudou no visual, na copy, no formulário nem no bloco da 4Selet.

## O que mudou

1. **Reserva da altura da esteira** (`css/comprovantes.css`):
   - as alturas que o CSS já dava às fileiras viraram variáveis no `.esteira`: `--alt-esq: calc(37.2rem * var(--esc))` (retrato, em cima) e `--alt-dir: calc(30rem * var(--esc))` (paisagem, embaixo). As molduras usam essas variáveis, e os valores não mudaram. Com `box-sizing: border-box`, a altura da moldura é a altura da fileira;
   - **animação normal:** `.esteira:empty { min-height: calc(var(--alt-esq) + var(--gap) + var(--alt-dir)) }`, ou seja, duas fileiras mais o espaço entre elas. Segue o `--esc` e o `--gap` de cada largura;
   - **reduced motion (uma fileira):** a reserva é a fileira de cima mais a folga da rolagem. O `1.2rem` do `padding-bottom` virou `--folga-rolagem` e é usado nos dois lugares. A fileira parada tem rolagem horizontal, e onde a barra ocupa espaço (Windows) ela soma uns 15 px à altura, que o CSS não tem como saber. Por isso a reserva desse caso é um `::before` invisível (`visibility: hidden`) que também rola (`overflow-x: scroll`), com as mesmas alturas como padding: o navegador põe nele a mesma barra da fileira real. Em celular a barra não ocupa espaço nos dois;
   - **só antes da montagem:** a reserva só vale enquanto a esteira está vazia (`:empty`). Montada, quem manda é o conteúdo, como antes, e o visual final não depende dela.
2. **Pixel no ocioso** (`js/meta.js`):
   - depois do load, `requestIdleCallback` com `timeout: 2000`. Onde ele não existe (Safari), `setTimeout` de 1500 ms. Nos dois casos o PageView sai sempre, uma vez, com o mesmo `event_id` na `/api/capi` e um único `init`;
   - o obrigado não mudou: o CompleteRegistration sai na hora;
   - a esteira continua montando no load.

Versão de cache: `?v=202611191535`.

Para o `docs/meta.md`, quando chegar aqui: "o Pixel (`init` + PageView) e o PageView da `/api/capi` saem depois do load, no ocioso (`requestIdleCallback`, timeout 2 s; sem ele, 1,5 s); o CompleteRegistration do obrigado continua imediato".

## Arquivos alterados

```
css/comprovantes.css   --alt-esq/--alt-dir/--folga-rolagem; reserva da .esteira:empty (normal e reduced motion)
js/meta.js             PageView depois do load + ocioso (rIC 2000 ms / setTimeout 1500 ms)
css/*, js/*, *.html    ?v=202611191535
relatorios/lcp-mobile-ajuste.md
```

## CLS (item 1)

Playwright com o Chrome 158. A base é o `023b580`, servido numa cópia à parte. "Parada" quer dizer: load atrasado 4 s (GTM segurado) e página rolada até os comprovantes antes dele.

| | 375 | 768 | 1440 |
|---|---|---|---|
| Normal, carga normal | 0 | 0 | 0 |
| Normal, parada | **0** (era 0,339) | **0** (era 0,316) | **0** (era 0,236) |
| Reduced motion, carga normal | 0 | 0 | 0 |
| Reduced motion, parada | **0** (era 0,190) | **0** (era 0,175) | **0** (era 0,130) |

A reserva bate com a esteira montada em todos os casos:

| Altura (px) | 375 | 768 | 1440 |
|---|---|---|---|
| Normal | 432,63 | 573,03 | 698 |
| Reduced motion | 242,63 | 317,03 | 384 |
| Reduced motion, com barra visível | 257,63 | 332,03 | 399 |

O Chrome headless esconde as barras de rolagem por padrão. Por isso a matriz inteira rodou de novo com as barras visíveis, como no Windows: **CLS 0 nos 12 casos**. Com só um `min-height` no reduced motion, sobravam 0,0006 a 0,006 nesse cenário; daí o `::before` que rola.

## Testes de rastreio (modo simulado)

Mesmo método do relatório anterior: nada saiu da máquina (Pixel, `/api/capi`, GTM, `/api/lead` e 4Selet interceptados; `modo: 'simulado'` e `teste: true` só na resposta ao navegador do teste). 39 de 39 verificações passaram:

| Caso | Resultado |
|---|---|
| LP: ocioso | `requestIdleCallback` pedido 1 vez, no load, com `{ timeout: 2000 }` |
| LP: PageView pelo navegador | 1, no ocioso, 886 ms depois do load; `init` 1 só, também depois do load |
| LP: `/api/capi` | 1 PageView; `event_id` = `eventID` do navegador; leva `fbp` e `external_id` |
| LP: ordem da rede | nenhum pedido de Pixel, CAPI ou comprovante antes do load |
| LP: esteira | igual: 2 fileiras, 4 grupos, 32 imagens, mesmo `alt`, 900×900, `lazy`, mesma ordem |
| Envio | o corpo leva `event_id`, `fbp` e `external_id` |
| Obrigado com `z7_meta_cr` | 1 `init`; CompleteRegistration 1 vez, na hora (`readyState` `interactive`), com o `event_id` do envio; PageView 1 vez, depois do load; chave apagada |
| Obrigado recarregado / sem a chave | sem CompleteRegistration; 1 `init`; 1 PageView depois do load |
| Sem `requestIdleCallback` (como no Safari) | LP: PageView 1510 ms depois do load, mesmo `event_id` na `/api/capi`. Obrigado: CompleteRegistration na hora e PageView 1511 ms depois do load, 1 `init` |
| Preload | 375 px: só a 1000, 1 pedido. 1440 px: só a 2000, 1 pedido |

Console: só os 3 erros do selo do Reclame Aqui por página (CORS em localhost). Nenhum 404.

## Visual (shots/lcp-mobile-ajuste/)

Página inteira, `023b580` × depois, em 375, 768 e 1440 px, com e sem reduced motion (`reduced-motion/`).

- **Comparação em duplas:** cada lado foi tirado duas vezes. Antes × depois deu **0 pixel** em 375 (normal e reduced motion) e em 768 (reduced motion). Em 1440, nos prints da pasta, também 0.
- **Ruído de renderização:** algumas comparações isoladas mostram diferenças de até 2 a 4 níveis em 255, nos degradês da hero ou na primeira moldura da fileira parada. Essas mesmas diferenças aparecem entre dois prints do mesmo lado, então não vêm do código.
- **Obrigado:** de 2 a 18 pixels com 1 a 2 níveis de 255. A página só mudou no `?v`.

## Lighthouse mobile local (item 3)

Lighthouse 12.8.2, padrão mobile simulado, Chrome 158 headless, `npm run dev`. O GTM e o Pixel carregaram, com `--blocked-url-patterns` em `*facebook.com/tr*`, `*google-analytics.com/g/collect*` e `*analytics.google.com*`. Para ter uma base comparável, o `023b580` rodou com o mesmo bloqueio.

| Mediana de 3 | 023b580 | Depois |
|---|---|---|
| Desempenho | 66 | **67** |
| FCP | 3,74 s | **3,72 s** |
| LCP | 6,80 s | **5,87 s** |
| TBT | 164 ms | **120 ms** |
| CLS | 0,018 | 0,018 |

Elemento LCP depois: **o mesmo**, `div.cena__camada.lband` (a bandeira).

Rodadas: o `023b580` deu 47 / 67 / 66 (LCP 6,46 / 6,80 / 6,84 s); depois deu 62 / 69 / 67 (LCP 5,50 / 5,87 / 5,91 s). A primeira rodada de cada lado teve o TBT alto (1482 e 539 ms), o que puxou a nota dela para baixo. A mediana descarta esses valores.

O LCP caiu ~0,9 s, o que fecha com a medição do relatório anterior (Pixel bloqueado: 6,07 s). Com o ocioso, o Pixel começa depois da primeira pintura e saiu da conta. O CLS de 0,018 (`.hero__form-area`) já existia antes e não aparece no PageSpeed do ar.

### O que saiu de localhost nessas 6 rodadas

| Destino | Status | Saiu evento? |
|---|---|---|
| `www.facebook.com/tr` | bloqueado nas 6 | não |
| `www.google-analytics.com/g/collect` | bloqueado nas 6 | não |
| `zero7-internacional-backend.vercel.app/api/capi` | 403 (origem não autorizada) | não, nada saiu pelo servidor |
| `connect.facebook.net` (`fbevents.js` e config do Pixel) | carregou | não, só script e configuração |
| **`www.google.com/g/collect`** | **204, 6 vezes (1 por rodada)** | **sim** |

O `www.google.com/g/collect` é o hit duplicado que o GA4 manda para os Google Signals, e nenhum dos três padrões cobre esse endereço. A visita em si (`google-analytics.com`) foi bloqueada.

### Bloqueio nas próximas rodadas

Decidido na revisão do `f887d54` (19/11/2026). A partir das próximas rodadas de Lighthouse, o GTM e o Pixel continuam carregando, e os disparos são bloqueados com quatro padrões:

```
--blocked-url-patterns=*facebook.com/tr*
--blocked-url-patterns=*google-analytics.com/g/collect*
--blocked-url-patterns=*analytics.google.com*
--blocked-url-patterns=*google.com/g/collect*
```

As 6 rodadas deste relatório foram feitas só com os três primeiros.
