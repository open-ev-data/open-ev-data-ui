import { Link } from 'react-router-dom';
import { SearchBar } from '@/features/vehicle-search';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import logoMini from '@/assets/open-ev-data-logo-mini.png';
import styles from './LayoutHeader.module.css';

export function LayoutHeader({ className }: { className?: string }) {
  return (
    <header className={cn(styles.header, className)}>
      <Link to="/" className={styles.logo}>
        <img src={logoMini} alt="OpenEV Data" className={styles.icon} />
        <span>OpenEV Data</span>
      </Link>

      <div className={styles.searchContainer}>
        <SearchBar />
      </div>

      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open('https://github.com/open-ev-data', '_blank')}
        >
          GitHub
        </Button>
      </div>
    </header>
  );
}
