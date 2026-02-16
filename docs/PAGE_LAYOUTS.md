# Page Layouts

This document defines the page-level layout specifications for each route. Component visual specs are in [UI_COMPONENTS.md](UI_COMPONENTS.md). Responsive adaptation rules are in [RESPONSIVE_STRATEGY.md](RESPONSIVE_STRATEGY.md). Design tokens referenced here are defined in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

### Related Documents

| Document | Scope |
| --- | --- |
| [Design System](DESIGN_SYSTEM.md) | Tokens for colors, spacing, typography, shadows |
| [UI Components](UI_COMPONENTS.md) | Component anatomy, states, and **data-driven rendering rules** |
| [Responsive Strategy](RESPONSIVE_STRATEGY.md) | Breakpoints and viewport-specific behavior |
| [Schema Reference](schema/reference_20260216.json) | Required vs optional vehicle data fields |

## Table of Contents

- [Global Layout](#global-layout)
- [Home Page](#home-page)
- [Vehicle Detail Page](#vehicle-detail-page)
- [Compare Page](#compare-page)
- [Not Found Page](#not-found-page)
- [Loading and Error States](#loading-and-error-states)

---

## Global Layout

The `AppLayout` wraps all pages and provides the persistent header and optional bottom navigation.

### Desktop Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
│  ⚡ OpenEV Data Explorer   [  🔍 Search EV Models, Specs...  🎤 ]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        <Outlet />                                   │
│                     (Page Content)                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile Structure

```
┌──────────────────────────────────────────┐
│  HEADER (compact)                        │
│  ⚡ OpenEV   [  🔍 Search...        🎤 ]│
├──────────────────────────────────────────┤
│                                          │
│            <Outlet />                    │
│          (Page Content)                  │
│                                          │
├──────────────────────────────────────────┤
│  BOTTOM NAV                              │
│   🏠    🔍    ☆    ⚡                    │
└──────────────────────────────────────────┘
```

### Header Specs

| Property | Value |
| --- | --- |
| Height | `64px` (desktop), `56px` (mobile) |
| Background | `--bg-surface-1` with `backdrop-filter: blur(12px)` |
| Border | `1px solid var(--border-subtle)` bottom |
| Position | `sticky`, `top: 0` |
| Z-Index | `--z-sticky` |
| Logo Font | `--text-lg`, `--weight-bold`, `--text-primary` |
| Logo Icon | `⚡` or custom SVG, `--text-accent` |
| Padding | `0 var(--space-6)` (desktop), `0 var(--space-4)` (mobile) |

### Bottom Navigation (Mobile Only)

| Property | Value |
| --- | --- |
| Height | `56px` |
| Background | `--bg-surface-1` with `backdrop-filter: blur(12px)` |
| Border | `1px solid var(--border-subtle)` top |
| Position | `fixed`, `bottom: 0` |
| Z-Index | `--z-sticky` |
| Icon Size | `--icon-lg` (`24px`) |
| Label Font | `--text-xs`, `--weight-medium` |
| Active Color | `--text-accent` |
| Inactive Color | `--text-tertiary` |

---

## Home Page

**Route**: `/`
**Component**: `HomePage`
**Reference**: [A01 Desktop](reference/A01-home-page.png) · [M01 Mobile](reference/M01-mobile-home-page.png)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                  │
├──────────┬────────────────────────────────────────────────┬──────────────┤
│          │  All Cards ▾          Search .................Q │              │
│ FILTER   │                                                │              │
│ PANEL    │  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────┐│              │
│          │  │ Card 1 │  │ Card 2 │  │ Card 3 │  │Card 4││              │
│ 240px    │  └────────┘  └────────┘  └────────┘  └──────┘│              │
│ fixed    │  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────┐│              │
│          │  │ Card 5 │  │ Card 6 │  │ Card 7 │  │Card 8││              │
│          │  └────────┘  └────────┘  └────────┘  └──────┘│              │
│          │                                                │              │
│          │  [Pagination]                                  │              │
├──────────┴────────────────────────────────────────────────┴──────────────┤
```

### Mobile Layout

```
┌──────────────────────────────────────────┐
│  HEADER                                  │
├──────────────────────────────────────────┤
│  [Filters & Sort                    ▾ ]  │ ← collapsible
├──────────────────────────────────────────┤
│  ┌──────────────────────────────────┐    │
│  │ [Img] Name          ♡           │    │
│  │       450km  28.6kWh  7.5s      │    │
│  │       [    Compare    ]          │    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │ [Img] Name          ♡           │    │
│  │       stats...                   │    │
│  │       [    Compare    ]          │    │
│  └──────────────────────────────────┘    │
│  ...more cards (infinite scroll/pag)     │
├──────────────────────────────────────────┤
│  BOTTOM NAV                              │
└──────────────────────────────────────────┘
```

### Page Component Hierarchy

```
HomePage
├── FilterPanel (sidebar on desktop / accordion on mobile)
├── ContentHeader
│   ├── ViewToggle ("All Cards ▾")
│   └── SearchInput (secondary in-grid search)
├── VehicleGrid
│   └── VehicleCard[] (mapped from filtered data)
└── Pagination
```

### Spec Details

| Property | Desktop | Mobile |
| --- | --- | --- |
| Main layout | `display: grid; grid-template-columns: 240px 1fr` | Single column |
| Content area padding | `--space-6` | `--space-4` |
| Card grid gap | `--space-6` | `--space-4` |
| Grid columns | `repeat(auto-fill, minmax(240px, 1fr))` | `1fr` |
| Secondary search | Top-right of content area | Hidden (uses header search) |
| Filter position | Sticky sidebar | Collapsible at top |

### Comparison Overlay (Active)

**Reference**: [A02 Desktop](reference/A02-home-page-compare-open.png) · [M02 Mobile](reference/M02-mobile-home-page-compare-open.png)

When the user opens the comparison view from the Home Page:

**Desktop**: A panel slides in from the right side, overlaying ~40% of the viewport width. The card grid content is visible but dimmed behind the panel.

```
┌──────────┬──────────────────────┬─────────────────────────┐
│  FILTER  │    Card Grid         │    COMPARISON PANEL     │
│  PANEL   │    (dimmed)          │    Slides from right    │
│          │                      │    ~40% width           │
│          │                      │    z-index: --z-modal   │
└──────────┴──────────────────────┴─────────────────────────┘
```

**Mobile**: Full-screen overlay replacing the card list. The comparison panel takes 100% of the viewport with a "Close" button at top-right.

| Property | Desktop | Mobile |
| --- | --- | --- |
| Panel width | `~40vw`, min `380px` | `100vw` |
| Animation | `slide-in-right`, `--duration-slow` | `slide-in-right` or full opacity fade |
| Overlay bg | `hsla(0,0%,0%,0.4)` behind panel | None (full takeover) |
| Close button | `×` ghost button, top-right | "Close" text button, top-right |

---

## Vehicle Detail Page

**Route**: `/vehicle/:code`
**Component**: `VehicleDetailPage`
**Reference**: [A03 Desktop](reference/A03-view-one-vehicle.png) · [M03 Mobile](reference/M03-mobile-view-one-vehicle.png)

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┬─────────────────────────────────────────┐      │
│  │  ← Back to Results  │  BYD Seal AWD Performance               │      │
│  │                      │                                         │      │
│  │   [Vehicle Image]    │  Overview │ Charging │ Range │ Specs    │      │
│  │                      │                                         │      │
│  │  Highlights           │  ┌─────────┬─────────┬────────┬──────┐│      │
│  │  ✓ 800V Arch.        │  │ $14.6k  │ 450 km  │23.5kWh│ 3.8s ││      │
│  │  ✓ V2L Capable       │  │ Price   │ WLTP    │Battery│0-100  ││      │
│  │  ✓ Heat Pump         │  └─────────┴─────────┴────────┴──────┘│      │
│  │                      │                                         │      │
│  │  Technology           │  ┌──────────────────┬─────────────────┐│      │
│  │  ✓ Root Seal AWD     │  │ DC Charging Curve│ Range Estimates ││      │
│  │  ✓ Heat Pump Std     │  │  [Line Chart]    │  [Bar Chart]    ││      │
│  │                      │  └──────────────────┴─────────────────┘│      │
│  └─────────────────────┴─────────────────────────────────────────┘      │
│                                                                   Compare│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────────────────────────┐
│  HEADER                                  │
├──────────────────────────────────────────┤
│  ← Back                                 │
│                                          │
│  BYD Seal AWD Performance                │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │        [Vehicle Image]           │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌────┐ ┌────────┐ ┌───────┐ ┌────┐    │
│  │$14k│ │ 450 km │ │23.5kWh│ │3.8s│    │
│  └────┘ └────────┘ └───────┘ └────┘    │
│                                          │
│  Overview│Charging│ Range │ Specs        │
│  ━━━━━━━━┤        │       │              │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Highlights        [Chart]        │    │
│  │ ✓ 800V Arch.                     │    │
│  │ ✓ V2L Capable                    │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │   Real-World Range Estimates     │    │
│  │   [Bar Chart — full width]       │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │           Compare                 │    │ ← sticky bottom CTA
│  └──────────────────────────────────┘    │
├──────────────────────────────────────────┤
│  BOTTOM NAV                              │
└──────────────────────────────────────────┘
```

### Page Component Hierarchy

```
VehicleDetailPage
├── BackButton ("← Back to Results")
├── VehicleHeader
│   ├── VehicleName (make + model + trim)         ← always rendered (required)
│   └── VehicleTags (badges: vehicle_type, year)  ← always rendered (required)
├── VehicleImage                                   ← conditional: images.exterior_url
├── SpecsPills                                     ← each pill conditional on field presence:
│   │                                                 Price → pricing.msrp[]
│   │                                                 Range → range.rated[].range_km (required)
│   │                                                 Battery → battery.pack_capacity_kwh_net
│   │                                                 0-100 → performance.acceleration_0_100_kmh_s
├── TabBar                                         ← tabs are conditional (see below)
├── TabContent
│   ├── OverviewTab                                ← always present
│   │   ├── HighlightsList                         ← data-driven: v2x, battery.heat_pump, etc.
│   │   └── ChargingOverviewTable                  ← charging.ac / charging.dc (required)
│   ├── ChargingCurveTab                           ← only if charging.dc_charge_curve exists
│   ├── RangeScenariosTab                          ← only if range.real_world[] exists
│   └── FullSpecsTab                               ← renders only sections with data:
│       │                                             body, dimensions, weights, capacity,
│       │                                             powertrain, wheels_tires, efficiency,
│       │                                             performance, software, links
│       └── (each section uses hasData() — see data-driven rendering in UI_COMPONENTS.md)
└── CompareButton (sticky on mobile)
```

> [!IMPORTANT]
> **Data-driven tab visibility**: The tab bar only renders tabs whose underlying data exists for the current vehicle. The Overview tab is always present. Charging Curve requires `charging.dc_charge_curve`. Range Scenarios requires `range.real_world[]`. Full Specs is always present but each section within it collapses when empty. See [Data-Driven Rendering Principle](UI_COMPONENTS.md#data-driven-rendering-principle) for implementation details.

### Spec Details

| Property | Desktop | Mobile |
| --- | --- | --- |
| Layout | 2-column: sidebar 280px + main area | Single column |
| Sidebar bg | `--bg-surface-1` | — |
| Image position | Sidebar, centered | Full width, below title |
| Image max height | `200px` | `200px` |
| Spec pills | Horizontal row in main area | Horizontal scroll |
| Tab bar position | Below spec pills in main | Below spec pills |
| Charts layout | Side by side (2 cols) | Stacked vertically |
| Compare button | Top-right area, ghost style | Sticky bottom, primary CTA |

---

## Compare Page

**Route**: `/compare`
**Component**: `ComparePage`

The standalone Compare Page provides a full-page comparison experience. This differs from the comparison panel overlay on the Home Page.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│  Comparison                                                        ✕    │
│                                                                          │
│  ┌──────────────┬──────────────┬──────────────┐                         │
│  │    Vehicle 1  │   Vehicle 2  │   Vehicle 3  │    (max 3 vehicles)    │
│  │  × [Image]   │  × [Image]   │  × [Image]   │                         │
│  │  Tesla M3     │  BYD Seal    │  Porsche T   │                         │
│  ├──────────────┼──────────────┼──────────────┤                         │
│  │  Range       │  Range       │  Range       │                         │
│  │  Price       │  Price       │  Price       │                         │
│  │  0-100       │  0-100       │  0-100       │                         │
│  ├──────────────┼──────────────┼──────────────┤                         │
│  │  [Radar]     │  [Radar]     │  [Radar]     │                         │
│  │  [Bars]      │  [Bars]      │  [Bars]      │                         │
│  │  [Chart]     │  [Chart]     │  [Chart]     │                         │
│  └──────────────┴──────────────┴──────────────┘                         │
└──────────────────────────────────────────────────────────────────────────┘
```

### Comparison Data Sections

All comparison rows are **data-driven**. A row only renders if at least one of the compared vehicles has data for that field. If a vehicle is missing a field that others have, display "—" in that cell. See [rendering rules](UI_COMPONENTS.md#rendering-rules).

1. **Key Metrics Table**: Range, Price, 0-100 km/h, Battery — rows filtered by data availability
2. **Radar Charts**: Only shown if enough metrics exist for a meaningful polygon (≥ 3 axes)
3. **Efficiency Bars**: Only shown if `efficiency.energy_consumption_wh_per_km` exists for at least one vehicle
4. **Charging Comparison**: AC max power, DC max power, architecture — from required `charging` object

### Spec Details

| Property | Value |
| --- | --- |
| Max vehicles | 3 |
| Column min width | `200px` (desktop), `160px` (mobile) |
| Column header bg | `--bg-glass` |
| Row border | `--border-subtle` |
| Best value | `--text-accent`, `--weight-bold` |
| Radar chart size | `160px × 160px` (desktop), `120px × 120px` (mobile) |
| Radar colors | `--chart-cyan`, `--chart-green`, `--chart-teal` per vehicle |
| Remove button (×) | `ghost` button, top-right of column header |

---

## Not Found Page

**Route**: `*`
**Component**: `NotFoundPage`

### Layout

```
┌──────────────────────────────────┐
│          HEADER                  │
├──────────────────────────────────┤
│                                  │
│          (empty space)           │
│                                  │
│       ⚠️ (large icon)           │
│       404 — Page Not Found       │
│       The page you're looking    │
│       for doesn't exist.         │
│                                  │
│       [ Go to Home ]             │
│                                  │
│          (empty space)           │
│                                  │
└──────────────────────────────────┘
```

### Specs

| Property | Value |
| --- | --- |
| Layout | Flex column, centered both axes |
| Min height | `calc(100vh - header height)` |
| Icon | `--icon-xl` (32px), `--color-warning` |
| Title | `--text-3xl`, `--weight-bold` |
| Message | `--text-base`, `--text-secondary` |
| Button | `primary` variant, `lg` size |

---

## Loading and Error States

### Initial Loading (Full Page)

When the application first loads and fetches the vehicle dataset:

```
┌──────────────────────────────────┐
│          HEADER                  │
├──────────────────────────────────┤
│                                  │
│                                  │
│          [Spinner lg]            │
│     Loading vehicle data...      │
│                                  │
│                                  │
└──────────────────────────────────┘
```

### Skeleton Loading (Cards)

While data is being processed/filtered, card skeletons maintain layout stability:

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  ← Image placeholder (pulse)
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│  └─────────────────────────────┘   │
│  ░░░░░░░░░░░░░░░░░              │  ← Title placeholder
│  ░░░░░░  ░░░░░░  ░░░░░          │  ← Stats placeholder
│  ┌─────────────────────────────┐   │
│  │░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │  ← Button placeholder
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Skeleton Specs

| Property | Value |
| --- | --- |
| Background | `--bg-surface-2` |
| Animated gradient | `linear-gradient(90deg, transparent, hsla(210,20%,30%,0.2), transparent)` |
| Animation | `pulse` keyframe, `1.5s infinite` |
| Border radius | Matches target element |
| Height | Matches expected content height |

### Error State (API Failure)

```
┌──────────────────────────────────┐
│          HEADER                  │
├──────────────────────────────────┤
│                                  │
│       ⚠️ (alert icon)           │
│    Unable to load vehicle data   │
│    Please check your connection  │
│    and try again.                │
│                                  │
│       [ Retry ]                  │
│                                  │
└──────────────────────────────────┘
```

| Property | Value |
| --- | --- |
| Component | `ErrorFallback` from `shared/ui/` |
| Icon | Alert triangle, `--color-warning` |
| Title | `--text-xl`, `--weight-semibold` |
| Message | `--text-base`, `--text-secondary` |
| Retry button | `primary` variant |
