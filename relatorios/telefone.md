# Telefone com máscara e DDI

Sugestão do Hugo (4Selet), aprovada pelo Gustavo em 19/11/2026. O campo `#telefone` era livre (só recusava letra no envio); agora tem máscara com DDI, validação por país e envio em E.164.

Não mudaram:

- **O campo:** id, `name`, `type="tel"`, `inputmode`, `autocomplete="tel"` e `maxlength`. O `index.html` só mudou no `?v`.
- **O resto:** o bloco da 4Selet, a copy (nenhum texto novo além do "+55") e as mensagens de erro.
- **Bibliotecas:** nenhuma.

## Decisões tomadas no caminho (19/11)

1. **O "+55 " entra quando a pessoa foca o Telefone**, e não no carregamento.
   - **Por quê:** com o "+55 " de fábrica, o bloco da 4Selet mandava um parcial `{ phone: "+55" }` de todo visitante que saía da página sem preencher nada. Testado: com o campo vazio, como hoje, não sai nada.
   - **O complemento:** se a pessoa sair do campo só com o "+55", ele volta a ficar vazio. Isso acontece antes de a validação e a 4Selet lerem o campo, então quem só tocou no Telefone também não gera parcial nem erro.
2. **Outro país: de 10 a 15 dígitos no total, contando o DDI**, e não de 8 a 15. É o mínimo da `/api/lead` (no repositório do site) e do bloco da 4Selet. Com 8 ou 9 dígitos, a página aceitaria, a função recusaria e a pessoa veria o erro genérico de envio. Ficam de fora só territórios minúsculos (Groenlândia, Ilhas Faroé, Andorra, Malvinas...).

## Como funciona

`js/telefone.js` (novo), ligado pelo `js/formulario.js`:

- **Máscara** ao digitar, colar e no preenchimento automático (todos passam pelo evento `input`):
  - entram só dígitos e um "+" no começo; letras, outros símbolos e um "+" no meio são descartados;
  - sem "+", o número é do Brasil e ganha o +55. O 0 de longa distância ("062...") e o 55 repetido ("+55 5562...") saem;
  - Brasil: `+55 (62) 99516-0427` (11 dígitos) ou `+55 (62) 3222-0000` (10). Separador só aparece quando já há dígito depois dele;
  - outro país: `+<DDI> <resto>`, com um espaço depois do DDI e o resto sem agrupamento. O fim do DDI sai de uma tabela compacta dos códigos de país da UIT (1 a 3 dígitos; nenhum é prefixo de outro).
- **Cursor:**
  - reposicionado pelo número de dígitos antes dele, então editar no meio não joga o cursor para o fim;
  - Backspace ou Delete sobre ")", " ", "-" ou o espaço depois do DDI apaga o dígito vizinho;
  - o "+" só some quando não há número depois dele.
- **Colar:** um número com "+", ou colado com o campo vazio ou só no "+55 ", troca o conteúdo. O resto é colado no cursor.
- **Validação** (mesmas mensagens de hoje):
  - vazio ou só "+55": "Preencha este campo.";
  - Brasil: DDD da lista da Anatel (67 DDDs) e 10 ou 11 dígitos depois do 55, sendo que com 11 o número começa com 9. Se não, "Digite um telefone válido.";
  - outro país: DDI da tabela e de 10 a 15 dígitos com o DDI. Se não, "Digite um telefone válido.".
- **Envio:** a `/api/lead` recebe E.164 (`"+5562995160427"`). O campo continua mascarado. A função já aceita esse formato (`+` e de 10 a 15 dígitos) e repassa à RD com o código do país.

Versão de cache: `?v=202611191653`.

## Arquivos alterados

```
js/telefone.js        novo: máscara, DDIs, DDDs, validação e E.164
js/formulario.js      usa js/telefone.js (validação, máscara e telefone em E.164 no envio)
css/*, js/*, *.html   ?v=202611191653
relatorios/telefone.md
```

## Testes

Playwright com o Chrome 158 na página real (`npm run dev`). Nada saiu da máquina:

