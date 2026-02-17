import { useSearchParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, ChevronLeft } from 'lucide-react';
import { useVehicle } from '@/entities/vehicle';
import { CompareTable } from '@/features/vehicle-compare/ui/CompareTable';
import { ComparisonVisualizations } from '@/features/vehicle-compare/ui/ComparisonVisualizations';
import { PageLoader, ErrorFallback, Button } from '@/shared/ui';
import { useComparison } from '@/features/vehicle-compare';
import styles from './ComparePage.module.css';

export const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { comparedVehicles, setComparedVehicles, removeFromCompare } = useComparison();
  const vehicleCodes = searchParams.get('vehicles')?.split(',').filter(Boolean) || [];

  // Fetch vehicles - use conditional hook pattern
  const vehicle1 = useVehicle(vehicleCodes[0]);
  const vehicle2 = useVehicle(vehicleCodes[1]);
  const vehicle3 = useVehicle(vehicleCodes[2]);

  const vehicleQueries = [vehicle1, vehicle2, vehicle3].filter((_, i) => i < vehicleCodes.length);

  // Check loading and error states
  const isLoading = vehicleQueries.some((q) => q.isLoading);
  const hasError = vehicleQueries.some((q) => q.error);
  const vehicles = vehicleQueries
    .map((q) => q.vehicle)
    .filter((v): v is NonNullable<typeof v> => v !== null && v !== undefined);

  // Sync state with Context when vehicles are loaded
  useEffect(() => {
    if (isLoading || vehicles.length === 0) return;

    const currentContextIds = comparedVehicles.map((v) => v.unique_code).join(',');
    const newPageIds = vehicles.map((v) => v.unique_code).join(',');

    if (currentContextIds !== newPageIds) {
      setComparedVehicles(vehicles);
    }
  }, [isLoading, vehicles, comparedVehicles, setComparedVehicles]);

  const handleRemoveVehicle = (code: string) => {
    const updatedCodes = vehicleCodes.filter((c) => c !== code);

    // Update Context
    removeFromCompare(code);

    if (updatedCodes.length > 0) {
      setSearchParams({ vehicles: updatedCodes.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Comparison link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // SEO
  const title =
    vehicles.length > 0
      ? `Compare ${vehicles.map((v) => `${v.make.name} ${v.model.name}`).join(' vs ')} | OpenEV Data`
      : 'Compare Electric Vehicles | OpenEV Data';

  const description =
    vehicles.length > 0
      ? `Side-by-side comparison of ${vehicles.map((v) => `${v.make.name} ${v.model.name}`).join(', ')}. Compare range, price, battery, charging, and performance.`
      : 'Compare electric vehicles side-by-side. Analyze range, pricing, charging speeds, and technical specifications.';

  const productSchema =
    vehicles.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'EV Comparison',
          itemListElement: vehicles.map((v, index) => ({
            '@type': 'Product',
            position: index + 1,
            name: `${v.make.name} ${v.model.name}`,
            url: `${window.location.origin}/vehicles/${v.unique_code}`,
          })),
        }
      : null;

  if (isLoading) return <PageLoader />;
  if (hasError) return <ErrorFallback />;

  // Empty state
  if (vehicles.length === 0) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <div className={styles.emptyState}>
          <h1 className={styles.emptyTitle}>No Vehicles Selected</h1>
          <p className={styles.emptyMessage}>
            Select vehicles from the home page to compare them side-by-side.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              Go to Home Page
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`https://open-ev-data.github.io/open-ev-data-ui/compare?vehicles=${vehicleCodes.join(',')}`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {productSchema && (
          <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        )}
      </Helmet>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link to="/" className={styles.backLink}>
              <ChevronLeft size={20} />
              Back
            </Link>
            <h1 className={styles.title}>Vehicle Comparison ({vehicles.length})</h1>
          </div>
          <Button variant="secondary" size="md" onClick={handleShare}>
            <Share2 size={16} className={styles.shareIcon} />
            Share Comparison
          </Button>
        </div>

        <CompareTable vehicles={vehicles} onRemoveVehicle={handleRemoveVehicle} />

        <ComparisonVisualizations vehicles={vehicles} />
      </div>
    </>
  );
};
