import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '@/features/vehicle-search';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import logoMini from '@/assets/open-ev-data-logo-mini.png';
import styles from './LayoutHeader.module.css';
import { Info, Github } from 'lucide-react';
import { AboutModal } from '@/widgets/AboutModal';

import { useVehicleMetadata } from '@/entities/vehicle/api/use-vehicles';

export function LayoutHeader({ className }: { className?: string }) {
  const { data: metadata } = useVehicleMetadata();
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
          <div className={styles.versionInfo}>
            <span className={styles.versionText} title={`UI Version: v${__APP_VERSION__}`}>
              UI v{__APP_VERSION__}
            </span>
            {metadata && (
              <span
                className={styles.versionText}
                title={`Dataset Commit: ${metadata.dataset_commit}`}
              >
                Data v{metadata.etl_version}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={styles.iconButton}
            onClick={() => setIsAboutModalOpen(true)}
            aria-label="About OpenEV Data"
          >
            <Info size={24} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={styles.contributeButton}
            onClick={() => window.open('https://github.com/open-ev-data', '_blank')}
            aria-label="Contribute on GitHub"
          >
            <Github size={20} className={styles.githubIcon} />
            <span className={styles.contributeText}>Contribute on GitHub</span>
          </Button>
        </div>
      </header>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
}