- GTM e Pixel responderam vazio, e a `/api/capi` foi respondida localmente;
- a `/api/lead` e o CRM foram abortados;
- `config.js` com `modo: 'simulado'` e o bloco da 4Selet com `teste: true`, só na resposta ao navegador do teste (ele mostra no console o que enviaria).

**83 de 83 verificações passaram.**

### Máscara

Cada entrada foi testada de três jeitos: digitada no campo vazio, colada no campo vazio e colada no "+55 " do foco (área de transferência de verdade, Ctrl+V). O resultado foi o mesmo nos três, sempre com o cursor no fim:

| Entrada | Campo | E.164 |
|---|---|---|
| `62995160427` | `+55 (62) 99516-0427` | `+5562995160427` |
| `(62) 99516-0427` | `+55 (62) 99516-0427` | `+5562995160427` |
| `062995160427` | `+55 (62) 99516-0427` | `+5562995160427` |
| `5562995160427` | `+55 (62) 99516-0427` | `+5562995160427` |
| `+55 62 99516 0427` | `+55 (62) 99516-0427` | `+5562995160427` |
| `6232220000` | `+55 (62) 3222-0000` | `+556232220000` |
| `+1 305 555 0100` | `+1 3055550100` | `+13055550100` |
| `+351 912 345 678` | `+351 912345678` | `+351912345678` |
| `+44 20 7946 0958` | `+44 2079460958` | `+442079460958` |
| `62a9951b60427` (com letras) | `+55 (62) 99516-0427` | `+5562995160427` |

- **Campo ao carregar:** vazio. Um clique na borda esquerda dá "+55 " com o cursor no fim. Ao sair só com "+55", o campo fica vazio, sem erro e sem parcial.
- **Preenchimento automático do Chrome** (perfil de endereço acionado pelo protocolo de depuração do Chrome):

| Telefone no perfil | No campo | A 4Selet leu |
|---|---|---|
| `+5562995160427` | `+55 (62) 99516-0427` | o mesmo valor |
| `62995160427` | `+55 (62) 99516-0427` | o mesmo valor |
| `+13055550100` | `+1 3055550100` | o mesmo valor |

- **Edição no meio:**

| Ação | Resultado | Cursor |
|---|---|---|
| Backspace no "5" de 99516 | `+55 (62) 9916-0427` | depois de "99" |
| Digitar 7 | `+55 (62) 99716-0427` | depois do 7 |
| Inserir 9 no meio de 3222 | `+55 (62) 32922-0000` | depois do 9, não no fim |

- **Separadores:**
  - Backspace sobre ")" ou sobre o espaço de ") " apaga o 2 do DDD: `+55 (69) 9516-0427`;
  - sobre "-", apaga o 6: `+55 (62) 9951-0427`;
  - Delete sobre "-" apaga o 0: `+55 (62) 9951-6427`;
  - Backspace do fim esvazia o campo em 14 toques (13 dígitos e o "+");
  - Backspace no "+" de `+351 912345678` não mexe no número.
- **Digitar** `62995+16x0427`: o "+" e o "x" do meio são descartados.

### Validação (no envio, com as mensagens de hoje)

| Telefone | Mensagem |
|---|---|
| vazio | Preencha este campo. |
| só "+55 " | Preencha este campo. |
| `+55 (20) 99999-9999` (DDD inválido) | Digite um telefone válido. |
| `+55 (62) 89999-9999` (11 dígitos sem 9) | Digite um telefone válido. |
| `+351 1234` (7 dígitos) | Digite um telefone válido. |
| `+351 123456` (9 dígitos) | Digite um telefone válido. |
| `+351 1234567890123` (16 dígitos) | Digite um telefone válido. |

- **Nos 7 casos:** `aria-invalid` ligado, foco no campo e nenhum envio.
- **Funções:**
  - Brasil aceita 10 e 11 dígitos e recusa 9 e 12;
  - outro país aceita 10 e 15 e recusa 7, 9 e 16;
  - um DDI fora da tabela (+800) é recusado.

### 4Selet e envio (modo simulado)

