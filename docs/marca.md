> **Atenção (13/11/2026):** o visual descrito aqui foi substituído pelo protótipo aprovado. Onde este documento divergir de `docs/design-aprovado.md`, vale o outro. O dourado foi recusado e não entra em lugar nenhum.

# Marca e direção visual — Black Zero7 Trading

A LP é uma peça da **Zero7 Trading (Zero7 Internacional)**. Quem chega do site `zero7trading.com` tem que reconhecer a mesma marca: preto, verde e o corte diagonal. A fonte da verdade é o site, na pasta irmã `../Zero7-Internacional` (**só leitura, nunca altere nada lá**).

## Cores

Valores tirados do site (`css/global.css`, `css/button.css`, `css/campanha.css`).

| Token | Valor | Uso |
|---|---|---|
| `--bg-black` | `#040404` | fundo de tudo |
| `--color-text` | `#f2fffb` | texto principal (branco levemente esverdeado) |
| texto secundário | `#d2d2d2` | parágrafos, rótulos |
| `--z7-deep` | `#0b5d3b` | início do degradê da marca |
| `--z7-mid` | `#10a36a` | meio do degradê |
| `--z7-sky` | `#34d399` | fim do degradê, bordas e brilhos |
| neon | `#6FF0B8` | **um** destaque por dobra (no site ele marca valor: "90%", "Funding") |

Regras:
- O preto domina. O verde aparece no botão, no foco dos campos, em bordas finas e em luz de fundo. Nada de bloco grande verde chapado.
- Não use o laranja da Black nacional (`#FF6A1A`). Aquela é outra marca.

## Forma

- **Corte diagonal**, a assinatura da internacional: `border-radius: var(--r) 0 var(--r) 0` (superior-esquerdo e inferior-direito arredondados, os outros dois retos). Vale para o botão, o cartão do formulário, os campos e as molduras dos comprovantes.
- Não use os quatro cantos iguais, a não ser em pílulas pequenas.
- Linha divisória do site: 1 px em degradê `transparent → #ffffff5b → #cecece → #ffffff5b → transparent` (é a do topo do rodapé).

## Tipografia

- **Títulos:** Zalando Sans Expanded (Google Fonts, licença aberta), em caixa alta, como no site. Baixe os arquivos e sirva local em `assets/fonts/` (woff2), com preload só do peso usado na hero.
- **Corpo, rótulos e campos:** Inter, local, woff2.
- **Não use** `TT Fors Trial` nem `Neue Plak`: são as fontes do site, mas uma é versão de avaliação e a outra é comercial. É a mesma decisão já tomada para o blog internacional.
- Os textos da copy mantêm a caixa em que foram escritos quando forem parágrafo. Título e botão podem ir em caixa alta por CSS (`text-transform`), sem mudar o texto no HTML.

## Botão

Use o botão do site, `.z7-btnx` (cópia em `_referencia/botao-z7-btnx.css`; HTML de exemplo em `../Zero7-Internacional/pedido-registrado/index.html`). É um `<button type="submit">` com o rótulo "QUERO RECEBER A OFERTA", largura total dentro do cartão do formulário.

O blog internacional tirou as animações em loop desse botão. Aqui ele é o único CTA da página, então **ficam** o brilho que acompanha o mouse e o anel girando; tudo desliga com `prefers-reduced-motion`.

## As dobras

### 1. Hero
- Topo: só a logo (`assets/marca/logo-zero7.avif`), sem menu. A página tem um único caminho: o formulário.
- Fundo: `assets/fundo/bg-black.avif` (o "07" em relevo escuro do site) com uma luz verde suave atrás do formulário. Nunca preto liso.
- Desktop (≥ 1080 px): duas colunas. À esquerda: título, texto e a linha da data. À direita: o cartão do formulário (chamada, dois campos, botão). Mobile: uma coluna, nessa mesma ordem, com o botão visível sem rolar muito em 390 × 844.
- "Black Zero7 Trading" é o maior elemento da tela.
- Cartão do formulário: fundo `rgba(255,255,255,.03)`, borda de 1 px `rgba(52,211,153,.25)`, corte diagonal, desfoque de fundo leve.
- Campos: altura mínima de 52 px, rótulo visível acima do campo ("Nome:" e "E-mail:"), foco com borda `#34d399` e halo. Sem placeholder fazendo papel de rótulo.

### 2. Pagamentos
- Título "Traders Zero7 recebendo em Dólar" centralizado; "Dólar" pode receber o destaque neon.
- Os comprovantes passam em **duas fileiras**, uma para cada lado, em movimento contínuo e lento (CSS, `transform`), com as bordas esquerda e direita sumindo em máscara de degradê.
- Pausa ao passar o mouse ou ao tocar. Com `prefers-reduced-motion`, vira uma fileira parada com rolagem horizontal (scroll-snap).
- Cada comprovante numa moldura com corte diagonal e borda fina. Altura fixa por fileira, largura livre, para aceitar imagens de proporções diferentes sem cortar.
- Imagens com `width`/`height`, `loading="lazy"` e `decoding="async"`. A lista vem de um array em `js/comprovantes.js`, para trocar imagens sem mexer no HTML.
- Enquanto as imagens reais não chegam, use molduras vazias com o mesmo tamanho (sem inventar comprovante falso).

### 3. Rodapé
- O mesmo do site: `footer#footer` + `section#author` (direitos, links e o aviso legal). Cópia em `_referencia/rodape/`; na dúvida vale o que está em `../Zero7-Internacional/index.html`.
- Textos e links idênticos aos do site. Só três ajustes, porque a LP mora em outro endereço:
  1. "Home" → `https://zero7trading.com/home/`
  2. "Planos" → `https://zero7trading.com/home/#plan`
  3. Sem os atributos `data-i18n` (a LP é só em português).
- Ícones sociais: no site vêm do Ionicons. Aqui use os três SVGs inline (Instagram, TikTok, Facebook) para não carregar a biblioteca.
- O selo do Reclame Aqui entra com o mesmo script do site.
- A faixa "Formas de Pagamento" (`section#pagamento`) **não entra** por enquanto: fica logo abaixo da dobra "Pagamentos" e confunde. Está na lista de pendências para o Gustavo decidir.
- A dobra de comprovantes usa `id="comprovantes"`, para não colidir com o `#pagamento` do site.

### Página de obrigado (`obrigado/index.html`)
- Mesmo fundo e mesma logo. Conteúdo centralizado, largura máxima de ~70 rem.
- "Obrigado!" grande (no site é `clamp(5rem, 12vw, 11rem)`, ver `../Zero7-Internacional/css/obrigado.css`).
- Os dois canais em dois cartões lado a lado (empilhados no mobile), com corte diagonal. O aviso sobre WhatsApp tem que ficar legível, não em letra miúda.
- Mesmo rodapé.
- `noindex, nofollow`.

## Movimento

Calmo. Uma entrada na hero (título e cartão sobem com opacidade, uma vez) e o movimento dos comprovantes. Sem GSAP, Lenis, AOS, Swiper ou jQuery: a página é pequena e tudo sai com CSS e poucas linhas de JS.

## Acessibilidade e desempenho

- Contraste de texto ≥ 4,5:1; área de toque ≥ 44 × 44 px; `:focus-visible` desenhado em tudo que recebe foco.
- `label` ligado a cada campo; erros anunciados com `aria-live`; `autocomplete="name"` e `autocomplete="email"`.
- Metas: LCP < 2,5 s no mobile, CLS < 0,05, primeira dobra < 500 KB.
- Sem rolagem horizontal em 360, 390, 768, 1024, 1280, 1440 e 1920 px.
