# Fases

Faça **somente a fase pedida**. Ao terminar, escreva o relatório em `relatorios/fase-N.md`, repita o resumo no chat e **pare**. A fase seguinte só começa com "Fase N aprovada" por escrito.

---

## Fase 1 — As duas páginas, com o formulário em modo simulado

**Objetivo:** a LP e a página de obrigado prontas para aprovação visual, funcionando de ponta a ponta sem a RD Station.

**Leia antes:** `CLAUDE.md`, `docs/copy.md`, `docs/marca.md`, `docs/rdstation.md` (só as regras do modo simulado) e, na pasta irmã, `../Zero7-Internacional/index.html` (rodapé), `css/footer.css`, `css/author.css`, `css/button.css`, `css/obrigado.css`.

**Entregar:**

1. Estrutura:
   ```
   index.html
   obrigado/index.html
   css/        tokens.css, base.css, hero.css, comprovantes.css, rodape.css, obrigado.css
   js/         config.js, formulario.js, rdstation.js, comprovantes.js, utm.js
   assets/     marca/, fundo/, fonts/, comprovantes/, favicon
   .htaccess
   ```
   Todo caminho é relativo (nada começa com `/`), para a página funcionar em qualquer subpasta.
2. Copie da pasta irmã o que faltar em `assets/` (favicon, e o que mais precisar). Renomeie sem espaços.
3. Hero, dobra dos comprovantes e rodapé, como em `docs/marca.md`.
4. Formulário: validação, estados de foco, erro e envio, honeypot, modo simulado, e redirecionamento para `obrigado/` no sucesso.
5. Página de obrigado.
6. `.htaccess` no padrão do `../lp-black-friday/.htaccess`: HTML sempre revalida, estáticos com cache longo, e 404 para `_referencia`, `docs`, `relatorios`, `shots`, `node_modules`, `*.md`, `package*.json` e dotfiles.
7. Cache busting: todo arquivo local sai com `?v=<versão>`.
8. `npm run dev` servindo em **http://localhost:5503** (um servidor estático simples; é o único uso de npm no projeto).
9. Capturas da página inteira em 360, 390, 768, 1024, 1280, 1440 e 1920 px, das duas páginas, em `shots/fase-1/`.

**Fora desta fase:** RD Station real, GTM e qualquer outro script de terceiros.

**Aceite:**
- A copy bate palavra por palavra com `docs/copy.md` (faça a conferência por script e cole o resultado no relatório).
- Console sem erros, rede sem 404, sem rolagem horizontal em nenhuma das sete larguras.
- Com teclado: Tab percorre Nome → E-mail → botão; Enter envia.
- Com `prefers-reduced-motion`: nada se move sozinho.
- O rodapé confere com o do site, tirando os três ajustes listados em `docs/marca.md`.

---

## Fase 1D — Rodada de design (protótipo aprovado)

**Objetivo:** aplicar nas duas páginas o visual aprovado pelo Gustavo, sem mexer em copy nem em comportamento.

**Leia antes:** `docs/design-aprovado.md` e os dois arquivos de `_referencia/prototipo/` (abra no navegador e leia o CSS).

**Entregar:**

1. Fundo em camadas, cores, título, pílula da data, cartão do formulário, molduras dos comprovantes e página de obrigado como no protótipo.
2. Versão de celular e tablet derivada do protótipo (ele só cobre 1440 px), com as mesmas camadas. Em 390 × 844 o botão continua visível sem rolar muito.
3. Remoção do ouro: nenhum `#f1c36a` nem variação dele sobra em CSS, tokens ou documentação viva.
4. Grão e demais texturas sem custo de desempenho: nada de imagem grande, nada de `filter` animado; com `prefers-reduced-motion` nada se move sozinho.
5. Capturas nas 7 larguras das duas páginas em `shots/fase-1d/`, e uma captura lado a lado (protótipo × página) em 1440 px de cada página.

**Aceite:**
- Em 1440 px, a página e o protótipo são a mesma coisa a olho nu. Aponte você mesmo, no relatório, cada diferença que sobrar.
- Conferência da copy sem diferença.
- Contraste de texto ≥ 4,5:1 medido sobre o fundo novo (com grão e pontos).
- Console sem erros, rede sem 404, sem rolagem horizontal, fluxo do formulário intacto.

---

## Fase 2 — RD Station, medição e publicação

**Só começa depois que `docs/rdstation.md` tiver a seção "A confirmar na conta" preenchida.** Se ela ainda estiver em branco, pare e avise.

**Entregar:**

1. `js/rdstation.js` em modo real, seguindo as regras de `docs/rdstation.md`.
2. Medição:
   - GTM `GTM-NLVJR569` (o mesmo do site), com o `noscript` logo depois do `<body>`.
   - No sucesso do envio, antes de redirecionar: `dataLayer.push({ event: 'lead_black_trading' })`. Nenhum dado pessoal (nome, e-mail) vai para o dataLayer nem para a URL.
   - Hotjar e Zendesk não entram, a não ser que o Gustavo peça.
3. Selo do Reclame Aqui no rodapé (`#ra-verified-seal`), com o mesmo script do site (terceiro permitido):
   `<script type="text/javascript" id="ra-embed-verified-seal" src="https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js" data-id="WDRYanlCUWlyT0xFUTFZeDp6ZXJvNy10ZXNvdXJhcmlh" data-target="ra-verified-seal" data-model="2"></script>`
4. `canonical`, `og:*` e `og:image` com URL absoluta, depois que o endereço de publicação for confirmado.
5. Teste de ponta a ponta com um lead de teste (ver a lista em `docs/rdstation.md`) e a evidência no relatório.
6. Roteiro de publicação, passo a passo, no relatório. **Não publique nada por conta própria.**

---

## Formato do relatório

```
# Fase N: <nome>
## O que foi feito
## Arquivos criados/alterados
## Capturas (caminhos em shots/fase-N/)
## Conferência da copy (resultado do script)
## Checagens rodadas
## Textos fora da copy usados nesta fase
## O que me incomodou
## Perguntas / pendências
Aguardando aprovação para a Fase N+1.
```
