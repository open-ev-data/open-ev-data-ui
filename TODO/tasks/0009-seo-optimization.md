# 0009 - SEO Optimization & Discoverability

## Objective
Implement state-of-the-art SEO practices to maximize discoverability on search engines and social media, ensuring the UI appears in relevant searches and renders rich previews.

## Input Documentation
- @[UI/docs/ARCHITECTURE.md] (Deployment, routing strategy)
- @[UI/docs/PAGE_LAYOUTS.md] (Page structure)
- Web.dev best practices, Google Search Central guidelines

## Implementation Steps

### 1. Static Prerendering (Critical for Crawlers)
- [ ] Install `vite-plugin-ssr` or `vite-plugin-prerender`
- [ ] Configure prerendering for key routes:
  - Home page (`/`)
  - Top 50 most popular vehicles (by GitHub dataset metadata)
  - Category pages (if implemented: `/suv`, `/sedan`, etc.)
  - Compare page template
- [ ] Generate static HTML during build with full meta tags and structured data
- [ ] Ensure prerendered HTML includes initial vehicle data (SSG approach)

### 2. Sitemap Generation
- [ ] Create `scripts/generate-sitemap.ts`:
  - Read vehicle dataset during build
  - Generate `sitemap.xml` with all vehicle URLs
  - Include `<lastmod>`, `<changefreq>`, `<priority>` tags
  - Add sitemap to `public/` output
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools
- [ ] Reference sitemap in `robots.txt`

