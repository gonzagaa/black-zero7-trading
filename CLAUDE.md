# LP Black Zero7 Trading — instruções permanentes

## O que é este projeto

Landing page de captação de leads da **Black da Zero7 Trading** (a Zero7 Internacional, prop firm de futuros da CME; site em `zero7trading.com`). A oferta é revelada ao vivo em **27/11/2026 às 12h**; até lá a página só coleta nome, e-mail e telefone e envia para a RD Station.

Endereço de publicação: **https://zero7trading.com/black-2026/**.

São duas páginas pequenas:

1. `index.html`: hero com formulário, dobra de comprovantes de pagamento e rodapé.
2. `obrigado/index.html`: confirmação do cadastro.

HTML, CSS e JS puros. Sem framework e sem etapa de build.

## Fontes da verdade (em ordem)

1. `docs/copy.md`: os textos. **São lei: exatamente esses, nada a mais e nada a menos.**
2. `docs/design-aprovado.md` e `_referencia/prototipo/`: o visual aprovado em 13/11. Valem por cima de `docs/marca.md`.
2b. `docs/marca.md`: cores, forma, tipografia e o desenho de cada dobra.
3. `docs/rdstation.md`: como o formulário envia os dados.
4. `../Zero7-Internacional/`: o site oficial (rodapé, botão, tokens). **Só leitura. Nunca altere nada fora desta pasta.** Única exceção, aprovada em 16/11/2026: na Fase 2, criar `backend/api/lead.js` e atualizar `backend/README.md` e `backend/.env.example` (ver `docs/rdstation.md`). Nada mais naquele repositório.

`_referencia/` guarda cópias do rodapé e do botão do site, tiradas em 13/11/2026. Se divergirem do site, vale o site.

## Fluxo de trabalho (obrigatório)

1. O trabalho está em `docs/fases.md`. Faça somente a fase pedida.
2. Ao terminar: capturas, relatório em `relatorios/fase-N.md`, resumo no chat e **pare**.
3. A fase seguinte só começa com "Fase N aprovada" por escrito.
4. Um commit por fase (`fase N: <resumo>`); correções em `fase N (ajuste): ...`.
5. Se faltar uma decisão que não está escrita (um texto, um dado, um comportamento), **pergunte e não invente**.

## Regras invioláveis

1. **Copy.** Palavra por palavra. Os únicos textos fora da copy são os da tabela "Textos que a copy não traz" em `docs/copy.md`.
2. **Formulário.** Só três campos: Nome, E-mail e Telefone. Não acrescente campo, caixa de aceite ou texto de apoio sem pedido explícito.
3. **Lead não se perde.** O redirecionamento para o obrigado só acontece depois do sucesso do envio. Regras completas em `docs/rdstation.md`.
4. **Identidade.** Preto, verde da Zero7 Trading e corte diagonal. Nada do laranja da Black nacional e nada de dourado (recusado; ver `docs/design-aprovado.md`).
5. **Nenhuma credencial no front nem em repositório.** A Chave de API da RD dá acesso total à conta: ela só existe na variável `RD_API_KEY` da Vercel, colocada pelo Gustavo. Nunca peça o valor, nunca o escreva em arquivo, log ou relatório. O token público antigo da RD também não é usado.
6. **Dados pessoais.** Nome, e-mail e telefone nunca vão para a URL, para o dataLayer ou para o console em modo real, nem para os logs da função na Vercel.
7. **Terceiros.** Nenhum script externo além dos listados em `docs/fases.md`.
8. **Caminhos relativos.** Nada começa com `/`.
9. **Não publique.** Deploy é decisão do Gustavo.

## Exceções aprovadas ao "mesmo rodapé do site"

Aprovadas pelo Gustavo em 13/11/2026 (Fase 1, ajuste). Além dos três ajustes de `docs/marca.md`:

1. "Cookie" e "Políticas de Uso" são texto sem link (no site são `<a href="">`, que recarrega a página).
2. O ano é "© 2026" (no site, "© 2025").
3. Ícones sociais com `aria-label` ("Instagram", "TikTok", "Facebook") e área de toque de 44 × 44 px; logo com `alt="Zero7"`.

## Pendências abertas (não resolva sozinho; pergunte)

| # | Pendência | Estado |
|---|---|---|
| 1 | RD Station | **Resolvida em 16/11.** Conta, rota, identificador e domínio de e-mail em `docs/rdstation.md`. Falta só a Chave de API na Vercel (Gustavo) e a base legal (marketing) |
| 2 | WhatsApp no obrigado × formulário | **Resolvida em 16/11:** a copy ganhou o campo "Telefone:" |
| 3 | Imagens dos comprovantes | o Gustavo vai enviar; entram em `assets/comprovantes/` |
| 4 | Endereço de publicação | **Resolvida em 16/11:** `https://zero7trading.com/black-2026/` |
| 5 | Faixa "Formas de Pagamento" do rodapé do site | fora por enquanto; ver `docs/marca.md` |
| 6 | O rodapé do site mostra `support@zero7trading.com` e a copy do obrigado usa `contact@zero7trading.com` | mantidos os dois, cada um no seu lugar |

## Verificação

- `npm run dev` → **http://localhost:5503** (sempre esta porta: a revisão é feita nesse endereço).
- Capturas em 360, 390, 768, 1024, 1280, 1440 e 1920 px, das duas páginas, em `shots/fase-N/`.
- Console sem erros, rede sem 404, sem rolagem horizontal.
