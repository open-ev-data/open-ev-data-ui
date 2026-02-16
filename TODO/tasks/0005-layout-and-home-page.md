# 0005 - Page Layouts & Home Page

## Objective
Assemble the application shell, layout structure, and the main Home Page.

## Input Documentation
- @[UI/docs/PAGE_LAYOUTS.md] (Home Page specs)
- @[UI/docs/RESPONSIVE_STRATEGY.md] (Grid system)

## Implementation Steps

### 1. App Layout (`src/app/layouts`)
- [ ] **AppLayout**:
  - Header (Sticky, containing SearchBar)
  - Main Content Area (`<Outlet />`)
  - Bottom Navigation (Mobile only, conditional render)
  - Footer (optional, copyright/links)
  - **SEO**:
    - Implement `ScrollToTop` component (scroll to top on route change)
    - Create `SEO` component wrapper (react-helmet-async)
    - Add WebSite + SearchAction structured data to home page
    - Implement breadcrumbs with BreadcrumbList schema

### 2. Home Page (`src/pages/home`)
- [ ] **Layout Composition**:
  - Grid: Sidebar (Filters) + Content (Vehicle Grid)
  - Responsive collapse of filters on mobile
- [ ] **VehicleGrid**:
  - Virtualized list or paginated grid
  - Grid Columns responsive logic (1 -> 2 -> 3 -> 4 -> 5 columns)
  - Empty states / Loading skeletons
- [ ] **Comparison Overlay**:
  - Slide-in panel (Desktop)
  - Full-screen overlay (Mobile)
  - Triggered when `comparedVehicles.length > 0` (check UX requirements) or via specific "Compare" button click

### 3. Routing Integration
- [ ] Update `router.tsx` to use `AppLayout` and `HomePage`
- [ ] Configure Lazy Loading for Home Page

## Verification
- [ ] Verify Home Page loads with sidebar on Desktop
- [ ] Verify Home Page adapts to Mobile (Filters collapse, Grid becomes List)
- [ ] Verify Navigation/Header presence
