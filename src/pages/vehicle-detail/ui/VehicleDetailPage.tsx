import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useVehicle } from '@/entities/vehicle/api/use-vehicle';
import { PageLoader } from '@/shared/ui/PageLoader/PageLoader';
import { ErrorFallback } from '@/shared/ui/ErrorFallback/ErrorFallback';
import { VehicleHeader } from '@/entities/vehicle/ui/VehicleHeader/VehicleHeader';
import { VehicleImage } from '@/entities/vehicle/ui/VehicleImage/VehicleImage';
import { SpecsPills } from '@/entities/vehicle/ui/SpecsPills/SpecsPills';
import { HighlightsList } from '@/entities/vehicle/ui/HighlightsList/HighlightsList';
import { ChargingOverviewTable } from '@/entities/vehicle/ui/ChargingOverviewTable/ChargingOverviewTable';
import { FullSpecs } from '@/entities/vehicle/ui/FullSpecs/FullSpecs';
import { Tabs } from '@/shared/ui/Tabs/Tabs';
import { Button } from '@/shared/ui/Button/Button';
import { LineChart, BarChart } from '@/shared/ui/Charts';
import { hasData } from '@/shared/lib/data-presence';
import { useSEO, generateProductSchema, generateBreadcrumbSchema } from '@/shared/seo';
import styles from './VehicleDetailPage.module.css';

export const VehicleDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { vehicle, isLoading, error } = useVehicle(code);
  const [activeTab, setActiveTab] = useState('overview');

  // SEO Data (prepare conditionally)
  const title = vehicle
    ? `${vehicle.make.name} ${vehicle.model.name} ${vehicle.year} - Full Specs`
    : 'Vehicle Details';
  const rangeKm = vehicle?.range?.rated?.[0]?.range_km;
  const batterykWh = vehicle?.battery?.pack_capacity_kwh_net;
  const description = vehicle
    ? `Complete technical specs for ${vehicle.make.name} ${vehicle.model.name} ${vehicle.year}.${rangeKm ? ` Range: ${rangeKm}km.` : ''}${batterykWh ? ` Battery: ${batterykWh}kWh.` : ''} Charging curves, dimensions, performance data.`
    : '';

  const breadcrumbs = vehicle
    ? generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: vehicle.make.name, url: `/?make=${vehicle.make.slug}` },
        { name: `${vehicle.model.name} ${vehicle.year}`, url: `/vehicles/${vehicle.unique_code}` },
      ])
    : null;

  // Call useSEO unconditionally at top level before any early returns
  const seo = useSEO({
    title,
    description,
    canonical: vehicle ? `/vehicles/${vehicle.unique_code}` : undefined,
    image: vehicle?.images?.exterior_url,
    type: 'product',
    schema: vehicle ? [generateProductSchema(vehicle), breadcrumbs].filter(Boolean) : undefined,
  });

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorFallback />;
  if (!vehicle) return <Navigate to="/404" replace />;

  // Prepare Chart Data
  const chargingCurveData =
    vehicle.charging?.dc_charge_curve?.points?.map((point) => ({
      soc: point.soc_percent,
      power: point.power_kw,
    })) || [];

  const rangeScenariosData =
    vehicle.range?.real_world?.map((scenario) => ({
      name: scenario.profile,
      range: scenario.range_km,
    })) || [];

  const tabItems = [
    { value: 'overview', label: 'Overview' },
    hasData(chargingCurveData) ? { value: 'charging', label: 'Charging Curve' } : null,
    hasData(rangeScenariosData) ? { value: 'range', label: 'Range Scenarios' } : null,
    { value: 'specs', label: 'Full Specs' },
  ].filter((item): item is { value: string; label: string } => item !== null);

  return (
    <>
      {seo}

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <VehicleImage vehicle={vehicle} />
          <div className={styles.desktopHighlights}>
            <HighlightsList vehicle={vehicle} />
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.topActions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className={styles.backButton}
            >
              <span className={styles.backIcon}>←</span> Back to Catalog
            </Button>
          </div>
          <VehicleHeader vehicle={vehicle} />
          <SpecsPills vehicle={vehicle} />

          <div className={styles.mobileHighlights}>
            <HighlightsList vehicle={vehicle} />
          </div>

          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={setActiveTab}
            className={styles.tabs}
          />

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.fadeIn}>
                <h3 className={styles.sectionTitle}>Charging Overview</h3>
                <ChargingOverviewTable vehicle={vehicle} />
              </div>
            )}

            {activeTab === 'charging' && (
              <div className={styles.fadeIn}>
                <h3 className={styles.sectionTitle}>DC Charging Curve</h3>
                <div className={styles.chartContainer}>
                  <LineChart
                    data={chargingCurveData}
                    xAxisKey="soc"
                    yAxisLabel="Power (kW)"
                    lines={[{ key: 'power', color: 'var(--color-primary)', name: 'Power (kW)' }]}
                    tooltipFormatter={(value) => [`${value} kW`, 'Power']}
                  />
                </div>
                <p className={styles.chartNote}>
                  Charging power (vertical) vs State of Charge (horizontal)
                </p>
              </div>
            )}

            {activeTab === 'range' && (
              <div className={styles.fadeIn}>
                <h3 className={styles.sectionTitle}>Real World Range</h3>
                <div className={styles.chartContainer}>
                  <BarChart
                    data={rangeScenariosData}
                    xAxisKey="name"
                    bars={[{ key: 'range', color: 'var(--color-primary)', name: 'Range (km)' }]}
                    tooltipFormatter={(value) => [`${value} km`, 'Range']}
                  />
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className={styles.fadeIn}>
                <FullSpecs vehicle={vehicle} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
