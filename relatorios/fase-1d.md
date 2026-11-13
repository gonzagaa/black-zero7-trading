# Fase 1D: Rodada de design (protótipo aprovado)

## O que foi feito

Apliquei nas duas páginas o visual de `_referencia/prototipo/`, com os valores exatos do CSS dele. Copy, estrutura das dobras, rodapé e todo o comportamento do formulário ficaram como estavam.

- **Fundo em camadas** (`.cena` em `css/base.css`), de baixo para cima:
  1. o "07" (`bg-black.avif`) com `brightness(1.45) contrast(1.1)`;
  2. duas luzes verdes (atrás do formulário e descendo do topo);
  3. campo de pontos de 1 px a cada 13 px com máscara radial;
  4. dois arcos concêntricos de 1 px;
  5. vinheta;
  6. grão (`overlay`, opacidade .34).
  - Tudo estático. No celular e no tablet, a luz e a máscara dos pontos descem para trás do cartão, e os arcos encolhem (110 e 72 rem em vez de 164 e 108).
- **Grão sem imagem.** O `grao.png` do protótipo tem 171 KB e, por ser ruído, não encolhe (em WebP fica entre 61 e 86 KB). Troquei por um ruído SVG embutido no token `--grao` (`feTurbulence`, menos de 1 KB, nenhuma requisição). Calibrei contra o PNG renderizando os dois sobre o mesmo cinza, com o mesmo blend e a mesma opacidade:

  | Fundo | PNG: média / desvio | SVG: média / desvio |
  |---|---|---|
  | `#0a0a0a` | 10,42 / 0,49 | 10,66 / 0,47 |
  | `#3a3a3a` | 58,35 / 1,82 | 59,12 / 1,77 |

- **Títulos** em degradê branco-prata recortado no texto. O h1 vai em três linhas (`<span>Black</span> <span>Zero7</span> <span>Trading</span>`); os espaços entre os spans mantêm o texto "Black Zero7 Trading" para o leitor de tela e para a conferência da copy.
- **Pílula de vidro** com corte diagonal e ponto verde pulsando (`.pilula` + `.ponto`), na data da hero e no fecho do obrigado. Ouro removido.
- **Cartão do formulário**: vidro escuro, borda branca a 12 %, `blur(18px)`, sombra funda com halo verde. Campos escuros com corte diagonal e foco verde.
- **Botão** com o desenho do protótipo: degradê da marca, brilho que passa (só `transform`) e a gota com a seta em SVG. Ficaram a luz que acompanha o mouse e o ripple. Saíram o anel girando e o "respirar" do botão do site, porque animavam `filter` (item 4 da fase).
- **Comprovantes**:
  - Linha fina no topo, campo de pontos, luz verde subindo da base, título prata com "Dólar" em neon.
  - Molduras com borda de 2 px em degradê branco → verde e corte diagonal.
  - Fileira de cima em retrato (292 × 372), a de baixo em paisagem (340 × 300), andando a 46 s e 54 s. No celular as molduras ficam a 62 % desse tamanho, no tablet a 82 %.
- **Obrigado**:
  - "Obrigado!" gigante em prata e "Cadastro feito com sucesso!" com o check verde.
  - Dois cartões de vidro com os ícones do protótipo; o aviso do WhatsApp numa caixa escura com borda fina. Os cartões ficam lado a lado a partir de 1080 px e empilhados abaixo disso.
  - O fecho na pílula.
- **Celular e tablet**: mesmas camadas e mesma ordem. Em 390 × 844 o botão termina em 776 px.
- **Ouro**:
  - Saiu de `css/tokens.css` (`--camp-accent`) e de `css/hero.css`.
  - Em `docs/marca.md` saíram a linha da tabela de cores e a regra de uso, e o hex do aviso do topo virou "O dourado foi recusado…".
  - O comentário "Regra de ouro" em `js/formulario.js` virou "Regra principal".

Duas correções apareceram na comparação com o protótipo:
- **Desfoque do cartão**: a animação de entrada estava no elemento pai do cartão. Opacidade animada num ancestral isola o `backdrop-filter`, e os pontos apareciam nítidos dentro do cartão. A animação foi para o próprio cartão, e no obrigado para cada cartão.
- **Altura do cartão**: os rótulos herdavam `line-height: 1.5`, e o cartão ficava 8 px mais alto que o do protótipo. Agora usam `1.2`, como lá.

## Arquivos criados/alterados

