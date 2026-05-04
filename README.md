# Betting Odds v2

React + TypeScript odds board built for large datasets, live odds movement, and fast bet-ticket interaction.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS 4
- Zustand
- Framer Motion
- `@tanstack/react-virtual`
- ESLint

## Current Features

- [x] Simulated dataset (`12,000` matches by default)
- [x] Virtualized odds board for smooth rendering
- [x] Mock live odds updates with up/down flash indicators
- [x] Mock API fetching
- [x] Implemented error boundary
- [x] Implemented loading and error handling for initial loading
- [x] Outcome selection and bet ticket sidebar (remove/clear, total odds)
- [x] Collapsible desktop ticket + mobile drawer ticket
- [x] Persistent board scroll position
- [x] Responsive layout

## Planned Improvements

- [ ] Socket method for removing existing matches
- [ ] Mock socket method for adding new match items
- [ ] Better state management for match states
- [ ] Better type declarations and refactoring
- [ ] Better responsive design
- [ ] Better UI states for selected bet buttons
- [ ] More usable UI elements implementation
- [ ] Real API/WebSocket integration
- [ ] Search, filtering, and sorting
- [ ] Stake input + potential return calculation
- [ ] Bet confirmation and history
- [ ] Better accessibility (keyboard/focus/ARIA)
- [ ] Tests + CI checks
- [ ] i18n support

## App Config

Runtime tuning values are centralized in `src/config/appConfig.ts`.

- `oddsBoard`: virtualized row sizing, overscan, and default dataset size/seed
- `socket`: mock odds update speed and batch size
- `api`: simulated initial-load delay range
- `flash`: odds up/down highlight duration
- `sidebar` and `viewport`: responsive breakpoints and ticket panel sizing

Adjust these values to control performance and UX behavior without changing feature logic.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

This runs `tsc -b` and then creates the Vite production build in `dist/`.

## Preview Build

```bash
npm run preview
```

## Linting

```bash
npm run lint
npm run lint:fix
```

`lint:fix` auto-fixes supported issues.

## TypeScript Strict Config

Enabled in both `tsconfig.app.json` and `tsconfig.node.json`:

- `strict`
- `strictNullChecks`
- `exactOptionalPropertyTypes`
- `noUncheckedIndexedAccess`
- `noImplicitOverride`

This helps catch unsafe nullable access and unchecked index access at compile time.
