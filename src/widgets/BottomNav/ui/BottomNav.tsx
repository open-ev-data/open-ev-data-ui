import { Home, Search, Heart } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import styles from './BottomNav.module.css';
import { useFavorites } from '@/features/vehicle-favorites';

export function BottomNav() {
  const { favoriteIds } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus the global search input after scroll triggers
    setTimeout(() => {
      document.getElementById('global-search-input')?.focus();
    }, 100);
  };

  const handleFavoritesClick = () => {
    navigate('/?tab=favorites');
  };

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={({ isActive }) => cn(styles.item, isActive && styles.itemActive)}>
        <Home size={24} />
        <span className={styles.label}>Home</span>
      </NavLink>

      <button className={styles.item} onClick={handleSearchClick}>
        <Search size={24} />
        <span className={styles.label}>Search</span>
      </button>

      {favoriteIds.length > 0 && (
        <button
          className={cn(
            styles.item,
            location.search.includes('tab=favorites') && styles.itemActive
          )}
          onClick={handleFavoritesClick}
        >
          <Heart size={24} />
          <span className={styles.label}>Favorites</span>
        </button>
      )}
    </nav>
  );
}
