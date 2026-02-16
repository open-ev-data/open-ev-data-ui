# 0001 - Setup Infrastructure & Foundation

## Objective
Initialize the project environment, set up the directory structure obeying FSD, configure global styles/design system implementation, and install core dependencies.

## Input Documentation
- @[UI/README.md]
- @[UI/docs/ARCHITECTURE.md] (Tech stack, FSD structure, naming conventions)
- @[UI/docs/DESIGN_SYSTEM.md] (Design tokens, global styles, reset)
- @[UI/docs/GET_STARTED.md] (Setup instructions)

## Implementation Steps

### 1. Project Initialization & Tooling
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure `vite.config.ts` with path aliases (`@/*` -> `src/*`)
- [ ] Setup `eslint.config.js`, `.prettierrc`, `.editorconfig`
- [ ] Setup `.releaserc.js` (Semantic Release config)
- [ ] Install dependencies:
  - `react-router-dom` (Router)
  - `@tanstack/react-query` (State management)
  - `lucide-react` (Icons)
  - `classnames` or `clsx` (CSS utility)
  - `vitest`, `@testing-library/react` (Testing)
  - `react-helmet-async` (SEO/Meta tags)
  - `schema-dts` (TypeScript types for Schema.org structured data)
  - `sitemap` (Sitemap generation)
  - `vite-plugin-prerender` OR `vite-plugin-ssr` (Static prerendering)

### 2. DevOps & CI/CD
- [ ] Create `.github/workflows/ci.yml` (Lint, Test, Build)
- [ ] Create `.github/workflows/deploy.yml` (Deploy to GitHub Pages)
- [ ] Create `public/404.html` (SPA Redirect script for GitHub Pages)
- [ ] Create `public/robots.txt`

### 2. Directory Structure (FSD)
- [ ] Create strict FSD layer structure:
  ```
  src/
  ├── app/          # Providers, App component, global styles
  ├── pages/        # Lazy loaded routes
  ├── features/     # Feature components
  ├── entities/     # Domain entities
  └── shared/       # UI kit, libs, styles
  ```

### 3. Global Styles & Design Tokens
- [ ] Create `src/shared/styles/reset.css` (Standard CSS reset)
- [ ] Create `src/shared/styles/tokens.css` (Implement ALL CSS variables from DESIGN_SYSTEM.md)
  - Colors (Core, Semantic, Surface, Border, Text, Charts)
  - Typography (Fonts, Scale, Weights)
  - Spacing & Radius
  - Shadows & Elevations
  - Animations & Transitions
  - Z-Index Scale
- [ ] Create `src/shared/styles/global.css` (Typography defaults, body bg)
- [ ] Create `src/shared/styles/breakpoints.css` (Media query reference)
- [ ] Import logic in `src/app/App.module.css` or root

### 4. Basic App Configuration
- [ ] Implement `src/app/providers.tsx` (QueryClientProvider, RouterProvider placeholder)
- [ ] Implement `src/app/router.tsx` (Basic definition with placeholder pages)
- [ ] Implement `src/app/App.tsx` (Root component)

## Verification
- [ ] Run `npm run dev` and verify "Hello World" renders with correct background color (`--bg-base`)
- [ ] Verify path aliases work (import from `@/shared/...`)
- [ ] Verify Vitest runs successfully
