# 0003 - Data Layer & Core Logic

## Objective
Implement the data fetching layer using TanStack Query to retrieve vehicle data from GitHub Releases, validate schema types, and provide global state access.

## Input Documentation
- @[UI/docs/ARCHITECTURE.md] (Data flow section, fetching strategy)
- @[UI/docs/schema/reference_20260216.json] (Schema definition)

## Implementation Steps

### 1. Configuration (`src/shared/config`)
- [ ] Create `env.ts`: Typed environment variables (API URLs, Feature flags)
- [ ] Create `constants.ts`: Application constants (Pagination limits, default fallbacks)
- [ ] Create `field-visibility.ts`: **Field Omission Logic**
  - Define `HIDDEN_FIELDS` array (e.g. `['pricing', 'range.real_world']`)
  - Export `isFieldVisible(path)` utility function

### 2. Domain Models (`src/entities/vehicle/model`)
- [ ] Create `vehicle.types.ts`: Define strict TypeScript interfaces matching `schema.json`
  - `Vehicle` (Root interface)
  - `VehicleType` (Enum)
  - `Battery`, `Charging`, `Range`, `Performance`, `Dimensions`, etc.
  - `SlugName` interface

- [ ] Create `vehicle.helpers.ts`:
  - `getVehicleTitle(vehicle)`
  - `getVehicleImage(vehicle)` (with fallback logic)

### 2. API Services (`src/entities/vehicle/api`)
- [ ] Create `vehicle.api.ts`:
  - `fetchLatestReleaseTag()`: Fetch latest release tag from GitHub API
  - `fetchDataset(tag)`: Fetch JSON asset from release
  - `fetchLatestvehicles()`: Orchestrated call (Tag -> JSON)

### 3. Query Hooks (State Management)
- [ ] Create `use-vehicles.ts`:
  - `useVehicles()` hook with `staleTime: 30min`
  - Returns `data` (array of `Vehicle`), `isLoading`, `error`

- [ ] Create `use-vehicle.ts`:
  - `useVehicle(code: string)` hook (Derived from `useVehicles` cache using `select` or `find`)

- [ ] Create `use-makes.ts`:
  - `useMakes()` hook (Derived unique makes list)

### 4. Global Error Handling
- [ ] Configure global `QueryClient` defaults in `src/app/providers.tsx`
- [ ] Set up `ErrorBoundary` to catch API failures

## Verification
- [ ] Verify type safety: TypeScript should error on accessing undefined properties
- [ ] Verify data fetch: `console.log` vehicle data in `App.tsx` temporary check
- [ ] Verify loading states work during fetch
