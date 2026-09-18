/**
 * Paleta de dados validada pela skill dataviz (referência em
 * `references/palette.md`). Fonte única em TS para uso em gráficos
 * (Recharts recebe cor como valor, não como classe Tailwind). Os
 * tokens semânticos de chrome/UI em `src/index.css` (`@theme`) devem
 * ser mantidos em sincronia manual com estes valores — ver ADR 0003.
 */

export type ThemeMode = 'light' | 'dark'

export const categorical = [
  { name: 'blue', light: '#2a78d6', dark: '#3987e5' },
  { name: 'orange', light: '#eb6834', dark: '#d95926' },
  { name: 'aqua', light: '#1baf7a', dark: '#199e70' },
  { name: 'yellow', light: '#eda100', dark: '#c98500' },
  { name: 'magenta', light: '#e87ba4', dark: '#d55181' },
  { name: 'green', light: '#008300', dark: '#00b300' },
  { name: 'violet', light: '#4a3aa7', dark: '#9085e9' },
  { name: 'red', light: '#e34948', dark: '#e66767' },
] as const

export function categoricalScale(mode: ThemeMode): string[] {
  return categorical.map((c) => c[mode])
}

/** Rampa sequencial (magnitude contínua, ex.: heatmap de retenção). */
export const sequentialBlue = {
  100: '#cde2fb',
  150: '#b7d3f6',
  200: '#9ec5f4',
  250: '#86b6ef',
  300: '#6da7ec',
  350: '#5598e7',
  400: '#3987e5',
  450: '#2a78d6',
  500: '#256abf',
  550: '#1c5cab',
  600: '#184f95',
  650: '#104281',
  700: '#0d366b',
} as const

export const diverging = {
  blue: sequentialBlue[450],
  red: '#e34948',
  midpoint: { light: '#f0efec', dark: '#383835' },
} as const

/**
 * `warning`/`serious` são fixas entre temas — nunca reutilizar para
 * série categórica. `good`/`critical` variam: o dark mode (derivado de
 * #27272a, mais claro que o preto quase puro de antes) precisa de
 * tons mais claros para manter contraste ≥4.5:1 (WCAG 1.4.3 — ambos
 * renderizam como texto real via Badge/StatTile, não só marca
 * gráfica) contra `chrome.surface.dark` — mesmo tom de vermelho usado
 * em `chrome.deltaBad.dark`.
 */
export const status = {
  good: { light: '#0ca30c', dark: '#0eb90e' },
  warning: '#fab219',
  serious: '#ec835a',
  critical: { light: '#d03b3b', dark: '#eb8484' },
} as const

/**
 * Escala neutra do dark mode derivada de #27272a (a cor mais escura,
 * `plane.dark`): mesmo matiz/saturação (HSL 240°, 4%), variando só a
 * luminosidade — ver comentário equivalente em src/index.css.
 */
export const chrome = {
  surface: { light: '#fcfcfb', dark: '#333338' },
  plane: { light: '#f9f9f7', dark: '#27272a' },
  inkPrimary: { light: '#0b0b0b', dark: '#f8f8f9' },
  inkSecondary: { light: '#52514e', dark: '#cacace' },
  inkMuted: { light: '#898781', dark: '#a0a0a7' },
  gridline: { light: '#e1e0d9', dark: '#45454a' },
  baseline: { light: '#c3c2b7', dark: '#58585f' },
  deltaGood: { light: '#006300', dark: status.good.dark },
  deltaBad: { light: status.critical.light, dark: status.critical.dark },
  border: {
    light: 'rgba(11,11,11,0.10)',
    dark: 'rgba(255,255,255,0.10)',
  },
} as const