```
index.html, obrigado/index.html     camadas do fundo, h1 em três linhas, pílulas, seta em SVG, check e ícones do obrigado
css/tokens.css                      sem ouro; --prata, --prata-h2, --grao
css/base.css                        .wrap, .topo, .cena e camadas, .prata, .pilula, .ponto (substituem .fundo-marca)
css/hero.css                        reescrito com os valores do protótipo; botão novo
css/comprovantes.css                reescrito (fundo da dobra, molduras retrato/paisagem, 46 s/54 s)
css/obrigado.css                    reescrito
js/comprovantes.js                  moldura com miolo (.moldura__dentro); comentário da proporção das fileiras
js/formulario.js                    comentário ("Regra principal")
docs/marca.md                       ouro removido
css/*, js/*, *.html                 versão de cache: ?v=202611131609
relatorios/fase-1d.md
```

Também entram neste commit os arquivos que o Gustavo deixou para esta rodada: `docs/design-aprovado.md`, `_referencia/prototipo/`, `assets/fundo/grao.png` e as edições em `CLAUDE.md`, `docs/fases.md` e `docs/marca.md`.

## Capturas (caminhos em shots/fase-1d/)

- Página inteira: `lp-{360,390,768,1024,1280,1440,1920}.png` e `obrigado-{360,390,768,1024,1280,1440,1920}.png`
- **Lado a lado em 1440 px (protótipo à esquerda, página à direita):** `lado-a-lado-lp-1440.png` e `lado-a-lado-obrigado-1440.png`
- Estados do formulário: `estado-erro-1280.png`, `estado-foco-botao-1280.png`, `estado-enviando-1280.png`, `estado-falha-envio-1280.png`
- Reduced motion: `reduced-motion-lp-1280.png`

## Diferenças que sobram em 1440 px (protótipo × página)

1. **Rodapé.** O protótipo mexeu de leve no rodapé:
   - colunas `1.3fr 1fr 1fr 1fr` com 56 px de vão e conteúdo a 132 px da borda;
   - faixa de baixo em `#0d0d0d`, numa linha só;
   - aviso legal em 11,5 px `#9aa19d`;
   - "Política de Privacidade" sublinhado.

   Mantive o rodapé do site, porque `design-aprovado.md` diz que o rodapé não muda e o `CLAUDE.md` pede "o mesmo rodapé do site". Na prática, a página fica 12 px mais para dentro, a coluna do endereço quebra em três linhas e a faixa de baixo quebra o CNPJ em duas. Se quiser o rodapé do protótipo, é um ajuste pequeno.
2. **Botão com o degradê mais escuro sob o rótulo** (ver "Contraste"). No protótipo o meio do botão já está em `#10a36a`; aqui o verde claro fica só nos últimos 80 px, sob a gota. O fim de "OFERTA" fica um tom mais escuro.
3. **Molduras sem os textos "COMPROVANTE 01 / a imagem real entra aqui".** São marcações do protótipo e não estão na copy. As molduras ficam vazias, no mesmo tamanho.
4. **Grão em SVG em vez de PNG.** A intensidade medida é a mesma e o desenho do ruído é outro; a olho, não se distingue.

Fora isso, a hero, a dobra 2 e o obrigado coincidem em posição, tamanho e cor. Conferi em recortes ampliados lado a lado.

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
  OK   js/formulario.js: Não foi possível enviar agora. Tente de novo.
  OK   js/formulario.js: ENVIANDO...
  OK   js/comprovantes.js: Comprovante de pagamento a trader Zero7

RESULTADO: copy confere, nenhum texto a mais.
```

## Contraste

Método:
- Medi sobre o fundo real, com grão, pontos e luzes.
- Para cada elemento com texto, usei a cor do texto. Nos títulos em degradê, a cor mais escura do degradê (`#9a9a9a` / `#a6a6a6`).
- Fotografei a página com todo o texto escondido e, só na área do texto, peguei o **percentil 95 da luminância do fundo**: o pior caso, ignorando 5 % de pixels isolados de grão.
- 7 larguras × 2 páginas, 329 medições.

