export const ROUTES = {
  login: '/login',
  productHealth: '/product-health',
  events: '/events',
  funnels: '/funnels',
  retention: '/retention',
  cohorts: '/cohorts',
  segmentation: '/segmentation',
  journey: '/journey',
  adoption: '/adoption',
  realtime: '/realtime',
  dashboards: '/dashboards',
  aiAnalyst: '/ai-analyst',
} as const

export interface NavItem {
  path: string
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  { path: ROUTES.productHealth, label: 'Product Health' },
  { path: ROUTES.events, label: 'Event Explorer' },
  { path: ROUTES.funnels, label: 'Funnels' },
  { path: ROUTES.retention, label: 'Retention' },
  { path: ROUTES.cohorts, label: 'Cohorts' },
  { path: ROUTES.segmentation, label: 'Segmentation' },
  { path: ROUTES.journey, label: 'User Journey' },
  { path: ROUTES.adoption, label: 'Feature Adoption' },
  { path: ROUTES.realtime, label: 'Realtime' },
  { path: ROUTES.dashboards, label: 'Dashboards' },
  { path: ROUTES.aiAnalyst, label: 'AI Analyst' },
]
