import {
  Navigate,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom'
import { AppShell } from './AppShell'
import {
  AiAnalystPage,
  CohortsPage,
  DashboardsPage,
  EventExplorerPage,
  FeatureAdoptionPage,
  FunnelsPage,
  LoginPage,
  ProductHealthPage,
  RealtimePage,
  RetentionPage,
  SegmentationPage,
  UserJourneyPage,
} from './lazyPages'
import { RequireAuth } from './RequireAuth'
import { ROUTES } from './routes'

export const routeObjects: RouteObject[] = [
  { path: ROUTES.login, element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <Navigate to={ROUTES.productHealth} replace />,
          },
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
    ],
  },
]

export const router = createBrowserRouter(routeObjects)
