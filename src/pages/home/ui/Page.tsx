import { useState } from 'react';
import { X } from 'lucide-react';
import type { Vehicle } from '@/entities/vehicle';
import { useVehicles } from '@/entities/vehicle';
import { useVehicleFilters, FilterPanel } from '@/features/vehicle-filter';
import { useComparison, ComparisonOverlay } from '@/features/vehicle-compare';
import { useFavorites } from '@/features/vehicle-favorites';
import { VehicleGrid } from '@/widgets/VehicleGrid';
import { useSEO, generateWebSiteSchema, generateOrganizationSchema } from '@/shared/seo';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import styles from './Page.module.css';

export function HomePage() {
  const { data: vehicles, isLoading, error: queryError, refetch } = useVehicles();
  const { filters, updateFilter, applyFilters, resetFilters, getActiveFilters, removeFilter } =
    useVehicleFilters();
  const { addToCompare, comparedVehicles } = useComparison();
  const { favoriteIds } = useFavorites();

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  // Apply filters
  const allFilteredVehicles = vehicles ? applyFilters(vehicles) : [];

  // Filter for Favorites
  const favoritesFilteredVehicles = allFilteredVehicles.filter((v) =>
    favoriteIds.includes(v.unique_code)
  );

  // Displayed Vehicles based on Tab
  const displayedVehicles = activeTab === 'all' ? allFilteredVehicles : favoritesFilteredVehicles;

  // Counts
  const allCount = allFilteredVehicles.length;
  // For favorites count, we want to know how many favorites match the current filter
  const favoritesCount = favoritesFilteredVehicles.length;

  const handleCompareClick = () => {
    setIsCompareOpen(true);
  };

  const handleAddToCompare = (vehicle: Vehicle) => {
    addToCompare(vehicle);
    setIsCompareOpen(true);
  };

  const seo = useSEO({
    title: 'OpenEV Data Explorer - Electric Vehicle Database & Specs',
    description:
      'Search, compare, and analyze 400+ electric vehicles. Complete technical specs, charging curves, real-world range data.',
    canonical: '/',
    schema: [generateWebSiteSchema(), generateOrganizationSchema()],
  });

  return (
    <div className={styles.container}>
      {seo}
      {/* Sidebar - Filters */}
      <aside className={cn(styles.sidebar, !isMobileFiltersOpen && styles.sidebarHidden)}>
        {/* Mobile Toggle would replace logic here for MVP */}
        <FilterPanel
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          className={cn(isMobileFiltersOpen ? styles.filterPanelMobile : '')}
        />
      </aside>

      {/* Main Content */}
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.tabs}>
            <button
              className={cn(styles.tabButton, activeTab === 'all' && styles.activeTab)}
              onClick={() => setActiveTab('all')}
            >
              All Vehicles
              {!isLoading && <span className={styles.count}>({allCount})</span>}
            </button>
            {favoriteIds.length > 0 && (
              <button
                className={cn(styles.tabButton, activeTab === 'favorites' && styles.activeTab)}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites
                <span className={styles.count}>({favoritesCount})</span>
              </button>
            )}
          </div>

          <div className={styles.activeFilters}>
            {getActiveFilters().map((filter) => (
              <div key={filter.key} className={styles.filterTag}>
                <span className={styles.tagName}>
                  {filter.key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                </span>
                <span className={styles.tagValue}>{filter.label}</span>
                <button
                  className={styles.removeTag}
                  onClick={() => removeFilter(filter.key)}
                  aria-label={`Remove ${filter.key} filter`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              size="sm"
              className={styles.mobileFilterToggle}
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              {isMobileFiltersOpen ? 'Hide Filters' : 'Filters'}
            </Button>

            {comparedVehicles.length > 0 && (
              <Button variant="primary" size="sm" onClick={handleCompareClick}>
                Compare ({comparedVehicles.length})
              </Button>
            )}
          </div>
        </header>

        <VehicleGrid
          vehicles={displayedVehicles}
          isLoading={isLoading}
          error={queryError}
          onRetry={refetch}
          onCompare={handleAddToCompare}
          selectedIds={comparedVehicles.map((v) => v.unique_code)}
        />
      </div>

      <ComparisonOverlay isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </div>
  );
}
