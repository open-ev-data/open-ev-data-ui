# 0006 - Vehicle Detail Page Implementation

## Objective
Implement the detailed view for a single vehicle, including data-driven tabs, charts, and technical specifications.

## Input Documentation
- @[UI/docs/PAGE_LAYOUTS.md] (Detail Page specs)
- @[UI/docs/UI_COMPONENTS.md] (Data-driven rendering rules)

## Implementation Steps

### 1. Page Scaffolding (`src/pages/vehicle-detail`)
- [ ] **VehicleDetailPage**:
  - URL parameter reading (`useParams` -> code)
  - Fetch vehicle data logic (`useVehicle(code)`)
  - 404 redirection if not found
  - Layout: Sidebar (Image/Info) + Main (Tabs)

### 2. Sidebar/Header Info
- [ ] **Header**: Title (Make Model Trim), Badges (Year, Type)
- [ ] **Image Component**: Gallery or Single Image with lightbox
- [ ] **Highlights**: Quick feature list (V2L, Heat Pump, etc.)
- [ ] **SEO**:
  - Dynamic title: "{Make} {Model} {Year} - Full Specs | OpenEV Data"
  - Meta description with key specs (range, battery, price, 0-100)
  - Open Graph tags (og:title, og:description, og:image, og:url)
  - Twitter Card tags
  - Product structured data (schema.org/Product)
  - Canonical URL
  - Breadcrumb structured data

### 3. Main Content Tabs
- [ ] **Tabs Container**: Logic to hide tabs with no data
- [ ] **Overview Tab**:
  - `ChargingOverviewTable`
  - `HighlightsList`
- [ ] **Charging Curve Tab**:
  - Render Chart (Line Chart of kW vs SoC)
  - Only if `charging.dc_charge_curve` exists
- [ ] **Range Scenarios Tab**:
  - Render Chart (Bar Chart of Real World Range scenarios)
  - Only if `range.real_world` exists
- [ ] **specs Tab**:
  - Full accordions for Body, Dimensions, Weights, etc.
  - Strict null checking for every field (DRY: `DataField`)

### 4. Charts Integration
- [ ] Install `recharts` (or chosen library)
- [ ] Create generic Chart components in `shared/ui/charts` (LineChart, BarChart) applying Design System colors

## Verification
- [ ] Verify all tabs render only when data exists
- [ ] Verify Charts render correctly with sample data
- [ ] Verify responsive stacking on Mobile
