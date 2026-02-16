import { useState } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { useVehicles } from '@/entities/vehicle';
import { useVehicleFilters, FilterPanel } from '@/features/vehicle-filter';
import { useComparison, ComparisonOverlay } from '@/features/vehicle-compare';
import { VehicleGrid } from '@/widgets/VehicleGrid';
import { useSEO, generateWebSiteSchema, generateOrganizationSchema } from '@/shared/seo';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import styles from './Page.module.css';

export function HomePage() {
  const { data: vehicles, isLoading, error: queryError, refetch } = useVehicles();
  const { filters, updateFilter, applyFilters, resetFilters } = useVehicleFilters();
  const { addToCompare, comparedVehicles } = useComparison();

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Apply filters
  const filteredVehicles = vehicles ? applyFilters(vehicles) : [];

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
          <h1 className={styles.title}>
            All Vehicles
            {!isLoading && <span className={styles.count}>({filteredVehicles.length})</span>}
          </h1>

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
          vehicles={filteredVehicles}
          isLoading={isLoading}
          error={queryError}
          onRetry={refetch}
          onCompare={handleAddToCompare}
        />
      </div>

      <ComparisonOverlay isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </div>
  );
}
