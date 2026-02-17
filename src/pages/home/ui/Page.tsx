import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'all' | 'favorites') || 'all';

  const setActiveTab = (tab: 'all' | 'favorites') => {
    setSearchParams((prev) => {
      if (tab === 'all') {
        prev.delete('tab');
      } else {
        prev.set('tab', tab);
      }
      return prev;
    });
  };

  // Calculate dynamic filter options based on available vehicle data
  const filterOptions = useMemo(() => {
    if (!vehicles) return undefined;

    const years = Array.from(new Set(vehicles.map((v) => v.year))).filter(Boolean);
    const vehicleTypes = Array.from(new Set(vehicles.map((v) => v.vehicle_type)));
    // Type assertion for drivetrains as we know they come from the schema but Set returns unknown
    const drivetrains = Array.from(
      new Set(vehicles.map((v) => v.powertrain.drivetrain))
    ) as Vehicle['powertrain']['drivetrain'][];
    const availability = Array.from(
      new Set(vehicles.map((v) => v.availability?.status).filter(Boolean))
    ) as string[];

    const rangeValues = vehicles
      .flatMap((v) => v.range?.rated?.map((r) => r.range_km) || [])
      .filter((v): v is number => typeof v === 'number');

    const batteryValues = vehicles
      .map((v) => v.battery?.pack_capacity_kwh_net)
      .filter((v): v is number => typeof v === 'number');

    const chargingValues = vehicles
      .map((v) => v.charging?.dc?.max_power_kw)
      .filter((v): v is number => typeof v === 'number');

    const acChargingValues = vehicles
      .map((v) => v.charging?.ac?.max_power_kw)
      .filter((v): v is number => typeof v === 'number');

    const accelValues = vehicles
      .map((v) => v.performance?.acceleration_0_100_kmh_s)
      .filter((v): v is number => typeof v === 'number');

    return {
      years,
      vehicleTypes,
      drivetrains,
      availability,
      range: {
        min: rangeValues.length ? Math.floor(Math.min(...rangeValues)) : 0,
        max: rangeValues.length ? Math.ceil(Math.max(...rangeValues)) : 0,
      },
      battery: {
        min: batteryValues.length ? Math.floor(Math.min(...batteryValues)) : 0,
        max: batteryValues.length ? Math.ceil(Math.max(...batteryValues)) : 0,
      },
      charging: {
        min: chargingValues.length ? Math.floor(Math.min(...chargingValues)) : 0,
        max: chargingValues.length ? Math.ceil(Math.max(...chargingValues)) : 0,
      },
      acCharging: {
        min: acChargingValues.length ? Math.floor(Math.min(...acChargingValues)) : 0,
        max: acChargingValues.length ? Math.ceil(Math.max(...acChargingValues)) : 0,
      },
      acceleration: {
        min: accelValues.length ? Math.floor(Math.min(...accelValues)) : 0,
        max: accelValues.length ? Math.ceil(Math.max(...accelValues)) : 0,
      },
    };
  }, [vehicles]);

  // Apply filters
  const allFilteredVehicles = vehicles ? applyFilters(vehicles, filterOptions) : [];

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
          options={filterOptions}
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
