import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './layouts';
import { PageLoader } from '@/shared/ui/PageLoader/PageLoader';

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));

const VehicleDetailPage = lazy(() =>
  import('@/pages/vehicle-detail').then((m) => ({ default: m.VehicleDetailPage }))
);

const ComparePage = lazy(() => import('@/pages/compare').then((m) => ({ default: m.ComparePage })));

const NotFoundPage = lazy(() =>
  import('@/pages/not-found/ui/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          ),
        },
        {
          path: 'vehicles/:code',
          element: (
            <Suspense fallback={<PageLoader />}>
              <VehicleDetailPage />
            </Suspense>
          ),
        },
        {
          path: 'compare',
          element: (
            <Suspense fallback={<PageLoader />}>
              <ComparePage />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: (
            <Suspense fallback={<PageLoader />}>
              <NotFoundPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
