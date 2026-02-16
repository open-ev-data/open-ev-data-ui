# 0002 - Shared UI Components Implementation

## Objective

Implement generic, reusable UI components (`shared/ui/*`) following the Design System, ensuring complete state coverage (hover, focus, disabled) and accessibility.

## Input Documentation

- @[UI/docs/UI_COMPONENTS.md] (Specs, variants, data-driven rendering rules)
- @[UI/docs/DESIGN_SYSTEM.md] (Tokens implementation)
- @[UI/docs/RESPONSIVE_STRATEGY.md] (Breakpoints)

## Implementation Steps

### 1. Shared Libraries (`src/shared/lib`)

- [x] Create `src/shared/lib/cn.ts` (Classname utility, e.g. `clsx` + `tailwind-merge` if using Tailwind, but here we use CSS Modules + `clsx` helper)
- [x] Create `src/shared/lib/data-presence.ts` (Implement `hasData` and `DataField` component)
  - **IMPORTANT**: Update `DataField` to check `isFieldVisible(path)` from config before rendering.
  - If field is in `HIDDEN_FIELDS`, render `null` regardless of data presence.
- [x] Create `src/shared/lib/format.ts` (Formatters: currency, distance, power, generic number)

### 2. Base Components (`src/shared/ui`)

Implement strict `interface Props` and separate CSS Modules for each.

#### Atoms

- [x] **Button**: Variants (`primary`, `secondary`, `ghost`, `danger`), Sizes (`sm`, `md`, `lg`), Loading state
- [x] **Input**: Base styling, `leadingIcon`, `trailingIcon`
- [x] **Badge**: Variants (`default`, `success`, `warning`, `neutral`)
- [x] **Spinner**: Loading indicator (sm, md, lg)
- [x] **Card**: Variants (`default`, `glass`, `highlighted`, `interactive`)

#### Form Elements & Molecules

- [x] **Select**: Custom dropdown with state styles
- [x] **Checkbox**: Custom checkbox with SVG checkmark
- [x] **Slider**: Range slider with custom track/thumb styling
- [x] **Tabs**: Tab switcher (Overview, Charging, etc.)

#### Complex UI

- [x] **Pagination**: Page controls
- [x] **Modal**: Overlay, backdrop, trap focus (use Portal/Dialog primitive)
- [x] **Drawer**: Bottom sheet / Side panel (for Mobile Filters)
- [x] **ErrorFallback**: Error boundary UI component

### 3. Tooling

- [x] Export all components via `src/shared/ui/index.ts` (Barrel file)
- [x] Write basic unit tests for Button and Input using Vitest/RTL

## Verification

- [ ] Verify hover/focus states match DESIGN_SYSTEM.md
- [ ] Verify accessibility (keyboard navigation)
- [ ] Verify `hasData` correctly identifies null/undefined/empty arrays
