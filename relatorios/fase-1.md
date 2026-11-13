# Fase 1: As duas páginas, com o formulário em modo simulado

## O que foi feito

- **LP (`index.html`)**: hero com a logo, título, texto, linha da data (em ouro `#f1c36a`) e o cartão do formulário; dobra "Traders Zero7 recebendo em Dólar" ("Dólar" em neon) com duas fileiras de comprovantes andando em sentidos opostos; rodapé do site.
  - Desktop (≥ 1080 px): duas colunas. Abaixo disso, uma coluna (título, texto, data, cartão). Em 390 × 844 o botão termina em 726 px, visível sem rolar.
  - Fundo `bg-black.avif` com luz verde suave atrás do cartão. Corte diagonal no cartão, nos campos, no botão e nas molduras.
  - Entrada única do título e do cartão (sobem com opacidade). Com `prefers-reduced-motion`, nada anima.
- **Formulário**: só Nome e E-mail, rótulo visível acima de cada campo, campos com 52 px de altura, `autocomplete="name"`/`"email"`, erros com `aria-live` e `aria-invalid`, foco na borda `#34d399` com halo. Validação no envio e ao sair do campo; o erro some quando o campo fica válido. Honeypot (`#website`, fora da tela e com `aria-hidden`). Enquanto envia, o botão mostra "ENVIANDO..." e não aceita outro envio. Sucesso → `obrigado/`. Falha → mensagem de erro, campos continuam preenchidos.
- **Modo simulado** (`js/rdstation.js`): espera ~600 ms, escreve o payload no console e resolve. O modo `real` falha de propósito (sem chave: erro no console; com chave: "não implementado, Fase 2"), sem cair para o simulado. Nada de dado pessoal na URL; o console só recebe o payload no modo simulado.
- **UTMs** (`js/utm.js`): as da URL de entrada vão para `sessionStorage` e entram no payload (`traffic_*`).
- **Botão**: o `.z7-btnx` do site, com o brilho que segue o mouse, o anel girando e o ripple. Com reduced motion, tudo desliga. Correção: no site o brilho que segue o mouse não funciona (as variáveis `--mx/--my` são `@property` com `inherits: false` e não chegam ao `::before`); aqui usei variáveis comuns (`--px/--py`).
- **Comprovantes** (`js/comprovantes.js`): a lista é um array no topo do arquivo. Vazia por enquanto, então a dobra mostra 8 molduras vazias por fileira (3:4), com `aria-hidden`. A esteira pausa com o mouse em cima ou com o dedo pressionado. Com reduced motion, vira uma fileira parada com rolagem horizontal e scroll-snap. Com imagens, cada uma sai com `width`/`height`, `loading="lazy"`, `decoding="async"` e o `alt` da tabela.
- **Página de obrigado**: logo, "Obrigado!" grande, subtítulo, texto, os dois canais em cartões lado a lado (empilhados abaixo de 768 px) com o `mailto:`, o fecho e o rodapé. `noindex, nofollow`.
- **Rodapé**: HTML do site com os três ajustes (Home e Planos com URL absoluta, sem `data-i18n`) e ícones Ionicons 7.1.0 em SVG inline (os mesmos paths). CSS = `footer.css` + `author.css` do site.
- **Fontes locais**: Zalando Sans Expanded (baixada do Google Fonts, variável, latin, 37 KB, com preload) e Inter (variável, latin, 48 KB, copiada da LP nacional). Licenças OFL ao lado, em `assets/fonts/`.
- **`.htaccess`** no padrão da LP nacional: HTML revalida sempre, estáticos com um ano de cache, 404 para `_referencia`, `docs`, `relatorios`, `shots`, `scripts`, `node_modules`, `*.md`, `package*.json`, `*.log` e dotfiles.
- **Cache busting**: `node scripts/versao.mjs` põe `?v=<AAAAMMDDHHMM>` em todo arquivo local (HTML, `url()` do CSS, `import` entre módulos e a constante das imagens dos comprovantes). `--conferir` só verifica. Versão atual: `202611131539`.
- **`npm run dev`**: servidor estático próprio em Node, sem dependências, em http://localhost:5503. Imita os bloqueios do `.htaccess` e não faz cache.

## Arquivos criados/alterados

