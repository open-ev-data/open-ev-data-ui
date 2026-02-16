import { Home, Search, Heart, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import styles from './BottomNav.module.css';

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={({ isActive }) => cn(styles.item, isActive && styles.itemActive)}>
        <Home size={24} />
        <span className={styles.label}>Home</span>
      </NavLink>

      {/* Search focuses header on desktop, but here acts as a tab if we had a dedicated search page.
          For now, maybe just scroll to top or focus search?
          Keeping simple navigation logic nicely fits standard routing.
      */}
      <button
        className={styles.item}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Search size={24} />
        <span className={styles.label}>Search</span>
      </button>

      <button className={styles.item}>
        <Heart size={24} />
        <span className={styles.label}>Saved</span>
      </button>

      <button className={styles.item}>
        <Menu size={24} />
        <span className={styles.label}>Menu</span>
      </button>
    </nav>
  );
}
