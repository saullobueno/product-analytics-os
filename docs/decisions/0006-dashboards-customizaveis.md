# 0006 - Dashboards customizáveis: dnd-kit + Zustand persistido

## Contexto

O produto pede dashboards customizáveis com widgets em drag/drop e
"saved reports". Já existe `useHeadlineMetrics` (fase 3, reaproveitado
da Product Health) com os cálculos de DAU/conversão/churn/retenção/
funil — os widgets do dashboard não deveriam recalcular essa lógica.

## Decisão

- **dnd-kit** (`@dnd-kit/core` + `@dnd-kit/sortable`) para o
  reordenamento drag/drop, em vez de implementar drag manual com
  eventos de mouse — é a lib padrão de fato para isso em React, com
  bom suporte a acessibilidade (teclado) de fábrica.
- Layout do dashboard e relatórios salvos vivem em
  `useDashboardStore` (Zustand + `persist`, `src/features/dashboards/`)
  — mesmo padrão do `themeStore` (ADR 0003), não um store novo do zero.
- Widgets do dashboard usam `useHeadlineMetrics('30d', 'all')` — um
  período/segmento fixo, não os filtros da Product Health. Um
  dashboard "at a glance" não deveria mudar de métrica toda vez que
  alguém mexe num filtro de outra página; se isso virar um requisito
  real, o próximo passo natural é guardar `range`/`device` por widget,
  não globalmente.
- "Salvar como relatório" grava um snapshot da lista de widgets atual
  (`SavedReport.widgets`), não uma referência — carregar um relatório
  antigo continua funcionando mesmo que o dashboard "ao vivo" tenha
  mudado depois.

## Consequências

- Testado em duas camadas: `dashboardStore.test.ts` cobre a lógica
  (add/remove/reorder/save/load) sem depender de simular um drag real;
  `DashboardsPage.test.tsx` cobre a integração via clique (adicionar,
  remover, salvar, carregar). O gesto de arrastar em si foi validado
  manualmente via Playwright (não há teste automatizado de drag —
  simular ponteiro com jsdom é fràgil e de baixo retorno aqui).
- `crypto.randomUUID()` é usado para ids de widget/relatório — funciona
  em browser e em jsdom (Node ≥ 19), sem dependência extra.
