import { AiAnalystPage } from '@/pages/AiAnalystPage'
import { CohortsPage } from '@/pages/CohortsPage'
import { DashboardsPage } from '@/pages/DashboardsPage'
import { EventExplorerPage } from '@/pages/EventExplorerPage'
import { FeatureAdoptionPage } from '@/pages/FeatureAdoptionPage'
import { FunnelsPage } from '@/pages/FunnelsPage'
import { ProductHealthPage } from '@/pages/ProductHealthPage'
import { RealtimePage } from '@/pages/RealtimePage'
import { RetentionPage } from '@/pages/RetentionPage'
import { SegmentationPage } from '@/pages/SegmentationPage'
import { UserJourneyPage } from '@/pages/UserJourneyPage'
import {
  Navigate,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom'
import { AppShell } from './AppShell'
import { ROUTES } from './routes'

export const routeObjects: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Navigate to={ROUTES.productHealth} replace /> },
      { path: ROUTES.productHealth, element: <ProductHealthPage /> },
      { path: ROUTES.events, element: <EventExplorerPage /> },
      { path: ROUTES.funnels, element: <FunnelsPage /> },
      { path: ROUTES.retention, element: <RetentionPage /> },
      { path: ROUTES.cohorts, element: <CohortsPage /> },
      { path: ROUTES.segmentation, element: <SegmentationPage /> },
      { path: ROUTES.journey, element: <UserJourneyPage /> },
      { path: ROUTES.adoption, element: <FeatureAdoptionPage /> },
      { path: ROUTES.realtime, element: <RealtimePage /> },
      { path: ROUTES.dashboards, element: <DashboardsPage /> },
      { path: ROUTES.aiAnalyst, element: <AiAnalystPage /> },
    ],
  },
]

export const router = createBrowserRouter(routeObjects)
