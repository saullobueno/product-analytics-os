# CLAUDE.md

Contexto para agentes trabalhando neste repositório. Veja também
`README.md` (visão de produto/stack) e `docs/decisions/` (ADRs).

## Natureza do projeto

Peça de portfólio de front-end. **Não é um produto real**: sem backend,
sem dados de usuário reais, sem chamadas a serviços pagos. Todo dataset
é sintético e determinístico (seed fixa) — ver ADR 0002. O "AI Analyst"
é um motor de regras determinístico sobre os dados mockados, não uma
chamada real a um provedor de LLM — ver ADR a ser adicionada na fase 4.

## Barra de qualidade

Antes de considerar qualquer mudança pronta, rodar (nessa ordem):

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Nunca afirmar que um desses passou sem realmente ter executado e visto
o resultado. Cada fase do projeto termina num commit com todos esses
comandos verdes.

## Convenções

- Alias de import `@/*` aponta para `src/*` (configurado em
  `tsconfig.app.json` e `vite.config.ts`).
- `baseUrl` foi deliberadamente omitido do `tsconfig.app.json` (é
  deprecated a partir do TypeScript 7) — `paths` funciona sem ele em
  `moduleResolution: "bundler"`.
- Sem arquivo `tailwind.config.js`: Tailwind v4 usa config CSS-first via
  `@theme` em `src/index.css`.
- Dependências: nunca resolver versão de memória — confira o registry
  (`npm view <pkg> version` / `dist-tags`) antes de adicionar ao
  `package.json`, e confira `engines` quando o ambiente Node local for
  mais antigo que o mais recente do pacote (ex.: jsdom 30 exige Node
  ≥24.15, por isso o projeto fixa jsdom em 29.x).

## Estrutura de pastas

```
src/
  app/          AppShell (nav/layout), router.tsx, routes.ts, useThemeSync
  pages/        1 componente por rota (hoje a maioria é PlaceholderPage)
  features/     lógica + componentes por feature de domínio (fase 3+)
  components/   design system (Card, StatTile, Badge, ...)
  data/         motor de dados sintéticos determinístico + selectors.ts
  store/        estado global (Zustand) — hoje só themeStore
  lib/          prng.ts, palette.ts, cn.ts (utilitários sem estado)
  test/         setup global de testes (Vitest)
```

Ver ADR [0003](docs/decisions/0003-fundacao-tecnica.md) para o porquê
de cada uma dessas escolhas.

## Motor de dados (`src/data/`)

- Nunca ler `dataset.dailyMetrics`/`dataset.funnel` bruto de dentro de
  um componente de página — sempre passar pelos seletores em
  `selectors.ts` (`funnelTotals`, `averageWeek1Retention`,
  `conversionRateByDevice`, etc.). Se faltar um seletor, adicionar um
  novo lá, não recalcular inline na página.
- `getDataset()` é memoizado em módulo; `resetDatasetCache()` existe só
  para isolar testes entre si.
- A regressão de conversão mobile pós-release (`generateFunnel.ts`) é
  dado real do gerador, não texto fixo — o motor de insight do AI
  Analyst (fase 4) deve ler os números daí, nunca hardcodar a resposta
  do exemplo do enunciado do produto.

## Tokens de cor (`src/index.css` + `src/lib/palette.ts`)

- **Fonte dupla deliberada** (ver ADR 0003): hex em `palette.ts` (TS,
  para props de cor em gráficos) e em `index.css` (`@theme` do
  Tailwind, para classes utilitárias). Ao mudar uma cor, mudar nos dois
  lugares.
- Tema padrão é dark; usar sempre os tokens semânticos (`bg-surface`,
  `text-ink`, `text-ink-secondary`, `text-delta-good`/`text-delta-bad`,
  `bg-good`/`warning`/`serious`/`critical`) — nunca hex direto em
  componentes.
- Qualquer gráfico novo: seguir a skill `dataviz` (rodar
  `validate_palette.js` antes de usar uma paleta categórica nova;
  status sempre com ícone + label, nunca só cor).

## Estado e rotas

- Estado verdadeiramente global vai em `src/store/` (Zustand). Estado
  de uma página fica local a ela.
- Testes de componente que dependem de um store Zustand devem resetar
  o estado no `beforeEach` (ver `themeStore.test.ts`) — os stores são
  singletons de módulo.
- Rotas ficam em `src/app/routes.ts` (`ROUTES` + `NAV_ITEMS`) e
  `src/app/router.tsx` (`routeObjects`, exportado separado do
  `router` do browser para os testes montarem `createMemoryRouter`).
