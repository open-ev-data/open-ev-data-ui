import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './layouts';
import { PageLoader } from '@/shared/ui/PageLoader/PageLoader';

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));

const VehicleDetailPage = lazy(() =>
  import('@/pages/vehicle-detail').then((m) => ({ default: m.VehicleDetailPage }))
);

const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage }))
);

export const router = createBrowserRouter([
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
        path: 'vehicle/:code',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VehicleDetailPage />
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
]);
