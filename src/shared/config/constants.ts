/**
 * Global application constants.
 */

export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_VISIBLE_PAGES: 5,
  },
  CACHE: {
    STALE_TIME_MS: 30 * 60 * 1000, // 30 minutes
    GC_TIME_MS: 60 * 60 * 1000, // 60 minutes
  },
  TIMEOUTS: {
    FETCH_TIMEOUT_MS: 15000, // 15 seconds
  },
} as const;
