/**
 * Logic for hiding specific fields from the UI.
 * This allows us to soft-deprecate or hide incomplete fields without changing the schema.
 */

// Paths to fields that should be hidden (using dot notation)
export const HIDDEN_FIELDS = [
  'pricing', // Pricing data is often stale or region-specific
  'range.real_world', // Real world range is subjective/crowdsourced
  'internal_notes',
  'metadata',
] as const;

export type HiddenField = (typeof HIDDEN_FIELDS)[number];

/**
 * Checks if a field should be visible in the UI.
 * @param path - Dot notation path to the field (e.g. 'pricing.msrp')
 * @returns boolean - True if the field is visible
 */
export function isFieldVisible(path: string): boolean {
  if (!path) return true;

  // Check exact match
  if (HIDDEN_FIELDS.some((field) => field === path)) {
    return false;
  }

  // Check prefix match (e.g. 'pricing.msrp' matches 'pricing')
  if (HIDDEN_FIELDS.some((field) => path.startsWith(`${field}.`))) {
    return false;
  }

  return true;
}
