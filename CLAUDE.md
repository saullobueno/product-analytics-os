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
  app/          shell da aplicação, roteamento, layout
  pages/        páginas por rota
  features/     lógica + componentes por feature de domínio
  components/   design system / componentes de UI compartilhados
  data/         motor de dados sintéticos (determinístico)
  store/        estado global (Zustand)
  lib/          utilitários (URL state, formatação)
  types/        tipos compartilhados
  test/         setup global de testes (Vitest)
```

Esta seção será expandida a cada fase à medida que convenções reais
(estado, URL sync, geração de dados) forem estabelecidas — não deixar
para atualizar só no final.
