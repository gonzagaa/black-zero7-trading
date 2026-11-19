# LCP mobile: preload da bandeira, Pixel e comprovantes depois do load

Ponto de partida (PageSpeed, mobile, no ar): Desempenho 75, FCP 2,6 s, LCP 5,3 s, TBT 80 ms, CLS 0. O LCP é a camada `.lband` (fundo `bandeira-eua-1000.webp`).

Nada mudou no visual, na copy, no formulário nem no bloco da 4Selet (o bloco está byte a byte igual ao do commit anterior).

## O que mudou

1. **Preload da bandeira** (`index.html`), logo depois do `meta viewport` e antes do GTM:
   - `bandeira-eua-1000.webp` com `media="(max-width: 1079px)"` e `bandeira-eua-2000.webp` com `media="(min-width: 1080px)"`, os dois com `fetchpriority="high"`;
   - a URL é a mesma do `css/hero.css`, com o mesmo `?v`, e o navegador reaproveita o download: um único pedido por largura (1000 em 375 px, 2000 em 1440 px, nunca as duas);
   - o `scripts/versao.mjs` já versiona os dois links (o `href` de `.webp` entra na regra dele), e o `--conferir` passa.
2. **Pixel da Meta depois do load** (`js/meta.js`):
   - na carga do módulo continuam `_fbp`, `_fbc` e `external_id`. O `dadosMeta()` não mudou;
   - depois do `window.load` (ou na hora, se `document.readyState` já for `complete`): `loadPixelBase`, `init`, PageView pelo navegador e o envio à `/api/capi`, com o mesmo `event_id` nos dois;
   - no obrigado, o CompleteRegistration continua imediato: o `meta-obrigado.js` chama `iniciarPixel()` na hora, e o PageView adiado reaproveita esse `init` (`iniciarPixel()` devolve `true` sem repetir).
3. **Comprovantes depois do load** (`js/comprovantes.js`): `montar()` e o ouvinte de reduced motion só rodam depois do `window.load`, com a mesma regra do `readyState`. Não mudaram: reduced motion, pausa no toque (ligada na hora, não baixa nada), ordem, `alt`, `width`/`height` e `loading="lazy"`.

Versão de cache: `?v=202611191511`.

O `docs/meta.md` não existe nesta cópia (está num commit do escritório) e não foi criado. Quando ele chegar aqui, falta registrar nele: "o Pixel (`init` + PageView) e o PageView da `/api/capi` saem depois do load; o CompleteRegistration do obrigado continua imediato".

## Arquivos alterados

```
index.html            2 preloads da bandeira
js/meta.js            init + PageView (navegador e /api/capi) depois do load
js/comprovantes.js    montagem da esteira depois do load
css/*, js/*, *.html   ?v=202611191511
relatorios/lcp-mobile.md
```

## Lighthouse mobile local (`npm run dev`, http://localhost:5503/)

Lighthouse 12.8.2, padrão mobile (simulado: Moto G Power, 4G lento, CPU 4×), Chrome 158 headless. 3 rodadas antes (commit `887a8d8`) e 3 depois.

| Mediana | Antes | Depois |
|---|---|---|
| Desempenho | 62 | **66** |
| FCP | 3,95 s | **3,91 s** |
| LCP | 7,27 s | **6,99 s** |
| TBT | 157 ms | **143 ms** |
| CLS | 0,018 | 0,018 |

Elemento LCP depois da mudança: **o mesmo**, `div.cena__camada.lband` (a bandeira).

Rodadas: antes 57 / 64 / 62 (FCP 2,20 / 3,95 / 5,27 s; LCP 7,26 / 7,78 / 7,27 s); depois 66 / 65 / 66 (FCP 3,91 / 3,91 / 3,73 s; LCP 6,95 / 6,99 / 7,02 s).

### Por que o ganho local é pequeno

- **Nesta máquina, a primeira pintura demora.** Sem nenhuma limitação de rede, a página só pinta em ~1,3 a 1,5 s, com tudo já baixado em ~80 ms. No rastro, quem segura é o processo de GPU (`CrGpuMain` ocupado ~1,2 s antes do FCP): o Chrome headless compõe as camadas da hero (máscaras, degradês e grão) por software. Com as flags de GPU ligadas, deu o mesmo resultado.
- **O Lantern conta tudo que começou antes dessa pintura.** O LCP simulado inclui todo pedido iniciado antes da pintura observada. Depois da mudança, o `load` sai em ~0,52 s, ainda antes dessa pintura. Então o Pixel, mesmo depois do load, continua entrando na conta.
- **Medição extra: depois, com o Pixel e a `/api/capi` bloqueados** (3 rodadas, só para medir): Desempenho 69, FCP 3,74 s, **LCP 6,07 s**, TBT 68 ms. Nesta máquina o Pixel ainda custa ~0,9 s de LCP simulado.
- **Os comprovantes já saíram da disputa.** Nos rastros de depois, nenhum pedido de comprovante sai antes do load.
- **O preload só aparece com latência de rede**, que localhost não tem. Num teste à parte com 150 ms de RTT (Chrome DevTools Protocol):

