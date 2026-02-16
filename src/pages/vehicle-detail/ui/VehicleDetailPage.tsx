import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
import { LineChart, BarChart } from '@/shared/ui/Charts';
import { hasData } from '@/shared/lib/data-presence';
import styles from './VehicleDetailPage.module.css';
import { useState } from 'react';

export const VehicleDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { vehicle, isLoading, error } = useVehicle(code);
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorFallback />;
  if (!vehicle) return <Navigate to="/404" replace />;

  // SEO Data
  const title = `${vehicle.make.name} ${vehicle.model.name} ${vehicle.year} - Full Specs | OpenEV Data`;
  const description = `Complete technical specs for ${vehicle.make.name} ${vehicle.model.name} ${vehicle.year}. Range: ${vehicle.range?.rated?.[0]?.range_km}km, Battery: ${vehicle.battery?.pack_capacity_kwh_net}kWh.`;
  const imageUrl = vehicle.images?.exterior_url;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${vehicle.make.name} ${vehicle.model.name}`,
    brand: {
      '@type': 'Brand',
      name: vehicle.make.name,
    },
    model: vehicle.model.name,
    image: imageUrl,
    description: description,
    offers: {
      '@type': 'Offer',
      price: vehicle.pricing?.msrp?.[0]?.amount,
      priceCurrency: vehicle.pricing?.msrp?.[0]?.currency,
      availability: 'https://schema.org/InStock',
    },
  };

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
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <VehicleImage vehicle={vehicle} />
          <div className={styles.desktopHighlights}>
            <HighlightsList vehicle={vehicle} />
          </div>
        </div>

        <div className={styles.main}>
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
