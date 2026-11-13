# Design aprovado — rodada de design (13/11/2026)

O Gustavo reprovou o visual da Fase 1 ("genérico, sem graça, sem textura") e aprovou o protótipo que está em `_referencia/prototipo/`. **Este documento e o protótipo valem por cima de `docs/marca.md`** onde houver conflito. A copy não muda.

## A referência

- `_referencia/prototipo/lp.html` e `_referencia/prototipo/obrigado.html`: abra no navegador. O CSS dentro deles traz os valores exatos aprovados (cores, opacidades, raios, sombras, tamanhos).
- É protótipo de **desktop** (1440 px). O celular não foi desenhado: você adapta, mantendo as mesmas camadas e a mesma hierarquia.
- O protótipo carrega as fontes do Google e usa `assets/fundo/grao.png`. Na página real as fontes continuam locais, e o grão pode virar WebP ou um SVG de ruído, desde que o resultado visual seja o mesmo.
- O formulário e o botão do protótipo são só desenho. A lógica da Fase 1 (validação, estados, envio, honeypot, UTMs) fica como está.

## O que foi recusado (não volte com nada disto)

- Dourado/ouro em qualquer lugar, inclusive na linha da data.
- Texto em contorno (`-webkit-text-stroke`).
- Eclipse, raios de luz, gráfico de candles, grade quadriculada, cantos marcados no cartão.
- Fundo liso com uma luz verde só. Foi exatamente isso que ele chamou de genérico.

## O que foi aprovado

### Fundo (todas as dobras escuras)
Camadas, de baixo para cima:
1. O "07" em relevo (`assets/fundo/bg-black.avif`), um pouco mais claro que o original (`brightness(1.45) contrast(1.1)`).
2. Luz verde: uma atrás do formulário e uma descendo do topo. Só verde da marca, nunca outra cor.
3. **Campo de pontos**: pontos brancos de 1 px a cada 13 px, com máscara radial que some nas bordas. É a linguagem do mapa pontilhado da hero do site.
4. Dois arcos finos concêntricos (1 px, branco a ~20%), como os da hero do site. São discretos; se não aparecerem, aumente um pouco a opacidade em vez de tirar.
5. Vinheta escurecendo as bordas e fundindo com a dobra seguinte.
6. **Grão** por cima de tudo (`mix-blend-mode: overlay`, opacidade ~.34). É a textura que ele pediu: tem que ser perceptível.

### Cor
- Preto `#040404` domina.
- Títulos em degradê branco-prata (`radial-gradient` de `#ffffff` a `#9a9a9a`, recortado no texto), o mesmo tratamento dos títulos do site.
- Verde só em: botão, ponto pulsando da data, a palavra "Dólar" (neon `#6FF0B8`), ícones dos canais no obrigado e luzes de fundo.

### Hero
- Título em três linhas ("Black" / "Zero7" / "Trading"), todas no mesmo degradê branco-prata, sem variação entre as palavras.
- Linha da data: pílula de vidro com corte diagonal, borda branca fina, ponto verde pulsando, texto branco.
- Cartão do formulário: vidro escuro (`rgba(255,255,255,.07)` → transparente), borda de 1 px branca a 12%, desfoque de fundo, sombra profunda com um halo verde leve. Sem borda colorida.
- Campos escuros com corte diagonal; foco em verde.
- Botão: o degradê verde da marca com o brilho que passa e a "gota" com a seta. Continua sendo o único elemento chamativo da página.

### Comprovantes
- Linha fina em degradê no topo da dobra (a mesma do rodapé do site), campo de pontos e luz verde subindo da base.
- Título em branco-prata com "Dólar" em neon.
- Molduras com borda fina em degradê branco → verde, corte diagonal, sem tracejado. Primeira fileira em retrato, segunda em paisagem.

### Obrigado
- Mesmo fundo da hero.
- "Obrigado!" gigante em branco-prata.
- "Cadastro feito com sucesso!" em texto branco com um ícone de check verde ao lado (sem pílula colorida).
- Dois cartões de vidro iguais ao do formulário, conteúdo centralizado na vertical. O aviso do WhatsApp fica numa caixa escura com borda fina, bem legível.
- O fecho usa a mesma pílula da data.

## O que não muda
Copy, estrutura das dobras, rodapé, acessibilidade, desempenho e tudo o que é comportamento. As metas da Fase 1 (LCP, CLS, sem rolagem horizontal, movimento reduzido) continuam valendo com o fundo novo.
