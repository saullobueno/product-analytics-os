# 0003 - Fundação técnica: motor de dados, tokens, estado, rotas

## Contexto

Antes do fluxo vertical principal (fase 3), o projeto precisa de uma
base compartilhada: como os dados sintéticos são gerados e consumidos,
como as cores/tokens de UI são definidos, como o estado global (tema,
mais adiante filtros) é gerenciado, e como as páginas são organizadas
em rotas.

## Decisões

### Motor de dados (`src/data/`)

- PRNG determinístico próprio (`src/lib/prng.ts`, mulberry32) em vez de
  uma dependência — é ~15 linhas e evita mais uma dependência para uma
  necessidade tão pequena.
- O dataset é uma janela móvel de 90 dias terminando na data real do
  sistema (`datasetEndDate()`), memoizado em módulo
  (`getDataset()`/`resetDatasetCache()` em `src/data/index.ts`).
- A regressão de conversão mobile citada no diferencial do produto (o
  AI Analyst, fase 4) é uma causa raiz **real**, embutida no gerador de
  funil (`generateFunnel.ts`): a partir do release `2.4.0` (8 dias
  antes do fim da janela), o abandono no passo "onboarding" do Android
  aumenta 50% (`ANDROID_ONBOARDING_ABANDONMENT_MULTIPLIER`). Isso é
  verificado em teste (`dataset.test.ts`), não é só texto decorativo —
  o AI Analyst vai calcular os números reais a partir disso, não
  reproduzir um texto fixo.
- Camada de seletores (`src/data/selectors.ts`) separa "dataset bruto"
  de "métrica derivada" (conversão, retenção média, drop-off por
  etapa) — páginas e o AI Analyst consomem seletores, não o dataset
  bruto diretamente.

### Tokens de cor (`src/index.css` + `src/lib/palette.ts`)

- Paleta validada pela skill `dataviz` (categórica, sequencial,
  diverging, status, chrome) — rodada pelo validador
  (`scripts/validate_palette.js`) nos dois modos antes de ser adotada.
- **Duplicação deliberada**: os valores existem em dois lugares —
  `src/lib/palette.ts` (TS, para gráficos que recebem cor como valor
  via props, ex.: Recharts) e `src/index.css` (tokens `@theme` do
  Tailwind v4, para classes utilitárias como `bg-surface`,
  `text-delta-good`). Tailwind v4 não importa TS em tempo de build, e
  duplicar ~30 valores de hex é mais simples do que um passo de geração
  de CSS a partir do TS para um projeto deste tamanho. Se os dois
  arquivos divergirem, é bug — não há terceira fonte de verdade.
- Tema padrão **dark**; light via atributo `data-theme="light"` no
  `<html>`, sincronizado pelo `themeStore` (Zustand, `src/store/`) via
  `useThemeSync`.

### Estado global (`src/store/`)

- **Zustand** em vez de Context/Redux: a maior parte do estado deste
  projeto é local a cada página (fase 3+); o que é genuinamente global
  é pequeno (tema agora; filtros de data/segmento na fase 3) e Zustand
  evita boilerplate de Context/reducer para isso, com persistência em
  `localStorage` via middleware `persist` sem código extra.

### Rotas (`src/app/`)

- **react-router-dom** (data router, `createBrowserRouter`) com um
  `AppShell` único (sidebar + `<Outlet/>`) envolvendo todas as rotas.
  `routeObjects` é exportado separado do router do browser
  especificamente para os testes poderem montar um
  `createMemoryRouter` com as mesmas rotas, sem depender de
  `window.history` real.
- Páginas (`src/pages/`) hoje são placeholders (`PlaceholderPage`) para
  todas as seções exceto o conteúdo real que chega na fase 3 (Product
  Health) e fases seguintes — a rota e a navegação já existem para o
  produto ser navegável desde já.

## Consequências

- Qualquer página nova só precisa: 1 seletor em `selectors.ts` (se for
  métrica nova), 1 componente de página em `src/pages/`, 1 entrada em
  `src/app/routes.ts` + `router.tsx`.
- A duplicação de paleta CSS/TS exige disciplina manual — se isso virar
  fonte de bugs reais, revisitar com um passo de geração de tokens.
- Zustand sem Context significa que testes de componente que dependem
  de estado global (tema) devem resetar o estado do store manualmente
  entre testes (`useThemeStore.setState(...)`) — já é o padrão adotado
  em `themeStore.test.ts`.