```
index.html
obrigado/index.html
css/tokens.css  css/base.css  css/hero.css  css/comprovantes.css  css/rodape.css  css/obrigado.css
js/config.js  js/formulario.js  js/rdstation.js  js/comprovantes.js  js/utm.js
assets/favicon-32.png  assets/apple-touch-icon.png            (gerados do "favicon zero7.png" do site, 1080 px/351 KB)
assets/fonts/zalando-sans-expanded-latin-wght-normal.woff2  assets/fonts/OFL-zalando-sans-expanded.txt
assets/fonts/inter-latin-wght-normal.woff2  assets/fonts/OFL-inter.txt
.htaccess
package.json
scripts/servidor.mjs  scripts/versao.mjs  scripts/conferir-copy.mjs
relatorios/fase-1.md
```

`assets/marca/logo-zero7.avif` e `assets/fundo/bg-black.avif` já estavam na pasta. Nada fora desta pasta foi alterado.

## Capturas (caminhos em shots/fase-1/)

Página inteira, das duas páginas:
- `lp-360.png`, `lp-390.png`, `lp-768.png`, `lp-1024.png`, `lp-1280.png`, `lp-1440.png`, `lp-1920.png`
- `obrigado-360.png`, `obrigado-390.png`, `obrigado-768.png`, `obrigado-1024.png`, `obrigado-1280.png`, `obrigado-1440.png`, `obrigado-1920.png`

Estados do formulário (1280 px): `estado-erro-1280.png`, `estado-foco-botao-1280.png`, `estado-enviando-1280.png`, `estado-falha-envio-1280.png`.
Reduced motion: `reduced-motion-lp-1280.png`.

## Conferência da copy (resultado do script)

`node scripts/conferir-copy.mjs`: lê os textos de `docs/copy.md` e do rodapé em `_referencia/`, extrai todo texto visível e todo `alt`/`aria-label`/`title`/`placeholder` das páginas e cruza com eles.

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
  OK   QUERO RECEBER A OFERTA
  OK   Traders Zero7 recebendo em Dólar
Textos visíveis fora da copy, do rodapé do site e da tabela técnica:
  nenhum
Textos técnicos no HTML: Black Zero7 Trading
Atributos com texto (alt/aria-label/title/placeholder): nenhum
Escondidos do leitor de tela (aria-hidden): →

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
Atributos com texto (alt/aria-label/title/placeholder): nenhum
Escondidos do leitor de tela (aria-hidden): nenhum

=== js/ (textos que o JS põe na tela)
  OK   js/formulario.js: Preencha este campo.
  OK   js/formulario.js: Digite um e-mail válido.
  OK   js/formulario.js: Não foi possível enviar agora. Tente de novo.
  OK   js/formulario.js: ENVIANDO...
  OK   js/comprovantes.js: Comprovante de pagamento a trader Zero7

