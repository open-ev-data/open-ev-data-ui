import { useState } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { useVehicles } from '@/entities/vehicle';
import { useVehicleFilters, FilterPanel } from '@/features/vehicle-filter';
import { useComparison, ComparisonOverlay } from '@/features/vehicle-compare';
import { VehicleGrid } from '@/widgets/VehicleGrid';
import { SEO } from '@/shared/ui/SEO';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import styles from './Page.module.css';

export function HomePage() {
  const { data: vehicles, isLoading, error: queryError, refetch } = useVehicles();
  const { filters, updateFilter, applyFilters } = useVehicleFilters();
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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Open EV Data Explorer',
    url: window.location.href,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${window.location.origin}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className={styles.container}>
      <SEO
        title="Home"
        description="Explore the comprehensive database of electric vehicles."
        structuredData={schema}
      />
      {/* Sidebar - Filters */}
      <aside className={cn(styles.sidebar, !isMobileFiltersOpen && 'hidden lg:block')}>
        {/* Mobile Toggle would replace logic here for MVP */}
        <FilterPanel
          filters={filters}
          updateFilter={updateFilter}
          className={cn(isMobileFiltersOpen ? 'w-full' : '')}
        />
      </aside>

      {/* Main Content */}
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            All Vehicles
            {!isLoading && <span className={styles.count}>({filteredVehicles.length})</span>}
          </h1>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="lg:hidden"
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
