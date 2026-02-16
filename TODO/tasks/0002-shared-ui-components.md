# 0002 - Shared UI Components Implementation

## Objective
Implement generic, reusable UI components (`shared/ui/*`) following the Design System, ensuring complete state coverage (hover, focus, disabled) and accessibility.

## Input Documentation
- @[UI/docs/UI_COMPONENTS.md] (Specs, variants, data-driven rendering rules)
- @[UI/docs/DESIGN_SYSTEM.md] (Tokens implementation)
- @[UI/docs/RESPONSIVE_STRATEGY.md] (Breakpoints)

## Implementation Steps

### 1. Shared Libraries (`src/shared/lib`)
- [ ] Create `src/shared/lib/cn.ts` (Classname utility, e.g. `clsx` + `tailwind-merge` if using Tailwind, but here we use CSS Modules + `clsx` helper)
- [ ] Create `src/shared/lib/data-presence.ts` (Implement `hasData` and `DataField` component for strict null checking)
- [ ] Create `src/shared/lib/format.ts` (Formatters: currency, distance, power, generic number)

### 2. Base Components (`src/shared/ui`)
Implement strict `interface Props` and separate CSS Modules for each.

#### Atoms
- [ ] **Button**: Variants (`primary`, `secondary`, `ghost`, `danger`), Sizes (`sm`, `md`, `lg`), Loading state
- [ ] **Input**: Base styling, `leadingIcon`, `trailingIcon`
- [ ] **Badge**: Variants (`default`, `success`, `warning`, `neutral`)
- [ ] **Spinner**: Loading indicator (sm, md, lg)
- [ ] **Card**: Variants (`default`, `glass`, `highlighted`, `interactive`)

#### Form Elements & Molecules
- [ ] **Select**: Custom dropdown with state styles
- [ ] **Checkbox**: Custom checkbox with SVG checkmark
- [ ] **Slider**: Range slider with custom track/thumb styling
- [ ] **Tabs**: Tab switcher (Overview, Charging, etc.)

#### Complex UI
- [ ] **Pagination**: Page controls
- [ ] **Modal**: Overlay, backdrop, trap focus (use Portal/Dialog primitive)
- [ ] **Drawer**: Bottom sheet / Side panel (for Mobile Filters)
- [ ] **ErrorFallback**: Error boundary UI component

### 3. Tooling
- [ ] Export all components via `src/shared/ui/index.ts` (Barrel file)
- [ ] Write basic unit tests for Button and Input using Vitest/RTL

## Verification
- [ ] Verify hover/focus states match DESIGN_SYSTEM.md
- [ ] Verify accessibility (keyboard navigation)
- [ ] Verify `hasData` correctly identifies null/undefined/empty arrays