### 3. Structured Data (JSON-LD)
- [ ] Create `src/shared/seo/structured-data.ts`:
  - **Product schema** for each vehicle (https://schema.org/Product)
    - name, brand, model, year, offers (price), aggregateRating
  - **BreadcrumbList** for navigation hierarchy
  - **WebSite** schema for home page with search action
  - **Organization** schema for OpenEV Data project
- [ ] Inject JSON-LD scripts into `<head>` via `react-helmet-async`
- [ ] Validate with Google Rich Results Test

### 4. Meta Tags & Open Graph
Enhance existing `react-helmet-async` implementation:

#### Per-Page Meta Tags
- [ ] **Home Page**:
  - Title: "OpenEV Data Explorer - Electric Vehicle Database & Specs"
  - Description: "Search, compare, and analyze 400+ electric vehicles. Complete technical specs, charging curves, real-world range data."
  - Keywords: "electric vehicle database, EV specs, battery comparison, charging speed"

- [ ] **Vehicle Detail Pages**:
  - Title: "{Make} {Model} {Year} - Full Specs | OpenEV Data"
  - Description: "Complete specs for {vehicle}: {range}km range, {battery}kWh battery, {price} price. Charging curves, dimensions, performance data."
  - Dynamic keywords from vehicle data

- [ ] **Compare Page**:
  - Title: "Compare Electric Vehicles - {Vehicle1} vs {Vehicle2} vs {Vehicle3}"
  - Description: Side-by-side comparison

#### Open Graph (Facebook, LinkedIn)
- [ ] `og:type` = "website" (home) / "product" (vehicle)
- [ ] `og:title`, `og:description` (same as meta)
- [ ] `og:image` = vehicle exterior image (fallback to OpenEV logo)
- [ ] `og:url` = canonical URL
- [ ] `og:site_name` = "OpenEV Data"

#### Twitter Cards
- [ ] `twitter:card` = "summary_large_image"
- [ ] `twitter:title`, `twitter:description`, `twitter:image`
- [ ] `twitter:site` = @openevdata (if exists)

### 5. Canonical URLs & Link Management
- [ ] Add `<link rel="canonical">` to every page
- [ ] Ensure absolute URLs (https://open-ev-data.github.io/open-ev-data-ui/...)
- [ ] Add `<link rel="alternate" hreflang="en">` for i18n preparation
- [ ] Internal linking strategy: link to related vehicles (same make, similar specs)

### 6. Performance Optimization (Core Web Vitals)
SEO depends heavily on performance. Ensure:

- [ ] **LCP (Largest Contentful Paint) < 2.5s**:
  - Lazy load below-fold images
  - Optimize vehicle images (WebP format, `srcset`)
  - Preload critical fonts (Inter)

- [ ] **FID (First Input Delay) < 100ms**:
  - Code splitting by route
  - Defer non-critical JS

- [ ] **CLS (Cumulative Layout Shift) < 0.1**:
  - Reserve space for images (width/height attributes)
  - Avoid layout shifts from dynamic content

- [ ] **INP (Interaction to Next Paint) < 200ms**:
  - Optimize React rendering (memoization where needed)

### 7. robots.txt Optimization
- [ ] Create `public/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://open-ev-data.github.io/open-ev-data-ui/sitemap.xml
  ```

### 8. Accessibility = SEO
- [ ] Ensure semantic HTML (`<main>`, `<article>`, `<section>`)
- [ ] Proper heading hierarchy (one `<h1>` per page)
- [ ] Alt text for all images (descriptive, keyword-rich)
- [ ] ARIA labels for icon-only buttons

### 9. Content Strategy for Indexing
- [ ] Add text content to pages (not just data cards):
  - Home: "Browse our database of 400+ electric vehicles..."
  - Vehicle detail: "The {Make} {Model} is a {type} electric vehicle..."
- [ ] Add FAQ section to home page (schema.org/FAQPage)
- [ ] Create `/about` page explaining the project
- [ ] Add footer links (About, Data Sources, API Docs, GitHub)

### 10. Analytics & Monitoring
- [ ] Setup **Plausible Analytics** (privacy-friendly, open source):
  - Track page views, search queries, popular vehicles
  - Monitor referrers to understand traffic sources

- [ ] Setup **Google Search Console**:
  - Submit sitemap
  - Monitor search performance, indexing status
  - Track Core Web Vitals

- [ ] Setup **Bing Webmaster Tools** (often forgotten, good traffic source)

### 11. Social Media Optimization
- [ ] Create shareable image templates for vehicles
- [ ] Add "Share" buttons on vehicle detail pages (Twitter, LinkedIn, Reddit)
- [ ] Generate Twitter/Facebook share URLs with pre-filled text

### 12. Breadcrumbs
- [ ] Implement breadcrumb navigation:
  - Home > {Vehicle Type} > {Make} > {Model}
- [ ] Style breadcrumbs (see UI_COMPONENTS.md)
- [ ] Add BreadcrumbList structured data

### 13. Advanced: Dynamic Rendering Detection
- [ ] Add `<noscript>` fallback with links to popular vehicles
- [ ] Detect crawler user agents and serve prerendered HTML
- [ ] Consider Cloudflare Workers (if migrating from GitHub Pages later)

## Dependencies to Install
- [ ] `vite-plugin-ssr` OR `vite-plugin-prerender`
- [ ] `sitemap` (npm package for sitemap generation)
- [ ] `react-helmet-async` (already in 0001)
- [ ] `schema-dts` (TypeScript types for Schema.org)

## Verification
- [ ] Google Rich Results Test: All structured data valid
- [ ] PageSpeed Insights: Score > 90 (mobile and desktop)
- [ ] Lighthouse SEO audit: Score 100
- [ ] Manual test: Share link on Twitter/LinkedIn shows correct card
- [ ] Google Search Console: No indexing errors, sitemap processed
- [ ] Search "tesla model 3 specs site:github.io" → site appears
- [ ] Check mobile-friendliness with Google Mobile-Friendly Test

## Post-Launch SEO Checklist
- [ ] Submit to relevant directories (AlternativeTo, Product Hunt)
- [ ] Create blog posts linking to the tool
- [ ] Engage on Reddit (r/electricvehicles, r/dataisbeautiful)
- [ ] Link from main OpenEV Data repository README
