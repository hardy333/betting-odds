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

- Simulated dataset (`12,000` matches by default)
- Virtualized odds board for smooth rendering
- Mock live odds updates with up/down flash indicators
- Outcome selection and bet ticket sidebar (remove/clear, total odds)
- Collapsible desktop ticket + mobile drawer ticket
- Persistent board scroll position
- Responsive layout

## Planned Improvements

- Real API/WebSocket integration
- Search, filtering, and sorting
- Stake input + potential return calculation
- Bet confirmation and history
- Better accessibility (keyboard/focus/ARIA)
- Tests + CI checks
- i18n support

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