| Telefone digitado | Parcial (blur do campo) | `submit` | `corpo.telefone` na `/api/lead` |
|---|---|---|---|
| `62995160427` | `+55 (62) 99516-0427` | `+55 (62) 99516-0427` | `+5562995160427` |
| `+1 305 555 0100` | `+1 3055550100` | `+1 3055550100` | `+13055550100` |

O bloco lê o valor mascarado, com o DDI, no parcial e no envio.

**Já era assim antes:** o `submit` da 4Selet sai no clique em enviar, antes da validação da página. Testado com `+55 (20) 99999-9999`: a página recusou e não mandou nada à RD, mas a 4Selet recebeu `submit` com esse telefone. O bloco só confere se há 10 dígitos. Isso não mudou com a máscara e vai avisado no texto para o Hugo.

### Visual (shots/telefone/)

- **Ao carregar** (página inteira, `f887d54` × depois, em 375, 768 e 1440 px):
  - LP: 0, 1 e 0 pixel de diferença. O campo começa vazio, como antes;
  - obrigado: 0 pixel em 375 e 1440. Em 768, uma comparação isolada deu 46 mil pixels com até 2 níveis de 255; tirando cada lado duas vezes, antes × depois dá 0 pixel (ruído de renderização; a página só mudou no `?v`).
- **Formulário:** `form-<largura>-foco.png` (campo com "+55") e `form-<largura>-preenchido.png` (`+55 (62) 99516-0427`). Nenhuma outra mudança.

### CLS

Igual ao `f887d54`: 0 em 375, 768 e 1440, em carga normal e com a pessoa parada nos comprovantes antes do load, com e sem reduced motion.

### Regressão

- **Testes de rastreio da Meta:** 39 de 39 de novo (PageView no ocioso, `event_id`, CompleteRegistration no obrigado, envio com `event_id`/`fbp`/`external_id`).
- **Console:** só os 3 erros do selo do Reclame Aqui por página (CORS em localhost). Nenhum 404.

## Texto para o Hugo

> Oi, Hugo! Entrou na LP da Black (zero7trading.com/black-2026/) a máscara com DDI no campo Telefone que você sugeriu. Os seletores (`#form-lead`, `#nome`, `#email`, `#telefone`, `#z7_campo_b`) e o seu bloco não mudaram. Muda só o formato do `phone` que chega para vocês, no `partial` e no `submit`:
>
> - **Brasil:** `+55 (62) 99516-0427` (celular, 11 dígitos depois do 55) ou `+55 (62) 3222-0000` (fixo, 10 dígitos).
> - **Outros países:** `+<DDI> <número>`, com um espaço depois do DDI e o número só com dígitos, sem agrupamento. Exemplos: `+1 3055550100`, `+351 912345678`, `+44 2079460958`.
> - **Para ter o E.164**, tire tudo que não é dígito e ponha "+" na frente: `+55 (62) 99516-0427` → `+5562995160427`.
> - **No `partial`**, o número pode vir incompleto, porque a pessoa ainda está digitando (ex.: `+55 (62) 9951`).
> - **O "+55":** o campo começa vazio; o "+55 " aparece quando a pessoa entra no campo e some se ela sair sem digitar. Então quem não preencheu o telefone não manda `phone`. A exceção, rara, é quem fecha a página com o cursor no campo sem ter digitado: aí pode chegar `phone: "+55"`.
> - **Validação da página**, antes de mandar para a RD: no Brasil, DDD existente e 10 ou 11 dígitos (com 11, começa com 9); outros países, de 10 a 15 dígitos contando o DDI. Mas o `submit` de vocês sai no clique, antes dessa validação. Por isso pode chegar um `submit` com telefone que a página recusou (ex.: DDD que não existe). Esses leads não chegam à RD.
>
> Qualquer dúvida, me chama.

## Pendência à parte

A edição de `relatorios/lcp-mobile-ajuste.md` (os quatro padrões de bloqueio do Lighthouse) continua fora de commit, esperando o seu ok. Não entrou neste commit.
