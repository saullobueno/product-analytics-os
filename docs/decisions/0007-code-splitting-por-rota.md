# 0007 - Code-splitting por rota

## Contexto

Depois de adicionar dashboards (dnd-kit) e os gráficos das páginas
restantes (Recharts), o build de produção passou a emitir um único
chunk de 764 KB (231 KB gzip) com aviso do próprio Vite pedindo
code-splitting. Performance é um dos pilares que este projeto quer
demonstrar (ver `docs/decisions/0001-stack-front-end.md`).

## Decisão

- Cada página vira o próprio chunk via `React.lazy`, centralizado em
  `src/app/lazyPages.ts` (não direto em `router.tsx`, para não misturar
  export de componente com export de config de rota no mesmo arquivo —
  isso também elimina o warning de fast-refresh do oxlint).
- `AppShell` envolve o `<Outlet/>` num único `<Suspense>` com um
  fallback textual simples (`<output>Carregando…</output>`) — não é
  por página, é um boundary só para toda a área de conteúdo.
- Resultado: o chunk inicial caiu de 764 KB para ~294 KB (94 KB gzip);
  Recharts (a dependência mais pesada, ~338 KB) só é baixado quando o
  usuário visita uma página com gráfico (Retention, Segmentation,
  Feature Adoption, Dashboards).

## Consequências

- **Gotcha de teste**: `src/App.test.tsx` monta a árvore real de rotas
  (`routeObjects`) e por isso paga o custo de um `import()` dinâmico de
  verdade — na primeira resolução "fria" isso passa do timeout padrão
  do `findBy*`/do teste. Esses dois testes usam um timeout bem maior
  (`LAZY_LOAD_TIMEOUT`, ver `CLAUDE.md`). Testes de página isolada
  (ex.: `ProductHealthPage.test.tsx`) importam o componente direto, não
  via `lazyPages.ts`, e não sofrem com isso.
- Navegar entre páginas mostra um "Carregando…" breve na primeira
  visita a cada rota (chunks ficam em cache do browser depois).
