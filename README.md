# Product Analytics OS

Peça de portfólio: uma plataforma de product analytics (no estilo
PostHog/Mixpanel/Amplitude) com foco em UX, incluindo um **AI Analyst**
que explica variações de métricas ("Por que a conversão caiu esta
semana?") com evidências extraídas dos dados.

> Este é um projeto de portfólio, não um produto real. Não há backend,
> não há dados de usuários reais e não há chamadas a serviços pagos —
> todo o dataset é sintético e gerado no cliente. Veja
> [`docs/decisions/0002-dados-100-mockados.md`](docs/decisions/0002-dados-100-mockados.md).

## Stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
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
  app/          shell da aplicação, roteamento, layout
  pages/        páginas por rota
  features/     lógica + componentes por feature de domínio
  components/   design system / componentes de UI compartilhados
  data/         motor de dados sintéticos (determinístico)
  store/        estado global (Zustand)
  lib/          utilitários (URL state, formatação)
  types/        tipos compartilhados
```

## Status

Projeto em construção incremental por fases (scaffold → fundação →
fluxo principal → AI Analyst → dashboards/polimento). Acompanhe o
progresso nos commits e nos ADRs em `docs/decisions/`.
