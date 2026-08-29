# 0004 - Filtros de período/segmento como URL state

## Contexto

O produto pede "filtros persistentes" e "URL state" como features
explícitas. A tela Product Health (fase 3) precisa de um filtro de
período (7/30/90 dias) e de device, que outras páginas (Funnels,
Retention, Segmentation) vão reaproveisar nas fases seguintes.

## Decisão

- Filtros vivem na **URL** (`?range=30d&device=android`), não em
  Zustand/Context — `useProductFilters` (`src/features/filters/`) lê e
  escreve via `useSearchParams` do React Router, com `replace: true`
  (não polui o histórico de navegação a cada clique de filtro).
- Valores inválidos ou ausentes na URL caem num default seguro (`30d` /
  `all`) em vez de lançar erro — a página sempre renderiza mesmo com
  uma URL editada à mão.
- A tradução "preset → intervalo de datas real" (`rangeFromPreset`) e
  "intervalo → intervalo anterior equivalente" (`previousRange`) vive
  em `src/data/selectors.ts`, não no hook de filtro — o hook só cuida
  de ler/escrever a URL; a semântica de datas fica onde o resto da
  lógica de dataset já mora.
- `FilterBar` (componente) é puramente controlado: recebe
  `ProductFilters` (o retorno do hook) via props — qualquer página nova
  que precise dos mesmos filtros só chama `useProductFilters()` e
  renderiza `<FilterBar {...filters} />`.

## Consequências

- Filtro é compartilhável por link e sobrevive a reload — de graça, por
  ser URL.
- Páginas que usam o mesmo filtro (Funnels, Retention, Segmentation nas
  fases seguintes) reaproveitam o hook e o componente sem duplicar
  lógica de parsing de query string.
- "Comparação de período" (`previousRange` + `percentChange`) já sai
  de graça dessa mesma decisão — os deltas nos `StatTile` da Product
  Health usam exatamente essas funções.
