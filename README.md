# Product Analytics OS

Peça de portfólio: uma plataforma de product analytics (no estilo
PostHog/Mixpanel/Amplitude) com foco em UX, incluindo um **AI Analyst**
que explica variações de métricas ("Por que a conversão caiu esta
semana?") com evidências extraídas dos dados.

> Este é um projeto de portfólio, não um produto real. Não há backend,
> não há dados de usuários reais e não há chamadas a serviços pagos —
> todo o dataset é sintético e gerado no cliente. Veja
> [`docs/decisions/0002-dados-100-mockados.md`](docs/decisions/0002-dados-100-mockados.md).

## Funcionalidades

- **Product Health**: DAU, retenção, conversão e churn com comparação
  vs. período anterior, funil de ativação (User Journey) e detecção de
  anomalias (desvio-padrão sobre a série diária de conversão).
- **AI Analyst**: pergunte "Por que a conversão caiu esta semana?" e
  receba fator primário, evidências e confiança — calculado de verdade
  a partir do dataset, não uma resposta fixa (ver
  [ADR 0005](docs/decisions/0005-ai-analyst-motor-de-regras.md)).
- **Event Explorer**, **Funnels**, **Retention**, **Cohorts** (heatmap),
  **Segmentation**, **User Journey**, **Feature Adoption**, **Realtime
  Events** — as demais seções de analytics, todas navegáveis pela
  sidebar.
- **Dashboards customizáveis**: widgets em drag/drop (dnd-kit) e
  relatórios salvos, persistidos em `localStorage`.
- Filtros de período/device como **URL state**
  (`?range=30d&device=android`), compartilháveis e persistentes entre
  reloads.

## Stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [React Router](https://reactrouter.com) (data router, páginas com
  `React.lazy` — ver [ADR 0007](docs/decisions/0007-code-splitting-por-rota.md))
- [Zustand](https://zustand-demo.pmnd.rs) (tema, dashboard)
- [Recharts](https://recharts.org) (gráficos) + [dnd-kit](https://dndkit.com) (drag/drop)
- [oxlint](https://oxc.rs) (lint) + [Prettier](https://prettier.io) (formatação)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)

Decisões de arquitetura documentadas em [`docs/decisions/`](docs/decisions/).

## Rodando localmente

```bash
npm install
npm run dev
```

## Scripts

| Script                 | Descrição                       |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento     |
| `npm run build`        | Typecheck + build de produção   |
| `npm run typecheck`    | Typecheck isolado (`tsc -b`)    |
| `npm run lint`         | Lint com oxlint                 |
| `npm run format`       | Formata com Prettier            |
| `npm run format:check` | Verifica formatação sem alterar |
| `npm run test`         | Testes em modo watch (Vitest)   |
| `npm run test:run`     | Testes em modo single-run (CI)  |
| `npm run preview`      | Preview do build de produção    |

## Estrutura

```
src/
  app/          shell da aplicação (nav/layout), roteamento, lazyPages.ts
  pages/        1 componente por rota
  features/     lógica + componentes por feature de domínio
                (ai-analyst, dashboards, filters, product-health,
                cohorts, retention, segmentation, events, adoption,
                realtime, funnels)
  components/   design system / componentes de UI compartilhados
  data/         motor de dados sintéticos determinístico + seletores
  store/        estado global (Zustand)
  lib/          utilitários (PRNG, paleta de cores, formatação, cn)
```

## Status

Projeto construído incrementalmente por fases (scaffold → fundação →
fluxo principal → AI Analyst → dashboards/páginas restantes/polimento).
Todas as fases estão completas; acompanhe as decisões em
`docs/decisions/`. Simplificações deliberadas (não são limitações
técnicas, são escopo de portfólio):

- Sem multiusuário/persistência entre dispositivos — tudo local ao
  navegador (dataset determinístico + `localStorage`).
- Widgets do dashboard usam um período fixo (30 dias, todos os
  devices), independente dos filtros de outras páginas.
- "Realtime Events" simula um feed ao vivo sobre um snapshot gerado
  uma vez por sessão, não uma conexão de verdade (não há backend).
