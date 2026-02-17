import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '@/features/vehicle-search';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import logoMini from '@/assets/open-ev-data-logo-mini.png';
import styles from './LayoutHeader.module.css';
import { Info } from 'lucide-react';
import { AboutModal } from '@/widgets/AboutModal';

export function LayoutHeader({ className }: { className?: string }) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(() => {
    try {
      const hasSeen = localStorage.getItem('hasSeenAboutModal');
      return !hasSeen;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isAboutModalOpen) {
      localStorage.setItem('hasSeenAboutModal', 'true');
    }
  }, [isAboutModalOpen]);

  return (
    <>
      <header className={cn(styles.header, className)}>
        <Link to="/" className={styles.logo}>
          <img src={logoMini} alt="OpenEV Data" className={styles.icon} />
          <span className={styles.brandName}>OpenEV</span>
          <span className={styles.brandSuffix}>Data Explorer</span>
        </Link>

        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            className={styles.iconButton}
            onClick={() => setIsAboutModalOpen(true)}
            aria-label="About OpenEV Data"
          >
            <Info size={20} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={styles.contributeButton}
            onClick={() => window.open('https://github.com/open-ev-data', '_blank')}
          >
            Contribute on GitHub
          </Button>
        </div>
      </header>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
}
