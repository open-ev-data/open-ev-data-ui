# 0004 - Feature & Entity Components

## Objective
Implement complex domain-aware components (`features/*` and `entities/*`) connecting UI logic with the data layer.

## Input Documentation
- @[UI/docs/UI_COMPONENTS.md] (Anatomy, specs)
- @[UI/docs/RESPONSIVE_STRATEGY.md] (Mobile/Desktop variants)

## Implementation Steps

### 1. Entity Components (`src/entities/vehicle/ui`)
- [ ] **VehicleSpecsTable**: Key metrics display (Price, Range, Battery, 0-100)
- [ ] **VehicleCard**:
  - Grid variant (Desktop): Vertical layout
  - List variant (Mobile): Horizontal layout
  - Image handling with fallback
  - Favorite icon placeholder (or logic if scope allows)
  - "Compare" button integration

### 2. Feature: Search (`src/features/vehicle-search`)
- [ ] **SearchBar**:
  - Input field with debounce
  - Dropdown logic for autocomplete results
  - Navigation on selection (`/vehicle/:code`)
  - Integration with `useVehicles()`

### 3. Feature: Filters (`src/features/vehicle-filter`)
- [ ] **FilterPanel** Logic:
  - State management (`useVehicleFilters` hook)
  - Sections: Range Slider, Battery Slider, Charging Slider, 0-100 Slider
  - Checkboxes: Market Availability, Variance, Vehicle Type, Drivetrain
- [ ] **FilterPanel** UI:
  - Desktop: Sticky Sidebar
  - Mobile: Accordion / Bottom Sheet (responsive adaptation)

### 4. Feature: Comparison Logic (`src/features/vehicle-compare`)
- [ ] Create `useComparison` hook (Context or LocalStorage based)
  - `addToCompare(vehicle)`
  - `removeFromCompare(vehicle)`
  - `comparedVehicles` list (max 3)

## Verification
- [ ] Verify Search finds vehicles and navigates
- [ ] Verify FilterPanel updates filter state (console log state changes)
- [ ] Verify VehicleCard renders correctly with real data
