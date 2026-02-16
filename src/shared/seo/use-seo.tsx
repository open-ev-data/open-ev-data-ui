import { Helmet } from 'react-helmet-async';
import type { ReactElement } from 'react';

const BASE_URL = 'https://open-ev-data.github.io/open-ev-data-ui';

export interface SEOProps {
  /** Page title (without site name suffix) */
  title: string;
  /** Meta description */
  description: string;
  /** Canonical URL path (e.g., '/vehicle/tesla-model-3') */
  canonical?: string;
  /** Open Graph image URL (absolute or relative) */
  image?: string;
  /** Open Graph type */
  type?: 'website' | 'product' | 'article';
  /** Structured data schema (JSON-LD object or array) */
  schema?: object | object[];
}

/**
 * Custom hook for managing SEO meta tags with react-helmet-async
 *
 * @example
 * ```tsx
 * export const MyPage = () => {
 *   const seo = useSEO({
 *     title: 'My Page Title',
 *     description: 'Description of my page',
 *     canonical: '/my-page',
 *   });
 *
 *   return (
 *     <>
 *       {seo}
 *       <div>Page content...</div>
 *     </>
 *   );
 * };
 * ```
 */
export function useSEO({
  title,
  description,
  canonical,
  image = '/og-image.png',
  type = 'website',
  schema,
}: SEOProps): ReactElement {
  const fullTitle = `${title} | OpenEV Data`;
  const fullUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  // Handle schema as array or single object
  const schemaArray = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="OpenEV Data" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Structured Data */}
      {schemaArray &&
        schemaArray.map((schemaObj, index) => (
          <script key={`schema-${index}`} type="application/ld+json">
            {JSON.stringify(schemaObj)}
          </script>
        ))}
    </Helmet>
  );
}
