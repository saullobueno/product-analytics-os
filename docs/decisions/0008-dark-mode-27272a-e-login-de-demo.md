# 0008 - Dark mode derivado de #27272A + login de demonstração

## Contexto

Pedido de portfólio: redesenhar o dark mode (tema padrão) a partir de
`#27272A` como a cor mais escura, com as demais cores do "chrome"
(fundo de cards, linhas de grade, texto) derivadas dela — e adicionar
uma tela de login coerente com o fato de o projeto não ter backend
([ADR 0002](0002-dados-100-mockados.md)).

## Decisão

- **Paleta neutra do dark mode**: `--color-plane` (fundo) e
  `--color-surface` (cards) passam a `#27272a`/`#333338`, e
  `--color-gridline`/`--color-baseline`/`--color-ink*` são gerados a
  partir do mesmo matiz/saturação de `#27272a` (HSL 240°, 4%),
  variando só a luminosidade — ver comentário em `src/index.css`.
- Como esse fundo é mais claro que o preto quase puro de antes
  (`#0d0d0d`/`#1a1a19`), alguns tons que antes tinham contraste
  suficiente deixaram de ter: `--color-good`, `--color-critical` (e os
  alias `--color-delta-good`/`--color-delta-bad`, que renderizam como
  texto real em `StatTile`/`Badge`, não só marca gráfica de gráfico —
  a régua é WCAG 1.4.3, ≥4.5:1) e `--color-series-6` (verde de série
  categórica, ≥3:1 por ser só marca gráfica). Esses tokens ganharam
  variantes mais claras só no dark mode; os valores originais
  continuam no light mode (`:root[data-theme='light']`), calibrado
  para um fundo quase-branco.
- **Login de demonstração** (`/login`, `src/pages/LoginPage.tsx`):
  como não há backend, não existe autenticação real. A credencial é
  fixa (`src/features/auth/credentials.ts`), pré-preenchida nos campos
  do formulário e repetida no rodapé do próprio card — visitantes só
  precisam clicar em "Entrar". Estado de sessão em
  `src/store/authStore.ts` (Zustand + `persist`, mesmo padrão de
  `themeStore`); rotas do app ficam atrás de um guard
  (`src/app/RequireAuth.tsx`) que redireciona para `/login` quando
  deslogado.

## Consequências

- Duas fontes de cor continuam em sincronia manual
  (`src/index.css`/`src/lib/palette.ts`, ver ADR 0003) — `status.good`
  e `status.critical` deixaram de ser fixos entre temas em
  `palette.ts` e passaram a `{ light, dark }`, como já era o caso de
  `chrome.deltaGood`/`chrome.deltaBad`.
- `App.test.tsx` precisa autenticar o `authStore` no `beforeEach` antes
  de montar `routeObjects` (senão toda rota redireciona para
  `/login`); ganhou um teste extra cobrindo o próprio redirecionamento
  quando deslogado.
- Simplificação deliberada, não é uma falha de segurança a corrigir: a
  credencial de demo é pública de propósito (é o ponto — ver README).