| | Antes | Depois |
|---|---|---|
| Quem pede a bandeira | `hero.css` | o preload (parser) |
| Quando | 656 ms | **184 ms**, junto com o CSS |
| Prioridade inicial | Low | **High** |

No ar, com rede de verdade, o efeito do preload deve ser maior que o medido aqui. O número que vale é o PageSpeed depois do deploy.

## Testes de rastreio (modo simulado)

Playwright com o Chrome 158. Nada saiu da máquina:

- o `fbevents.js` respondeu vazio; as chamadas do `fbq` foram registradas por um Proxy, com horário e `readyState`;
- a `/api/capi` foi respondida localmente, com o corpo registrado;
- o GTM respondeu vazio, como na Fase 2;
- a `/api/lead` e o CRM da 4Selet foram abortados;
- o `config.js` foi servido com `modo: 'simulado'`, e o bloco da 4Selet com `teste: true`, só na resposta ao navegador do teste: os arquivos não foram tocados.

32 de 32 verificações passaram:

| Caso | Resultado |
|---|---|
| LP: `init` | 1 só, Pixel 1380055004077990, depois do load (`init` em 520 ms, `loadEventStart` 519 ms) |
| LP: PageView pelo navegador | 1, com `readyState` `complete`, depois do load |
| LP: `/api/capi` | 1 PageView; `event_id` = `eventID` do navegador; leva `fbp` e `external_id` |
| LP: ordem da rede | nenhum pedido de Pixel, CAPI ou comprovante antes do load; comprovantes a partir de ~715 ms depois do load |
| LP: esteira | 2 fileiras, 4 grupos (2 cópias `aria-hidden`), 32 imagens, `alt` "Comprovante de pagamento a trader Zero7", 900×900, `lazy`, ordem 01,03,05,07 / 02,04,06,08 |
| Envio | o corpo leva `event_id`, `fbp` e `external_id` |
| Obrigado com `z7_meta_cr` | 1 `init`; CompleteRegistration 1 vez, imediato (`readyState` `interactive`), com o `event_id` do envio; PageView 1 vez, depois do load; `/api/capi` com o mesmo `event_id`; chave apagada na leitura |
| Obrigado recarregado | sem CompleteRegistration |
| Obrigado sem a chave | sem CompleteRegistration; 1 `init`, só depois do load; 1 PageView, depois do load |
| Preload | 375 px: só a 1000, pedida 1 vez. 1440 px: só a 2000, pedida 1 vez |

Console: os únicos erros são os 3 do selo do Reclame Aqui por página (CORS em localhost, já registrados na Fase 2). Nenhum 404.

## Visual (shots/lcp-mobile/)

Página inteira, antes (commit `887a8d8`, servido numa cópia à parte) e depois, em 375, 768 e 1440 px. O print foi tirado com as animações paradas e todas as imagens da esteira carregadas, e a comparação foi pixel a pixel:

| | 375 | 768 | 1440 |
|---|---|---|---|
| LP | 0 px | 0 px | 0 px |
| Obrigado | 0 px | 0 px | 6 px com 1 nível de 255 (ruído; a página só mudou no `?v`) |

Arquivos: `lp-<largura>-antes.png`, `lp-<largura>-depois.png` e `lp-<largura>-diferenca.png`, e o mesmo para `obrigado-`.

## CLS

- **Carga normal, sem rolar:** 0 antes e depois, em 375, 768, 1440 e 1920 px.
- **Risco novo:** se a pessoa já estiver parada nos comprovantes quando o load chegar, a esteira entra naquela hora e o rodapé desce. Para testar, o load foi atrasado 4 s (GTM segurado) e a página rolada até a dobra antes dele:

| Largura | Antes | Depois |
|---|---|---|
| 375 px | 0 | 0,34 |
| 1440 px | 0 | 0,24 |

Isso não aparece no PageSpeed (que não rola a página), mas pode aparecer no CLS de campo (CrUX) de quem desce rápido numa conexão lenta. A correção possível é reservar no CSS a altura da esteira em cada largura; o visual final continua o mesmo. Não fiz: depende do seu ok.
- **Já existia:** o CLS de 0,018 do Lighthouse local (em `.hero__form-area`, já antes da mudança) não aparece no PageSpeed do ar, que dá 0.

## Efeito colateral das medições

As rodadas de Lighthouse carregaram o GTM e o Pixel de verdade, porque a disputa com eles era justamente o que estava sendo medido:

- **Pixel 1380055004077990:** 8 PageViews pelo navegador, com URL `http://localhost:5503/`;
- **GA4 G-KZJZE2E298:** 11 visitas de `localhost`;
- **`/api/capi`:** respondeu 403 (origem não autorizada); nada saiu pelo servidor;
- **4Selet:** nada, porque o formulário não foi preenchido nessas rodadas.

Nos testes de rastreio e nos prints, tudo foi interceptado.

## Para decidir

1. **Reservar a altura da esteira**, para fechar o risco de CLS acima.
2. **Adiar mais o Pixel.** Hoje ele sai no load; poderia sair, por exemplo, quando o navegador ficar ocioso depois do load. Localmente isso valeria até ~0,9 s de LCP simulado. No ar, o ganho depende de onde o load cai em relação à primeira pintura, e só o PageSpeed depois do deploy responde.
