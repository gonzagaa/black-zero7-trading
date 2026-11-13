# Fase 1 (ajuste): acessibilidade do rodapé, campo-isca, entrada da hero e documentos

## O que foi feito

1. **Ícones sociais**: cada link tem área de toque de no mínimo 44 × 44 px em todas as larguras, e o ícone continua com o tamanho do site (20 px no mobile; 30 px com 8 px de respiro no desktop). Ganharam `aria-label="Instagram"`, `"TikTok"` e `"Facebook"`. No mobile, a fileira foi puxada 12 px para a esquerda, para o primeiro ícone continuar alinhado ao texto. Os ícones ficaram mais espaçados (24 px de vão visual em vez de 10 px), porque áreas de 44 px não podem se sobrepor.
2. **Logo** do topo e do rodapé, nas duas páginas: `alt="Zero7"`.
3. **Campo-isca**: `id`/`name` passaram a `z7_campo_b` (antes `website`), com `tabindex="-1"` e `autocomplete="off"`. O `js/formulario.js` segue o novo nome.
4. **Entrada da hero**:
   - Título (`.entra`, que é o LCP): só desloca de 24 px para 0, em 600 ms. A opacidade fica em 1 o tempo todo.
   - Cartão do formulário (`.entra-surge`): opacidade 0 → 1 com deslocamento de 16 px, **sem atraso e com 400 ms de duração**. Medido: totalmente visível 379–381 ms depois do primeiro paint (390 e 1440 px).
   - No obrigado vale a mesma regra: o título só desloca, e os outros blocos usam `.entra-surge`, sem os atrasos de 120/240 ms de antes.
   - Com reduced motion, nada anima.
5. **Rodapé**: "Cookie" e "Políticas de Uso" viraram texto sem link, e o ano passou para "© 2026", nas duas páginas. Registrado no `CLAUDE.md`, na nova seção "Exceções aprovadas ao 'mesmo rodapé do site'". A seção também lista os `aria-label` e o `alt` dos itens 1 e 2.
6. **`docs/fases.md`, Fase 2**: novo item 3, "Selo do Reclame Aqui", com o script do site (o mesmo `src`, `data-id`, `data-target` e `data-model`) como terceiro permitido. Os itens seguintes foram renumerados (4 a 6).

Fora do pedido, mas necessário para a conferência da copy:
- `docs/copy.md`: quatro linhas novas na tabela "Textos que a copy não traz": `alt` "Zero7" e os três `aria-label`, marcadas como "aprovado na Fase 1, ajuste". Sem isso o script acusaria esses textos como extras. Se preferir que a tabela fique como estava, eu tiro e ponho a exceção só no script.
- `scripts/conferir-copy.mjs`: aceita "© 2026 | Todos os direitos reservados." como exceção do rodapé (a referência em `_referencia/` continua com 2025, cópia fiel do site).

## Arquivos criados/alterados

```
index.html, obrigado/index.html        alt, aria-label, rodapé, campo-isca, classes de entrada
css/base.css                           .entra (só deslocamento) e .entra-surge (400 ms, sem atraso)
css/rodape.css                         área de toque de 44 × 44 px nos ícones sociais
js/formulario.js                       seletor do campo-isca
CLAUDE.md                              seção "Exceções aprovadas ao 'mesmo rodapé do site'"
docs/fases.md                          Reclame Aqui na Fase 2
docs/copy.md                           alt e aria-label na tabela técnica
scripts/conferir-copy.mjs              exceção do ano no rodapé
css/*, js/*, *.html                    versão de cache: ?v=202611131547
relatorios/fase-1-ajuste.md
```

## Capturas (caminhos em shots/fase-1/)

Refeitas todas, porque o rodapé mudou nas duas páginas e a entrada mudou na hero:
`lp-{360,390,768,1024,1280,1440,1920}.png`, `obrigado-{360,390,768,1024,1280,1440,1920}.png`, `estado-erro-1280.png`, `estado-foco-botao-1280.png`, `estado-enviando-1280.png`, `estado-falha-envio-1280.png`, `reduced-motion-lp-1280.png`.

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

## Checagens rodadas

| Checagem | Resultado |
|---|---|
| Console, respostas ≥ 400, rolagem horizontal (7 larguras × 2 páginas) | nenhum erro, nenhum 404, nenhuma rolagem |
| Área de toque dos ícones sociais | 44 × 44 de 360 a 1024 px; 46 × 46 em 1280 e 1440; 48 × 48 em 1920 (as duas páginas) |
| Título da hero | opacidade mínima medida desde o primeiro paint: 1 |
| Cartão do formulário | `animation-delay: 0s`, `animation-duration: 0.4s`; totalmente visível em 381 ms (390 px) e 379 ms (1440 px) depois do primeiro paint |
| Tab | `nome` → `email` → botão |
| Envio válido | redireciona para `obrigado/` em ~640 ms |
| Campo-isca `z7_campo_b` preenchido | vai para `obrigado/` sem enviar |
| Falha simulada | fica na página com a mensagem de erro e os campos preenchidos |
| Reduced motion | nenhuma animação rodando, esteira parada, uma fileira |
| `node scripts/versao.mjs --conferir` | OK, `?v=202611131547` |

## Textos fora da copy usados neste ajuste

- `alt="Zero7"` (logo do topo e do rodapé, nas duas páginas)
- `aria-label`: "Instagram", "TikTok", "Facebook"
- "© 2026 | Todos os direitos reservados." (exceção aprovada do rodapé)

Os quatro primeiros entraram na tabela de `docs/copy.md`; o ano está no `CLAUDE.md`.

## O que me incomodou

- Os ícones sociais ficaram mais espaçados no mobile (de 10 px para 24 px de vão visual). Era isso ou sobrepor as áreas de toque.
- A tabela de `docs/copy.md` foi editada sem pedido explícito, só para registrar os textos aprovados (ver "O que foi feito").

## Perguntas / pendências

- Seguem abertas as pendências 1 a 6 do `CLAUDE.md`. A 5 da lista anterior (Reclame Aqui) foi resolvida: o script entra na Fase 2.

Aguardando aprovação para a Fase 2.
