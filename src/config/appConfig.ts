export const appConfig = {
  viewport: {
    mobileMaxWidthPx: 767,
  },
  oddsBoard: {
    rowHeightPx: 62,
    overscanRows: 10,
    defaultTotalMatches: 12_000,
    defaultSeed: 2026,
  },
  socket: {
    intervalMs: 400,
    updatesPerTick: 2000,
  },
  api: {
    initialMatchesMinDelayMs: 300,
    initialMatchesMaxDelayMs: 400,
  },
  flash: {
    durationMs: 1000,
  },
  sidebar: {
    topHeaderHeightRem: 4,
    gapRem: 0.5,
    safetyOffsetRem: 0.5,
    collapsedWidthPx: 44,
    expandedWidthPx: 280,
    widthTransitionMs: 300,
  },
  format: {
    numberLocale: 'en-US',
  },
} as const