RESULTADO: copy confere, nenhum texto a mais.
```

O "→" é a seta do botão do site, dentro de um `aria-hidden` (é ícone, não texto).

## Checagens rodadas

Playwright (Chromium headless) em http://localhost:5503, nas 7 larguras e nas 2 páginas:

| Checagem | Resultado |
|---|---|
| Erros e avisos no console | nenhum |
| Respostas ≥ 400 / requisições com falha | nenhuma |
| Rolagem horizontal (`scrollWidth > clientWidth`) | nenhuma, em todas as larguras |
| Tab a partir do topo | `nome` → `email` → `button.z7-btnx` |
| Enter com campos vazios | "Preencha este campo." nos dois; o foco vai para Nome |
| Enter com `maria@exemplo` | "Digite um e-mail válido."; o foco vai para E-mail |
| Enter com dados válidos | botão "ENVIANDO...", payload no console (`[RD simulado]`), redireciona para `obrigado/` em ~650 ms |
| Honeypot preenchido | vai para `obrigado/` sem chamar o envio |
| Envio com falha (`simularFalha: true`) | fica na página, mostra "Não foi possível enviar agora. Tente de novo.", campos preenchidos, botão volta ao normal |
| `prefers-reduced-motion: reduce` | nenhuma animação rodando, esteira parada, 1 fileira com `overflow-x: auto` |
| Sem reduced motion | esteira anda (~35 px/s) e para com o mouse em cima |
| Bloqueios do servidor | `docs/copy.md`, `CLAUDE.md`, `_referencia/…`, `package.json`, `.htaccess`, `.gitignore`, `scripts/…`, `relatorios/`, `shots/` → 404 |
| `node scripts/versao.mjs --conferir` | OK: todas as referências locais com `?v=202611131539` |

Altura do botão no mobile: começa em 662 px e termina em 726 px (390 × 844).

## Textos fora da copy usados nesta fase

Todos da tabela "Textos que a copy não traz":
- `<title>` da página: "Black Zero7 Trading"
- `<title>` do obrigado: "Obrigado! — Black Zero7 Trading"
- "Preencha este campo.", "Digite um e-mail válido.", "Não foi possível enviar agora. Tente de novo.", "ENVIANDO..."
- `alt` dos comprovantes: "Comprovante de pagamento a trader Zero7" (está no código; só aparece quando entrarem imagens)
- `meta description` e `og:description`: o texto da hero. `og:title`: "Black Zero7 Trading".

Os textos do rodapé são os do site, sem mudança.

## O que me incomodou

1. **Ícones sociais sem nome acessível.** No site os três links (Instagram, TikTok, Facebook) não têm texto, e mantive assim porque `aria-label` seria texto fora da copy. O leitor de tela anuncia só "link". Sugiro liberar `aria-label="Instagram"`, `"TikTok"` e `"Facebook"`.
2. **A logo está com `alt=""`.** Fiz assim pelo mesmo motivo (o rodapé do site também usa `alt=""`). Como o h1 já diz "Black Zero7 Trading", ninguém fica sem informação, mas um `alt="Zero7"` seria o normal.
3. **"Cookie" e "Políticas de Uso" com `href=""`.** No site esses links recarregam a própria página, e aqui fazem o mesmo. Se houver URL certa, troco.
4. **"© 2025"** no rodapé, idêntico ao site. Em novembro de 2026 talvez valha atualizar nos dois.
5. **O selo do Reclame Aqui ficou de fora.** `docs/marca.md` pede o script do site, mas `docs/fases.md` tira da Fase 1 "qualquer outro script de terceiros" e o `CLAUDE.md` só permite scripts listados em `fases.md`, onde o RA não aparece. O lugar dele (`#ra-verified-seal`) já está no rodapé, vazio.
6. **"Obrigado!" menor no mobile que no site.** O site usa `clamp(5rem, 12vw, 11rem)`, mas a Zalando Sans Expanded em caixa alta é larga e, com 50 px, "OBRIGADO!" passa de 360 px. Usei `clamp(3.6rem, 10vw, 11rem)`; no desktop o tamanho máximo é o mesmo.
7. **Os cartões do obrigado passam um pouco dos ~70 rem** (até 88 rem a partir de 768 px). Com 70 rem, o e-mail quebrava no meio ("contact@zero7trading.co / m"). O texto continua em 60–70 rem.
8. **Esteira e WCAG 2.2.2.** O movimento pausa com o mouse e com o dedo pressionado, mas não há botão de pausa. Botão exigiria texto fora da copy; com reduced motion a esteira já fica parada.
9. **Entre 1024 e 1080 px a hero fica em uma coluna** (a regra da marca é ≥ 1080). Em 1024 o cartão fica largo; se preferir, desço o ponto de quebra para 1024.

## Perguntas / pendências

1. **Ícones sociais e logo** (itens 1 e 2 acima): posso usar `aria-label` com o nome da rede e `alt="Zero7"`?
2. **Reclame Aqui**: o script entra na Fase 2, junto com o GTM? Se sim, ponho em `docs/fases.md` como permitido.
3. **Pendências do `CLAUDE.md` que seguem abertas**: 1 (RD), 2 (WhatsApp no obrigado × formulário sem esse campo), 3 (imagens dos comprovantes), 4 (endereço de publicação, para `canonical`/`og:image`), 5 (faixa "Formas de Pagamento"), 6 (`support@` no rodapé × `contact@` no obrigado).
4. **Commit**: a pasta não era repositório git. Rodei `git init` e fiz o commit `fase 1: ...` local, sem remoto e sem push.

Para revisar o estado de erro sem rede: em `js/config.js`, `simularFalha: true` (e voltar para `false`).

Aguardando aprovação para a Fase 2.