```
Menores razões (pior caso, percentil 95 do fundo):
   4.87:1  lp@1280        15.5px rgb(255, 255, 255)   QUERO RECEBER A OFERTA
   4.87:1  lp@1440        15.5px rgb(255, 255, 255)   QUERO RECEBER A OFERTA
   4.87:1  lp@1920        16.12px rgb(255, 255, 255)   QUERO RECEBER A OFERTA
   5.05:1  lp@360         14px  rgb(255, 255, 255)   QUERO RECEBER A OFERTA
   5.19:1  lp@390         14px  rgb(255, 255, 255)   QUERO RECEBER A OFERTA
   6.33:1  obrigado@1440  165.6px rgb(154, 154, 154)   Obrigado!
   6.33:1  obrigado@1920  174.72px rgb(154, 154, 154)   Obrigado!
   6.42:1  obrigado@1280  147.2px rgb(154, 154, 154)   Obrigado!
   6.75:1  lp@768         15.5px rgb(255, 255, 255)   QUERO RECEBER A OFERTA
   6.81:1  obrigado@360   41.4px rgb(154, 154, 154)   Obrigado!
   6.85:1  obrigado@390   44.85px rgb(154, 154, 154)   Obrigado!
   6.98:1  obrigado@1024  117.76px rgb(154, 154, 154)   Obrigado!
      7:1  obrigado@768   88.32px rgb(154, 154, 154)   Obrigado!
   7.63:1  lp@1024        15.5px rgb(255, 255, 255)   QUERO RECEBER A OFERTA

Elementos medidos: 329. Abaixo de 4,5:1: 0.
```

Com o degradê do protótipo, o rótulo do botão dava **2,89:1** em 1440 px: branco sobre o fim do degradê, já perto do `#10a36a`. Ajustei o degradê: o verde claro ficou só nos últimos 8 rem (a gota e o vão) e, sob o rótulo, o verde vai no máximo até `#0d874f`, que dá 4,5:1 com o branco em qualquer largura do botão. As mensagens de erro (`#ff9d9d`) não aparecem no estado inicial; sobre o cartão (cerca de `#111411`) dão ~10:1.

## Checagens rodadas

| Checagem | Resultado |
|---|---|
| Console, respostas ≥ 400, rolagem horizontal (7 larguras × 2 páginas) | nenhum erro, nenhum 404, nenhuma rolagem |
| Fim do botão em 390 × 844 / 360 × 844 | 776 px / 766 px |
| Tab | `nome` → `email` → botão |
| Enter vazio / e-mail inválido | "Preencha este campo." nos dois, foco em Nome / "Digite um e-mail válido.", foco em E-mail |
| Envio válido | "ENVIANDO..." e `obrigado/` em ~630 ms |
| Campo-isca preenchido | `obrigado/` sem enviar |
| Falha simulada | fica na página, mensagem de erro, campos preenchidos |
| Entrada | título com opacidade 1 desde o primeiro paint; cartão sem atraso, 400 ms, todo visível em 370–379 ms |
| Propriedades animadas | `entra`: transform · `entra-surge`: transform, opacity · `pulso`: transform, opacity · `z7x-passa`: transform · esteiras: transform. **Nenhum `filter` animado.** |
| Reduced motion | nenhuma animação rodando, esteira parada em uma fileira com rolagem |
| Esteira sem reduced motion | anda e para com o mouse em cima |
| Peso da LP no celular (tudo, ainda sem comprovantes) | 179 KB: fontes 84, fundo 31, logo 16, CSS 25, JS 13, HTML 10 |
| `node scripts/versao.mjs --conferir` | OK, `?v=202611131609` |
| Bloqueios do servidor | `docs/`, `_referencia/`, `CLAUDE.md`, `package.json`, dotfiles, `scripts/`, `relatorios/`, `shots/` → 404 |

## Textos fora da copy usados nesta fase

Nenhum novo. Continuam os da tabela de `docs/copy.md`: os `<title>`, as mensagens de validação e envio, "ENVIANDO...", o `alt` dos comprovantes, o `alt="Zero7"` e os três `aria-label` do rodapé.

## O que me incomodou

1. **O botão do protótipo não passa no contraste.** Escureci o meio do degradê só o necessário. Para manter o degradê exato, a alternativa é aumentar o rótulo para pelo menos 18,7 px em negrito (vira "texto grande", com mínimo de 3:1), mas isso mexe mais no desenho.
2. **`assets/fundo/grao.png` (171 KB) continua na pasta publicada.** As páginas não carregam esse arquivo; ele só está lá porque o protótipo aponta para ele. Antes de publicar, convém tirá-lo de `assets/` (ou mover junto com o protótipo) para não ir para o servidor.
3. **Em 768 e 1024 px o botão fica abaixo da primeira tela**: termina em 912 e 983 px, numa tela de 900 de altura. A exigência é só para 390 × 844, mas no tablet em pé é preciso rolar um pouco.
4. **O rodapé** é a principal diferença visível em relação ao protótipo (item 1 das diferenças).

## Perguntas / pendências

1. Rodapé: mantenho o do site ou adoto o do protótipo?
2. Botão: aprova o ajuste de contraste do degradê?
3. `grao.png`: posso tirá-lo de `assets/` antes da publicação?
4. A Fase 2 continua parada: `docs/rdstation.md` ainda está com "A confirmar na conta" em branco, e falta o endereço de publicação.

Aguardando aprovação.
