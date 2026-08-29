import { lazy } from 'react'

// Code-splitting por rota: cada página vira o próprio chunk, carregado
// só quando o usuário navega até ela (ver ADR de performance da fase 5).
export const ProductHealthPage = lazy(() =>
  import('@/pages/ProductHealthPage').then((m) => ({
    default: m.ProductHealthPage,
  })),
)
export const EventExplorerPage = lazy(() =>
  import('@/pages/EventExplorerPage').then((m) => ({
    default: m.EventExplorerPage,
  })),
)
export const FunnelsPage = lazy(() =>
  import('@/pages/FunnelsPage').then((m) => ({ default: m.FunnelsPage })),
)
export const RetentionPage = lazy(() =>
  import('@/pages/RetentionPage').then((m) => ({ default: m.RetentionPage })),
)
export const CohortsPage = lazy(() =>
  import('@/pages/CohortsPage').then((m) => ({ default: m.CohortsPage })),
)
export const SegmentationPage = lazy(() =>
  import('@/pages/SegmentationPage').then((m) => ({
    default: m.SegmentationPage,
  })),
)
export const UserJourneyPage = lazy(() =>
  import('@/pages/UserJourneyPage').then((m) => ({
    default: m.UserJourneyPage,
  })),
)
export const FeatureAdoptionPage = lazy(() =>
  import('@/pages/FeatureAdoptionPage').then((m) => ({
    default: m.FeatureAdoptionPage,
  })),
)
export const RealtimePage = lazy(() =>
  import('@/pages/RealtimePage').then((m) => ({ default: m.RealtimePage })),
)
export const DashboardsPage = lazy(() =>
  import('@/pages/DashboardsPage').then((m) => ({
    default: m.DashboardsPage,
  })),
)
export const AiAnalystPage = lazy(() =>
  import('@/pages/AiAnalystPage').then((m) => ({ default: m.AiAnalystPage })),
)
