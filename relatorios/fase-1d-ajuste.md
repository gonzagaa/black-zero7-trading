# Fase 1D (ajuste)

## O que foi feito

1. **Rodapé:** sem mudança; continua o do site.
2. **Botão:** sem mudança; o ajuste de contraste do degradê foi aprovado como está.
3. **Grão do protótipo:** `assets/fundo/grao.png` foi movido (com `git mv`) para `_referencia/prototipo/grao.png`. Nos dois arquivos do protótipo (`lp.html` e `obrigado.html`), o caminho passou de `../../assets/fundo/grao.png` para `grao.png`. Abri os dois protótipos direto do disco: o grão carrega (220 × 220) e nenhum arquivo local falha. O comentário de `css/tokens.css` aponta para o novo lugar. Com isso, `assets/` não tem mais nada que as páginas não usem.
4. **Obrigado, abaixo de 560 px:** em `css/obrigado.css`, `@media (max-width: 559px)`, o cartão do canal vira coluna:
   - o ícone fica em cima;
   - o texto e a caixa de aviso ocupam toda a largura útil do cartão.

   A partir de 560 px, o cartão continua como estava, com o ícone ao lado.
5. **Pílula da data (LP e obrigado):** o trecho da data ganhou `<span class="sem-quebra">` (`white-space: nowrap`, em `css/base.css`):
   - na LP, `27/11 às 12h`;
   - no obrigado, `dia 27/11 às 12h.`.

   Como a pílula é `inline-flex`, o texto foi envolvido num `<span>`. Sem ele, o trecho sem quebra viraria um item flex separado. O texto da copy não mudou: a conferência continua passando.

Versão de cache: `?v=202611160750`.

## Arquivos alterados

```
_referencia/prototipo/grao.png        movido de assets/fundo/grao.png
_referencia/prototipo/lp.html         caminho do grão
_referencia/prototipo/obrigado.html   caminho do grão
index.html, obrigado/index.html       span da pílula + sem-quebra na data; versão de cache
css/base.css                          .sem-quebra
css/obrigado.css                      canais em coluna abaixo de 560 px
css/tokens.css                        comentário do grão
css/*, js/*, *.html                   ?v=202611160750
relatorios/fase-1d-ajuste.md
```

## Medidas

Linhas da pílula e posição do ícone nos cartões, medidas no navegador:

| Largura | LP: pílula | Obrigado: pílula | Canais: ícone acima / texto e aviso = largura útil |
|---|---|---|---|
| 360 | "OFERTA REVELADA AO VIVO -" / "27/11 ÀS 12H" | "TE ESPERAMOS AO VIVO NO" / "DIA 27/11 ÀS 12H." | sim / 278 = 278 |
| 390 | idem | idem | sim / 308 = 308 |
| 414 | idem | idem | sim / 332 = 332 |
| 480 | uma linha | "…AO VIVO NO" / "DIA 27/11 ÀS 12H." | sim / 398 = 398 |
| 559 | uma linha | uma linha | sim / 477 = 477 |
| 560 | uma linha | uma linha | não (ícone ao lado, como antes) |
| 768 | uma linha | uma linha | não (como antes) |

Em todas: console sem erros, nenhum 404 e nenhuma rolagem horizontal.

## Capturas (shots/fase-1d-ajuste/)

`lp-360.png`, `lp-390.png`, `obrigado-360.png`, `obrigado-390.png` (página inteira).

## Conferência da copy

```
=== index.html
<title>: OK   Black Zero7 Trading
  OK   Black Zero7 Trading
  OK   Uma oferta imperdível para você testar e operar Day Trade no mercado americano de futuros.
  OK   Oferta revelada ao vivo - 27/11 às 12h
  OK   Cadastre-se para receber a oferta.
  OK   Nome:
  OK   E-mail:
  OK   QUERO RECEBER A OFERTA
  OK   Traders Zero7 recebendo em Dólar
Textos visíveis fora da copy, do rodapé do site e da tabela técnica: nenhum

=== obrigado/index.html
<title>: OK   Obrigado! — Black Zero7 Trading
  OK   Obrigado!
  OK   Cadastro feito com sucesso!
  OK   Para não perder sua oferta e os detalhes dela fique atento a esses dois canais:
  OK   Te esperamos ao vivo no dia 27/11 às 12h.
  OK   Sua caixa de e-mail e marque como confiável: contact@zero7trading.com
  OK   Seu WhatsApp de cadastro (Atenção: A Zero7 não solicita nenhum pagamento, PIX ou transferência por meio do WhatsApp - esse é um canal apenas para notificações)
Textos visíveis fora da copy, do rodapé do site e da tabela técnica: nenhum

=== js/
  OK   (os 5 textos técnicos de sempre)

RESULTADO: copy confere, nenhum texto a mais.
```

## Observações

- No obrigado, a quebra acontece depois de "AO VIVO NO", porque o trecho sem quebra pedido é "dia 27/11 às 12h.". Ela cai antes de "DIA".
- `docs/design-aprovado.md` (linha 9) ainda diz que o protótipo usa `assets/fundo/grao.png`. Não alterei o arquivo porque é documento seu; se quiser, troco para `_referencia/prototipo/grao.png`.

Aguardando aprovação.
