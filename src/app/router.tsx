import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './layouts';
import { PageLoader } from '@/shared/ui/PageLoader/PageLoader';

const HomePage = lazy(() =>
  import('@/pages/home').then((module) => ({ default: module.HomePage }))
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
      // Add more routes here later
    ],
  },
]);
