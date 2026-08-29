# 0001 - Stack de front-end

## Contexto

O projeto é uma peça de portfólio (não um produto real) que demonstra
boas práticas de front-end: estado complexo, testes, acessibilidade e
performance, aplicadas a um domínio de product analytics (dashboards,
funis, retenção, cohorts, um "AI Analyst"). Não há requisito de SEO ou
SSR — é uma ferramenta interna de analytics, tipicamente atrás de login.
Não haverá backend real (ver [0002](0002-dados-100-mockados.md)).

## Decisão

- **Vite 8 + React 19 + TypeScript** como base da SPA. Vite oferece dev
  server rápido e build otimizado sem necessidade de SSR.
- **TypeScript fixado em `~6.0.x`** (não a major `7.x`, que é a recém
  lançada reescrita nativa "Corsa"), seguindo o próprio template oficial
  do Vite (`create-vite`), que já faz esse pin — o ecossistema de
  ferramentas (linters type-aware, etc.) ainda está migrando para as
  diferenças de comportamento da v7.
- **oxlint** (linter em Rust, plugins `react`, `typescript`, `oxc`,
  `jsx-a11y`, `vitest`, `import` habilitados) no lugar de ESLint —
  é o padrão do template atual do Vite, é ordens de magnitude mais
  rápido, e cobre as regras que importam aqui (regras de hooks,
  acessibilidade JSX, problemas de testes).
- **Prettier** para formatação (oxlint não formata).
- **Tailwind CSS v4** (config CSS-first via `@theme`, sem
  `tailwind.config.js`) para estilização.
- **Vitest + Testing Library + jsdom** para testes unitários/integração
  (nativo do ecossistema Vite, mesma pipeline de transform do app).

## Consequências

- SPA pura, sem SSR/SEO — aceitável para uma ferramenta de analytics
  que não precisa ser indexada.
- oxlint tem um ecossistema de plugins menor que ESLint, mas cobre
  react/hooks/a11y/vitest, que é o que este projeto precisa; se surgir
  uma regra específica que só exista em ESLint, isso será revisitado.
- TypeScript abaixo da última major disponível é uma escolha deliberada
  de estabilidade, não desconhecimento — reavaliar quando o ecossistema
  (oxlint, Vite, Vitest) confirmar suporte pleno à v7.
