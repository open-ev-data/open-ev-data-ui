import type { Vehicle } from '@/entities/vehicle';
import type { Product, BreadcrumbList, WebSite, Organization } from 'schema-dts';

const BASE_URL = 'https://open-ev-data.github.io/open-ev-data-ui';

/**
 * Generate Schema.org Product schema for a vehicle
 */
export function generateProductSchema(vehicle: Vehicle): Product {
  const rangKm = vehicle.range?.rated?.[0]?.range_km;
  const batterykWh = vehicle.battery?.pack_capacity_kwh_net;
  const price = vehicle.pricing?.msrp?.[0]?.amount;
  const currency = vehicle.pricing?.msrp?.[0]?.currency;

  const description = `${vehicle.make.name} ${vehicle.model.name} ${vehicle.year}${
    rangKm ? ` - ${rangKm}km range` : ''
  }${batterykWh ? `, ${batterykWh}kWh battery` : ''}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${vehicle.make.name} ${vehicle.model.name}`,
    brand: {
      '@type': 'Brand',
      name: vehicle.make.name,
    },
    model: vehicle.model.name,
    description,
    image: vehicle.images?.exterior_url,
    offers: price
      ? {
          '@type': 'Offer',
          price: price.toString(),
          priceCurrency: currency || 'USD',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  } as Product;
}

/**
 * Generate Schema.org BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  } as BreadcrumbList;
}

/**
 * Generate Schema.org WebSite schema for home page
 */
export function generateWebSiteSchema(): WebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpenEV Data',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  } as WebSite;
}

/**
 * Generate Schema.org Organization schema
 */
export function generateOrganizationSchema(): Organization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenEV Data',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: ['https://github.com/open-ev-data'],
  } as Organization;
}
