# 0007 - Compare Page Implementation

## Objective
Implement the standalone comparison page allowing side-by-side analysis of up to 3 vehicles.

## Input Documentation
- @[UI/docs/PAGE_LAYOUTS.md] (Compare Page specs)
- @[UI/components/UI_COMPONENTS.md] (CompareTable specs)

## Implementation Steps

### 1. Compare Page (`src/pages/compare`)
- [ ] **ComparePage layout**:
  - Handle URL query params or global state for selected vehicles
  - Grid layout for 2 or 3 columns
  - **SEO**: Dynamic Title "Compare V1 vs V2" & Meta Description
  - **Link Sharing**: Generate unique URL for the comparison set

### 2. Comparison Logic
- [ ] **CompareTable**:
  - Render "Key Metrics" row
  - Render "Pricing" row
  - Render "Dimensions" row
  - Render "Charging" row
  - Logic to highlight "Best Value" (max range, min price, etc. - confirm logic or keep visual only)

### 3. Visualizations
- [ ] **Radar Chart**: Comparison of key metrics (Speed, Range, Efficiency, Charging) overlay
- [ ] **Efficiency Bars**: Side-by-side bar comparison

### 4. Responsive Adaptation
- [ ] Mobile: Horizontal scroll container for columns
- [ ] Desktop: Fixed table layout

## Verification
- [ ] Verify adding 3 vehicles works
- [ ] Verify removing a vehicle works
- [ ] Verify empty state/placeholder logic
