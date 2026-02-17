import { Outlet } from 'react-router-dom';
import { LayoutHeader } from '@/widgets/LayoutHeader';
import { BottomNav } from '@/widgets/BottomNav';
import { ScrollToTop } from '@/shared/lib/scroll-to-top';
import { ScrollToTopButton } from '@/shared/ui';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <ScrollToTop />
      <ScrollToTopButton />
      <LayoutHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
